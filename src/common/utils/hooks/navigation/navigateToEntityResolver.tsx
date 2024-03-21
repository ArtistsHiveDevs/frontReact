import { PATHS } from '~/constants';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { EventModel } from '~/models/domain/event/event.model';
import { TourOutlineModel } from '~/models/domain/favourites/tourOutline';
import { PlaceModel } from '~/models/domain/place/place.model';

export const resolveNavigateToEntityPath = (entityType: string) => {
  let entity = undefined;
  switch (entityType) {
    case ArtistModel.name:
      entity = PATHS.ARTISTS;
      break;
    case EventModel.name:
      entity = PATHS.EVENTS;
      break;
    case PlaceModel.name:
      entity = PATHS.PLACES;
      break;
    case TourOutlineModel.name:
      entity = PATHS.TOURS_OUTLINE;
      break;

    default:
      break;
  }
  return entity;
};
