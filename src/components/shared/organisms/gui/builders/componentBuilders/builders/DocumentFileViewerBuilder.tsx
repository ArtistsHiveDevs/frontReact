import { GalleryImageParams } from '~/components/shared/atoms/ImageGallery/ImageGallery';
import { HorizontalImageGallery } from '~/components/shared/atoms/ImageGallery/HorizontalImageGallery';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';
import { DynamicIcons } from '~/components/shared/DynamicIcons';

export const createDocumentFileViewerModuleComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData } = params;

  let images: GalleryImageParams[] = [];

  if (componentDescriptor.data?.images) {
    images = getData(componentDescriptor.data?.images, entityData);
  }
  if (componentDescriptor.data?.image) {
    images = [{ src: getData(componentDescriptor.data?.image, entityData) }];
  }

  return <>
  <div>{componentDescriptor?.formMetaData?.fieldName}</div>
  <DynamicIcons iconName='BiSolidFilePdf' size={40} />
    {/* <HorizontalImageGallery imagesInfo={images} data={componentDescriptor.data} /> */}
  </>;
};
