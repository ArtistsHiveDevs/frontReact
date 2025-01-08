import dayjs, { Dayjs } from 'dayjs';
import { getUrlS3 } from '~/common/utils/amplify/storage/storage.helpers';
import { VerificationStatus } from '~/constants';
import { EntityModel, EntityTemplate, LocatableTemplate, SearchableTemplate } from '~/models/base';
import { ArtistModel } from '../artist/artist.model';
import { PlaceModel } from '../place/place.model';

export enum EventConfirmationStatus {
  DRAFT = 'DRAFT',
  CREATED = 'CREATED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RETURNED = 'RETURNED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface EventTemplate extends EntityTemplate {
  verified_status: VerificationStatus;
  confirmation_status: EventConfirmationStatus;
  name: string;
  subtitle: string;
  profile_pic: string;
  // main_artist_id: string;
  // main_artist: ArtistModel;
  // guest_artist_id: string;
  // guest_artist: ArtistModel;
  artists: ArtistModel[];
  place_id: string;
  place?: PlaceModel;
  timetable__initial_date: Dayjs;
  timetable__end_date: string;
  timetable__openning_doors: string;
  timetable__guest_time: string;
  timetable__main_artist_time: number;
  promoter: string;
  national_code: string;
  description: string;
  tickets_website: string;
  genres: { [artType: string]: string[] };
  price: any;
}

export class EventModel
  extends EntityModel<EventTemplate>
  implements EventTemplate, SearchableTemplate, LocatableTemplate
{
  declare name: string;
  declare verified_status: VerificationStatus;
  declare confirmation_status: EventConfirmationStatus;
  declare subtitle: string;
  declare profile_pic: string;
  // declare main_artist_id: string;
  // declare main_artist: ArtistModel;
  // declare guest_artist_id: string;
  // declare guest_artist: ArtistModel;
  declare artists: ArtistModel[];
  declare place_id: string;
  declare place?: PlaceModel;
  declare timetable__initial_date: Dayjs;
  declare timetable__end_date: string;
  declare timetable__openning_doors: string;
  declare timetable__guest_time: string;
  declare timetable__main_artist_time: number;
  declare promoter: string;
  declare national_code: string;
  declare description: string;
  declare tickets_website: string;
  declare genres: { [artType: string]: string[] };
  declare price: any;

  constructor(template: EventTemplate) {
    super(template);
    this.timetable__main_artist_time = Number(template.timetable__main_artist_time);
    // this.main_artist = template.main_artist ? new ArtistModel(template.main_artist) : undefined;
    // this.guest_artist = template.guest_artist ? new ArtistModel(template.guest_artist) : undefined;
    this.artists = template.artists ? template.artists.map((artist) => new ArtistModel(artist)) : [];
    this.place = template.place ? new PlaceModel(template.place) : undefined;

    const hours = Math.floor(this.timetable__main_artist_time / 100) || 0; // Dividir entre 100 para obtener las horas
    const minutes = this.timetable__main_artist_time % 100 || 0;

    this.timetable__initial_date = dayjs(template.timetable__initial_date).hour(hours).minute(minutes); //.add(4, 'month');
  }

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.artists?.length && !!this.place;
  }

  get cardInfo() {
    return { title: this.name, subtitle: this.timetable__initial_date };
  }

  get cityWithCountry() {
    return `${this.place?.city}, ${this.place?.country}`;
  }

  get main_artists(): ArtistModel[] {
    return [...this.artists];
  }

  get other_artists(): ArtistModel[] {
    return [];
  }

  get initial_time() {
    return this.timetable__guest_time || this.timetable__main_artist_time;
  }

  get latLng() {
    return this.place?.latLng;
  }

  async avatarURL(): Promise<string> {
    return await getUrlS3({ path: this.profile_pic });
  }
}
