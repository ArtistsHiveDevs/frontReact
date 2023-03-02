import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "~/common/utils/@reduxjs/toolkit";
import {
  useInjectReducer,
  useInjectSaga,
} from "~/common/utils/redux-injectors";
import {
  TermsAndConditionsModel,
  TermsAndConditionsTemplate,
} from "~/models/app/termsAndConditions/TermsAndConditions.model";

import { termsAndConditionsSaga } from "./saga";
import { TermsAndConditionsErrorType, TermsAndConditionsState } from "./types";

export const termsAndConditionsInitialState: TermsAndConditionsState = {
  queriedTermsVersion: undefined,
  terms: undefined,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "TermsAndConditionsReducer",
  initialState: termsAndConditionsInitialState,
  reducers: {
    loadTermsAndConditions(state, action?: PayloadAction<{ version: string }>) {
      state.loading = true;
      state.error = null;
      state.terms = undefined;
      state.queriedTermsVersion = action?.payload?.version;
    },
    termsAndConditionsLoaded(
      state,
      action: PayloadAction<TermsAndConditionsTemplate>
    ) {
      state.terms = new TermsAndConditionsModel(action.payload);
      state.loading = false;
    },
    repoError(state, action: PayloadAction<TermsAndConditionsErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions, reducer } = slice;

export const useTermsAndConditionsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: termsAndConditionsSaga });

  return { actions: slice.actions };
};
