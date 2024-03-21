import { AppUserModel } from '~/models/app/user/user.model';

export enum UserErrorType {
  RESPONSE_ERROR = 1,
}

export interface UserState {
  users: AppUserModel[] | [];
  loading: boolean;
  error: UserErrorType | null;
}
