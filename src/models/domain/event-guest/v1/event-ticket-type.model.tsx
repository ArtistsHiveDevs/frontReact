import { EntityModel, EntityTemplate } from '~/models/base';
import { formatTicketPrice } from './ticket-price.utils';

export interface EventTicketTypeTemplate extends EntityTemplate {
  _id?: string;
  sID?: string;
  event_id?: string;
  name?: string;
  price?: number;
  currency?: string;
  order?: number;
  active?: boolean;
  createdAt?: string;
}

export class EventTicketTypeModel extends EntityModel<EventTicketTypeTemplate> implements EventTicketTypeTemplate {
  declare sID?: string;
  declare event_id?: string;
  declare name?: string;
  declare price?: number;
  declare currency?: string;
  declare order?: number;
  declare active?: boolean;
  declare createdAt?: string;

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.name;
  }

  get cardInfo() {
    return { title: this.name, subtitle: this.formattedPrice };
  }

  get formattedPrice(): string {
    return formatTicketPrice(this.price, this.currency);
  }

  get selectLabel(): string {
    const price = this.formattedPrice;
    return price ? `${this.name} ${price}` : `${this.name}`;
  }
}
