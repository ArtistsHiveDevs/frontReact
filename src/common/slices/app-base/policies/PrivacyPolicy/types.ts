import { PrivacyPolicyModel } from "~/models/app/policies/privacy/PrivacyPolicy.model";

export enum PrivacyPolicyErrorType {
  RESPONSE_ERROR = 1,
}

export interface PrivacyPolicyState {
  queriedTermsVersion: string;
  policy: PrivacyPolicyModel;
  loading: boolean;
  error: PrivacyPolicyErrorType | null;
}
