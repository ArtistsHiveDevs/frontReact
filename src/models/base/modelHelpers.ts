import { AppUserModel } from '../app/user/user.model';
import { ArtistModel } from '../domain/artist/artist.model';
import { EventModel } from '../domain/event/event.model';
import { PlaceModel } from '../domain/place/place.model';

export function getModelNameFromPlural(entityType: string) {
  let entityName = '';
  if (entityType === 'artists') {
    entityName = 'Artist';
    //   path = ArtistModel.name;
  } else if (entityType === 'places') {
    entityName = 'Place';
    //   path = PlaceModel.name;
  } else if (entityType === 'events') {
    entityName = 'Event';
    //   path = EventModel.name;
  }
  return entityName;
}

export function getModelInfoFromInstance(instance: any) {
  return getModelInfoFromClassName(instance?.constructor?.name);
}

export function getModelInfoFromClassName(entityType: string) {
  let entityName = undefined;
  let plural = '';
  switch (entityType) {
    case ArtistModel.name:
      entityName = 'Artist';
      plural = 'artists';
      break;
    case PlaceModel.name:
      entityName = 'Place';
      plural = 'places';
      break;
    case EventModel.name:
      entityName = 'Event';
      plural = 'events';
      break;
    case AppUserModel.name:
      entityName = 'User';
      plural = 'users';
      break;
  }
  return { entityName, plural };
}

export function getClassFromModelName(modelName: string) {
  let model = undefined;

  switch (modelName) {
    case 'Artist':
      model = ArtistModel;
      break;
    case 'Place':
      model = PlaceModel;
      break;
    case 'Event':
      model = EventModel;
      break;
    case 'User':
      model = AppUserModel;
      break;
  }
  return model;
}
