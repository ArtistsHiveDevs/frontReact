import { Target_Audience } from '~/constants/domain/domain.constants';
import { EntityModel, EntityTemplate } from '~/models/base';
import { ArtistShowFormatTemplate } from './artist.model';

export interface SongTemplate extends EntityTemplate {
  name: string;
  durationInSec: number;
}

export interface ShowSetListTemplate extends EntityTemplate {
  songsList: { song: SongTemplate; order: number }[];
  optionalSongsList?: { song: SongTemplate; order: number }[];
}

export interface ShowProjectPricingTemplate {
  validSince: string;
  startingPrice: number;
  finalPrice: number;
  currency: string;
}

export interface ShowProjectTemplate extends EntityTemplate {
  name: string;
  setList: ShowSetListTemplate;
  pricing: ShowProjectPricingTemplate;
  showFormats: ArtistShowFormatTemplate[];

  target_audiences: Target_Audience[];
  is_active: boolean;

  // Atributos técnicos del show
  hasRider?: boolean; // Tiene rider técnico disponible
  hasStagePlot?: boolean; // Tiene stage plot configurado
}

export class ShowProjectModel extends EntityModel<ShowProjectTemplate> implements ShowProjectTemplate {
  declare name: string;
  declare showFormats: ArtistShowFormatTemplate[];
  declare setList: ShowSetListTemplate;

  declare pricing: ShowProjectPricingTemplate;

  declare target_audiences: Target_Audience[];

  declare is_active: boolean;

  // Atributos técnicos del show
  declare hasRider?: boolean;
  declare hasStagePlot?: boolean;

  get hasFetchAllData(): boolean {
    return !!this.name && !!this.setList;
  }
}
