import { ArtistModel, ARTISTS, BARS, getCustomList } from "~/constants";

import { mainSection, welcomeSection } from "./home.utils";
import "./index.scss";
import { useI18n } from "~/common/utils";

import Card from "react-bootstrap/Card";
import VerifiedArtist from "~/components/shared/VerifiedArtist";

const BASE_TRANSLATIONS_HOME_PAGE = "app.pages.HomePage";

const artistList: ArtistModel[] = ARTISTS;
const placesList: ArtistModel[] = BARS;
const placeParams = { hidePhoto: true };

const HomePage = () => (
  <>
    {welcomeSection()}
    <div className="home-section-title">
      <h1 className="welcome-title">Novedades</h1>
    </div>
    {mainSection(
      "Artistas",
      "Estos son los artistas nuevos más solicitados",
      getCustomList(10, artistList)
    )}

    {mainSection(
      "Lugares",
      "Estos son los lugares más cercanos a tu ubicación que están buscando artistas",
      getCustomList(10, placesList),
      placeParams
    )}
  </>
);

export default HomePage;
