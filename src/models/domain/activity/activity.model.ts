import { EntityModel, EntityTemplate } from '~/models/base';

export enum ActivityType {
  REHEARSAL = 'rehearsal',
  SOUNDCHECK = 'soundcheck',
  OTHER = 'other',
}

export const ALL_ACTIVITY_TYPES: ActivityType[] = [
  ActivityType.REHEARSAL,
  ActivityType.SOUNDCHECK,
  ActivityType.OTHER,
];

export interface ActivityTemplate extends EntityTemplate {
  title: string;
  type?: ActivityType;
  // `start` y `end` se conservan como los envía el backend: los de día completo llegan
  // como "YYYY-MM-DD" y parsearlos a Date los correría un día en zonas horarias negativas.
  start: string;
  end?: string | null;
  allDay?: boolean;
  notes?: string | null;
}

export class ActivityModel extends EntityModel<ActivityTemplate> implements ActivityTemplate {
  declare title: string;
  declare type?: ActivityType;
  declare start: string;
  declare end?: string | null;
  declare allDay?: boolean;
  declare notes?: string | null;

  constructor(template: ActivityTemplate) {
    super(template);
    this.type = template.type || ActivityType.OTHER;
    this.allDay = !!template.allDay;
  }

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.title && !!this.start;
  }
}
