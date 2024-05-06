import { Avatar } from '@mui/material';
import './ProfilePicture.scss';

export const ProfilePicture = (props: any) => {
  let { src, alt, size, onClickHandler } = props;

  size = size || 'm';

  return (
    src && (
      <Avatar
        src={src}
        onClick={(params: any) => {
          if (onClickHandler) {
            onClickHandler(params);
          } else {
            console.warn('Click is not implemented');
          }
        }}
      />
    )
  );
};
