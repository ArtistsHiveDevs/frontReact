import { VerificationStatus } from "~/constants";
import { EntityModel, EntityTemplate, SearchableTemplate } from "~/models/base";
import {
  ArtistModel,
  ArtistTemplate,
} from "~/models/domain/artist/artist.model";
import { EventModel, EventTemplate } from "~/models/domain/event/event.model";
import { PlaceModel, PlaceTemplate } from "~/models/domain/place/place.model";

export interface SavedTemplate extends EntityTemplate, SearchableTemplate {
  artists: ArtistTemplate[];
  places: PlaceTemplate[];
  events: EventTemplate[];
}

export class SavedModel
  extends EntityModel<SavedTemplate>
  implements SavedTemplate, SavedTemplate
{
  declare artists: ArtistTemplate[];
  declare events: EventTemplate[];
  declare places: PlaceTemplate[];

  constructor(template: SavedTemplate) {
    super(template);
    this.artists =
      template?.artists?.map((artist) => new ArtistModel(artist)) || [];
    this.events =
      template?.events?.map((events) => new EventModel(events)) || [];
    this.places =
      template?.places?.map((places) => new PlaceModel(places)) || [];
  }
  profile_pic?: string;
  name: string;
  subtitle?: string;
  description?: string;
  cityWithCountry?: string;
  country?: string;
  place?: PlaceModel;
  verified_status?: VerificationStatus;

  get likedEntities() {
    return Object.keys(this).filter((entityName) => {
      const field: any = this[entityName as keyof SavedModel];

      return Array.isArray(field) && field.length;
    });
  }
}
