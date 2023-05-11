import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "~/common/utils/@reduxjs/toolkit";
import {
  useInjectReducer,
  useInjectSaga,
} from "~/common/utils/redux-injectors";
import { ArtistRiderModel } from "~/models/domain/rider/rider.model";

import { riderSaga } from "./saga";
import { RiderErrorType, RiderState } from "./types";

export const ridersInitialState: RiderState = {
  riders: [],
  loading: false,
  error: null,
  ridersQueryParams: null,
  queriedRiders: [],
};

const slice = createSlice({
  name: "RidersReducer",
  initialState: ridersInitialState,
  reducers: {
    loadRiders(state) {
      state.loading = true;
      state.error = null;
      state.riders = [];
    },
    ridersLoaded(state, action: PayloadAction<ArtistRiderModel[]>) {
      const riders = action.payload.map(
        (template) => new ArtistRiderModel(template)
      );

      state.riders = riders;
      state.loading = false;
    },
    queryRiders(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
      state.queriedRiders = [];
      state.ridersQueryParams = action?.payload;
    },
    queriedRiders(state, action: PayloadAction<ArtistRiderModel[] | []>) {
      const artistsQuery = action.payload.map(
        (template) => new ArtistRiderModel(template)
      );

      state.queriedRiders = artistsQuery;
      state.loading = false;
    },
    repoError(state, action: PayloadAction<RiderErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: ridersActions, reducer } = slice;

export const useRidersSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: riderSaga });

  return { actions: slice.actions };
};
