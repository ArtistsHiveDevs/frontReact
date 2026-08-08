import { AgendaEventType } from '~/models/domain/calendar/agenda-event.model';

export interface AgendaEventsQueryParams {
  from: string;
  to: string;
  types: string;
}

export function buildAgendaEventsQueryParams(range: {
  from: string;
  to: string;
  types: AgendaEventType[];
}): AgendaEventsQueryParams {
  return { from: range.from, to: range.to, types: range.types.join(',') };
}
