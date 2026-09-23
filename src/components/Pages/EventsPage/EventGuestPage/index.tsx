import './index.scss';

import { Alert, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorEventGuests } from '~/common/slices/domain/event-guests/event-guests.redux';
import {
  selectorEventTicketTypes,
  useEventTicketTypesSlice,
} from '~/common/slices/domain/event-guests/event-ticket-types.redux';
import { selectorEvents, useEventsSlice } from '~/common/slices/domain/events/events.redux';
import { useI18n } from '~/common/utils';
import { RootState } from '~/common/utils/redux-injectors/types';
import { useProfileInfo } from '~/components/Pages/domain/OpenCallPage/common';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { URL_PARAMETER_NAMES } from '~/constants';
import { EventModel } from '~/models/domain/event/event.model';
import { AddEventGuestDialog } from './AddEventGuestDialog';
import { TRANSLATION_BASE_EVENT_GUEST_PAGE } from './config-event-guest';

const EventGuestPage = () => {
  const urlParameters = useParams();
  const eventId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];

  const dispatch = useDispatch();
  const { translateText } = useI18n();

  const { actions: eventActions } = useEventsSlice();
  const { actions: eventTicketTypeActions } = useEventTicketTypesSlice();
  const { isArtistProfile, currentProfileId } = useProfileInfo();

  const [isAddGuestDialogOpen, setIsAddGuestDialogOpen] = useState(false);

  const selectEventById = selectorEvents.makeSelectItemById();
  const currentEvent: EventModel = useSelector((state: RootState) =>
    eventId ? selectEventById(state, eventId) : undefined
  );
  const isLoadingEvent = useSelector(selectorEvents.selectLoading);
  const ticketTypes = useSelector(selectorEventTicketTypes.selectItems);
  const createdGuest = useSelector(selectorEventGuests.selectCreatedItem);

  useEffect(() => {
    dispatch(eventActions.getItemById({ id: eventId }));
    dispatch(eventTicketTypeActions.loadItems({ queryParams: { event_id: eventId } }));
  }, [eventId]);

  if (isLoadingEvent || !currentEvent) {
    return <AppLoader height="100vh" />;
  }

  return (
    <div className="event-guest-page">
      <h1 className="event-guest-page__title">{translateText(`${TRANSLATION_BASE_EVENT_GUEST_PAGE}.title`)}</h1>

      <div className="event-guest-page__content">
        <section className="event-guest-page__event">
          <h2 className="event-guest-page__event-name">{currentEvent.name}</h2>
          {!!currentEvent.description && (
            <p className="event-guest-page__event-description">{currentEvent.description}</p>
          )}
          {!!currentEvent.place && (
            <p className="event-guest-page__event-place">
              {[currentEvent.place.name, currentEvent.place.address, currentEvent.place.city]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </section>

        <div className="event-guest-page__actions">
          <Button variant="contained" onClick={() => setIsAddGuestDialogOpen(true)}>
            {translateText(`${TRANSLATION_BASE_EVENT_GUEST_PAGE}.addSale`)}
          </Button>
        </div>
      </div>

      {!!createdGuest && (
        <Alert severity="success" className="event-guest-page__feedback">
          {translateText(`${TRANSLATION_BASE_EVENT_GUEST_PAGE}.successMessage`)}
        </Alert>
      )}

      <AddEventGuestDialog
        isOpen={isAddGuestDialogOpen}
        onClose={() => setIsAddGuestDialogOpen(false)}
        eventId={eventId}
        ticketTypes={ticketTypes}
        artistId={isArtistProfile ? currentProfileId : undefined}
      />
    </div>
  );
};

export default EventGuestPage;
