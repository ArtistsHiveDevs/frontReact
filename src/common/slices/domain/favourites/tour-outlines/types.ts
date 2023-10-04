import { TourOutlineModel } from "~/models/domain/favourites/tourOutline";

export enum TourOutlineErrorType {
  RESPONSE_ERROR = 1,
}

export interface TourOutlineState {
  toursOutlines: TourOutlineModel[];
  loading: boolean;
  error: TourOutlineErrorType | null;
  tourOutlineQueryParam?: string;
}
