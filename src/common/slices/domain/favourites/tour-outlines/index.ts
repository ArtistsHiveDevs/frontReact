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
  detailedTourOutline: null,
  loading: false,
  error: null,
  userOwner: "",
  detailTourOutlineId: "",
};

const slice = createSlice({
  name: "ToursOutlinesReducer",
  initialState: TourOutlineInitialState,
  reducers: {
    getToursOutlinesByUser(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
      state.toursOutlines = null;
      state.userOwner = action?.payload;
    },
    getToursOutlinesByUserResponse(
      state,
      action: PayloadAction<TourOutlineTemplate[]>
    ) {
      state.toursOutlines = action.payload.map(
        (tourOutline) => new TourOutlineModel(tourOutline)
      );
      state.loading = false;
    },
    getTourOutlineById(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
      state.toursOutlines = null;
      state.detailTourOutlineId = action?.payload;
    },
    getTourOutlineByIdResponse(
      state,
      action: PayloadAction<TourOutlineTemplate[]>
    ) {
      state.detailedTourOutline = new TourOutlineModel(action.payload);

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
