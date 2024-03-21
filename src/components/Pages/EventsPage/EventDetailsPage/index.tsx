import './index.scss';

import { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEventsSlice } from '~/common/slices/events';
import { selectEvents } from '~/common/slices/events/selectors';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import VerifiedArtist from '~/components/shared/VerifiedArtist';
import {
  FavoriteSubscription,
  FavoriteSubscritionIconDefaultTypes,
} from '~/components/shared/molecules/general/favoriteSubscribe/favoriteSubscribe';
import { ProfileTabsPage } from '~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage';
import { URL_PARAMETER_NAMES } from '~/constants';
import { EventModel } from '~/models/domain/event/event.model';
import { EVENT_DETAIL_SUB_PAGE_CONFIG } from './config-event-detail';

const TRANSLATION_BASE_EVENT_DETAILS_PAGE: string = 'app.pages.EventsPages.EventDetailsPage';

const EventDetailsPage = () => {
  // Component URL Params
  const urlParameters = useParams();
  const [eventId, setCurrentEventId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);

  // States
  const [currentEvent, setCurrentEvent] = useState<EventModel>(undefined);
  const [requestsAreReady, setRequestesAreReady] = useState(false);

  const eventsList: EventModel[] = useSelector(selectEvents);
  const { actions: eventActions } = useEventsSlice();

  const subPagesInfo = [...EVENT_DETAIL_SUB_PAGE_CONFIG];

  // Hooks
  const dispatch = useDispatch();

  const { translateText } = useI18n();

  const { navigateToEntity } = useNavigation();

  // Effects
  useEffect(() => {
    if (eventsList.length === 0) {
      dispatch(eventActions.loadEvents());
    } else {
      setCurrentEvent(eventsList?.find((event) => `${event.id}` === `${eventId}`));
    }

    if (eventId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentEventId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
  }, [urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]]);

  useEffect(() => {
    if (!!eventsList.length) {
      setRequestesAreReady(true);
      setCurrentEvent(eventsList?.find((event) => `${event.id}` === `${eventId}`));
    }
  }, [eventsList]);

  // function navigateTo(newEntity: PATHS, id: string = null) {
  //   navigate(`${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${id}`);
  // }

  const handlers = {
    onNavigateToEntity: (value: any) => {
      const entityType = value.constructor.name;
      navigateToEntity({ entityType, id: value.id });
    },
  };

  return (
    <>
      {currentEvent && (
        <>
          <ProfileTabsPage
            entityName="Event"
            entityData={currentEvent}
            translation_base_path={TRANSLATION_BASE_EVENT_DETAILS_PAGE}
            subpagesConfig={subPagesInfo}
            handlers={handlers}
            profileHeaderComponent={
              <>
                <h1 className="event-title">
                  {currentEvent.name} <VerifiedArtist verifiedStatus={currentEvent?.verified_status} />
                  <FavoriteSubscription
                    color={'#7a260a'}
                    size={22}
                    iconType={FavoriteSubscritionIconDefaultTypes.BELL}
                  />
                </h1>
                <Image alt={currentEvent.name} src={currentEvent.profile_pic} fluid={true} />
              </>
            }
          />
        </>
      )}
      {requestsAreReady && !currentEvent && (
        <h2>{translateText(`${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.eventNotFound`)}</h2>
      )}
    </>
  );
};

export default EventDetailsPage;
