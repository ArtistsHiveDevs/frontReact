import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import {
  CalendarActivityModel,
  CalendarActivityTemplate,
  CalendarActivityType,
} from '~/models/domain/calendar/calendar-activity.model';

const calendarEventsSliceName = 'calendarEvents';
const calendarEventsEndpoint = '/events/all_events';

const calendarActivitiesSliceName = 'calendarActivities';
const calendarActivitiesEndpoint = '/calendar-activities';

export interface CalendarEventsQueryParams {
  from: string;
  to: string;
  types: string;
}

export function buildCalendarEventsQueryParams(range: {
  from: string;
  to: string;
  types: CalendarActivityType[];
}): CalendarEventsQueryParams {
  return { from: range.from, to: range.to, types: range.types.join(',') };
}

export const selectorCalendarEvents = createEntitySelectors<
  typeof calendarEventsSliceName,
  CalendarActivityModel,
  CalendarActivityTemplate
>({ sliceName: calendarEventsSliceName });

export const selectorCalendarActivities = createEntitySelectors<
  typeof calendarActivitiesSliceName,
  CalendarActivityModel,
  CalendarActivityTemplate
>({ sliceName: calendarActivitiesSliceName });

const { slice: calendarEventsSlice, saga: sagaCalendarEvents } = createEntitySlice({
  name: calendarEventsSliceName,
  Model: CalendarActivityModel,
  initialState: {
    items: [],
    loading: false,
    error: null,
    detailedItems: {},
  },
  resourceEndpoint: calendarEventsEndpoint,
  selectors: {
    ...selectorCalendarEvents,
  },
  options: {
    disableOperations: {
      create: true,
      update: true,
      postAction: true,
      delete: true,
    },
  },
});

const { slice: calendarActivitiesSlice, saga: sagaCalendarActivities } = createEntitySlice({
  name: calendarActivitiesSliceName,
  Model: CalendarActivityModel,
  initialState: {
    items: [],
    loading: false,
    error: null,
    detailedItems: {},
    newItemRQ: null,
    createdItem: null,
  },
  resourceEndpoint: calendarActivitiesEndpoint,
  selectors: {
    ...selectorCalendarActivities,
  },
  options: {
    disableOperations: {
      postAction: true,
    },
  },
});

export const reducerCalendarEvents = calendarEventsSlice.reducer;
export const actionsCalendarEvents = calendarEventsSlice.actions;
export const reducerCalendarActivities = calendarActivitiesSlice.reducer;
export const actionsCalendarActivities = calendarActivitiesSlice.actions;
export { sagaCalendarEvents, sagaCalendarActivities };

export const useCalendarEventsSlice = () => {
  useInjectReducer({ key: calendarEventsSlice.name, reducer: calendarEventsSlice.reducer });
  useInjectSaga({ key: calendarEventsSlice.name, saga: sagaCalendarEvents });

  return { actions: calendarEventsSlice.actions };
};

export const useCalendarActivitiesSlice = () => {
  useInjectReducer({ key: calendarActivitiesSlice.name, reducer: calendarActivitiesSlice.reducer });
  useInjectSaga({ key: calendarActivitiesSlice.name, saga: sagaCalendarActivities });

  return { actions: calendarActivitiesSlice.actions };
};
