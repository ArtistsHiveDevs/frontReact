import { createContext, ReactNode, useEffect, useState } from "react";
import { UNLOGGED_USER } from "~/models/app/user/user.model";

export const AuthContext = createContext({});

interface AuthProviderProps {
  children?: ReactNode;
  // any props that come into the component
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState(UNLOGGED_USER);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
