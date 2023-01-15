import { createContext, ReactNode, useState } from "react";
import { crearDummyUser } from "~/components/Pages/app-base/SettingsPage/dummy-users.mock";
import { AppUserModel } from "~/models/app/user/user.model";

export interface AuthContextParams {
  auth?: AppUserModel;
  setAuth?: Function;
}
export const AuthContext = createContext<AuthContextParams>({});

interface AuthProviderProps {
  children?: ReactNode;
  // any props that come into the component
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AppUserModel>(crearDummyUser(4));

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
