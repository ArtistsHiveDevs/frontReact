import { VerificationStatus } from "~/constants";
import {
  EntityModel,
  EntityTemplate,
  LocatableTemplate,
  SearchableTemplate,
} from "~/models/base";
import { ArtistModel } from "../artist/artist.model";
import { PlaceModel } from "../place/place.model";

export enum EVENT_CONFIRMATION_STATUS {
  DRAFT,
  CREATED,
  UNDER_REVIEW,
  RETURNED,
  APPROVED,
  REJECTED,
  CANCELLED,
}

export interface EventTemplate extends EntityTemplate {
  verified_status: VerificationStatus;
  name: string;
  subtitle: string;
  profile_pic: string;
  main_artist_id: string;
  main_artist: ArtistModel;
  guest_artist_id: string;
  guest_artist: ArtistModel;
  place_id: string;
  place?: PlaceModel;
  timetable__initial_date: string;
  timetable__end_date: string;
  timetable__openning_doors: string;
  timetable__guest_time: string;
  timetable__main_artist_time: string;
  promoter: string;
  national_code: string;
  description: string;
  tickets_website: string;
  genres: { [artType: string]: string[] };
}

export class EventModel
  extends EntityModel<EventTemplate>
  implements EventTemplate, SearchableTemplate, LocatableTemplate
{
  declare name: string;
  declare verified_status: VerificationStatus;
  declare subtitle: string;
  declare profile_pic: string;
  declare main_artist_id: string;
  declare main_artist: ArtistModel;
  declare guest_artist_id: string;
  declare guest_artist: ArtistModel;
  declare place_id: string;
  declare place?: PlaceModel;
  declare timetable__initial_date: string;
  declare timetable__end_date: string;
  declare timetable__openning_doors: string;
  declare timetable__guest_time: string;
  declare timetable__main_artist_time: string;
  declare promoter: string;
  declare national_code: string;
  declare description: string;
  declare tickets_website: string;
  declare genres: { [artType: string]: string[] };

  constructor(template: EventTemplate) {
    super(template);

    this.main_artist = template.main_artist
      ? new ArtistModel(template.main_artist)
      : undefined;
    this.guest_artist = template.guest_artist
      ? new ArtistModel(template.guest_artist)
      : undefined;
    this.place = template.place ? new PlaceModel(template.place) : undefined;
  }

  get cardInfo() {
    return { title: this.name, subtitle: this.timetable__initial_date };
  }

  get cityWithCountry() {
    return `${this.place?.city}, ${this.place?.country}`;
  }

  get main_artists() {
    return [this.main_artist, this.guest_artist];
  }

  get initial_time() {
    return this.timetable__guest_time;
  }

  get latLng() {
    return this.place?.latLng;
  }
}
