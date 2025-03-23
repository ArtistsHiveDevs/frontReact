import { AppUserModel } from '~/models/app/user/user.model';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { EventModel } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import { actionsArtists, useArtistsSlice } from '../domain/artists/artist.redux';
import { actionsPlaces, usePlacesSlice } from '../domain/places/places.redux';

export function getSliceInfoFromInstance(instance: any) {
  return getSliceInfoFromClassName(instance?.constructor?.name);
}

export function getSliceInfoFromClassName(entityType: string) {
  let entityName = undefined;
  let plural = '';
  let slice = undefined;
  let actions;
  if (entityType === ArtistModel.name) {
    entityName = 'Artist';
    plural = 'artists';
    slice = useArtistsSlice;
    actions = actionsArtists;
  } else if (entityType === PlaceModel.name) {
    entityName = 'Place';
    plural = 'places';
    slice = usePlacesSlice;
    actions = actionsPlaces;
  } else if (entityType === EventModel.name) {
    entityName = 'Event';
    plural = 'events';
  } else if (entityType === AppUserModel.name) {
    entityName = 'User';
    plural = 'users';
  }
  return { entityName, plural, slice, actions };
}
