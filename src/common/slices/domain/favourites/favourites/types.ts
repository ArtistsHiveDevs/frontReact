import { SavedFavouritesModel } from "~/models/domain/favourites/favourites";

export enum SavedFavouritesErrorType {
  RESPONSE_ERROR = 1,
}

export interface SavedFavouritesState {
  savedFavourites: SavedFavouritesModel[] | [];
  loading: boolean;
  error: SavedFavouritesErrorType | null;
}
