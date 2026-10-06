import './index.scss';

import { Alert, Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { BackButton } from '~/components/shared/app/atoms/navigation-buttons/back-buttons';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { URL_PARAMETER_NAMES } from '~/constants';
import { EventModel } from '~/models/domain/event/event.model';
import { AddEventGuestDialog } from './AddEventGuestDialog';
import { EventGuestsTable } from './EventGuestsTable';
import { TRANSLATION_BASE_EVENT_GUEST_PAGE } from './config-event-guest';

const ALREADY_CHECKED_IN_BACKEND_MESSAGE = 'This guest has already entered the event and can no longer be modified.';
const NOT_ALLOWED_BACKEND_MESSAGES = [
  'Permission denied',
  'Unauthorized operation. To execute this operation you require a valid session',
];

const EventGuestPage = () => {
  const urlParameters = useParams();
  const eventId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];

  const dispatch = useDispatch();
  const { translateText } = useI18n();

  const { actions: eventActions } = useEventsSlice();
  const { actions: eventTicketTypeActions } = useEventTicketTypesSlice();
  const { actions: eventGuestActions } = useEventGuestsSlice();
  const { isArtistProfile, isPlaceProfile, currentProfileId, currentProfileEntity, loggedUser } = useProfileInfo();

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
  const guestsResponseError = useSelector(selectorEventGuests.selectError);
  const isGuestsSliceBusy = useSelector(selectorEventGuests.selectLoading);

  const [checkInGuestId, setCheckInGuestId] = useState<string>();
  const [usuario, setUsuario] = useState<string>();
  const [isSamePlace, setIsSamePlace] = useState<boolean>(false);
  const [checkInErrorMessage, setCheckInErrorMessage] = useState<string>();
  const lastSeenErrorRef = useRef(guestsResponseError);

  const canListGuests = true;

  useEffect(() => {
    dispatch(eventActions.getItemById({ id: eventId }));
    dispatch(eventTicketTypeActions.loadItems({ queryParams: { event_id: eventId } }));
  }, [eventId]);

  const reloadRegisteredGuests = useCallback(() => {
    if (canListGuests && !!currentProfileEntity) {
      dispatch(
        eventGuestActions.loadItems({
          queryParams: {
            event_id: eventId,
            ...(isArtistProfile && !!currentProfileId ? { artist_id: currentProfileId } : {}),
          },
        })
      );
    }
  }, [canListGuests, eventId, currentProfileEntity, isArtistProfile, currentProfileId, dispatch, eventGuestActions]);

  const registerGuestEntry = useCallback(
    (guestId: string) => {
      lastSeenErrorRef.current = guestsResponseError;
      setCheckInErrorMessage(undefined);
      setCheckInGuestId(guestId);
      dispatch(
        eventGuestActions.postActionItem({
          id: guestId,
          action: 'checkIn',
          newItem: { checked_in: true },
          params: {},
        })
      );
    },
    [dispatch, eventGuestActions, guestsResponseError]
  );

  const dismissCheckInError = useCallback(() => setCheckInErrorMessage(undefined), []);

  const isCheckInTargetRegistered = useMemo(
    () =>
      !!checkInGuestId &&
      registeredGuests.some(
        (guest) => [guest.identifier, guest.id, guest.sID].includes(checkInGuestId) && guest.isCheckedIn
      ),
    [checkInGuestId, registeredGuests]
  );

  useEffect(() => {
    if (!checkInGuestId || (isGuestsSliceBusy && !isCheckInTargetRegistered)) {
      return;
    }

    if (guestsResponseError !== lastSeenErrorRef.current) {
      lastSeenErrorRef.current = guestsResponseError;

      const backendMessage = guestsResponseError?.message || '';
      const errorKey =
        backendMessage === ALREADY_CHECKED_IN_BACKEND_MESSAGE
          ? 'alreadyCheckedIn'
          : NOT_ALLOWED_BACKEND_MESSAGES.includes(backendMessage)
          ? 'checkInNotAllowed'
          : 'checkInError';

      setCheckInErrorMessage(translateText(`${TRANSLATION_BASE_EVENT_GUEST_PAGE}.errors.${errorKey}`));
    }

    setCheckInGuestId(undefined);
  }, [checkInGuestId, isGuestsSliceBusy, isCheckInTargetRegistered, guestsResponseError, translateText]);

  useEffect(() => {
    reloadRegisteredGuests();
  }, [reloadRegisteredGuests]);

  useEffect(() => {
    if (currentEvent?.place && isPlaceProfile) {
      setIsSamePlace(loggedUser?.currentProfileIdentifier === currentEvent.place.identifier);
    }
  }, [currentEvent, loggedUser]);

  const openAddGuestDialog = useCallback(() => setIsAddGuestDialogOpen(true), []);
  const closeAddGuestDialog = useCallback(() => setIsAddGuestDialogOpen(false), []);

  if (isLoadingEvent || !currentEvent) {
    return <AppLoader height="100vh" />;
  }

  return (
    <>
      <BackButton />
      <div className="event-guest-page">
        <h1 className="event-guest-page__title">{translateText(`${TRANSLATION_BASE_EVENT_GUEST_PAGE}.title`)}</h1>
        {!((currentEvent?.place && isPlaceProfile && isSamePlace) || isArtistProfile) && (
          <>No tienes permisos para registrar en el evento.</>
        )}
        {((currentEvent?.place && isPlaceProfile && isSamePlace) || isArtistProfile) && (
          <>
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

            {canListGuests && (
              <EventGuestsTable
                guests={registeredGuests}
                showsAllGuests={isPlaceProfile}
                onRegisterEntry={isPlaceProfile ? registerGuestEntry : undefined}
                isRegisteringEntry={!!checkInGuestId}
                registerEntryError={checkInErrorMessage}
                onDismissRegisterEntryError={dismissCheckInError}
              />
            )}

            <AddEventGuestDialog
              isOpen={isAddGuestDialogOpen}
              onClose={closeAddGuestDialog}
              onGuestCreated={reloadRegisteredGuests}
              eventId={eventId}
              ticketTypes={ticketTypes}
              artistId={isArtistProfile ? currentProfileId : undefined}
            />
          </>
        )}
      </div>
    </>
  );
};

export default EventGuestPage;
