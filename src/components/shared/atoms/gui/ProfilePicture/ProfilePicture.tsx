import { Avatar } from '@mui/material';
import { useS3Url } from '~/common/hooks/useS3Url';
import './ProfilePicture.scss';

export const ProfilePicture = (props: any) => {
  let { src, alt, size, onClickHandler } = props;

  size = size || 'm';

  const resolvedSrc = useS3Url(src);

  return (
    <Avatar
      src={resolvedSrc}
      onClick={(params: any) => {
        if (onClickHandler) {
          onClickHandler(params);
        } else {
          console.warn('Click is not implemented');
        }
      }}
    />
  );
};
