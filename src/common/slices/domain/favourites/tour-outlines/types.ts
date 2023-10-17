import { TourOutlineModel } from "~/models/domain/favourites/tourOutline";

export enum TourOutlineErrorType {
  RESPONSE_ERROR = 1,
}

export interface TourOutlineState {
  toursOutlines: TourOutlineModel[];
  detailedTourOutline: TourOutlineModel;
  loading: boolean;
  error: TourOutlineErrorType | null;
  userOwner?: string;
  detailTourOutlineId?: string;
}
