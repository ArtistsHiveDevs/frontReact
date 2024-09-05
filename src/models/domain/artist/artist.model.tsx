import moment from 'moment';
import { VerificationStatus } from '~/constants';
import { SocialNetworkStatsTemplate } from '~/constants/social-networks.const';
import { EntityModel, EntityTemplate, ProfileModel, ProfileTemplate, SearchableTemplate } from '~/models/base';
import { EventModel, EventTemplate } from '../event/event.model';

export interface ArtistInTrack {
  id: string;
  name: string;
}

export interface TrackTemplate {
  artists: ArtistInTrack[];
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

  since: number;
  home_city: string;
  spoken_languages: string[];
  stage_languages: string[];
  arts_languages: string[];

  website: string;
  email: string;
  mobile_phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  spotify: string;
  youtube: string;
  youtube_widget_id: string;

  arts?: { music: { albums: AlbumTemplate[] } };
}

export class ArtistModel extends ProfileModel<ArtistTemplate> implements ArtistTemplate, SearchableTemplate {
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

  declare since: number;
  declare home_city: string;
  declare spoken_languages: string[];
  declare stage_languages: string[];
  declare arts_languages: string[];

  declare website: string;
  declare email: string;
  declare mobile_phone: string;
  declare whatsapp: string;
  declare facebook: string;
  declare instagram: string;
  declare spotify: string;
  declare youtube: string;
  declare youtube_widget_id: string;

  declare arts?: { music: { albums: AlbumModel[] } };

  constructor(template: ArtistTemplate) {
    super(template);
    this.events = template?.events?.map((event) => new EventModel(event)) || [];

    if (!!template.arts?.music?.albums?.length) {
      this.arts.music.albums = template?.arts?.music?.albums?.map((album) => new AlbumModel(album)) || [];
    }
  }

  get hasFetchAllData(): boolean {
    return !this.isExpiredCache() && !!this.id && !!this.name && !!this.description;
  }

  get pastEvents() {
    return this.events
      .filter((event) => moment(event.timetable__initial_date).isBefore(moment()))
      .sort((e1, e2) => {
        const date1 = e1.timetable__initial_date.toUpperCase(); // ignore upper and lowercase
        const date2 = e2.timetable__initial_date.toUpperCase(); // ignore upper and lowercase
        if (date1 < date2) {
          return -1;
        } else if (date1 > date2) {
          return 1;
        }
        // names must be equal
        return 0;
      })
      .reverse();
  }

  get nextEvents() {
    return this.events
      .filter((event) => moment(event.timetable__initial_date).isSameOrAfter(moment()))
      .sort((e1, e2) => {
        const date1 = e1.timetable__initial_date.toUpperCase(); // ignore upper and lowercase
        const date2 = e2.timetable__initial_date.toUpperCase(); // ignore upper and lowercase
        if (date1 < date2) {
          return -1;
        } else if (date1 > date2) {
          return 1;
        }
        // names must be equal
        return 0;
      });
  }
}
