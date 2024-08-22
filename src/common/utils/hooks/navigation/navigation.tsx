import { NavigateOptions, useNavigate } from 'react-router-dom';
import { PATHS, SUB_PATHS } from '~/constants';
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

  const navigateToEntity = (params: {
    entityType: string;
    id?: string;
    options?: NavigateOptions;
    action?: string;
  }) => {
    let entity = resolveNavigateToEntityPath(params.entityType);

    if (entity) {
      let path = `${entity}`;

      if (entity === PATHS.PROFILE || params.id) {
        const idParam = entity === PATHS.PROFILE ? '' : `/${params.id}`;
        path += `/${params.action || SUB_PATHS.ELEMENT_DETAILS}${idParam}`;
      }

      window.scrollTo(0, 0);
      navigate(path, params.options);
    }
  };

  return { goBack, navigateToEntity, navigateToInnerPath };
};
