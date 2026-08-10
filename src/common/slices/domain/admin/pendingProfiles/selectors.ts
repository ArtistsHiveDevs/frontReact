import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/common/utils/redux-injectors/types';

import { pendingProfilesInitialState } from '.';

const selectDomain = (state: RootState) => state?.PendingProfilesReducer || pendingProfilesInitialState;

export const selectPendingArtists = createSelector([selectDomain], (state) => state.artists);

export const selectPendingPlaces = createSelector([selectDomain], (state) => state.places);

export const selectPendingProfilesLoading = createSelector([selectDomain], (state) => state.loading);

export const selectPendingProfilesReviewingId = createSelector([selectDomain], (state) => state.reviewingId);

export const selectPendingProfilesError = createSelector([selectDomain], (state) => ({
  errorType: state.error,
  error: state.errorContent,
}));
