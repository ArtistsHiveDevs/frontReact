import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useArtistsSlice } from "~/common/slices/artists";
import { selectArtists } from "~/common/slices/artists/selectors";
import { useEventsSlice } from "~/common/slices/events";
import { selectEvents } from "~/common/slices/events/selectors";
import { usePlacesSlice } from "~/common/slices/places";
import { selectPlaces } from "~/common/slices/places/selectors";
import { useI18n } from "~/common/utils";
import { useNavigation } from "~/common/utils/hooks/navigation/navigation";
import { DynamicForm } from "~/components/shared/organisms/gui/dynamicForms/dynamic-form";
import { PATHS, getCustomList } from "~/constants";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { EventModel } from "~/models/domain/event/event.model";
import { PlaceModel } from "~/models/domain/place/place.model";
import MainSection from "../MainSection";
import WelcomeSection from "../WelcomeSection";
import { fields } from "./data";
import "./index.scss";

const TRANSLATION_BASE_HOME_PAGE = "app.pages.HomePage";
const TRANSLATION_BASE_GLOBAL_DICTONARY = "app.global_dictionary";

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
  const { navigateToEntity, navigateToInnerPath } = useNavigation();

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

  function onClickCardArtist(data: any) {
    navigateToEntity({ entityType: ArtistModel.name, id: data.id });
  }

  function onClickCardEventos(data: any) {
    navigateToEntity({ entityType: EventModel.name, id: data.id });
  }

  function onClickCardPlaces(data: any) {
    navigateToEntity({ entityType: PlaceModel.name, id: data.id });
  }

  const openOfferIndustry = (actorRole: string) => {
    navigateToInnerPath({ path: `${PATHS.INDUSTRY_OFFER}/${actorRole}` });
  };

  const offerActors = [
    {
      role: "artists",
      image:
        "https://c1.wallpaperflare.com/preview/516/564/13/band-music-performance-perform.jpg",
    },
    {
      role: "promoters",
      image:
        "https://c1.wallpaperflare.com/preview/105/913/190/audio-audio-mixer-bass-blur.jpg",
    },
    {
      role: "places",
      image:
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d0beebe8-2760-4784-a929-15d40d310a61/dcqsobn-d17166c2-92e4-42b9-92dd-e4b5060fff7a.jpg/v1/fill/w_1088,h_734,q_70,strp/bar_concert_room_by_goliatgashi_dcqsobn-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI5NiIsInBhdGgiOiJcL2ZcL2QwYmVlYmU4LTI3NjAtNDc4NC1hOTI5LTE1ZDQwZDMxMGE2MVwvZGNxc29ibi1kMTcxNjZjMi05MmU0LTQyYjktOTJkZC1lNGI1MDYwZmZmN2EuanBnIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.ecRdf5oG2RVLEbQNBpZgZh1U5wt6iz7W3CKYOdeYnCU",
    },
    {
      role: "academies",
      image:
        "https://artsedcollab.org/wp-content/uploads/2018/12/20180118_121442_24968897657_o-600x450.jpg",
    },
  ];

  const provincias = {
    AR: [
      { value: "BsAs", label: "Buenos Aires" },
      { value: "neu", label: "Neuquén" },
      { value: "bar", label: "Bariloche" },
      { value: "cor", label: "Córdoba" },
    ],
    CO: [
      { value: "bog", label: "Bogotá" },
      { value: "med", label: "Medellín" },
      { value: "cal", label: "Cali" },
      { value: "barr", label: "Barranquilla" },
    ],
    PE: [
      { value: "Lim", label: "Lima" },
      { value: "Cuz", label: "Cuzco" },
      { value: "Iqui", label: "Iquitos" },
      { value: "CHI", label: "Chiclayo" },
    ],
  };

  const [fieldsForm, updateFields] = useState(fields);
  const [ciudadesForm, updateCiudades] = useState([]);
  const handlers = {
    onSubmit: (data: any, error?: any) => {
      console.log("#####----------->>>>  !!! ", data);
    },
    onChangecountry: (data: any) => {
      const ciudades =
        !!data &&
        !!data.value &&
        Object.keys(provincias).indexOf(data?.value) >= 0
          ? provincias[data.value as keyof typeof provincias]
          : [];
      const provinceField = fields.find(
        (fieldData) => fieldData.fieldName === "province"
      );
      provinceField.options = ciudades;
      // provinceField.defaultValue =
      //   (ciudades && ciudades.length && ciudades[1].value) || "";

      updateFields(fields);
      updateCiudades(ciudades);
    },
  };

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
        callbacks={{ onClickCard: onClickCardArtist }}
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
        callbacks={{ onClickCard: onClickCardPlaces }}
      />

      <div className="home-section-title">
        <h1 className="welcome-title">
          {translateText(`${TRANSLATION_BASE_HOME_PAGE}.industry_offer.title`)}
        </h1>
        <p>
          {translateText(
            `${TRANSLATION_BASE_HOME_PAGE}.industry_offer.call_to_action`
          )}
        </p>
        <div className="offer-to-industry-container">
          {offerActors.map((actor) => {
            return (
              <div
                className="offer-to-industry"
                key={actor.role}
                onClick={() => openOfferIndustry(actor.role)}
              >
                <p className="text-offer">
                  {translateText(
                    `${TRANSLATION_BASE_GLOBAL_DICTONARY}.entities.${actor.role}.plural`
                  )}
                </p>
                <Image
                  rounded={true}
                  src={actor.image}
                  className="offer-to-industry-image"
                />
              </div>
            );
          })}
        </div>
        <h1>PRUEBA FORM</h1>
        <h1>Dynamic form</h1>
        <DynamicForm fields={fieldsForm} handlers={handlers} />
      </div>
    </>
  );
};

export default HomePage;
