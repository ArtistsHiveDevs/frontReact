import './index.scss';

import { Alert, Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorEventGuests, useEventGuestsSlice } from '~/common/slices/domain/event-guests/event-guests.redux';
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
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { EventModel } from '~/models/domain/event/event.model';
import { AddEventGuestDialog } from './AddEventGuestDialog';
import { EventGuestsTable } from './EventGuestsTable';
import { TRANSLATION_BASE_EVENT_GUEST_PAGE } from './config-event-guest';

const EventGuestPage = () => {
  const urlParameters = useParams();
  const eventId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];

  const dispatch = useDispatch();
  const { translateText } = useI18n();

  const { actions: eventActions } = useEventsSlice();
  const { actions: eventTicketTypeActions } = useEventTicketTypesSlice();
  const { actions: eventGuestActions } = useEventGuestsSlice();
  const { loggedUser } = useProfileInfo();

  const currentProfileInfo = loggedUser?.currentProfileInfo;
  const isArtistProfile = currentProfileInfo?.entity === ArtistModel.name;
  const currentProfileId = currentProfileInfo?.id;

  const [isAddGuestDialogOpen, setIsAddGuestDialogOpen] = useState(false);

  const selectEventById = useMemo(() => selectorEvents.makeSelectItemById(), []);
  const selectCurrentEvent = useCallback(
    (state: RootState) => (eventId ? selectEventById(state, eventId) : undefined),
    [selectEventById, eventId]
  );
  const currentEvent: EventModel = useSelector(selectCurrentEvent);
  const isLoadingEvent = useSelector(selectorEvents.selectLoading);
  const ticketTypes = useSelector(selectorEventTicketTypes.selectItems);
  const createdGuest = useSelector(selectorEventGuests.selectCreatedItem);
  const registeredGuests = useSelector(selectorEventGuests.selectItems);

  const canListGuests = !!eventId && isArtistProfile && !!currentProfileId;

  useEffect(() => {
    dispatch(eventActions.getItemById({ id: eventId }));
    dispatch(eventTicketTypeActions.loadItems({ queryParams: { event_id: eventId } }));
  }, [eventId]);

  const reloadRegisteredGuests = useCallback(() => {
    if (canListGuests) {
      dispatch(eventGuestActions.loadItems({ queryParams: { event_id: eventId, artist_id: currentProfileId } }));
    }
  }, [canListGuests, eventId, currentProfileId, dispatch, eventGuestActions]);

  useEffect(() => {
    reloadRegisteredGuests();
  }, [reloadRegisteredGuests]);

  const openAddGuestDialog = useCallback(() => setIsAddGuestDialogOpen(true), []);
  const closeAddGuestDialog = useCallback(() => setIsAddGuestDialogOpen(false), []);

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
          <Button variant="contained" onClick={openAddGuestDialog}>
            {translateText(`${TRANSLATION_BASE_EVENT_GUEST_PAGE}.addSale`)}
          </Button>
        </div>
      </div>

      {!!createdGuest && (
        <Alert severity="success" className="event-guest-page__feedback">
          {translateText(`${TRANSLATION_BASE_EVENT_GUEST_PAGE}.successMessage`)}
        </Alert>
      )}

      {canListGuests && <EventGuestsTable guests={registeredGuests} />}

      <AddEventGuestDialog
        isOpen={isAddGuestDialogOpen}
        onClose={closeAddGuestDialog}
        onGuestCreated={reloadRegisteredGuests}
        eventId={eventId}
        ticketTypes={ticketTypes}
        artistId={isArtistProfile ? currentProfileId : undefined}
      />
    </div>
  );
};

export default EventGuestPage;
