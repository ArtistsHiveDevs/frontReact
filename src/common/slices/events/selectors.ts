import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "~/common/utils/redux-injectors/types";

import { eventsInitialState } from ".";

// First select the relevant part from the state
const selectDomain = (state: RootState) =>
  state?.EventsReducer || eventsInitialState;

export const selectLoading = createSelector(
  [selectDomain],
  (EventState) => EventState.loading
);

export const selectError = createSelector(
  [selectDomain],
  (EventState) => EventState.error
);

export const selectEvents = createSelector(
  [selectDomain],
  (EventState) => EventState.events
);
