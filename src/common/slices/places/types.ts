import { PlaceModel } from '~/models/domain/place/place.model';

export enum PlaceErrorType {
  RESPONSE_ERROR = 1,
}

export interface PlaceState {
  places: PlaceModel[] | [];
  loading: boolean;
  error: PlaceErrorType | null;
  placesQueryParams: string;
  queriedPlaces: PlaceModel[] | [];
}
