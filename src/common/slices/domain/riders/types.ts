import { ArtistRiderModel } from "~/models/domain/rider/rider.model";

export enum RiderErrorType {
  RESPONSE_ERROR = 1,
}

export interface RiderState {
  riders: ArtistRiderModel[] | [];
  loading: boolean;
  error: RiderErrorType | null;
  ridersQueryParams: string;
  queriedRiders: ArtistRiderModel[] | [];
}
