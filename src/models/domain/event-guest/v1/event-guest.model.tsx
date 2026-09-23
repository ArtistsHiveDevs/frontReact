import { EntityModel, EntityTemplate } from '~/models/base';
import { PopulatedEntityRef, resolvePopulatedRefId } from '~/models/base/modelHelpers';

export interface EventGuestTemplate extends EntityTemplate {
  _id?: string;
  sID?: string;
  event_id?: string | PopulatedEntityRef;
  artist_id?: string | PopulatedEntityRef;
  first_name?: string;
  last_name?: string;
  cc?: string;
  email?: string;
  ticket_type_id?: string;
  ticket_type_name?: string;
  ticket_price?: number;
  checked_in?: boolean;
  createdAt?: string;
}

export class EventGuestModel extends EntityModel<EventGuestTemplate> implements EventGuestTemplate {
  declare sID?: string;
  declare event_id?: string | PopulatedEntityRef;
  declare artist_id?: string | PopulatedEntityRef;
  declare first_name?: string;
  declare last_name?: string;
  declare cc?: string;
  declare email?: string;
  declare ticket_type_id?: string;
  declare ticket_type_name?: string;
  declare ticket_price?: number;
  declare checked_in?: boolean;
  declare createdAt?: string;

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.event_id;
  }

  get cardInfo() {
    return { title: this.fullName, subtitle: this.ticket_type_name };
  }

  get fullName(): string {
    return [this.first_name, this.last_name].filter(Boolean).join(' ');
  }

  get eventId(): string | undefined {
    return resolvePopulatedRefId(this.event_id);
  }

  get artistId(): string | undefined {
    return resolvePopulatedRefId(this.artist_id);
  }
}
