import { Alert } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useI18n } from '~/common/utils';
import { uploadFileToServer } from '~/common/utils/amplify/storage/storage.helpers';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { DynamicFieldData, DynamicForm } from '~/components/shared/organisms/gui/dynamicForms';
import {
  ALL_CALENDAR_ACTIVITY_SUBTYPES,
  CalendarActivitySubtype,
  CalendarActivityTemplate,
  CREATABLE_CALENDAR_ACTIVITY_TYPE,
} from '~/models/domain/calendar/calendar-activity.model';
import { ALL_DAY_DATE_FORMAT, TRANSLATION_BASE_CALENDAR_PAGE } from '../calendar-page.constants';
import { CalendarEventImage } from '../CalendarEventImage';

export interface CalendarActivityDraft {
  id?: string;
  title?: string | null;
  subtype?: CalendarActivitySubtype | null;
  start: string;
  end?: string | null;
  allDay?: boolean;
  notes?: string | null;
  image?: string | null;
}

interface ActivityFormValues {
  title: string;
  subtype: CalendarActivitySubtype;
  allDay: boolean;
  start_date: Dayjs;
  start_time: Dayjs | null;
  end_date: Dayjs;
  end_time: Dayjs | null;
  notes: string;
}

interface ActivityFormDialogProps {
  open: boolean;
  draft?: CalendarActivityDraft;
  fullScreen?: boolean;
  saveErrorMessage?: string;
  onClose: () => void;
  onSave: (activity: CalendarActivityTemplate) => void;
  onDelete: (activityId: string) => void;
}

const withTimeOfDay = (date: Dayjs, time: Dayjs): Dayjs =>
  date.hour(time.hour()).minute(time.minute()).second(0).millisecond(0);

const buildFormValues = (draft?: CalendarActivityDraft): ActivityFormValues => {
  const start = draft?.start ? dayjs(draft.start) : dayjs();
  const end = draft?.end ? dayjs(draft.end) : start;
  const isAllDay = draft?.allDay ?? true;

  return {
    title: draft?.title || '',
    subtype: draft?.subtype || CalendarActivitySubtype.OTHER,
    allDay: isAllDay,
    start_date: start,
    start_time: isAllDay ? null : start,
    end_date: end,
    end_time: isAllDay ? null : end,
    notes: draft?.notes || '',
  };
};

const buildActivityPayload = (formValues: ActivityFormValues, image?: string | null): CalendarActivityTemplate => {
  const { title, subtype, allDay, start_date, start_time, end_date, end_time, notes } = formValues;

  const schedule = allDay
    ? {
        start: start_date.format(ALL_DAY_DATE_FORMAT),
        end: end_date.format(ALL_DAY_DATE_FORMAT),
      }
    : {
        start: withTimeOfDay(start_date, start_time).toISOString(),
        end: withTimeOfDay(end_date, end_time || start_time).toISOString(),
      };

  return {
    title,
    type: CREATABLE_CALENDAR_ACTIVITY_TYPE,
    subtype,
    allDay,
    notes: notes || null,
    image: image || null,
    ...schedule,
  };
};

export const ActivityFormDialog = ({
  open,
  draft,
  fullScreen,
  saveErrorMessage,
  onClose,
  onSave,
  onDelete,
}: ActivityFormDialogProps) => {
  const { translateText } = useI18n();
  const formMethods = useForm<ActivityFormValues>({ defaultValues: buildFormValues() });
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string>();
  const [imageUploadError, setImageUploadError] = useState(false);

  const translate = (key: string) => translateText(`${TRANSLATION_BASE_CALENDAR_PAGE}.${key}`);

  const activityId = draft?.id;
  const isAllDay = formMethods.watch('allDay');

  useEffect(() => {
    setDeleteConfirmationOpen(false);

    if (open) {
      formMethods.reset(buildFormValues(draft));
      setImageFile(undefined);
      setImagePreview(undefined);
      setImageUploadError(false);
    }
  }, [open, draft]);

  useEffect(
    () => () => {
      if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview]
  );

  const scheduleFields: DynamicFieldData[] = isAllDay
    ? [
        {
          fieldName: 'end_date',
          inputType: 'date',
          label: translate('activity_form.fields.end_date'),
          config: { required: translate('activity_form.validation.end_date_required') },
          componentParams: { minDate: formMethods.watch('start_date') },
        },
      ]
    : [
        {
          fieldName: 'start_time',
          inputType: 'time',
          label: translate('activity_form.fields.start_time'),
          config: { required: translate('activity_form.validation.start_time_required') },
          componentParams: { ampm: true },
        },
        {
          fieldName: 'end_date',
          inputType: 'date',
          label: translate('activity_form.fields.end_date'),
          config: { required: translate('activity_form.validation.end_date_required') },
          componentParams: { minDate: formMethods.watch('start_date') },
        },
        {
          fieldName: 'end_time',
          inputType: 'time',
          label: translate('activity_form.fields.end_time'),
          componentParams: { ampm: true },
        },
      ];

  const fields: DynamicFieldData[] = [
    {
      fieldName: 'title',
      inputType: 'text',
      label: translate('activity_form.fields.title'),
      config: { required: translate('activity_form.validation.title_required') },
    },
    {
      fieldName: 'subtype',
      inputType: 'select',
      label: translate('activity_form.fields.subtype'),
      options: ALL_CALENDAR_ACTIVITY_SUBTYPES.map((activitySubtype) => ({
        value: activitySubtype,
        label: translate(`activity_form.subtypes.${activitySubtype}`),
      })),
    },
    {
      fieldName: 'allDay',
      inputType: 'switch',
      label: translate('activity_form.fields.all_day'),
    },
    {
      fieldName: 'start_date',
      inputType: 'date',
      label: translate('activity_form.fields.start_date'),
      config: { required: translate('activity_form.validation.start_date_required') },
    },
    ...scheduleFields,
    {
      fieldName: 'notes',
      inputType: 'textarea',
      label: translate('activity_form.fields.notes'),
    },
  ];

  const handlers = {
    start_date_value_onchange: (startDate: Dayjs | null) => {
      const endDate = formMethods.getValues('end_date');

      if (startDate && (!endDate || endDate.isBefore(startDate, 'day'))) {
        formMethods.setValue('end_date', startDate);
      }
    },
    onSubmit: async (formValues: ActivityFormValues) => {
      let image = draft?.image || null;

      if (imageFile) {
        try {
          setImageUploadError(false);
          const upload = await uploadFileToServer({ file: imageFile, path: 'calendar-activities' });

          if (!upload) throw new Error('Image upload failed');
          await upload.result.result;
          image = `r://${upload.customPath}`;
        } catch {
          setImageUploadError(true);
          return;
        }
      }

      onSave(buildActivityPayload(formValues, image));
    },
  };

  return (
    <>
      <AppDialog
        isOpenDialog={open}
        onClose={onClose}
        fullScreen={fullScreen}
        title={translate(activityId ? 'activity_form.edit_title' : 'activity_form.create_title')}
        actions={
          activityId
            ? [{ label: translate('actions.delete'), handler: () => setDeleteConfirmationOpen(true) }]
            : undefined
        }
        content={
          <>
            {!!saveErrorMessage && <Alert severity="error">{saveErrorMessage}</Alert>}
            {imageUploadError && <Alert severity="error">{translate('activity_form.image_upload_error')}</Alert>}
            <div className="calendar-activity-image-field">
              {(imagePreview || draft?.image) && (
                <CalendarEventImage
                  alt={translate('activity_form.fields.image')}
                  className="calendar-activity-image-field__preview"
                  source={imagePreview || draft?.image}
                />
              )}
              <label className="calendar-activity-image-field__button">
                {translate('activity_form.fields.image')}
                <input
                  accept="image/*"
                  hidden
                  type="file"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>
            <DynamicForm
              key={isAllDay ? 'all-day' : 'timed'}
              formMethods={formMethods}
              fields={fields}
              handlers={handlers}
              translationBasePath=""
              submitLabel={activityId ? 'save' : 'create'}
            />
          </>
        }
      />

      <AppDialog
        isOpenDialog={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        title={translate('activity_form.delete_confirmation.title')}
        content={translate('activity_form.delete_confirmation.message')}
        actions={[
          { label: translate('actions.cancel'), handler: () => setDeleteConfirmationOpen(false) },
          { label: translate('actions.delete'), handler: () => onDelete(activityId) },
        ]}
      />
    </>
  );
};
