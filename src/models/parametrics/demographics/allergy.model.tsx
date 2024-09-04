import { EntityModel, EntityTemplate, SearchableTemplate } from '~/models/base';

export interface AllergyTemplate extends EntityTemplate {
  name: string;
  i18n: any;
  percentage: number;
  type: string;
  code?: string;
}

export class AllergyModel extends EntityModel<AllergyTemplate> implements AllergyTemplate, SearchableTemplate {
  declare name: string;
  declare i18n: any;
  declare percentage: number;
  declare type: string;
  declare code?: string;

  get hasFetchAllData(): boolean {
    return !this.isExpiredCache() && !!this.id && !!this.name && !!this.type;
  }

  get label() {
    return this.name;
  }

  get value() {
    return this.id;
  }
}
