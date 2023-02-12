import { VerificationStatus } from "~/constants";

interface Template {}

export interface EntityTemplate extends Template {
  id?: string;
}

export interface ObjectValueTemplate extends Template {}

export interface SearchableTemplate extends EntityTemplate {
  profile_pic?: string;
  name: string;
  subtitle?: string;
  cityWithCountry?: string;
  verified_status?: VerificationStatus;
}
