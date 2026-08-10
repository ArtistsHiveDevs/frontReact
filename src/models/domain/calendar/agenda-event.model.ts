import { EntityModel, EntityTemplate } from '~/models/base';

export enum AgendaEventType {
  CONCERT = 'concert',
  CALL = 'call',
  ACTIVITY = 'activity',
}

export const ALL_AGENDA_EVENT_TYPES: AgendaEventType[] = [
  AgendaEventType.CONCERT,
  AgendaEventType.CALL,
  AgendaEventType.ACTIVITY,
];

// Refleja el flag homónimo del backend (helpers/calendarCollectors.js): mientras esté en false
// la fuente de conciertos nunca devuelve eventos, así que el tipo no se ofrece en la UI.
export const CONCERT_SOURCE_ENABLED = false;

export const VISIBLE_AGENDA_EVENT_TYPES: AgendaEventType[] = ALL_AGENDA_EVENT_TYPES.filter(
  (eventType) => eventType !== AgendaEventType.CONCERT || CONCERT_SOURCE_ENABLED
);

export interface AgendaEventMeta {
  expired?: boolean;
  city?: string | null;
  event_date?: string | null;
  applications_count?: number;
  activity_type?: string | null;
  notes?: string | null;
  [key: string]: any;
}

export interface AgendaEventTemplate extends EntityTemplate {
  type: AgendaEventType;
  title: string;
  // `start` y `end` se conservan como los envía el backend: los de día completo llegan
  // como "YYYY-MM-DD" y parsearlos a Date los correría un día en zonas horarias negativas.
  start: string;
  end?: string | null;
  allDay?: boolean;
  status?: string | null;
  entityId?: string;
  meta?: AgendaEventMeta;
}

export class AgendaEventModel extends EntityModel<AgendaEventTemplate> {
  declare type: AgendaEventType;
  declare title: string;
  declare start: string;
  declare end?: string | null;
  declare allDay?: boolean;
  declare status?: string | null;
  declare entityId?: string;
  declare meta?: AgendaEventMeta;

  get isDeadline(): boolean {
    return this.type === AgendaEventType.CALL;
  }

  get isExpired(): boolean {
    return this.meta?.expired === true;
  }

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.title && !!this.start;
  }
}
