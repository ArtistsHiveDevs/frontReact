import { SocialNetworks } from '~/constants/social-networks.const';
import { ComponentBuilderParams } from '../types';
import { getData, getDataSource } from '../utils/dataExtraction';

export const createSocialNetworkWidgetComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData, parentDataSource } = params;

  const dataSourceElement = getDataSource(componentDescriptor, entityData, parentDataSource);

  const socialNetworkName = componentDescriptor.data?.socialNetwork;
  const selectedSocialNetwork = SocialNetworks[socialNetworkName];
  const user = dataSourceElement[socialNetworkName as keyof typeof dataSourceElement];

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
