export enum ApiKeyErrorType {
  RESPONSE_ERROR = 1,
}

export interface ErrorType {
  errorType: ApiKeyErrorType;
  error: any;
}

export interface ApiKeyState {
  apiKey: string;
  userId: string;
  password: string;
  remember_me: boolean;
  loading: boolean;
  error: ApiKeyErrorType | null;
  errorContent: any;
}

export enum ApiKeyVeficationStatus {
  VALID,
  INVALID,
  NOT_FOUND,
}

export interface ApiKeyPayload {
  userId?: string;
  password: string;
  remember_me: boolean;
}

export interface ApiKeyResponse {
  apiKey: string;
}
