import { EntityModel, EntityTemplate } from '~/models/base';

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
    if (this.price === undefined || this.price === null) {
      return '';
    }
    if (!this.currency) {
      return `${this.price}`;
    }
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: this.currency,
        maximumFractionDigits: 0,
      }).format(this.price);
    } catch {
      return `${this.currency} ${this.price}`;
    }
  }

  get selectLabel(): string {
    const price = this.formattedPrice;
    return price ? `${this.name} ${price}` : `${this.name}`;
  }
}
