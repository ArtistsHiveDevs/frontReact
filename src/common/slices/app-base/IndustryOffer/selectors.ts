import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/common/utils/redux-injectors/types';

import { industryOfferInitialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.IndustryOfferReducer || industryOfferInitialState;

export const selectLoading = createSelector([selectDomain], (IndustryOfferState) => IndustryOfferState.loading);

export const selectError = createSelector([selectDomain], (IndustryOfferState) => IndustryOfferState.error);

export const selectIndustryOffer = createSelector([selectDomain], (IndustryOfferState) => IndustryOfferState.offer);
