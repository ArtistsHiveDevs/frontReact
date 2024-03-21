import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/common/utils/redux-injectors/types';

import { placesInitialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.PlacesReducer || placesInitialState;

export const placesSelectLoading = createSelector([selectDomain], (PlaceState) => PlaceState.loading);

export const placesSelectError = createSelector([selectDomain], (PlaceState) => PlaceState.error);

export const selectPlaces = createSelector([selectDomain], (PlaceState) => PlaceState.places);

export const selectQueriedPlaces = createSelector([selectDomain], (PlaceState) => PlaceState.queriedPlaces);
