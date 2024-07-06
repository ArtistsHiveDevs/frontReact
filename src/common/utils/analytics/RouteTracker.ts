import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArtistModel } from '~/models/domain/artist/artist.model';

export const RouteTracker = (props: any): any => {
  const { entity } = props;
  const location = useLocation();

  useEffect(() => {
    const titleFromEntity = entity ? `${entity.name}` : document.title || 'Artist Hive';
    if (entity) {
      if (entity instanceof ArtistModel) {
        document.title = entity.name;
      }
    }
    // logPageView({ title: titleFromEntity });
  }, [location]);

  return null;
};
