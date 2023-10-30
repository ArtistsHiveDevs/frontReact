import "./index.scss";

import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEventsSlice } from "~/common/slices/events";
import { selectEvents } from "~/common/slices/events/selectors";
import { useI18n } from "~/common/utils";
import { DynamicIcons } from "~/components/shared/DynamicIcons";
import VerifiedArtist from "~/components/shared/VerifiedArtist";
import { ProfileTabsPage } from "~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage";

import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from "~/constants";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { EventModel } from "~/models/domain/event/event.model";
import { PlaceModel } from "~/models/domain/place/place.model";
import { EVENT_DETAIL_SUB_PAGE_CONFIG } from "./config-event-detail";

const TRANSLATION_BASE_EVENT_DETAILS_PAGE: string =
  "app.pages.EventsPages.EventDetailsPage";

const EventDetailsPage = () => {
  // Component URL Params
  const urlParameters = useParams();
  const [eventId, setCurrentEventId] = useState(
    urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]
  );

  // States
  const [currentEvent, setCurrentEvent] = useState<EventModel>(undefined);
  const [requestsAreReady, setRequestesAreReady] = useState(false);

  const eventsList: EventModel[] = useSelector(selectEvents);
  const { actions: eventActions } = useEventsSlice();

  const subPagesInfo = [...EVENT_DETAIL_SUB_PAGE_CONFIG];

  // Hooks
  const dispatch = useDispatch();

  const { translateText } = useI18n();

  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    if (eventsList.length === 0) {
      dispatch(eventActions.loadEvents());
    } else {
      setCurrentEvent(
        eventsList?.find((event) => `${event.id}` === `${eventId}`)
      );
    }

    if (eventId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentEventId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
  }, [urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]]);

  useEffect(() => {
    if (!!eventsList.length) {
      setRequestesAreReady(true);
      setCurrentEvent(
        eventsList?.find((event) => `${event.id}` === `${eventId}`)
      );
    }
  }, [eventsList]);

  function navigateTo(newEntity: PATHS, id: string = null) {
    navigate(`${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${id}`);
  }

  const handlers = {
    onNavigateToEntity: (value: any) => {
      const entityType = value.constructor.name;
      let entity = undefined;
      if (entityType === ArtistModel.name) {
        entity = PATHS.ARTISTS;
      } else if (entityType === EventModel.name) {
        entity = PATHS.EVENTS;
      } else if (entityType === PlaceModel.name) {
        entity = PATHS.PLACES;
      }
      if (entity) {
        navigateTo(entity, value.id);
      }
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
                  {currentEvent.name}{" "}
                  <VerifiedArtist
                    verifiedStatus={currentEvent?.verified_status}
                  />
                  <DynamicIcons iconName="FaHeart" size={25} color="#e30000" />
                </h1>
                <Image
                  alt={currentEvent.name}
                  src={currentEvent.profile_pic}
                  fluid={true}
                />
              </>
            }
          />
        </>
      )}
      {requestsAreReady && !currentEvent && (
        <h2>
          {translateText(
            `${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.eventNotFound`
          )}
        </h2>
      )}
    </>
  );
};

export default EventDetailsPage;
