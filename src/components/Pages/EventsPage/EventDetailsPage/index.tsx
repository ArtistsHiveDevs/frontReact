import "./index.scss";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEventsSlice } from "~/common/slices/events";
import { selectEvents } from "~/common/slices/events/selectors";
import { useI18n } from "~/common/utils";
import { DynamicIcons } from "~/components/shared/DynamicIcons";
import VerifiedArtist from "~/components/shared/VerifiedArtist";

import IconFieldReadOnly from "~/components/shared/atoms/IconField";
import ProfileThumbnailCard from "~/components/shared/molecules/Profile/ProfileThumbnailCard";
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from "~/constants";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { EventModel } from "~/models/domain/event/event.model";

const TRANSLATION_BASE_EVENT_DETAILS_PAGE: string =
  "app.pages.EventsPages.EventDetailsPage";

const EventDetailsPage = () => {
  // Component URL Params
  const urlParameters = useParams();
  const eventId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];

  // States
  const [currentEvent, setCurrentEvent] = useState<EventModel>(undefined);
  const [generalInfoFields, setGeneralInfoFields] = useState([]);
  const [artists, setArtists] = useState<ArtistModel[]>([]);
  const [contactInfoFields, setContactInfoFields] = useState([]);
  const [placeInfoFields, setPlaceInfoFields] = useState([]);
  const [requestsAreReady, setRequestesAreReady] = useState(false);

  const eventsList: EventModel[] = useSelector(selectEvents);
  const { actions: eventActions } = useEventsSlice();

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
  }, []);

  useEffect(() => {
    if (!!eventsList.length) {
      setRequestesAreReady(true);
      setCurrentEvent(
        eventsList?.find((event) => `${event.id}` === `${eventId}`)
      );
    }
  }, [eventsList]);

  useEffect(() => {
    if (currentEvent) {
      setArtists([currentEvent.main_artist, currentEvent.guest_artist]);
      setGeneralInfoFields([
        {
          icon: "FaRegCalendarAlt",
          fieldName: translateText(
            `${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.date`
          ),
          fieldValue: currentEvent?.timetable__initial_date,
        },
        {
          icon: "TbDoorEnter",
          fieldName: translateText(
            `${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.openingDoors`
          ),
          fieldValue: currentEvent?.timetable__openning_doors,
        },
        {
          icon: "IoTimeOutline",
          fieldName: translateText(
            `${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.initialTime`
          ),
          fieldValue: currentEvent?.timetable__guest_time,
        },
        {
          icon: "FaMapMarkerAlt",
          fieldName: "",
          fieldValue: (
            <>
              {currentEvent.place.Nombre} <br /> {currentEvent.place.Dirección}
              <br /> {currentEvent.place.Ciudad}
            </>
          ),
        },
        {
          icon: "IoTicketOutline",
          fieldName: "",
          fieldValue: "https://www.tickets.com",
        },
        {
          icon: "IoTimeOutline",
          fieldName: translateText(
            `${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.minimumAge`
          ),
          fieldValue: currentEvent?.timetable__guest_time,
        },
        {
          icon: "BsInfoCircleFill",
          fieldName: translateText(
            `${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.promoter`
          ),
          fieldValue: currentEvent?.timetable__guest_time,
        },
        {
          icon: "IoBarcodeOutline",
          fieldName: translateText(
            `${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.national_code`
          ),
          fieldValue: currentEvent?.timetable__guest_time,
        },
      ]);

      setContactInfoFields([
        {
          icon: "BsFacebook",
          fieldName: "",
          fieldValue: `@${currentEvent?.timetable__guest_time}`,
        },
        {
          icon: "GrInstagram",
          fieldName: "",
          fieldValue: `@${currentEvent?.timetable__guest_time}`,
        },
        {
          icon: "GrTwitter",
          fieldName: "",
          fieldValue: `@${currentEvent?.timetable__guest_time}`,
        },
        {
          icon: "GrYoutube",
          fieldName: "",
          fieldValue: `@${currentEvent?.timetable__guest_time}`,
        },
        {
          icon: "GrSpotify",
          fieldName: "",
          fieldValue: `@${currentEvent?.timetable__guest_time}`,
        },
        {
          icon: "TfiWorld",
          fieldName: "",
          fieldValue: `@${currentEvent?.timetable__guest_time}`,
        },
        {
          icon: "FaPhoneAlt",
          fieldName: "",
          fieldValue: `@${currentEvent?.timetable__guest_time}`,
        },
        {
          icon: "HiDevicePhoneMobile",
          fieldName: "",
          fieldValue: `@${currentEvent?.timetable__guest_time}`,
        },
        {
          icon: "HiOutlineMail",
          fieldName: "",
          fieldValue: `email@events.com`,
        },
      ]);

      setPlaceInfoFields([
        {
          icon: "FaMapMarkerAlt",
          fieldName: "",
          fieldValue: currentEvent.place?.Dirección,
        },
        {
          icon: "FaCity",
          fieldName: "",
          fieldValue: `${currentEvent.place?.Ciudad}, ${currentEvent.place?.País}`,
        },
        {
          icon: "FaPhoneAlt",
          fieldName: "",
          fieldValue: currentEvent.place?.Teléfono,
        },
        {
          icon: "FaWhatsapp",
          fieldName: "",
          fieldValue: currentEvent.place?.Teléfono,
        },
      ]);
    }
  }, [currentEvent]);

  // Helpers
  function placeInfoThumbnailFooter() {
    return placeInfoFields.map((field, index) => (
      <IconFieldReadOnly
        key={`${field.fieldName}-${index}`}
        icon={field.icon}
        fieldName={field.fieldName}
        fieldValue={field.fieldValue}
      />
    ));
  }

  function navigateTo(newEntity: PATHS, id: string = null) {
    navigate(`${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${id}`);
  }

  return (
    <>
      {currentEvent && (
        <>
          <h1>
            {currentEvent.name}{" "}
            <VerifiedArtist verifiedStatus={currentEvent?.verified_status} />
            <DynamicIcons iconName="FaHeart" size={25} color="#e30000" />
          </h1>

          <img width="135%" src={currentEvent.photo} />
          <hr />
          <h2>
            {translateText(
              `${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.general_information`
            )}
          </h2>
          <div className="info-container">
            {generalInfoFields.map((field, index) => (
              <IconFieldReadOnly
                key={`${field.fieldName}-${index}`}
                icon={field.icon}
                fieldName={field.fieldName}
                fieldValue={field.fieldValue}
              />
            ))}
          </div>
          <h2>
            {translateText(
              `${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.description`
            )}
          </h2>
          <div className="info-container">
            <p>
              Te invitamos a que nos acompañes a la versión número 15 del Gran
              Concierto de fin de año 2022, un concierto en vivo y en directo en
              donde recibiremos el año nuevo con una recopilación de varias de
              las obras que hemos presentado durante las ediciones anteriores.
            </p>
            <p>
              Desde 2008, ininterrumpidamente se ha realizado esta gala musical
              todos los 31 de diciembre, en donde el público capitalino disfruta
              de lo más selecto de la música clásica. La interpretación estará a
              cargo del Coro y Orquesta de la Fundación Orquesta Sinfónica de
              Bogotá - FOSBO, bajo la dirección del maestro Carlos Agreda, y
              como solistas invitados el pianista Mauricio Arias y la soprano
              Beatriz Mora.
            </p>
            <p>
              Te garantizamos una velada con un alto nivel artístico y en donde
              el corazón de cada persona que no acompañe latirá y vibrará con
              cada nota que emita la orquesta y el coro permitiendo así, meditar
              sobre las cosas buenas y malas de este año 2022 e iniciar con un
              nuevo espíritu el 2023.
            </p>
            <p>
              La cita al Gran Concierto de fin de año es el próximo 31 de
              diciembre a las 8:00 p.m. en nuestro Teatro Cafam.
            </p>
          </div>
          <h2>
            {translateText(`${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.artists`)}
          </h2>

          <div className="info-container">
            {artists.map((artist, index) => (
              <ProfileThumbnailCard
                key={`${artist.id}-${index}`}
                elementData={{
                  id: artist.id,
                  profile_pic: artist.profile_pic,
                  name: artist.name,
                  subtitle: artist.subtitle,
                  verified_status: artist.verified_status,
                }}
                callbacks={{
                  onClickCard: (elementData: any) =>
                    navigateTo(PATHS.ARTISTS, elementData.id),
                }}
              />
            ))}
          </div>

          <h2>
            {translateText(`${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.contact`)}
          </h2>
          <div className="info-container">
            {contactInfoFields.map((field, index) => (
              <IconFieldReadOnly
                key={`${field.fieldName}-${index}`}
                icon={field.icon}
                fieldName={field.fieldName}
                fieldValue={field.fieldValue}
              />
            ))}
          </div>
          <h2>
            {translateText(`${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.place`)}
          </h2>
          <div>
            {currentEvent.place && (
              <ProfileThumbnailCard
                key={`${currentEvent.place?.id}`}
                elementData={{
                  id: currentEvent.place_id,
                  profile_pic: currentEvent.place?.profile_pic,
                  name: currentEvent.place?.Nombre,
                  verified_status: currentEvent.main_artist?.verified_status,
                }}
                footer={() => placeInfoThumbnailFooter()}
                styles={{ avatar: "avatar-place" }}
                callbacks={{
                  onClickCard: (elementData: any) =>
                    navigateTo(PATHS.PLACES, elementData.id),
                }}
              />
            )}
          </div>
          <h2>
            {translateText(
              `${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.additionalInfo`
            )}
          </h2>
          <div>
            <ul>
              <li>
                Recuerde tener listo su tiquete de entrada impreso o el código
                QR en el celular al momento del ingreso para agilizar la
                entrada.
              </li>
              <li>El evento inicia puntualmente.</li>
              <li>
                No se permite el ingreso de personas en estado de embriaguez ni
                efectos alucinógenos.
              </li>
            </ul>
          </div>
          <h2>
            {translateText(`${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.discounts`)}
          </h2>
          <div></div>
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
