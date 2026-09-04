import dayjs, { Dayjs } from 'dayjs';
import { EntityModel, EntityTemplate } from '~/models/base';
import { PopulatedEntityRef, resolvePopulatedRefId } from '~/models/base/modelHelpers';
import { PlaceModel } from '../place/place.model';

export enum OpenCallStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export interface OpenCallTemplate extends EntityTemplate {
  profile_pic?: string;
  event_name: string;
  event_date: string | Dayjs;
  start_date: string | Dayjs;
  end_date: string | Dayjs;
  // El backend lo populate (Mongoose), por lo que llega como sub-documento y no como id plano.
  place_id: string | PopulatedEntityRef;
  place?: PlaceModel;
  city: string;
  status: OpenCallStatus;
  description?: string;
  genres?: string[];
  applications_count?: number;
  event_location?: string;
  country?: string;
  accepted_project_types?: string[];
  max_applications?: number;
  requirements_description?: string;
  stage_type?: string;
  stage_dimensions?: string;
  set_duration_min?: number;
  set_duration_max?: number;
  available_slots?: number;
  expected_audience?: number;
  provided_sound?: string;
  provided_backline?: string;
  provided_lighting?: string;
  technical_notes?: string;
  fee_currency?: string;
  fee_amount?: number;
  travel_support?: string;
  accommodation_provided?: string;
  meals_provided?: string;
  additional_notes?: string;
}

export class OpenCallModel extends EntityModel<OpenCallTemplate> implements OpenCallTemplate {
  declare profile_pic?: string;
  declare event_name: string;
  declare event_date: Dayjs;
  declare start_date: Dayjs;
  declare end_date: Dayjs;
  declare place_id: string | PopulatedEntityRef;
  declare place?: PlaceModel;
  declare city: string;
  declare status: OpenCallStatus;
  declare description?: string;
  declare genres?: string[];
  declare applications_count?: number;
  declare event_location?: string;
  declare country?: string;
  declare accepted_project_types?: string[];
  declare max_applications?: number;
  declare requirements_description?: string;
  declare stage_type?: string;
  declare stage_dimensions?: string;
  declare set_duration_min?: number;
  declare set_duration_max?: number;
  declare available_slots?: number;
  declare expected_audience?: number;
  declare provided_sound?: string;
  declare provided_backline?: string;
  declare provided_lighting?: string;
  declare technical_notes?: string;
  declare fee_currency?: string;
  declare fee_amount?: number;
  declare travel_support?: string;
  declare accommodation_provided?: string;
  declare meals_provided?: string;
  declare additional_notes?: string;

  constructor(template: OpenCallTemplate) {
    super(template);
    this.event_date = dayjs(template.event_date);
    this.start_date = dayjs(template.start_date);
    this.end_date = dayjs(template.end_date);
    this.place = template.place ? new PlaceModel(template.place) : undefined;
    this.status = !this.isExpired ? template.status || OpenCallStatus.DRAFT : OpenCallStatus.CLOSED;
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

  get isExpired(): boolean {
    return dayjs().isAfter(this.end_date, 'day');
  }

  get placeId(): string | undefined {
    return resolvePopulatedRefId(this.place_id);
  }
}
