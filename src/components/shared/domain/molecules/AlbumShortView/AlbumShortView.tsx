import { Avatar } from '@mui/material';
import moment from 'moment';
import './AlbumShortView.scss';

export const AlbumShortView = (props: any) => {
  const { album, onClick: onClickHandler } = props;

  const year = moment(album.release_date).year();
  const albumInDialogSize = '5rem';
  return (
    <div className="album-short-view" onClick={() => onClickHandler && onClickHandler(album)}>
      <Avatar
        src={album.images[2].url}
        alt={album.name}
        sx={{
          width: albumInDialogSize,
          height: albumInDialogSize,
          // border:   ? '1px solid #999' : '2px solid white',
        }}
        variant={'rounded'}
      ></Avatar>
      <div className="album-description">
        <div className="album-title">{album.name}</div>
        <div>
          ({year}) - {album.total_tracks} tracks
        </div>
      </div>
    </div>
  );
};
