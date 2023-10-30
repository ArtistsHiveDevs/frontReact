import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "~/common/utils/@reduxjs/toolkit";
import {
  useInjectReducer,
  useInjectSaga,
} from "~/common/utils/redux-injectors";
import { AcademyModel } from "~/models/domain/academy/academy.model";

import { academySaga } from "./saga";
import { AcademyErrorType, AcademyState } from "./types";

export const academiesInitialState: AcademyState = {
  academies: [],
  loading: false,
  error: null,
  academiesQueryParams: null,
  queriedAcademies: [],
};

const slice = createSlice({
  name: "AcademiesReducer",
  initialState: academiesInitialState,
  reducers: {
    loadAcademies(state) {
      state.loading = true;
      state.error = null;
      state.academies = [];
    },
    academiesLoaded(state, action: PayloadAction<AcademyModel[]>) {
      const academies = action.payload.map(
        (template) => new AcademyModel(template)
      );

      state.academies = academies;
      state.loading = false;
    },
    queryAcademies(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
      state.queriedAcademies = [];
      state.academiesQueryParams = action?.payload;
    },
    queriedAcademies(state, action: PayloadAction<AcademyModel[] | []>) {
      const artistsQuery = action.payload.map(
        (template) => new AcademyModel(template)
      );

      state.queriedAcademies = artistsQuery;
      state.loading = false;
    },
    repoError(state, action: PayloadAction<AcademyErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: academiesActions, reducer } = slice;

export const useAcademiesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: academySaga });

  return { actions: slice.actions };
};
