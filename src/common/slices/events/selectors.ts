import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/common/utils/redux-injectors/types';

import { eventsInitialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.EventsReducer || eventsInitialState;

export const eventsSelectLoading = createSelector([selectDomain], (EventState) => EventState.loading);

export const eventsSelectError = createSelector([selectDomain], (EventState) => EventState.error);

export const selectEvents = createSelector([selectDomain], (EventState) => EventState.events);

export const selectQueriedEvents = createSelector([selectDomain], (EventState) => EventState.queriedEvents);
