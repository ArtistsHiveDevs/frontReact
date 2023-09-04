import { VerificationStatus } from "~/constants";
import { PlaceModel } from "../domain/place/place.model";

interface Template {}

export interface EntityTemplate extends Template {
  id?: string;
}

export interface ObjectValueTemplate extends Template {}

export interface LocatableTemplate extends Template {
  latLng: { lat: number; lng: number };
}

export interface SearchableTemplate extends EntityTemplate {
  profile_pic?: string;
  name: string;
  subtitle?: string;
  description?: string;
  cityWithCountry?: string;
  country?: string;
  place?: PlaceModel;
  verified_status?: VerificationStatus;
}

export function isSearchableEntity(object: any): object is SearchableTemplate {
  return "name" in object && "profile_pic" in object;
}

export function isLocableEntity(object: any): object is LocatableTemplate {
  return "latLng" in object;
}
