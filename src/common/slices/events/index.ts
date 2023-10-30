import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "~/common/utils/@reduxjs/toolkit";
import {
  useInjectReducer,
  useInjectSaga,
} from "~/common/utils/redux-injectors";
import { EventModel } from "~/models/domain/event/event.model";

import { eventSaga } from "./saga";
import { EventErrorType, EventState } from "./types";

export const eventsInitialState: EventState = {
  events: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "EventsReducer",
  initialState: eventsInitialState,
  reducers: {
    loadEvents(state) {
      state.loading = true;
      state.error = null;
      state.events = [];
    },
    eventLoaded(state, action: PayloadAction<EventModel[]>) {
      const events = action.payload;

      state.events = events;
      state.loading = false;
    },
    repoError(state, action: PayloadAction<EventErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: eventsActions, reducer } = slice;

export const useEventsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: eventSaga });

  return { actions: slice.actions };
};
