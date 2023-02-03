import { Image } from "react-bootstrap";
import "./ProfilePicture.scss";

export const ProfilePicture = (props: any) => {
  let { src, alt, size } = props;

  size = size || "m";

  return src && <Image className={`avatar-${size}`} src={src} alt={alt} />;
};
