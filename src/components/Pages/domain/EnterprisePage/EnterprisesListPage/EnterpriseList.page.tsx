import { useParams } from 'react-router-dom';
import { URL_PARAMETER_NAMES } from '~/constants';
import './EnterpriseList.page.scss';

const EnterprisesListPage = () => {
  const urlParameters = useParams();
  const artistId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];
  return <>Enterprises funciona {artistId}</>;
};

export default EnterprisesListPage;
