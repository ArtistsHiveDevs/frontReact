import { ArtistModel, ARTISTS, BARS, getCustomList } from "~/constants";
import "./index.scss";
import { useI18n } from "~/common/utils";

import Card from "react-bootstrap/Card";

const BASE_TRANSLATIONS_HOME_PAGE = "app.pages.HomePage";

const artistList: ArtistModel[] = ARTISTS;
const placesList: ArtistModel[] = BARS;
const placeParams = { hidePhoto: true };

const welcomeSection = () => {
  const { translateText } = useI18n();

  return (
    <section className="welcome-section">
      <>
        <h1 className="welcome-title">
          {translateText(`${BASE_TRANSLATIONS_HOME_PAGE}.welcome`)} a Artists
          Hive!
        </h1>
        <p>
          La comunidad más grande que conecta artistas independientes con los
          sitios. Encuentra tu lugar favorito. Disfruta de las mejores
          expresiones artísticas en tu lugar.
        </p>
        <p>
          Planifica tus eventos, programa tus giras, crea la información
          profesional de tu grupo artístico
        </p>
      </>
    </section>
  );
};

const mainSection = (
  title: string,
  description: string,
  listView: ArtistModel[],
  params?: any
) => {
  return (
    <section className="main-section">
      <>
        <h3 className="main-section-title">{title}</h3>
        <p>{description}</p>
        <div className="cards-container">
          {listView?.map((element, idx) => {
            return entityCard(element, idx, params);
          })}
        </div>
      </>
    </section>
  );
};

const entityCard = (data: ArtistModel, idx: number, params?: any) => {
  return (
    <Card className="entity-card" key={idx}>
      <div className="header-card-container">
        <p>
          {data?.profile_pic && (
            <img className="profile-avatar" src={data.profile_pic}></img>
          )}
          {!data?.profile_pic && (
            <img
              className="profile-avatar"
              src="/src/assets/img/empty-profile.png"
            ></img>
          )}
        </p>
        <p className="header-card-name">
          <span className="card-title-label">{data.name}</span>
          <span>{data.subtitle}</span>
        </p>
      </div>
      {!params?.hidePhoto && (
        <>
          {data?.photo && (
            <div className="container-img-card">
              <Card.Img variant="top" className="img-card" src={data.photo} />
            </div>
          )}
        </>
      )}
      <Card.Body>
        <p className="card-description">{data.description}</p>
      </Card.Body>
      <div className="card-buttons-container">
        <Card.Link className="card-link" href="#">
          Card Link
        </Card.Link>
        <Card.Link href="#">Another Link</Card.Link>
      </div>
    </Card>
  );
};

const HomePage = () => {
  const { translateText } = useI18n();

  return (
    <>
      {welcomeSection()}
      <div className="home-section-title">
        <h1 className="welcome-title">
          {translateText(`${BASE_TRANSLATIONS_HOME_PAGE}.news`)}
        </h1>
      </div>
      {mainSection(
        translateText(`${BASE_TRANSLATIONS_HOME_PAGE}.artists`),
        "Estos son los artistas nuevos más solicitados",
        getCustomList(10, artistList)
      )}

      {mainSection(
        translateText(`${BASE_TRANSLATIONS_HOME_PAGE}.places`),
        "Estos son los lugares más cercanos a tu ubicación que están buscando artistas",
        getCustomList(10, placesList),
        placeParams
      )}
    </>
  );
};

export default HomePage;
