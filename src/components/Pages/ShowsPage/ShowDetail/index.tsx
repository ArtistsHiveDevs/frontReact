import { useParams } from "react-router-dom";
import { URL_PARAMETER_NAMES } from "~/constants";

const ShowDetailPage = () => {
  const urlParameters = useParams();
  const eventId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];
  return <>Detalle de evento funciona {eventId}</>;
};

export default ShowDetailPage;
