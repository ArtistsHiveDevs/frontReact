import { EntityModel, EntityTemplate, SearchableTemplate } from '~/models/base';

export interface LocationEntityMetadata {
  isCapital?: boolean;
  isMajorCity?: boolean;
  population?: number;
  coordinates?: { lat: number; lng: number };
}

export interface LocationEntityTemplate extends EntityTemplate {
  name: string;
  label: string;
  value: string;
  level: number; // 1-5 (1=State/Departamento, 2=City/Municipio, etc.)
  parentId?: string; // Reference to parent level
  countryId: string;
  alpha2?: string; // For entities that have flags (some states/provinces)
  flagURL?: string; // Direct URL to flag image
  metadata?: LocationEntityMetadata;
  idRedux?: string;
}

export class LocationEntityModel
  extends EntityModel<LocationEntityTemplate>
  implements LocationEntityTemplate, SearchableTemplate
{
  declare name: string;
  declare level: number;
  declare label: string;
  declare value: string;
  declare parentId?: string;
  declare countryId: string;
  declare alpha2?: string;
  declare flagURL?: string;
  declare metadata?: LocationEntityMetadata;
  declare idRedux?: string;

  constructor(template: LocationEntityTemplate) {
    super(template);

    if (!template.id) {
      this.id = this.value;
    }

    this.name = this.label;
    this.idRedux = `${this.countryId}_${this.level}_${this.parentId || 'root'}_${this.name}`;
  }

  get hasFetchAllData(): boolean {
    return !this.isExpiredCache() && !!this.id && !!this.name && !!this.level && !!this.countryId;
  }

  get isLevel1(): boolean {
    return this.level === 1;
  }

  get isLevel2(): boolean {
    return this.level === 2;
  }

  get isLevel3(): boolean {
    return this.level === 3;
  }

  get isLevel4(): boolean {
    return this.level === 4;
  }

  get isLevel5(): boolean {
    return this.level === 5;
  }

  get hasFlag(): boolean {
    return !!(this.alpha2 || this.flagURL);
  }

  get isCapital(): boolean {
    return this.metadata?.isCapital || false;
  }

  get isMajorCity(): boolean {
    return this.metadata?.isMajorCity || false;
  }
}
