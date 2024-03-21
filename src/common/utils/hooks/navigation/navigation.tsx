import { NavigateOptions, useNavigate } from 'react-router-dom';
import { SUB_PATHS } from '~/constants';
import { resolveNavigateToEntityPath } from './navigateToEntityResolver';

export const useNavigation = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const navigateToInnerPath = (params: { path: string; options?: NavigateOptions }) => {
    window.scrollTo(0, 0);
    navigate(params.path, params.options);
  };

  const navigateToEntity = (params: { entityType: string; id?: string; options?: NavigateOptions }) => {
    let entity = resolveNavigateToEntityPath(params.entityType);

    if (entity) {
      let path = `${entity}`;
      if (params.id) {
        path += `/${SUB_PATHS.ELEMENT_DETAILS}/${params.id}`;
      }
      window.scrollTo(0, 0);
      navigate(path, params.options);
    }
  };

  return { goBack, navigateToEntity, navigateToInnerPath };
};
