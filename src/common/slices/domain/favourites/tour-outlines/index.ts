import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "~/common/utils/@reduxjs/toolkit";
import {
  useInjectReducer,
  useInjectSaga,
} from "~/common/utils/redux-injectors";

import {
  TourOutlineModel,
  TourOutlineTemplate,
} from "~/models/domain/favourites/tourOutline";
import { tourOutlineSaga } from "./saga";
import { TourOutlineErrorType, TourOutlineState } from "./types";

export const TourOutlineInitialState: TourOutlineState = {
  toursOutlines: null,
  loading: false,
  error: null,
  tourOutlineQueryParam: "",
};

const slice = createSlice({
  name: "ToursOutlinesReducer",
  initialState: TourOutlineInitialState,
  reducers: {
    queryTourOutline(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
      state.toursOutlines = null;
      state.tourOutlineQueryParam = action?.payload;
    },
    tourOutlineQueried(state, action: PayloadAction<TourOutlineTemplate[]>) {
      state.toursOutlines = action.payload.map(
        (tourOutline) => new TourOutlineModel(tourOutline)
      );
      state.loading = false;
    },
    repoError(state, action: PayloadAction<TourOutlineErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: tourOutlineActions, reducer } = slice;

export const useTourOutlineSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: tourOutlineSaga });

  return { actions: slice.actions };
};
