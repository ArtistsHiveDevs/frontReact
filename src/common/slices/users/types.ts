import { UsernameAvailabilityStatus } from '~/constants/app.constants';
import { AppUserModel } from '~/models/app/user/user.model';

export enum UserErrorType {
  RESPONSE_ERROR = 1,
}

export interface ClaimFeedback {
  alreadyRequested: boolean;
  message?: string;
}

export interface UserState {
  users: AppUserModel[] | [];
  currentUser: AppUserModel;
  newUserRQInfo: {username:string, sub:string};
  usernameForAvailabilityCheck: string;
  usernameAvailabilityResult: UsernameAvailabilityStatus;
  loading: boolean;
  error: UserErrorType | null;
  claimFeedback: ClaimFeedback | null;
}
