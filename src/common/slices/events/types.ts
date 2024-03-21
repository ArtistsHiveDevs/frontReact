import { EventModel } from '~/models/domain/event/event.model';

export enum EventErrorType {
  RESPONSE_ERROR = 1,
}

export interface EventState {
  events: EventModel[] | [];
  loading: boolean;
  error: EventErrorType | null;
  eventQueryParams: string;
  queriedEvents: EventModel[] | [];
}
