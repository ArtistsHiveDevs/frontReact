export enum ProfileErrorType {
  RESPONSE_ERROR = 1,
}

export interface ProfileState {
  loading: boolean;
  error: ProfileErrorType | null;
}
