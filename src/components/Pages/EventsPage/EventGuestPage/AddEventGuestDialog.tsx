import { Alert, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormProvider, RegisterOptions, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectorEventGuests, useEventGuestsSlice } from '~/common/slices/domain/event-guests/event-guests.redux';
import { useI18n } from '~/common/utils';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms/dynamic-control-types';
import { DynamicForm } from '~/components/shared/organisms/gui/dynamicForms/dynamic-form';
import { EventTicketTypeModel } from '~/models/domain/event-guest/v1';
import { EVENT_GUEST_FORM_FIELDS, TRANSLATION_BASE_EVENT_GUEST_PAGE } from './config-event-guest';

const DUPLICATED_CC_BACKEND_MESSAGE = 'A guest with this document number is already registered for this event.';

interface AddEventGuestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  ticketTypes: EventTicketTypeModel[];
  artistId?: string;
}

export const AddEventGuestDialog = (props: AddEventGuestDialogProps) => {
  const { isOpen, onClose, eventId, ticketTypes, artistId } = props;

  const dispatch = useDispatch();
  const { translateText } = useI18n();
  const { actions: eventGuestActions } = useEventGuestsSlice();

  const createdGuest = useSelector(selectorEventGuests.selectCreatedItem);
  const responseError = useSelector(selectorEventGuests.selectError);
  const isSaving = useSelector(selectorEventGuests.selectLoading);

  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  const formMethods = useForm({ mode: 'onChange', reValidateMode: 'onChange' });

  const hasTicketTypes = ticketTypes?.length > 0;

  const translateField = (field: DynamicFieldData): DynamicFieldData => {
    const translatedField: DynamicFieldData = {
      ...field,
      label: translateText(`${TRANSLATION_BASE_EVENT_GUEST_PAGE}.fields.${field.label}`),
    };
    const pattern = field.config?.pattern as { value: RegExp; message: string } | undefined;

    if (!pattern?.message) {
      return translatedField;
    }

    translatedField.config = {
      ...field.config,
      pattern: { value: pattern.value, message: translateText(pattern.message) },
    } as RegisterOptions;

    return translatedField;
  };

  const ticketTypeOptions = (ticketTypes || []).map((ticketType) => ({
    value: ticketType.identifier,
    label: ticketType.selectLabel,
  }));

  useEffect(() => {
    if (isAwaitingResponse && createdGuest) {
      setIsAwaitingResponse(false);
      formMethods.reset();
      onClose();
    }
  }, [createdGuest, isAwaitingResponse]);

  const errorMessageKey =
    responseError?.message === DUPLICATED_CC_BACKEND_MESSAGE ? 'duplicatedCc' : 'genericError';

  const handlers = {
    onSubmit: (formData: any) => {
      setIsAwaitingResponse(true);
      dispatch(
        eventGuestActions.createItem({
          data: {
            event_id: eventId,
            ticket_type_id: formData.ticket_type_id,
            first_name: formData.first_name,
            last_name: formData.last_name,
            cc: formData.cc,
            ...(formData.email ? { email: formData.email } : {}),
            ...(artistId ? { artist_id: artistId } : {}),
          },
        })
      );
    },
  };

  return (
    <AppDialog
      className="add-event-guest-dialog"
      title={translateText(`${TRANSLATION_BASE_EVENT_GUEST_PAGE}.addSale`)}
      isOpenDialog={isOpen}
      onClose={onClose}
      content={
        <FormProvider {...formMethods}>
          <form
            noValidate
            onSubmit={(submitEvent) => {
              submitEvent.preventDefault();
              submitEvent.stopPropagation();
              formMethods.handleSubmit(handlers.onSubmit)();
            }}
          >
            {!hasTicketTypes && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {translateText(`${TRANSLATION_BASE_EVENT_GUEST_PAGE}.errors.noTicketTypes`)}
              </Alert>
            )}

            <DynamicForm
              fields={EVENT_GUEST_FORM_FIELDS.map(translateField)}
              handlers={handlers}
              formMethods={formMethods}
              fieldOptions={{ ticket_type_id: ticketTypeOptions }}
              translationBasePath={TRANSLATION_BASE_EVENT_GUEST_PAGE}
              hideSubmitButton={true}
              useExternalForm={true}
            />

            {isAwaitingResponse && !!responseError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {translateText(`${TRANSLATION_BASE_EVENT_GUEST_PAGE}.errors.${errorMessageKey}`)}
              </Alert>
            )}

            <Button type="submit" variant="contained" disabled={!hasTicketTypes || isSaving} sx={{ mt: 2 }}>
              {translateText(`${TRANSLATION_BASE_EVENT_GUEST_PAGE}.submitLabel`)}
            </Button>
          </form>
        </FormProvider>
      }
    />
  );
};
