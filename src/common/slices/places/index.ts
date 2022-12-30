import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "~/common/utils/@reduxjs/toolkit";
import {
  useInjectReducer,
  useInjectSaga,
} from "~/common/utils/redux-injectors";
import { PlaceModel } from "~/models/domain/place/place.model";

import { placeSaga } from "./saga";
import { PlaceErrorType, PlaceState } from "./types";

export const placesInitialState: PlaceState = {
  places: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "PlacesReducer",
  initialState: placesInitialState,
  reducers: {
    loadPlaces(state) {
      state.loading = true;
      state.error = null;
      state.places = [];
    },
    placesLoaded(state, action: PayloadAction<PlaceModel[]>) {
      const places = action.payload.map((template) => new PlaceModel(template));

      state.places = places;
      state.loading = false;
    },
    repoError(state, action: PayloadAction<PlaceErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: placesActions, reducer } = slice;

export const usePlacesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: placeSaga });

  return { actions: slice.actions };
};
