import { GalleryImageParams, ImageGallery } from '~/components/shared/atoms/ImageGallery/ImageGallery';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';

export const createImageGalleryComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData, handlers } = params;

  let clickHandler: ((source: GalleryImageParams, images: any) => void) | undefined = undefined;

  if (componentDescriptor.clickHandlerName && handlers) {
    clickHandler = handlers[componentDescriptor.clickHandlerName] as (source: GalleryImageParams, images: any) => void;
  }

  let images: GalleryImageParams[] = [];

  if (componentDescriptor.data?.images) {
    images = getData(componentDescriptor.data?.images, entityData);
  }
  if (componentDescriptor.data?.image) {
    images = [{ src: getData(componentDescriptor.data?.image, entityData) }];
  }

  return (
    <div>
      <ImageGallery
        images={images}
        imageSize="fs"
        clickHandler={(source: GalleryImageParams) => {
          if (clickHandler) {
            clickHandler(source, getData(componentDescriptor.data?.images, entityData));
          }
        }}
      />
    </div>
  );
};
