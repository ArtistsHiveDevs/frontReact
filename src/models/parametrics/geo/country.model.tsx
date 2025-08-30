import { EntityModel, EntityTemplate, SearchableTemplate } from '~/models/base';

export interface CountryLevel {
  level: number; // 1, 2, 3, 4, 5
  name: string; // "departamento", "provincia", "estado", "municipio", "distrito", "barrio", etc.
  translationKey: string; // "app.location.departamento"
  required: boolean;
  flagURL?: string; // URL to flag image for this level (e.g., provincial flags)
}

export interface CountryStructure {
  levels: CountryLevel[];
}

export interface CountryTemplate extends EntityTemplate {
  name: string;
  native: string;
  phone: number;
  continent: any;
  capital: string;
  currency: any[];
  languages: any[];
  alpha2: string;
  alpha3: string;
  i18n: any;
  official_name: string;
  top_five_cities: string[];
  top_10_dishes: string[];
  top_10_non_alcoholic_beverages: string[];
  top_10_alcoholic_beverages: string[];
  top_10_touristic_activities: string[];
  official_languages: string;
  structure?: CountryStructure; // New flexible structure field
}

export class CountryModel extends EntityModel<CountryTemplate> implements CountryTemplate, SearchableTemplate {
  declare name: string;
  declare native: string;
  declare phone: number;
  declare continent: any;
  declare capital: string;
  declare currency: any[];
  declare languages: any[];
  declare alpha2: string;
  declare alpha3: string;
  declare i18n: any;
  declare official_name: string;
  declare top_five_cities: string[];
  declare top_10_dishes: string[];
  declare top_10_non_alcoholic_beverages: string[];
  declare top_10_alcoholic_beverages: string[];
  declare top_10_touristic_activities: string[];
  declare official_languages: string;
  declare structure?: CountryStructure;

  get hasFetchAllData(): boolean {
    return !this.isExpiredCache() && !!this.id && !!this.name && !!this.languages && !!this.top_five_cities;
  }
}
