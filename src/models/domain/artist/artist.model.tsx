import { LocationLevelData } from '~/common/utils/location-display.utils';
import dayjs, { Dayjs } from 'dayjs';
import { VerificationStatus } from '~/constants';
import { ExperienceRange } from '~/constants/domain/domain.constants';
import { SocialNetworkStatsTemplate } from '~/constants/social-networks.const';
import { AppUserTemplate } from '~/models/app/user/user.model';
import { EntityModel, EntityTemplate, ProfileModel, ProfileTemplate } from '~/models/base';
import { CountryModel, CountryTemplate } from '~/models/parametrics/geo/country.model';
import { LanguageModel, LanguageTemplate } from '~/models/parametrics/geo/language.model';
import { EventModel, EventTemplate } from '../event/event.model';
import { ShowProjectModel } from './showProject.model';

export interface ArtistInTrack {
  id: string;
  name: string;
}

export interface SimpleTrackTemplate {
  id: string;
  name: string;
  duration_ms: number;
}

export interface TrackTemplate extends SimpleTrackTemplate {
  artists: ArtistInTrack[];
  album?: AlbumTemplate;
  disc_number: number;
  explicit: boolean;
  id: string;
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

export interface ArtistAwardTemplate {
  name: string;
  status: 'Nomminated' | 'Winner';
  date: Date;
}

export interface ArtistShowFormatTemplate {
  name?: string;
  musicians: AppUserTemplate[];
  technicalCrew: AppUserTemplate[];
  stageCrew: AppUserTemplate[];
}

export interface ArtistPricingTemplate {
  startingPrice: number;
  finalPrice: number;
  currency?: string;
  since?: Date;
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
  homeCityData?: LocationLevelData[];
  country: CountryTemplate;
  city: any;
  spoken_languages: LanguageTemplate[];
  stage_languages: LanguageTemplate[];
  arts_languages: LanguageTemplate[];

  website: string;
  email: string;
  phone?: string;
  mobile_phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  spotify: string;
  youtube: string;
  youtube_widget_id: string;

  arts?: { music: { albums: AlbumTemplate[]; top_tracks: any[]; related_artists: ArtistTemplate[] } };

  // Solista, Trío, Banda, etc
  showFormats: ArtistShowFormatTemplate[];

  show_pojects: ShowProjectModel[];

  awards?: ArtistAwardTemplate[];

  // ========================================
  // NUEVOS ATRIBUTOS PARA FILTROS DE BÚSQUEDA
  // ========================================

  // Público objetivo por edad
  targetAudience?: string[]; // ['CHILDRENS', 'TEEN', 'ADULTS_18', 'ADULTS_21', 'SENIOR', 'FAMILY', 'ALL_AGES']

  // Tipo de discográfica
  recordLabelType?: 'independent' | 'signed';

  manager?: string;

  // Subgéneros musicales más específicos
  subgenres?: string[];

  // Rango de movilidad geográfica
  mobility_range?: 'local' | 'national' | 'international' | 'worldwide';
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
  declare homeCityData: LocationLevelData[];
  declare spoken_languages: LanguageModel[];
  declare stage_languages: LanguageModel[];
  declare arts_languages: LanguageModel[];

  declare website: string;
  declare email: string;
  declare phone?: string;
  declare mobile_phone: string;
  declare whatsapp: string;
  declare facebook: string;
  declare instagram: string;
  declare spotify: string;
  declare youtube: string;
  declare youtube_widget_id: string;

  declare arts?: { music: { albums: AlbumModel[]; top_tracks: any[]; related_artists: ArtistModel[] } };

  declare showFormats: ArtistShowFormatTemplate[];

  declare show_pojects: ShowProjectModel[];

  declare awards?: ArtistAwardTemplate[];

  declare country: CountryModel;
  declare city: any;

  declare artist_gallery: string[];
  declare artist_riders_data: string[];

  // ========================================
  // NUEVOS ATRIBUTOS PARA FILTROS DE BÚSQUEDA
  // ========================================

  /**
   * Retorna el número de músicos en tarima del formato principal
   * o del primer formato disponible
   */
  get musiciansOnStage(): number {
    if (!this.showFormats?.length) return 0;
    const mainFormat = this.showFormats[0]; // Primer formato o formato principal
    return mainFormat?.musicians?.length || 0;
  }

  declare targetAudience?: string[];
  declare recordLabelType?: 'independent' | 'signed';
  declare subgenres?: string[];

  declare manager?: string;

  get hasManager(): boolean {
    return !!this.manager;
  }

  /**
   * Verifica si alguno de los show projects tiene rider técnico
   */
  get hasRider(): boolean {
    return this.show_pojects?.some((project) => project.hasRider) || false;
  }

  /**
   * Verifica si alguno de los show projects tiene stage plot
   */
  get hasStagePlot(): boolean {
    return this.show_pojects?.some((project) => project.hasStagePlot) || false;
  }

  /**
   * Calcula el rango de experiencia basado en los años desde el campo 'since'
   */
  get experience(): string | undefined {
    if (!this.since) return undefined;
    const years = dayjs().diff(this.since, 'year');
    if (years < 5) return ExperienceRange.ENTRY;
    if (years < 10) return ExperienceRange.INTERMEDIATE;
    if (years < 20) return ExperienceRange.ADVANCED;
    return ExperienceRange.EXPERT;
  }

  declare mobility_range?: 'local' | 'national' | 'international' | 'worldwide';

  constructor(template: ArtistTemplate) {
    super({ ...template, entity: ArtistModel.name });
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

  get priceRange() {
    return [this.pricing.startingPrice, this.pricing.finalPrice];
  }

  get pricing(): ArtistPricingTemplate {
    const averagePricing = {
      startingPrice: 500,
      finalPrice: 1000,
      currency: 'USD',
      since: new Date(2025, 1, 1),
    };
    return averagePricing;
  }

  get target_audiences() {
    return;
  }

  get epkGallery() {
    return [
      ...(this.image_members || []).map((img: any) => {
        return {
          ...img,
          translationKey:
            'app.pages.ArtistsPages.ArtistsDetailsPage.subpages.general.sections.artist_gallery.attributes.members',
        };
      }),
      ...(this.image_live_gallery || []).map((img: any) => {
        return {
          ...img,
          translationKey:
            'app.pages.ArtistsPages.ArtistsDetailsPage.subpages.general.sections.artist_gallery.attributes.live',
        };
      }),
    ];
  }

  /**
   * Valida si un campo tiene un valor válido según su tipo de dato
   * @param field - Nombre del campo a validar
   * @returns true si el campo tiene un valor válido, false en caso contrario
   */
  private isFieldValueValid(field: string): boolean {
    const value = this[field];

    // Null o undefined
    if (value == null) {
      return false;
    }

    // Array: debe tener al menos un elemento
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    // String: no debe estar vacío
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    // Number: debe ser un número válido (no NaN) y mayor a 0
    if (typeof value === 'number') {
      return !isNaN(value) && value > 0;
    }

    // Boolean: debe ser true
    if (typeof value === 'boolean') {
      return value === true;
    }

    // Objeto: debe tener al menos una propiedad
    if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    }

    // Otros tipos: considerarlos inválidos
    return false;
  }

  get openCallDocumentCheckList() {
    const required_fields = [
      'image_members',
      'image_live_gallery',
      // 'members',
      'spotify',
      'technical_epk',
      'technical_rider',
      // 'stage_plot',
    ];

    console.log(this);
    const missingDocs = required_fields
      .filter((field) => !this.isFieldValueValid(field))
      .map((field) => ({ field, translationPath: '' }));

    return missingDocs;
  }
}
