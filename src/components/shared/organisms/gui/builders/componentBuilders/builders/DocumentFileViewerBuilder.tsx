import { GalleryImageParams } from '~/components/shared/atoms/ImageGallery/ImageGallery';
import { HorizontalImageGallery } from '~/components/shared/atoms/ImageGallery/HorizontalImageGallery';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { CustomPDFViewer } from '~/components/shared/atoms/CustomPDFViewer/CustomPDFViewer';

export const createDocumentFileViewerModuleComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData } = params;
  
  let files = getData(componentDescriptor.data?.fileSource, entityData);

  return <>
  <h3>{componentDescriptor?.data?.placeholder}</h3>
    <CustomPDFViewer fileSources = {files} />
  </>;
};
