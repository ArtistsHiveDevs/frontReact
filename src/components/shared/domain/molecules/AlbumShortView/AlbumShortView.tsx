import dayjs from 'dayjs';
import { AvatarWithIcon } from '~/components/shared/atoms/gui/avatar-with-icon/Avatar-with-icon';
import './AlbumShortView.scss';

export const AlbumShortView = (props: any) => {
  const { album, albumNumber, totalAlbums, onClick: onClickHandler } = props;

  const albumInDialogSize = '5rem';
  return (
    <div className="album-short-view" onClick={() => onClickHandler && onClickHandler(album)}>
      <AvatarWithIcon
        image={album.images[2].url}
        name={album.name}
        avatarSize={albumInDialogSize}
        variant="rounded"
        buttonIcon="AiOutlineZoomIn"
      />

      <div className="album-description">
        <div className="album-title">{album.name}</div>
        <div>
          ({dayjs(album.release_date).format('MMM / YYYY')}) ⬢ {album.total_tracks} tracks
        </div>
        <div>
          [ {totalAlbums - albumNumber} / {totalAlbums}]
        </div>
      </div>
    </div>
  );
};
