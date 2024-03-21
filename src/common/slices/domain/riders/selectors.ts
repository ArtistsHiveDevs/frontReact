import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/common/utils/redux-injectors/types';

import { ridersInitialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.RidersReducer || ridersInitialState;

export const ridersSelectLoading = createSelector([selectDomain], (RiderState) => RiderState.loading);

export const ridersSelectError = createSelector([selectDomain], (RiderState) => RiderState.error);

export const selectRiders = createSelector([selectDomain], (RiderState) => RiderState.riders);

export const selectQueriedRiders = createSelector([selectDomain], (RiderState) => RiderState.queriedRiders);
