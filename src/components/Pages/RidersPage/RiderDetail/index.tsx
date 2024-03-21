import { useParams } from 'react-router-dom';
import { URL_PARAMETER_NAMES } from '~/constants';

const RiderDetailPage = () => {
  const urlParameters = useParams();
  const artistId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];
  return <>Rider details funciona {artistId}</>;
};

export default RiderDetailPage;
