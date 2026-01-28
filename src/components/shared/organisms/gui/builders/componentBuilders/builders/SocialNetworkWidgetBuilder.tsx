import { SocialNetworks } from '~/constants/social-networks.const';
import { ComponentBuilderParams } from '../types';
import { getData, getDataSource } from '../utils/dataExtraction';

export const createSocialNetworkWidgetComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData, parentDataSource, section } = params;

  // Obtener el data source - prioriza parentDataSource cuando está disponible
  const dataSourceElement = getDataSource(componentDescriptor, entityData, parentDataSource);

  const socialNetworkName = componentDescriptor.data?.socialNetwork || section?.name;
  const selectedSocialNetwork = SocialNetworks[socialNetworkName];

  // Si parentDataSource está disponible, el user debería estar directamente en dataSourceElement
  // Si no, buscarlo en dataSourceElement[socialNetworkName]
  let user;
  if (parentDataSource && componentDescriptor.data?.data_source) {
    // Caso anidado: el data_source apunta directamente al valor del usuario
    user = dataSourceElement;
  } else if (parentDataSource) {
    // Caso anidado sin data_source: buscar en parentDataSource
    user = dataSourceElement[socialNetworkName as keyof typeof dataSourceElement] || dataSourceElement;
  } else {
    // Caso no anidado: buscar en dataSourceElement
    user = dataSourceElement[socialNetworkName as keyof typeof dataSourceElement];
  }

  const widgetParams = componentDescriptor.data?.params || {};
  const paramsValues: any = {};
  Object.keys(widgetParams).forEach((param) => (paramsValues[param] = getData(widgetParams[param], dataSourceElement)));

  return (
    <>
      {selectedSocialNetwork?.widget &&
        selectedSocialNetwork?.widget({
          user,
          ...paramsValues,
        })}
    </>
  );
};
