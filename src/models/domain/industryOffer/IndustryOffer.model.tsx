import { EntityModel, EntityTemplate } from '~/models/base';

export interface IndustryOfferTemplate extends EntityTemplate {
  offer: string;
}

export class IndustryOfferModel extends EntityModel<IndustryOfferTemplate> {
  declare offer: string;

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.offer;
  }
}
