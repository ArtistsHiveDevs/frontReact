import { GalleryImageParams } from '~/components/shared/atoms/ImageGallery/ImageGallery';
import { HorizontalImageGallery } from '~/components/shared/atoms/ImageGallery/HorizontalImageGallery';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';

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
  <div>Hola</div>
    <HorizontalImageGallery imagesInfo={images} data={componentDescriptor.data} />
  </>;
};
