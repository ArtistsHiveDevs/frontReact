import { createContext, ReactNode, useEffect, useState } from "react";
import { AppUserModel, UNLOGGED_USER } from "~/models/app/user/user.model";

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
  const [auth, setAuth] = useState<AppUserModel>(UNLOGGED_USER);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
