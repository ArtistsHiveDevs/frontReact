import dayjs, { Dayjs } from 'dayjs';
import { VerificationStatus } from '~/constants';
import { SocialNetworkStatsTemplate } from '~/constants/social-networks.const';
import { EntityModel, EntityTemplate, ProfileModel, ProfileTemplate } from '~/models/base';
import { CountryModel, CountryTemplate } from '~/models/parametrics/geo/country.model';
import { LanguageModel, LanguageTemplate } from '~/models/parametrics/geo/language.model';
import { EventModel, EventTemplate } from '../event/event.model';

export interface ArtistInTrack {
  id: string;
  name: string;
}

export interface TrackTemplate {
  artists: ArtistInTrack[];
  album?: AlbumTemplate;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  id: string;
  name: string;
  track_number: number;
}

export interface AlbumTemplate extends EntityTemplate {
  name: string;
  images: [
    {
      height: number | string;
      url: string;
      width: number | string;
    }
  ];
  release_date: string;
  release_date_precision: string;
  spotify: {
    id: string;
    url: string;
  };
  total_tracks: number;
  tracks: TrackTemplate[];
}

export class AlbumModel extends EntityModel<AlbumTemplate> {
  declare name: string;
  declare images: [
    {
      height: number | string;
      url: string;
      width: number | string;
    }
  ];
  declare release_date: string;
  declare release_date_precision: string;
  declare spotify: {
    id: string;
    url: string;
  };
  declare total_tracks: number;
  declare tracks: TrackTemplate[];

  get hasFetchAllData(): boolean {
    return !this.isExpiredCache() && !!this.id && !!this.name && !!this.images && !!this.total_tracks;
  }

  get totalDurationMs(): number {
    return this.tracks.reduce((accumulator, track) => accumulator + track.duration_ms, 0);
  }
}
export interface ArtistRatingTemplate {
  overall: number;
  talent: number;
  performance: number;
  proffesionalism: number;
  stage_presence: number;
  charisma: number;
  timeliness: number;
  communication: number;
  respectfulness: number;
  total_rates: number;
}

export interface ArtistTemplate extends ProfileTemplate {
  artistType: string;
  name: string;
  subtitle: string;
  verified_status: VerificationStatus;
  profile_pic?: string;
  photo?: string;
  description: string;
  date?: Date;
  events: EventTemplate[];
  genres: { [artType: string]: string[] };
  stats: {
    rating: ArtistRatingTemplate;
    socialNetworks: SocialNetworkStatsTemplate[];
  };

  since: Dayjs;
  home_city: string;
  country: CountryTemplate;
  city: any;
  spoken_languages: LanguageTemplate[];
  stage_languages: LanguageTemplate[];
  arts_languages: LanguageTemplate[];

  website: string;
  email: string;
  mobile_phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  spotify: string;
  youtube: string;
  youtube_widget_id: string;

  arts?: { music: { albums: AlbumTemplate[]; top_tracks: any[]; related_artists: ArtistTemplate[] } };
}

export class ArtistModel extends ProfileModel<ArtistTemplate> implements ArtistTemplate {
  declare artistType: string;
  declare name: string;
  declare subtitle: string;
  declare verified_status: VerificationStatus;
  declare profile_pic?: string;
  declare photo?: string;
  declare description: string;
  declare date?: Date;

  declare events: EventTemplate[];
  declare genres: { [artType: string]: string[] };
  declare stats: {
    rating: ArtistRatingTemplate;
    socialNetworks: SocialNetworkStatsTemplate[];
  };

  declare since: Dayjs;
  declare home_city: string;
  declare spoken_languages: LanguageModel[];
  declare stage_languages: LanguageModel[];
  declare arts_languages: LanguageModel[];

  declare website: string;
  declare email: string;
  declare mobile_phone: string;
  declare whatsapp: string;
  declare facebook: string;
  declare instagram: string;
  declare spotify: string;
  declare youtube: string;
  declare youtube_widget_id: string;

  declare arts?: { music: { albums: AlbumModel[]; top_tracks: any[]; related_artists: ArtistModel[] } };
  declare country: CountryModel;
  declare city: any;

  constructor(template: ArtistTemplate) {
    super(template);
    this.events = template?.events?.map((event) => new EventModel(event)) || [];

    if (typeof template === 'object' && template !== null) {
      if (typeof template.country !== 'string') {
        this.country = template.country ? new CountryModel(template.country) : undefined;
      }
    }

    if (!!template.arts?.music?.albums?.length) {
      this.arts.music.albums = template?.arts?.music?.albums?.map((album) => new AlbumModel(album)) || [];
    }
    if (!!template.arts?.music?.related_artists?.length) {
      this.arts.music.related_artists =
        template?.arts?.music?.related_artists?.map((artist) => new ArtistModel(artist)) || [];
    }

    this.since = template.since ? dayjs(template.since) : null;
  }

  get hasFetchAllData(): boolean {
    return !this.isExpiredCache() && !!this.id && !!this.name && !!this.description;
  }

  get pastEvents() {
    return this.events
      .filter((event) => dayjs(event.timetable__initial_date).isBefore(dayjs())) // Filtrar los eventos antes de la fecha actual
      .sort((a, b) => dayjs(b.timetable__initial_date).diff(dayjs(a.timetable__initial_date))); // Ordenar del más antiguo al más reciente
  }

  get nextEvents() {
    return this.events
      .filter((event) => dayjs(event.timetable__initial_date).isAfter(dayjs())) // Filtrar los eventos antes de la fecha actual
      .sort((a, b) => dayjs(a.timetable__initial_date).diff(dayjs(b.timetable__initial_date))); // Ordenar del más antiguo al más reciente
  }
}
