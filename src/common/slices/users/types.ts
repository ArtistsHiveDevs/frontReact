import { UserNameAvailabilityStatus } from '~/constants/app.constants';
import { AppUserModel } from '~/models/app/user/user.model';

export enum UserErrorType {
  RESPONSE_ERROR = 1,
}

export interface UserState {
  users: AppUserModel[] | [];
  currentUser: AppUserModel;
  newUserRQInfo: {username:string, sub:string};
  usernameForAvailabilityCheck: string;
  usernameAvailabilityResult: UserNameAvailabilityStatus;
  loading: boolean;
  error: UserErrorType | null;
}
