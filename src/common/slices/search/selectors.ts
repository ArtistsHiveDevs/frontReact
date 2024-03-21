import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/common/utils/redux-injectors/types';

import { SearchInitialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.SearchReducer || SearchInitialState;

export const selectSearchLoading = createSelector([selectDomain], (SearchState) => SearchState.loading);

export const selectSearchError = createSelector([selectDomain], (SearchState) => SearchState.error);

export const selectSearch = createSelector([selectDomain], (SearchState) => SearchState.search);
