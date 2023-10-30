import { getCustomList } from "~/constants";

import { ArtistModel } from "~/models/domain/artist/artist.model";

import "./index.scss";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useArtistsSlice } from "~/common/slices";
import { selectArtists } from "~/common/slices/artists/selectors";

import MainSection from "../MainSection/MainSection";
import WelcomeSection from "../WelcomeSection/WelcomeSection";
import "./index.scss";

// const artistList: ArtistModel[] = ARTISTS;
const placesList: ArtistModel[] = [];
const placeParams = { hidePhoto: true };

const HomePage = () => {
  const artistList: ArtistModel[] = useSelector(selectArtists);
  const { actions } = useArtistsSlice();
  const dispatch = useDispatch();

  useEffect(() => {
    if (artistList.length === 0) {
      dispatch(actions.loadArtists());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <WelcomeSection />
      <div className="home-section-title">
        <h1 className="welcome-title">Novedades</h1>
      </div>

      <MainSection
        description={"Estos son los artistas nuevos más solicitados"}
        listView={getCustomList(10, artistList)}
        params={{ useNewCard: true }}
        title={"Artistas"}
      />

      <MainSection
        description={"Próximos eventos cercanos a ti"}
        listView={getCustomList(10, artistList)}
        params={placeParams}
        title={"Eventos"}
      />

      <MainSection
        description={
          "Estos son los lugares más cercanos a tu ubicación que están buscando artistas"
        }
        listView={getCustomList(10, artistList)}
        params={placeParams}
        title={"Lugares"}
      />
    </>
  );
};

export default HomePage;
