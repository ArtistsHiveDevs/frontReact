import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "~/common/utils/@reduxjs/toolkit";
import {
  useInjectReducer,
  useInjectSaga,
} from "~/common/utils/redux-injectors";

import { SavedFavouritesModel } from "~/models/domain/favourites/favourites";
import { userSaga } from "./saga";
import { SavedFavouritesErrorType, SavedFavouritesState } from "./types";

export const savedFavouritesInitialState: SavedFavouritesState = {
  savedFavourites: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "SavedFavouritesReducer",
  initialState: savedFavouritesInitialState,
  reducers: {
    loadSavedFavourites(state) {
      state.loading = true;
      state.error = null;
      state.savedFavourites = [];
      console.log("asd");
    },
    userLoaded(state, action: PayloadAction<SavedFavouritesModel[]>) {
      const savedFavourites = action.payload.map(
        (template) => new SavedFavouritesModel(template)
      );

      state.savedFavourites = savedFavourites;
      state.loading = false;
    },
    repoError(state, action: PayloadAction<SavedFavouritesErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: savedFavouritesActions, reducer } = slice;

export const useSavedFavouritesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: userSaga });

  return { actions: slice.actions };
};
