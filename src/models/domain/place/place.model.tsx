import dayjs from 'dayjs';
import { VerificationStatus } from '~/constants';
import { Target_Audience } from '~/constants/domain/domain.constants';
import { SocialNetworkStatsTemplate } from '~/constants/social-networks.const';
import { LocatableTemplate, LocationTemplate, ProfileModel, ProfileTemplate } from '~/models/base';
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

export interface VenueStageTemplate {
  name?: string;
  width: number;
  depth: number;
  seated_capacity?: number;
  total_capacity?: number;
  isMainStage: boolean;
}

export interface VenueFacilitiesTemplate {
  parking?: {
    has_own_parking?: boolean;
    has_nearby_parking?: boolean;
  };
  publicTransportNearby?: boolean;
  accessibility?: boolean;
}

export interface VenueOperatingHoursTemplate {
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
  shift?: 'day' | 'night' | 'both';
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
  location: string | LocationTemplate[];
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
  verified_status: VerificationStatus;
  imageGallery: Image[];

  events: EventTemplate[];
  genres: { [artType: string]: string[] };

  stages: VenueStageTemplate[];

  target_audiences: Target_Audience[];
  bookingRatesPolicy: string[];

  facilities: VenueFacilitiesTemplate;

  stats: {
    rating: PlaceRatingTemplate;
    socialNetworks: SocialNetworkStatsTemplate[];
  };

  has_open_mic?: boolean;

  // ========================================
  // NUEVOS ATRIBUTOS PARA FILTROS DE BÚSQUEDA
  // ========================================

  // Horarios de operación
  operatingHours?: VenueOperatingHoursTemplate;

  // Tipo de contrato
  contractType?: 'percentage' | 'fixed_fee' | 'both';

  // Política de bebidas
  beveragePolicy?: string[]; // ['open_bar', 'prohibited', 'minimum_consumption']

  // Restricción de edad
  ageRestriction?: string[]; // ['infantil', '+18', '+21', 'familiar', 'todas']

  // Backline disponible (tipos)
  backlineTypes?: string[]; // ['sonido', 'luces', 'video', 'piano', etc.]

  // Número de micrófonos
  micCount?: number;

  // Capacidad total del venue
  capacity?: number;
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
  declare location: string | LocationTemplate[];
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
  declare verified_status: VerificationStatus;
  declare events: EventTemplate[];
  declare genres: { [artType: string]: string[] };

  declare stages: VenueStageTemplate[];

  declare has_open_mic?: boolean;

  declare target_audiences: Target_Audience[];
  declare bookingRatesPolicy: string[];

  declare facilities: VenueFacilitiesTemplate;

  declare stats: {
    rating: PlaceRatingTemplate;
    socialNetworks: SocialNetworkStatsTemplate[];
  };

  // ========================================
  // NUEVOS ATRIBUTOS PARA FILTROS DE BÚSQUEDA
  // ========================================
  declare operatingHours?: VenueOperatingHoursTemplate;
  declare contractType?: 'percentage' | 'fixed_fee' | 'both';
  declare beveragePolicy?: string[];
  declare ageRestriction?: string[];
  declare backlineTypes?: string[];
  declare micCount?: number;
  declare capacity?: number;

  constructor(template: PlaceTemplate) {
    super({ ...template, entity: PlaceModel.name });
    this.events = template.events?.map((event) => new EventModel(event)) || [];

    this.country = template.country ? new CountryModel(template.country) : undefined;

    // Políticas de alquiler
    const politicas = [
      'Alquiler del lugar entero por un valor fijo',
      'Entradas para el artista, consumo para el venue.',
      '80% de las entradas para el artista y 20% de las entradas más el consumo para el venue',
      'Contrato fijo para el artista',
      'Convenio con bookers específicos, no se contrata directamente',
    ];
    const shuffledBookingPolicies = [...politicas].sort(() => Math.random() - 0.5);

    const size = Math.floor(Math.random() * politicas.length) + 1;

    // Retornamos los primeros "size" elementos del arreglo mezclado
    this.bookingRatesPolicy = shuffledBookingPolicies.slice(0, size);

    if (!this.verified_status) {
      this.verified_status = VerificationStatus.NON_VERIFIED;
    }
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
      .filter((event) => dayjs(event.timetable__initial_date).isBefore(dayjs())) // Filtrar los eventos antes de la fecha actual
      .sort((a, b) => dayjs(b.timetable__initial_date).diff(dayjs(a.timetable__initial_date))); // Ordenar del más antiguo al más reciente
  }

  get nextEvents() {
    return this.events
      .filter((event) => dayjs(event.timetable__initial_date).isAfter(dayjs())) // Filtrar los eventos antes de la fecha actual
      .sort((a, b) => dayjs(a.timetable__initial_date).diff(dayjs(b.timetable__initial_date))); // Ordenar del más antiguo al más reciente
  }
}

export interface Image {
  src: string;
  alt?: string;
  getURL(): string | Promise<string>;
}
