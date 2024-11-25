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

      if (entity === PATHS.PROFILE) {
        path += `/${params.action || ''}`;
      } else {
        path += `/${params.action || SUB_PATHS.ELEMENT_DETAILS}/${params.id}`;
      }

      window.scrollTo(0, 0);
      navigate(path, params.options);
    } else {
      console.error('Navigate to entity error: Entity type was not found', params, entity);
    }
  };

  return { goBack, navigateToEntity, navigateToInnerPath };
};
