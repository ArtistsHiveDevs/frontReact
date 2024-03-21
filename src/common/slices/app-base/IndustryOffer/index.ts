import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '~/common/utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

import { IndustryOfferModel, IndustryOfferTemplate } from '~/models/domain/industryOffer/IndustryOffer.model';
import { industryOfferSaga } from './saga';
import { IndustryOfferErrorType, IndustryOfferState } from './types';

export const industryOfferInitialState: IndustryOfferState = {
  queriedRole: undefined,
  offer: undefined,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'IndustryOfferReducer',
  initialState: industryOfferInitialState,
  reducers: {
    loadIndustryOffer(state, action?: PayloadAction<{ role: string }>) {
      state.loading = true;
      state.error = null;
      state.offer = undefined;
      state.queriedRole = action?.payload?.role;
    },
    industryOfferLoaded(state, action: PayloadAction<IndustryOfferTemplate>) {
      state.offer = new IndustryOfferModel(action.payload);
      state.loading = false;
    },
    repoError(state, action: PayloadAction<IndustryOfferErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions, reducer } = slice;

export const useIndustryOfferSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: industryOfferSaga });

  return { actions: slice.actions };
};
