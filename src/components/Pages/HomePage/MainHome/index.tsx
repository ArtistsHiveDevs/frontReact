import { ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useArtistsSlice } from "~/common/slices/artists";
import { selectArtists } from "~/common/slices/artists/selectors";
import { useEventsSlice } from "~/common/slices/events";
import { selectEvents } from "~/common/slices/events/selectors";
import { usePlacesSlice } from "~/common/slices/places";
import { selectPlaces } from "~/common/slices/places/selectors";
import { useI18n } from "~/common/utils";
import { getCustomList, PATHS, SUB_PATHS } from "~/constants";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { EventModel } from "~/models/domain/event/event.model";
import { PlaceModel } from "~/models/domain/place/place.model";
import MainSection from "../MainSection";
import WelcomeSection from "../WelcomeSection";
import "./index.scss";

import MapContainer from "~/components/shared/mapPrinter/mapContainer";

const TRANSLATION_BASE_HOME_PAGE = "app.pages.HomePage";

const HomePage = () => {
  const artistList: ArtistModel[] = useSelector(selectArtists);
  const { actions: artistsActions } = useArtistsSlice();

  const eventsList: EventModel[] = useSelector(selectEvents);
  const { actions: eventActions } = useEventsSlice();

  const placesList: PlaceModel[] = useSelector(selectPlaces);
  const { actions: placesActions } = usePlacesSlice();

  // Hooks
  const dispatch = useDispatch();
  const { translateText } = useI18n();
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    if (artistList.length === 0) {
      dispatch(artistsActions.loadArtists());
    }
    if (eventsList.length === 0) {
      dispatch(eventActions.loadEvents());
    }
    if (placesList.length === 0) {
      dispatch(placesActions.loadPlaces());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onClickCardEventos(data: any) {
    navigate(`${PATHS.EVENTS}/${SUB_PATHS.ELEMENT_DETAILS}/${data.id}`);
  }
  return (
    <>
      <WelcomeSection />
      <div className="home-section-title">
        <h1 className="welcome-title">
          {translateText(`${TRANSLATION_BASE_HOME_PAGE}.news`)}
        </h1>
      </div>

      <MainSection
        description={"Estos son los artistas nuevos más solicitados"}
        listView={getCustomList(18, artistList)}
        params={{ useNewCard: true }}
        title={translateText(`${TRANSLATION_BASE_HOME_PAGE}.artists`)}
      />

      <MainSection
        description={"Próximos eventos cercanos a ti"}
        listView={getCustomList(30, eventsList)}
        params={{ useNewCard: true }}
        title={translateText(`${TRANSLATION_BASE_HOME_PAGE}.events`)}
        callbacks={{ onClickCard: onClickCardEventos }}
      />

      <MainSection
        description={
          "Estos son los lugares más cercanos a tu ubicación que están buscando artistas"
        }
        listView={getCustomList(22, placesList)}
        params={{ useNewCard: true }}
        title={translateText(`${TRANSLATION_BASE_HOME_PAGE}.places`)}
      />
    </>
  );
};

export default HomePage;
