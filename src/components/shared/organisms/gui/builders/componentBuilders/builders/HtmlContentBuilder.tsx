import { ComponentBuilderParams } from '../types';
import { getData, getDataSource } from '../utils/dataExtraction';

export const createHtmlContentComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData, parentDataSource } = params;

  const dataSourceElement = getDataSource(componentDescriptor, entityData, parentDataSource);

  const content =
    getData(componentDescriptor.data?.attribute_content, dataSourceElement) ||
    componentDescriptor.data?.content ||
    (componentDescriptor.data?.render && componentDescriptor.data?.render(dataSourceElement));

  return <>{content}</>;
};
