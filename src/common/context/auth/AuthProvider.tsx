import { createContext, ReactNode, useState } from 'react';
import { AppUserModel, UNLOGGED_USER } from '~/models/app/user/user.model';
import { EntityModel, EntityTemplate } from '~/models/base';

export enum LoggedUserEntity {
  USER = 'User',
  ARTIST = 'Artist',
  PLACE = 'Place',
}
export interface LoggedUserProfile {
  entityName: LoggedUserEntity;
  entityInstanceId: string;
}
export interface AuthContextParams {
  // Getters
  loggedUser?: AppUserModel;
  currentUserProfile?: LoggedUserProfile;
  loggedUserProfile?: EntityModel<EntityTemplate>;

  // Setters
  setLoggedUser?: Function;
  setCurrentUserProfile?: Function;
}
export const AuthContext = createContext<AuthContextParams>({});

interface AuthProviderProps {
  children?: ReactNode;
  // any props that come into the component
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedUser, setLoggedUser] = useState<AppUserModel>(UNLOGGED_USER);
  const [currentUserProfile, setCurrentUserProfile] = useState<LoggedUserProfile>(undefined);
  const [loggedUserProfile] = useState<EntityModel<EntityTemplate>>(UNLOGGED_USER);

  return (
    <AuthContext.Provider
      value={{
        loggedUser,
        currentUserProfile,
        loggedUserProfile,
        setLoggedUser,
        setCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
