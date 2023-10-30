import { getCustomList } from "~/constants";

import { ArtistModel } from "~/models/domain/artist/artist.model";

import "./index.scss";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useArtistsSlice } from "~/common/slices";
import { selectArtists } from "~/common/slices/artists/selectors";
import { useEventsSlice } from "~/common/slices/events";
import { selectEvents } from "~/common/slices/events/selectors";
import { useI18n } from "~/common/utils";
import { EventModel } from "~/models/domain/event/event.model";
import MainSection from "../MainSection/MainSection";
import WelcomeSection from "../WelcomeSection/WelcomeSection";
import "./index.scss";

const TRANSLATION_BASE_HOME_PAGE = "app.pages.HomePage";

// const artistList: ArtistModel[] = ARTISTS;
const placesList: ArtistModel[] = [];
const placeParams = { hidePhoto: true };

const HomePage = () => {
  const artistList: ArtistModel[] = useSelector(selectArtists);
  const { actions: artistsActions } = useArtistsSlice();

  const eventsList: EventModel[] = useSelector(selectEvents);
  const { actions: eventActions } = useEventsSlice();

  const dispatch = useDispatch();

  const { translateText } = useI18n();

  useEffect(() => {
    if (artistList.length === 0) {
      dispatch(artistsActions.loadArtists());
    }
    if (eventsList.length === 0) {
      dispatch(eventActions.loadEvents());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        listView={getCustomList(10, artistList)}
        params={{ useNewCard: true }}
        title={translateText(`${TRANSLATION_BASE_HOME_PAGE}.artists`)}
      />

      <MainSection
        description={"Próximos eventos cercanos a ti"}
        listView={getCustomList(10, artistList)}
        params={placeParams}
        title={translateText(`${TRANSLATION_BASE_HOME_PAGE}.events`)}
      />

      <MainSection
        description={
          "Estos son los lugares más cercanos a tu ubicación que están buscando artistas"
        }
        listView={getCustomList(10, artistList)}
        params={placeParams}
        title={translateText(`${TRANSLATION_BASE_HOME_PAGE}.places`)}
      />
    </>
  );
};

export default HomePage;
