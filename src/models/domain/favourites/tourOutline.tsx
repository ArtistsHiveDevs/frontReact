import { EntityModel, EntityTemplate, SearchableTemplate } from "~/models/base";
import { ArtistTemplate } from "~/models/domain/artist/artist.model";
import { EventTemplate } from "~/models/domain/event/event.model";
import { PlaceTemplate } from "~/models/domain/place/place.model";

export interface ToursOutlinesTemplate extends EntityTemplate {
  name: string;
  likedPlaces: PlaceTemplate[];
  likedArtists: ArtistTemplate[];
  confirmedEvents: EventTemplate[];
  pendingEvents: EventTemplate[];
}

export class ToursOutlinesModel
  extends EntityModel<ToursOutlinesTemplate>
  implements ToursOutlinesTemplate, SearchableTemplate
{
  name: string;
  likedPlaces: PlaceTemplate[];
  likedArtists: ArtistTemplate[];
  confirmedEvents: EventTemplate[];
  pendingEvents: EventTemplate[];
}
