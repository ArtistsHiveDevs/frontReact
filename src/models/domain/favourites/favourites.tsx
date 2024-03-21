import { EntityModel, EntityTemplate } from '~/models/base';
import { ArtistTemplate } from '~/models/domain/artist/artist.model';
import { EventTemplate } from '~/models/domain/event/event.model';
import { PlaceTemplate } from '~/models/domain/place/place.model';

export interface SavedFavouritesTemplate extends EntityTemplate {
  artists: ArtistTemplate[];
  places: PlaceTemplate[];
  events: EventTemplate[];
}

export class SavedFavouritesModel extends EntityModel<SavedFavouritesTemplate> implements SavedFavouritesTemplate {
  declare artists: ArtistTemplate[];
  declare events: EventTemplate[];
  declare places: PlaceTemplate[];
}
