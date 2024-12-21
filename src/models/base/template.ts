import { VerificationStatus } from '~/constants';
import { ProfileActiveStatus, ProfileNature } from '~/constants/domain/profile.constants';
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

  isClaimedProfile?: boolean;

  is_active?: ProfileActiveStatus;

  nature?: ProfileNature;

  isFollowedByCurrentProfile?: boolean;
  followed_profiles?: FollowerProfileTemplate[];
  followed_by?: FollowerProfileTemplate[];
}

export interface ObjectValueTemplate extends Template {}

export interface LocatableTemplate extends Template {
  identifier?: string;
  name?: string;
  profile_pic?: string;
  latLng: { lat: number; lng: number };
}

export interface LocationTemplate {
  country_name?: string;
  country_alpha2?: string;
  country_alpha3?: string;
  state?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  locationPrecision?: string;
}
export interface SearchableTemplate extends EntityTemplate {
  identifier?: string;
  profile_pic?: string;
  name: string;
  subtitle?: string;
  description?: string;
  cityWithCountry?: string;
  country?: string | { name: string; alpha2: string };
  location?: string | LocationTemplate[];
  place?: PlaceModel;
  verified_status?: VerificationStatus;
  activity?: string;
}

export interface ThumbnailableTemplate {
  avatarURL(): string | Promise<string>;
}

export interface SearchableProfileTemplate extends SearchableTemplate, ThumbnailableTemplate {}

export function isSearchableEntity(object: any): object is SearchableTemplate {
  return 'name' in object; // && 'profile_pic' in object;
}

export function isLocableEntity(object: any): object is LocatableTemplate {
  return 'latLng' in object;
}

export interface FollowerProfileTemplate {
  entityType: string;
  id: string;
  identifier?: string;
  name?: string;
  username?: string;
  profile_pic?: string;
  subtitle?: string;
  verified_status?: VerificationStatus;
}

export interface SocialNetworkUsernamesTemplate {
  website: string;
  email: string;
  mobile_phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  spotify: string;
  youtube: string;
  youtube_widget_id: string;
}
