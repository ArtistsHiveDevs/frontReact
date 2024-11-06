import moment from 'moment';
import { VerificationStatus } from '~/constants';
import { SocialNetworkStatsTemplate } from '~/constants/social-networks.const';
import { LocatableTemplate, ProfileModel, ProfileTemplate } from '~/models/base';
import { CountryModel, CountryTemplate } from '~/models/parametrics/geo/country.model';
import { EventModel, EventTemplate } from '../event/event.model';

export interface PlaceRatingTemplate {
  overall: number;
  stage: number;
  sound: number;
  backline: number;
  lights: number;
  dressing_room: number;
  hospitality_food: number;
  hospitality_drinks: number;
  timeliness: number;
  communication: number;
  transportation: number;
  logistic: number;
  location: number;
  seating_capacity: number;
  total_rates: number;
}
export interface PlaceTemplate extends ProfileTemplate {
  name: string;
  place_type: string;
  music_genre: string;
  country: CountryTemplate;
  country_alpha2: string;
  state: string;
  city: string;
  address: string;
  location:
    | string
    | [
        {
          country_name?: string;
          country_alpha2?: string;
          country_alpha3?: string;
          state?: string;
          city?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          locationPrecision?: string;
        }
      ];
  email: string;
  phone: string;
  public_private: string;
  facebook: string;
  instagram: string;
  twitter: string;
  website: string;
  promoter: string;
  tiktok: string;
  subtitle?: string;
  profile_pic: string;
  verified_status?: VerificationStatus;
  imageGallery: Image[];

  events: EventTemplate[];
  genres: { [artType: string]: string[] };

  stats: {
    rating: PlaceRatingTemplate;
    socialNetworks: SocialNetworkStatsTemplate[];
  };
}

export class PlaceModel extends ProfileModel<PlaceTemplate> implements PlaceTemplate, LocatableTemplate {
  declare name: string;
  declare place_type: string;
  declare music_genre: string;
  declare country: CountryModel;
  declare country_alpha2: string;
  declare state: string;
  declare city: string;
  declare address: string;
  declare location:
    | string
    | [
        {
          country_name?: string;
          country_alpha2?: string;
          country_alpha3?: string;
          state?: string;
          city?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          locationPrecision?: string;
        }
      ];
  declare email: string;
  declare phone: string;
  declare public_private: string;
  declare facebook: string;
  declare instagram: string;
  declare twitter: string;
  declare website: string;
  declare promoter: string;
  declare tiktok: string;
  declare subtitle?: string;
  declare profile_pic: string;
  declare imageGallery: Image[];
  declare verified_status?: VerificationStatus;
  declare events: EventTemplate[];
  declare genres: { [artType: string]: string[] };
  declare stats: {
    rating: PlaceRatingTemplate;
    socialNetworks: SocialNetworkStatsTemplate[];
  };

  constructor(template: PlaceTemplate) {
    super(template);
    this.events = template.events?.map((event) => new EventModel(event)) || [];

    this.country = template.country ? new CountryModel(template.country) : undefined;
  }

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.name && !!this.location;
  }

  public get photo() {
    return this.profile_pic;
  }

  public get cardInfo() {
    return { title: this.name };
  }

  public get place() {
    return this;
  }

  get cityWithCountry() {
    // Caso 1: Accede directamente a country, city, state si está disponible
    if (this.country) {
      return [this.city, this.state, this.country.name].filter(Boolean).join(', ');
    }

    // Caso 2: Accede a través de location, si location es un array de objetos
    if (this.location && Array.isArray(this.location)) {
      const locationObj = this.location[0]; // Si location es un array, tomamos el primer objeto
      return [
        locationObj.city,
        locationObj.state,
        locationObj.country_name, // Accedemos a country_name (en lugar de `country.location.name` ya que location es el objeto que contiene la propiedad country_name)
      ]
        .filter(Boolean)
        .join(', ');
    }

    // Si no se puede obtener los datos, retornamos null
    return null;
  }

  get latitude() {
    if (typeof this.location === 'string') {
      return parseFloat(this.location?.split(',')[0] || '0');
    } else {
      return this.location[0].latitude;
    }
  }

  get longitude() {
    if (typeof this.location === 'string') {
      return parseFloat(this.location?.split(',')[1] || '0');
    } else {
      return this.location[0].longitude;
    }
  }

  get aa() {
    return this.latitude + ', ' + this.longitude;
  }
  get latLng() {
    return { lat: this.latitude, lng: this.longitude };
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

export interface Image {
  src: string;
  alt?: string;
  getURL(): string | Promise<string>;
}
