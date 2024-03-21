import moment from 'moment';
import { Image } from 'react-bootstrap';
import './AlbumShortView.scss';

export const AlbumShortView = (props: any) => {
  const { album } = props;

  const year = moment(album.release_date).year();

  return (
    <div className="album-short-view">
      <div>
        <Image fluid={true} src={album.images[1].url} />
      </div>
      <div>
        <div className="album-title">{album.name}</div>
        <div>
          ({year}) - {album.total_tracks} tracks
        </div>
      </div>
    </div>
  );
};
