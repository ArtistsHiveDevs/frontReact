import { Alert } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useI18n } from '~/common/utils';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { DynamicFieldData, DynamicForm } from '~/components/shared/organisms/gui/dynamicForms';
import { ActivityTemplate, ActivityType, ALL_ACTIVITY_TYPES } from '~/models/domain/activity/activity.model';
import { ALL_DAY_DATE_FORMAT, TRANSLATION_BASE_CALENDAR_PAGE } from '../calendar-page.constants';

export interface ActivityDraft {
  id?: string;
  title?: string;
  type?: ActivityType;
  start: string;
  end?: string | null;
  allDay?: boolean;
  notes?: string | null;
}

interface ActivityFormValues {
  title: string;
  type: ActivityType;
  allDay: boolean;
  start_date: Dayjs;
  start_time: Dayjs | null;
  end_date: Dayjs | null;
  end_time: Dayjs | null;
  notes: string;
}

interface ActivityFormDialogProps {
  open: boolean;
  draft?: ActivityDraft;
  saveErrorMessage?: string;
  onClose: () => void;
  onSave: (activity: ActivityTemplate) => void;
  onDelete: (activityId: string) => void;
}

const withTimeOfDay = (date: Dayjs, time: Dayjs): Dayjs =>
  date.hour(time.hour()).minute(time.minute()).second(0).millisecond(0);

const buildFormValues = (draft?: ActivityDraft): ActivityFormValues => {
  const start = draft?.start ? dayjs(draft.start) : dayjs();
  const end = draft?.end ? dayjs(draft.end) : null;
  const isAllDay = draft?.allDay ?? true;

  return {
    title: draft?.title || '',
    type: draft?.type || ActivityType.OTHER,
    allDay: isAllDay,
    start_date: start,
    start_time: isAllDay ? null : start,
    end_date: isAllDay ? end : null,
    end_time: isAllDay ? null : end,
    notes: draft?.notes || '',
  };
};

const buildActivityPayload = (formValues: ActivityFormValues): ActivityTemplate => {
  const { title, type, allDay, start_date, start_time, end_date, end_time, notes } = formValues;

  const schedule = allDay
    ? {
        start: start_date.format(ALL_DAY_DATE_FORMAT),
        end: end_date ? end_date.format(ALL_DAY_DATE_FORMAT) : null,
      }
    : {
        start: withTimeOfDay(start_date, start_time).toISOString(),
        end: end_time ? withTimeOfDay(start_date, end_time).toISOString() : null,
      };

  return { title, type, allDay, notes: notes || null, ...schedule };
};

export const ActivityFormDialog = ({
  open,
  draft,
  saveErrorMessage,
  onClose,
  onSave,
  onDelete,
}: ActivityFormDialogProps) => {
  const { translateText } = useI18n();
  const formMethods = useForm<ActivityFormValues>({ defaultValues: buildFormValues() });
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const translate = (key: string) => translateText(`${TRANSLATION_BASE_CALENDAR_PAGE}.${key}`);

  const activityId = draft?.id;
  const isAllDay = formMethods.watch('allDay');

  useEffect(() => {
    setDeleteConfirmationOpen(false);

    if (open) {
      formMethods.reset(buildFormValues(draft));
    }
  }, [open, draft]);

  const scheduleFields: DynamicFieldData[] = isAllDay
    ? [
        {
          fieldName: 'end_date',
          inputType: 'date',
          label: translate('activity_form.fields.end_date'),
        },
      ]
    : [
        {
          fieldName: 'start_time',
          inputType: 'time',
          label: translate('activity_form.fields.start_time'),
          config: { required: translate('activity_form.validation.start_time_required') },
        },
        {
          fieldName: 'end_time',
          inputType: 'time',
          label: translate('activity_form.fields.end_time'),
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
      fieldName: 'type',
      inputType: 'select',
      label: translate('activity_form.fields.type'),
      options: ALL_ACTIVITY_TYPES.map((activityType) => ({
        value: activityType,
        label: translate(`activity_form.types.${activityType}`),
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
    onSubmit: (formValues: ActivityFormValues) => onSave(buildActivityPayload(formValues)),
  };

  return (
    <>
      <AppDialog
        isOpenDialog={open}
        onClose={onClose}
        title={translate(activityId ? 'activity_form.edit_title' : 'activity_form.create_title')}
        actions={
          activityId
            ? [{ label: translate('actions.delete'), handler: () => setDeleteConfirmationOpen(true) }]
            : undefined
        }
        content={
          <>
            {!!saveErrorMessage && <Alert severity="error">{saveErrorMessage}</Alert>}
            <DynamicForm
              // Remontar al alternar "todo el día" evita que los campos de hora y de fecha
              // se intercambien en la misma posición de la lista, lo que rompe el orden de hooks.
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
