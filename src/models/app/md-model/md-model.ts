import { EntityModel, EntityTemplate } from '~/models/base';

export interface MDDocumentTemplate extends EntityTemplate {
  content: string;
  lang: string;
  version?: string;
  creationDate?: string;
  validSince?: string;
  expirationDate?: string;
}

export class MDDocumentModel extends EntityModel<MDDocumentTemplate> {
  declare content: string;
  declare lang: string;
  declare version?: string;
  declare creationDate?: string;
  declare validSince?: string;
  declare expirationDate?: string;

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.content;
  }
}
