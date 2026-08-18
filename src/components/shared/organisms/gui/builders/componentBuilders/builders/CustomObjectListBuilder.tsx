import { CustomObjectListViewer } from '~/components/shared/CustomObjectListViewer/CustomObjectListViewer';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';

export const createCustomObjectListBuiderComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData } = params;
  const { data: componentDescriptorData, formMetaData } = componentDescriptor || {};
  const { externalData } = componentDescriptorData;

  let memberList: any = getData(externalData, entityData);
  const fields = formMetaData?.componentParams?.fields || [];
  const translationPath = formMetaData?.componentParams?.translationPath || '';
  const enableVerticalViewFromExt =  formMetaData?.componentParams?.enableVerticalView;

  return (
    <>
      <CustomObjectListViewer fields={fields} objectList={[...memberList]} translationPath={translationPath} enableVerticalView={enableVerticalViewFromExt} />
    </>
  );
};
