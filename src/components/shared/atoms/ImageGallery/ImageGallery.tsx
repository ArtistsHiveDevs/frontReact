import "./ImageGallery.scss";
import { Image } from "react-bootstrap";

export interface ImageGalleryContainerParams {
  title?: string;
  subtitle?: string;
  images: GalleryImageParams[];
  clickHandler?: Function;
}

export interface GalleryImageParams {
  id: string;
  src: string;
  alt?: string;
}

export const ImageGallery = (props: ImageGalleryContainerParams) => {
  const { images, clickHandler } = props;

  function onClick(source: GalleryImageParams) {
    if (!!clickHandler) {
      clickHandler(source);
    }
  }
  return (
    <div className="gallery-container">
      {(images || []).map((image, index) => {
        if (!image.id) {
          image.id = `${index}`;
        }
        return (
          <Image
            key={`${image.src}-${index}`}
            className="image-gallery"
            src={image.src}
            alt={image.alt || image.src}
            onClick={() => onClick(image)}
          />
        );
      })}
    </div>
  );
};

export default ImageGallery;
