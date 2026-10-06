import { VerificationStatus } from '~/constants';
import { ProfileActiveStatus, ProfileNature } from '~/constants/domain/profile.constants';
import { PlaceModel } from '../domain/place/place.model';

export interface Template {
  fetchTimestamp?: number;
  username?: string;
  shortId?: string;
}

/**
 * Campos comunes a los grants de acceso otorgados directamente por el recurso a un perfil
 * puntual (por `identifier`), independiente del rol normal del viewer.
 *
 * `fieldPaths` sigue la misma convención jerárquica que las keys de traducción
 * (`<subpage>.sections.<section>.attributes.<attribute>`, ver `getAttributeTitle`): un grant
 * aplica a ese path exacto y a cualquier path que cuelgue de él (prefijo + '.'), así que un path
 * corto como 'documents' habilita todo lo que esté debajo de esa subpage/sección. Si se omite,
 * el grant aplica a todo el recurso.
 */
interface AccessGrantBase {
  identifier: string;
  expiresAt: string;
  fieldPaths?: string[];
  reason?: string;
}

/**
 * Acceso temporal (ej. un Place viendo los documentos de un Artist mientras dura una
 * postulación a un Open Call). Vence con el evento/convocatoria que lo originó.
 */
export interface TemporaryAccessGrant extends AccessGrantBase {}

/**
 * Acceso de confianza más duradero (ej. 1 año), asociado a uno o más roles del recurso
 * (`OWNER`, `MANAGER`, `MUSICIAN`, `BOOKER`, ...). Igual que `TemporaryAccessGrant`, puede
 * acotarse por `fieldPaths`; si se omite, aplica a todo el recurso.
 */
export interface TrustedInstanceGrant extends AccessGrantBase {
  roles: string[];
}

export interface EntityTemplate extends Template {
  id?: string;
  temporaryAccessInstances?: TemporaryAccessGrant[];
  trustedInstances?: TrustedInstanceGrant[];
}

export interface ProfileTemplate extends EntityTemplate {
  username?: string;
  run?: string;
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
