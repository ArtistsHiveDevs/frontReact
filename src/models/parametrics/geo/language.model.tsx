import { EntityModel, EntityTemplate, SearchableTemplate } from '~/models/base';

export interface LanguageTemplate extends EntityTemplate {
  key: string;
  main_flag_2: string;
  main_flag_3: string;
  other_flags_2?: string[];
  other_flags_3?: string[];
  name: string;
  native: string;
  i18n: any;
}

export class LanguageModel extends EntityModel<LanguageTemplate> implements LanguageTemplate, SearchableTemplate {
  declare key: string;
  declare main_flag_2: string;
  declare main_flag_3: string;
  declare other_flags_2?: string[];
  declare other_flags_3?: string[];
  declare name: string;
  declare native: string;
  declare i18n: any;

  get hasFetchAllData(): boolean {
    return !this.isExpiredCache() && !!this.id && !!this.name && !!this.other_flags_2 && !!this.other_flags_3;
  }

  get label() {
    const translation = this.native && this.name !== this.native ? ` (${this.native})` : '';
    return `${this.name}${translation}`;
  }

  get value() {
    return this.id || this.key;
  }
}
