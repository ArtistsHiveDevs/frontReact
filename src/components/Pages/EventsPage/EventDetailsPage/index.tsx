import './index.scss';

import { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorEvents, useEventsSlice } from '~/common/slices/domain/events/events.redux';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { RootState } from '~/common/utils/redux-injectors/types';
import NotFoundPage from '~/components/Pages/NotFoundPage';
import VerifiedArtist from '~/components/shared/VerifiedArtist';
import {
  FavoriteSubscription,
  FavoriteSubscritionIconDefaultTypes,
} from '~/components/shared/molecules/general/favoriteSubscribe/favoriteSubscribe';
import { ProfileTabsPage } from '~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { URL_PARAMETER_NAMES } from '~/constants';
import { EventModel } from '~/models/domain/event/event.model';
import { EVENT_DETAIL_SUB_PAGE_CONFIG, TRANSLATION_BASE_EVENT_DETAILS_PAGE } from './config-event-detail';

const EventDetailsPage = () => {
  // Component URL Params
  const urlParameters = useParams();
  const [eventId, setCurrentEventId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);

  // States
  const [requestsAreReady, setRequestesAreReady] = useState(false);
  const [imageURL, setImageURL] = useState<string>(undefined);

  const { actions: eventActions } = useEventsSlice();

  const subPagesInfo = [...EVENT_DETAIL_SUB_PAGE_CONFIG];

  // Hooks
  const dispatch = useDispatch();

  const { translateText } = useI18n();

  const { navigateToEntity } = useNavigation();

  // Effects

  const selectEventById = selectorEvents.makeSelectItemById();
  const currentEvent: EventModel = useSelector((state: RootState) => {
    if (eventId) {
      return selectEventById(state, eventId);
    } else {
      return undefined;
    }
  });
  const isLoading = useSelector(selectorEvents.selectLoading);

  useEffect(() => {
    if (currentEvent) {
      document.title = `${currentEvent.name}  ◃⬡▹  Artist Hive`;
      // logPageViewEvent({ page_title: `Event - ${currentEvent.name}` });
    }
    if (requestsAreReady) {
      console.log('LLegó la respuesta del evento', currentEvent);
    }
  }, [currentEvent]);

  useEffect(() => {
    dispatch(eventActions.getItemById({ id: eventId }));
    console.log('RQ EVENTO');
    setRequestesAreReady(true);
  }, [eventId]);

  // function navigateTo(newEntity: PATHS, id: string = null) {
  //   navigate(`/${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${id}`);
  // }

  const handlers = {
    onNavigateToEntity: (value: any) => {
      const entityType = value.constructor.name;
      navigateToEntity({ entityType, id: value.identifier });
    },
  };

  const getProfilePicURL = async () => {
    const photoURL =
      currentEvent && !!currentEvent?.avatarURL ? await currentEvent.avatarURL() : currentEvent?.profile_pic;

    setImageURL(photoURL);
  };

  useEffect(() => {
    if (!!currentEvent) {
      getProfilePicURL();
    }
  }, [currentEvent]);

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
                <Image alt={currentEvent.name} src={imageURL} fluid={true} />
              </>
            }
          />
        </>
      )}
      {isLoading && <AppLoader height="100vh" />}
      {requestsAreReady && !isLoading && !currentEvent && <NotFoundPage />}
    </>
  );
};

export default EventDetailsPage;
