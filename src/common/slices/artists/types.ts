import { ArtistModel } from "~/constants";

export enum ArtistErrorType {
  RESPONSE_ERROR = 1,
}

export interface ArtistState {
  artists: ArtistModel[] | [];
  loading: boolean;
  error: ArtistErrorType | null;
}
