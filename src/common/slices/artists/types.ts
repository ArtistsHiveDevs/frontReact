import { ArtistModel, ArtistTemplate } from '~/models/domain/artist/artist.model';

export enum ArtistErrorType {
  RESPONSE_ERROR = 1,
}

export interface ArtistState {
  artists: ArtistModel[] | [];
  loading: boolean;
  error: ArtistErrorType | null;
  artistsQueryParams?: string;
  queriedArtists?: ArtistModel[] | [];
  queriedId?: string;
  newArtistRQ: ArtistTemplate;
  createdArtist: ArtistTemplate;
  detailedArtists?: { [artistId: string]: ArtistModel };
}
