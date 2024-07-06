export enum ApiKeyErrorType {
  RESPONSE_ERROR = 1,
}

export interface ApiKeyState {
  apiKey: string;
  userId: string;
  password: string;
  remember_me: boolean;
  loading: boolean;
  error: ApiKeyErrorType | null;
}

export enum ApiKeyVeficationStatus {
  VALID,
  INVALID,
  NOT_FOUND,
}
