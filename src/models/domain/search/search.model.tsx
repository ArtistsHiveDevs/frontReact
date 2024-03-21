import { EntityModel, EntityTemplate, isLocableEntity, isSearchableEntity, SearchableTemplate } from '~/models/base';
import { ArtistModel } from '../artist/artist.model';
import { EventModel } from '../event/event.model';
import { PlaceModel } from '../place/place.model';

export interface SearchPaginationTemplate {
  total_artists: number;
  total_events: number;
  total_places: number;
}

export interface SearchLocationBoundariesTemplace {
  min_lat: number;
  max_lat: number;
  min_lng: number;
  max_lng: number;
}

export interface SearchTemplate extends EntityTemplate {
  artists: ArtistModel[];
  events: EventModel[];
  places: PlaceModel[];
  pagination: SearchPaginationTemplate;
  location_boundaries: SearchLocationBoundariesTemplace;
}

export class SearchModel extends EntityModel<SearchTemplate> implements SearchTemplate {
  declare artists: ArtistModel[];
  declare events: EventModel[];
  declare places: PlaceModel[];
  declare pagination: SearchPaginationTemplate;
  declare location_boundaries: SearchLocationBoundariesTemplace;

  constructor(template: SearchTemplate) {
    super(template);
    this.artists = template?.artists?.map((artist) => new ArtistModel(artist)) || [];
    this.events = template?.events?.map((events) => new EventModel(events)) || [];
    this.places = template?.places?.map((places) => new PlaceModel(places)) || [];
  }

  get totalResults() {
    return this.artists.length + this.events.length + this.places.length;
  }

  get foundEntities() {
    return Object.keys(this).filter((entityName) => {
      const field: any = this[entityName as keyof SearchModel];

      return Array.isArray(field) && field.length && isSearchableEntity(field[0]);
    });
  }

  get locatedResults(): any {
    const searchableKeys = this.foundEntities;

    const result: any = {};
    searchableKeys.forEach((entityName) => {
      if (entityName === 'places') {
        const elements = this[entityName as keyof SearchModel].filter((result: SearchableTemplate) =>
          isLocableEntity(result)
        );
        if (elements.length) {
          result[entityName] = elements;
        }
      }
    });
    return result;
  }
}
