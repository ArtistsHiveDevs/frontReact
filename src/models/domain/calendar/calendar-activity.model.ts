import { PATHS, SUB_PATHS } from '~/constants';
import { EntityModel, EntityTemplate } from '~/models/base';

export enum CalendarActivityType {
  ACTIVITY = 'activity',
  OPENCALL = 'opencall',
  EVENT = 'event',
  HOLIDAY = 'holiday',
}

export enum CalendarActivitySubtype {
  REHEARSAL = 'rehearsal',
  SOUNDCHECK = 'soundcheck',
  PRESENTATION = 'presentation',
  CONCERT = 'concert',
  TOUR = 'tour',
  OTHER = 'other',
}

export const ALL_CALENDAR_ACTIVITY_SUBTYPES: CalendarActivitySubtype[] = [
  CalendarActivitySubtype.REHEARSAL,
  CalendarActivitySubtype.SOUNDCHECK,
  CalendarActivitySubtype.PRESENTATION,
  CalendarActivitySubtype.CONCERT,
  CalendarActivitySubtype.TOUR,
  CalendarActivitySubtype.OTHER,
];

export type CalendarActivityDisplayMode = 'auto' | 'background';

export interface CalendarActivityTypeConfig {
  detailRoute?: string;
  defaultSubtype?: CalendarActivitySubtype;
  editableByDefault: boolean;
  isDeadline: boolean;
  isInteractive: boolean;
  gridDisplayMode: CalendarActivityDisplayMode;
  agendaDisplayMode: CalendarActivityDisplayMode;
  allDaySortPriority: number;
}

export const CALENDAR_ACTIVITY_TYPE_CONFIG: Record<CalendarActivityType, CalendarActivityTypeConfig> = {
  [CalendarActivityType.ACTIVITY]: {
    defaultSubtype: CalendarActivitySubtype.OTHER,
    editableByDefault: true,
    isDeadline: false,
    isInteractive: true,
    gridDisplayMode: 'auto',
    agendaDisplayMode: 'auto',
    allDaySortPriority: 3,
  },
  [CalendarActivityType.OPENCALL]: {
    detailRoute: `/${PATHS.OPEN_CALLS}/${SUB_PATHS.ELEMENT_DETAILS}`,
    editableByDefault: false,
    isDeadline: true,
    isInteractive: true,
    gridDisplayMode: 'auto',
    agendaDisplayMode: 'auto',
    allDaySortPriority: 1,
  },
  [CalendarActivityType.EVENT]: {
    detailRoute: `/${PATHS.EVENTS}/${SUB_PATHS.ELEMENT_DETAILS}`,
    editableByDefault: false,
    isDeadline: false,
    isInteractive: true,
    gridDisplayMode: 'auto',
    agendaDisplayMode: 'auto',
    allDaySortPriority: 2,
  },
  [CalendarActivityType.HOLIDAY]: {
    editableByDefault: false,
    isDeadline: false,
    isInteractive: false,
    gridDisplayMode: 'background',
    agendaDisplayMode: 'auto',
    allDaySortPriority: 0,
  },
};

export const ALL_CALENDAR_ACTIVITY_TYPES = Object.keys(CALENDAR_ACTIVITY_TYPE_CONFIG) as CalendarActivityType[];

export const CREATABLE_CALENDAR_ACTIVITY_TYPE = CalendarActivityType.ACTIVITY;

export interface CalendarActivityMeta {
  expired?: boolean;
  city?: string | null;
  event_date?: string | null;
  applications_count?: number;
  notes?: string | null;
  [key: string]: any;
}

export interface CalendarActivityTemplate extends EntityTemplate {
  type: CalendarActivityType;
  subtype?: CalendarActivitySubtype | null;
  title: string | null;
  start: string;
  end?: string | null;
  allDay?: boolean;
  status?: string | null;
  entityId?: string | null;
  editable?: boolean;
  notes?: string | null;
  meta?: CalendarActivityMeta;
}

export class CalendarActivityModel extends EntityModel<CalendarActivityTemplate> implements CalendarActivityTemplate {
  declare type: CalendarActivityType;
  declare subtype?: CalendarActivitySubtype | null;
  declare title: string | null;
  declare start: string;
  declare end?: string | null;
  declare allDay?: boolean;
  declare status?: string | null;
  declare entityId?: string | null;
  declare editable?: boolean;
  declare notes?: string | null;
  declare meta?: CalendarActivityMeta;

  constructor(template: CalendarActivityTemplate) {
    super(template);
    this.type = template.type || CREATABLE_CALENDAR_ACTIVITY_TYPE;
    this.subtype = template.subtype || this.typeConfig.defaultSubtype || null;
    this.allDay = !!template.allDay;
  }

  get typeConfig(): CalendarActivityTypeConfig {
    return CALENDAR_ACTIVITY_TYPE_CONFIG[this.type] || CALENDAR_ACTIVITY_TYPE_CONFIG[CREATABLE_CALENDAR_ACTIVITY_TYPE];
  }

  get isDeadline(): boolean {
    return this.typeConfig.isDeadline;
  }

  get isEditable(): boolean {
    return this.editable ?? this.typeConfig.editableByDefault;
  }

  get isInteractive(): boolean {
    return this.typeConfig.isInteractive;
  }

  get detailRoute(): string | undefined {
    return this.typeConfig.detailRoute;
  }

  displayModeFor(agendaView: boolean): CalendarActivityDisplayMode {
    return agendaView ? this.typeConfig.agendaDisplayMode : this.typeConfig.gridDisplayMode;
  }

  get isAllDayBlock(): boolean {
    return this.isDeadline || !!this.allDay;
  }

  get isExpired(): boolean {
    return this.meta?.expired === true;
  }

  get dayKey(): string {
    if (this.isAllDayBlock) {
      return this.start.slice(0, 10);
    }

    const startDate = new Date(this.start);

    if (Number.isNaN(startDate.getTime())) {
      return this.start.slice(0, 10);
    }

    const month = `${startDate.getMonth() + 1}`.padStart(2, '0');
    const day = `${startDate.getDate()}`.padStart(2, '0');

    return `${startDate.getFullYear()}-${month}-${day}`;
  }

  get startTimestamp(): number {
    const startDate = new Date(this.start);

    return Number.isNaN(startDate.getTime()) ? 0 : startDate.getTime();
  }

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.title && !!this.start;
  }
}

export function compareCalendarActivities(first: CalendarActivityModel, second: CalendarActivityModel): number {
  if (first.dayKey !== second.dayKey) {
    return first.dayKey < second.dayKey ? -1 : 1;
  }

  if (first.isAllDayBlock !== second.isAllDayBlock) {
    return first.isAllDayBlock ? -1 : 1;
  }

  if (first.isAllDayBlock) {
    const priorityDifference = first.typeConfig.allDaySortPriority - second.typeConfig.allDaySortPriority;

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return (first.title || '').localeCompare(second.title || '');
  }

  const startDifference = first.startTimestamp - second.startTimestamp;

  return startDifference !== 0 ? startDifference : (first.title || '').localeCompare(second.title || '');
}

export function sortCalendarActivities(activities: CalendarActivityModel[]): CalendarActivityModel[] {
  return [...activities].sort(compareCalendarActivities);
}
