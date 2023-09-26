import { SavedModel } from "~/models/domain/favourites/saved";

export enum SavedErrorType {
  RESPONSE_ERROR = 1,
}

export interface SavedState {
  saved: SavedModel;
  loading: boolean;
  error: SavedErrorType | null;
  savedQueryParam?: string;
}
