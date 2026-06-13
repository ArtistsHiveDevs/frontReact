import dayjs, { Dayjs } from 'dayjs';
import { EntityModel, EntityTemplate } from '~/models/base';
import { PlaceModel } from '../place/place.model';

export enum OpenCallStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export interface OpenCallTemplate extends EntityTemplate {
  event_name: string;
  event_date: string | Dayjs;
  start_date: string | Dayjs;
  end_date: string | Dayjs;
  place_id: string;
  place?: PlaceModel;
  city: string;
  status: OpenCallStatus;
  description?: string;
  genres?: string[];
  applications_count?: number;
}

export class OpenCallModel extends EntityModel<OpenCallTemplate> implements OpenCallTemplate {
  declare event_name: string;
  declare event_date: Dayjs;
  declare start_date: Dayjs;
  declare end_date: Dayjs;
  declare place_id: string;
  declare place?: PlaceModel;
  declare city: string;
  declare status: OpenCallStatus;
  declare description?: string;
  declare genres?: string[];
  declare applications_count?: number;

  constructor(template: OpenCallTemplate) {
    super(template);
    this.event_date = dayjs(template.event_date);
    this.start_date = dayjs(template.start_date);
    this.end_date = dayjs(template.end_date);
    this.place = template.place ? new PlaceModel(template.place) : undefined;
    this.status = template.status || OpenCallStatus.DRAFT;
    this.applications_count = template.applications_count || 0;
  }

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.event_name;
  }

  get cardInfo() {
    return { title: this.event_name, subtitle: this.end_date };
  }

  get isActive(): boolean {
    const now = dayjs();
    return this.status === OpenCallStatus.OPEN && now.isAfter(this.start_date) && now.isBefore(this.end_date);
  }
}
