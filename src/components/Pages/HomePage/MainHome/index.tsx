import { getCustomList } from "~/constants";

import { ArtistModel } from "~/models/domain/artist/artist.model";
import MainSection from "../MainSection/MainSection";
import WelcomeSection from "../WelcomeSection/WelcomeSection";
import "./index.scss";

const artistList: ArtistModel[] = [];
const placesList: ArtistModel[] = [];
const placeParams = { hidePhoto: true };

const HomePage = () => (
  <>
    <WelcomeSection />
    <div className="home-section-title">
      <h1 className="welcome-title">Novedades</h1>
    </div>

    <MainSection
      title={"Artistas"}
      description={"Estos son los artistas nuevos más solicitados"}
      listView={getCustomList(10, artistList)}
      params={{ useNewCard: true }}
    />

    <MainSection
      title={"Eventos"}
      description={"Próximos eventos cercanos a ti"}
      listView={getCustomList(10, artistList)}
      params={placeParams}
    />

    <MainSection
      title={"Lugares"}
      description={
        "Estos son los lugares más cercanos a tu ubicación que están buscando artistas"
      }
      listView={getCustomList(10, artistList)}
      params={placeParams}
    />
  </>
);

export default HomePage;
