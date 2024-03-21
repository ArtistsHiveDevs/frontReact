import { ArtistModel } from '~/models/domain/artist/artist.model';

export enum ArtistErrorType {
  RESPONSE_ERROR = 1,
}

export interface ArtistState {
  artists: ArtistModel[] | [];
  loading: boolean;
  error: ArtistErrorType | null;
  artistsQueryParams?: string;
  queriedArtists?: ArtistModel[] | [];
}
