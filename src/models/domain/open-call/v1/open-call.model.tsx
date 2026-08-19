import dayjs, { Dayjs } from 'dayjs';
import { EntityModel, EntityTemplate } from '~/models/base';
import { PopulatedEntityRef, resolvePopulatedRefId } from '~/models/base/modelHelpers';
import { PlaceModel } from '../../place/place.model';
import { ControlType } from '~/components/shared/organisms/gui/dynamicForms';

export enum OpenCallStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

/**
 * Configuración de un campo del formulario de aplicación
 */
export interface ApplicationFormFieldConfig {
  id: string;
  inputType: ControlType;
  fieldName: string;
  label?: string;
  translationPath?: string;
  placeholder?: string;
  required: boolean;
  order: number;
  componentParams?: {
    options?: string[];
    multiline?: boolean;
    rows?: number;
    accept?: string;
    maxFiles?: number;
    [key: string]: any;
  };
  config?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    [key: string]: any;
  };
  help_text?: string;
  defaultValue?: any;
  hidden?: boolean | Function;
}

/**
 * Sección del formulario de aplicación
 */
export interface ApplicationFormSection {
  id: string;
  name: string;
  order: number;
  fields: ApplicationFormFieldConfig[];
}

/**
 * Configuración completa del formulario de aplicación dinámico
 */
export interface ApplicationFormConfig {
  sections: ApplicationFormSection[];
}

export interface OpenCallTemplate extends EntityTemplate {
  // === INFORMACIÓN BÁSICA ===
  event_name: string;
  event_type?: string; // 'concierto', 'festival', 'residencia', etc.
  event_date: string | Dayjs;
  start_date: string | Dayjs; // Inicio de la convocatoria
  end_date: string | Dayjs; // Cierre de la convocatoria

  // === UBICACIÓN ===
  place_id: string | PopulatedEntityRef;
  place?: PlaceModel;
  city: string;
  country?: string;
  event_location?: string;

  // === ESTADO ===
  status: OpenCallStatus;

  // === DESCRIPCIÓN Y REQUISITOS ===
  description?: string;
  genres?: string[];
  accepted_project_types?: string[];
  requirements_description?: string;
  selection_criteria?: string;

  // === ASPECTOS TÉCNICOS ===
  stage_type?: string;
  stage_dimensions?: string;
  set_duration_min?: number;
  set_duration_max?: number;
  expected_audience?: number;
  provided_sound?: string;
  provided_backline?: string;
  provided_lighting?: string;
  technical_notes?: string;

  // === COMPENSACIÓN Y BENEFICIOS ===
  fee_currency?: string;
  fee_amount?: number;
  fee_negotiable?: boolean;
  travel_support?: string;
  accommodation_provided?: string;
  meals_provided?: string;

  // === CUPOS Y APLICACIÓN ===
  available_slots?: number; // Número de cupos disponibles
  applications_count?: number;

  // === TÉRMINOS Y CONDICIONES ===
  terms_and_conditions?: string; // Markdown o texto plano
  terms_and_conditions_file?: string; // URL del PDF

  // === FORMULARIO DINÁMICO ===
  application_form_config?: ApplicationFormConfig;

  // === OTROS ===
  is_recurring?: boolean;
  external_link?: string;
  additional_notes?: string;
}

export class OpenCallModel extends EntityModel<OpenCallTemplate> implements OpenCallTemplate {
  declare event_name: string;
  declare event_type?: string;
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
  declare requirements_description?: string;
  declare selection_criteria?: string;
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
  declare fee_negotiable?: boolean;
  declare travel_support?: string;
  declare accommodation_provided?: string;
  declare meals_provided?: string;
  declare terms_and_conditions?: string;
  declare terms_and_conditions_file?: string;
  declare application_form_config?: ApplicationFormConfig;
  declare is_recurring?: boolean;
  declare external_link?: string;
  declare additional_notes?: string;

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

  get isExpired(): boolean {
    return dayjs().isAfter(this.end_date, 'day');
  }

  get placeId(): string | undefined {
    return resolvePopulatedRefId(this.place_id);
  }

  /**
   * Retorna el número de días restantes hasta el cierre de la convocatoria
   */
  get daysUntilClose(): number {
    return this.end_date.diff(dayjs(), 'day');
  }

  /**
   * Retorna true si la convocatoria está por cerrar (menos de 7 días)
   */
  get isClosingSoon(): boolean {
    return this.daysUntilClose <= 7 && this.daysUntilClose > 0;
  }

  /**
   * Retorna true si hay cupos disponibles
   */
  get hasAvailableSlots(): boolean {
    if (!this.available_slots) return true; // Si no hay límite, siempre hay cupos
    return (this.applications_count || 0) < this.available_slots;
  }
}
