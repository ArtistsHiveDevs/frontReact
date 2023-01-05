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

import { Wrapper, Status } from "@googlemaps/react-wrapper";
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

  // TODO Datos para el mapa

  const mapData = {
    zoom: 20,
    center: { lat: 4.633355, lng: -74.090679 },
    marksLocation: [
      { lat: 4.633355, lng: -74.090679 },
      // { lat: 4.6332706708716085, lng: -74.09073366181859 },
    ],
    anotherOpts: {},
  };

  const mapContainerStyles = { width: "80%", height: "400px" };
  const googleApiKey = "AIzaSyBzyzf0hnuMJBdOB9sR0kBbBTtqYs-XECs";

  //  TODO  fin datos para el mapa

  function onClickCardEventos(data: any) {
    navigate(`${PATHS.EVENTS}/${SUB_PATHS.ELEMENT_DETAILS}/${data.id}`);
  }
  return (
    <>
      {/* TODO Se comenta implementación de mapa anterior y se llama a nueva */}
      {/* <h1>Antes Mapa</h1>
      <div id="map-container">
        <Wrapper
          apiKey={"AIzaSyBzyzf0hnuMJBdOB9sR0kBbBTtqYs-XECs"}
          render={render}
        >
          <MyMapComponent
            center={{ lat: 4.633355, lng: -74.090679 }}
            zoom={20}
          />
        </Wrapper>
      </div>
      <h1>después Mapa S</h1> */}
      <h1>Se muestra ubicación</h1>
      <MapContainer
        apiKey={googleApiKey}
        stylesc={mapContainerStyles}
        mapData={mapData}
      />
      <h1>después Mapa S</h1>
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
        listView={getCustomList(10, eventsList)}
        params={{ useNewCard: true }}
        title={translateText(`${TRANSLATION_BASE_HOME_PAGE}.events`)}
        callbacks={{ onClickCard: onClickCardEventos }}
      />

      <MainSection
        description={
          "Estos son los lugares más cercanos a tu ubicación que están buscando artistas"
        }
        listView={getCustomList(10, placesList)}
        params={{ useNewCard: true }}
        title={translateText(`${TRANSLATION_BASE_HOME_PAGE}.places`)}
      />
    </>
  );
};

const render = (status: Status): ReactElement => {
  if (status === Status.FAILURE) return <h1>ERROR</h1>;
  return <h1>SPINNER</h1>;
};
function MyMapComponent({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) {
  const ref = useRef();

  useEffect(() => {
    let marker = new google.maps.Marker(ref.current).setLabel("cualquierCosa");
    let map = new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });
  });

  return <div ref={ref} id="map" />;
}
export default HomePage;
