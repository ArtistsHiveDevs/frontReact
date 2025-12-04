import { FollowerListView } from '~/components/shared/molecules/Profile/FollowerListView/FollowerListView';
import { ComponentBuilderParams, ComponentBuilderFunction } from '../types';
import { getData, getDataSource } from '../utils/dataExtraction';

/**
 * Builder para PROFILE_FOLLOWERS_COMPONENT
 *
 * Características:
 * - Extrae contenido de múltiples fuentes posibles
 * - Integra con handlers para navegación de tabs
 * - Soporta filtrado por tipo de follower
 *
 * NOTA: Este componente requiere handlers especiales:
 * - lastVisibleTab: string (del estado de ProfileTabsPage)
 * - setShowSpecificTab: Function (del estado de ProfileTabsPage)
 * - showSpecificFollowerType: string | undefined (opcional)
 */
export const createProfileFollowersComponent: ComponentBuilderFunction = (
  params: ComponentBuilderParams
): JSX.Element => {
  const { componentDescriptor, entityData, parentDataSource, handlers } = params;

  const dataSourceElement = getDataSource(componentDescriptor, entityData, parentDataSource);

  // Extraer contenido de múltiples fuentes posibles (prioridad descendente)
  const content =
    getData(componentDescriptor.data?.attribute_content, dataSourceElement) ||
    componentDescriptor.data?.content ||
    (componentDescriptor.data?.render && componentDescriptor.data?.render(parentDataSource || dataSourceElement)) ||
    parentDataSource ||
    dataSourceElement;

  // Construir handlers con onClickBackButtonFollowers
  const followersListView = {
    ...handlers,
    onClickBackButtonFollowers: () => {
      const lastVisibleTab = handlers?.['lastVisibleTab'];
      const setShowSpecificTab = handlers?.['setShowSpecificTab'];

      console.log(lastVisibleTab);
      if (setShowSpecificTab) {
        setShowSpecificTab(lastVisibleTab);
      }
    },
  };

  // Obtener tipo específico de follower si existe
  const showSpecificFollowerType = handlers?.['showSpecificFollowerType'] as unknown as string | undefined;

  return (
    <FollowerListView
      element={content}
      handlers={followersListView}
      showSpecificFollowerType={showSpecificFollowerType}
    />
  );
};
