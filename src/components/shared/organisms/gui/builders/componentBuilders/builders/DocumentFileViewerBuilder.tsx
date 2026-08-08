import { useI18n } from '~/common/utils';
import { CustomPDFViewer } from '~/components/shared/atoms/CustomPDFViewer/CustomPDFViewer';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';
import { DBFileDataItem } from '~/common/utils/amplify/storage/storage.types';

export const createDocumentFileViewerModuleComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { translateText } = useI18n();

  const { componentDescriptor, entityData } = params;
  const { data: componentDescriptorData } = componentDescriptor || {};
  const { fileSource, translationPath } = componentDescriptorData;

  let files: DBFileDataItem[] = getData(fileSource, entityData);

  return (
    <>
      <h3>{translateText(`${translationPath}.${fileSource}`)}</h3>
      <CustomPDFViewer fileSources={files} />
    </>
  );
};
