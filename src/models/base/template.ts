import { VerificationStatus } from '~/constants';
import { PlaceModel } from '../domain/place/place.model';

export interface Template {
  fetchTimestamp?: number;
  username?: string;
  shortId?: string;
}

export interface EntityTemplate extends Template {
  id?: string;
}

export interface ProfileTemplate extends EntityTemplate {
  username?: string;
  profile_pic?: string;
}

export interface ObjectValueTemplate extends Template {}

export interface LocatableTemplate extends Template {
  latLng: { lat: number; lng: number };
}

export interface SearchableTemplate extends EntityTemplate {
  identifier?: string;
  profile_pic?: string;
  name: string;
  subtitle?: string;
  description?: string;
  cityWithCountry?: string;
  country?: string | { name: string; alpha2: string };
  place?: PlaceModel;
  verified_status?: VerificationStatus;
}

export interface ThumbnailableTemplate {
  avatarURL(): string | Promise<string>;
}

export interface SearchableProfileTemplate extends SearchableTemplate, ThumbnailableTemplate {}

export function isSearchableEntity(object: any): object is SearchableTemplate {
  return 'name' in object && 'profile_pic' in object;
}

export function isLocableEntity(object: any): object is LocatableTemplate {
  return 'latLng' in object;
}
