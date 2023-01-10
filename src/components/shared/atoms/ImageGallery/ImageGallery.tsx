import "./ImageGallery.scss";
import { Image } from "react-bootstrap";

export interface ImageGalleryContainerParams {
  title?: string;
  subtitle?: string;
  images: GalleryImageParams[];
  imageSize?: "sm" | "fs";
  clickHandler?: Function;
}

export interface GalleryImageParams {
  id: string;
  src: string;
  alt?: string;
}

export const ImageGallery = (props: ImageGalleryContainerParams) => {
  const { images, clickHandler, imageSize } = props;

  const imageClasses: string[] = [];
  if (imageSize === "fs") {
    imageClasses.push("full-size-image-gallery");
  } else {
    imageClasses.push("image-gallery");
  }

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
            className={imageClasses.join(" ")}
            src={image.src}
            alt={image.alt || image.src}
            onClick={() => onClick(image)}
          />
        );
      })}
    </div>
  );
};
