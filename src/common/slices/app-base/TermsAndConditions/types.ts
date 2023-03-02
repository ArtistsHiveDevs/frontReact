import { TermsAndConditionsModel } from "~/models/app/termsAndConditions/TermsAndConditions.model";

export enum TermsAndConditionsErrorType {
  RESPONSE_ERROR = 1,
}

export interface TermsAndConditionsState {
  queriedTermsVersion: string;
  terms: TermsAndConditionsModel;
  loading: boolean;
  error: TermsAndConditionsErrorType | null;
}
