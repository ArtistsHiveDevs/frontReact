import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "~/common/utils/hooks/auth/useAuth";
import { PATHS } from "~/constants";
import { AppUserModel } from "~/models/app/user/user.model";

export const RequireAuth = ({ allowedRoles = [] }) => {
  const { auth } = useAuth();
  const authAppUser: AppUserModel = auth;
  const { location } = useLocation();

  let nextPage;

  if (authAppUser && !!authAppUser?.id) {
    if (true) {
      // User is allowed to access by role
      nextPage = <Outlet />;
    } else {
      // User is not allowed by role
      nextPage = (
        <Navigate
          to={PATHS.REDIRECT_UNAUTHORIZED_AND_LOGGED_USER}
          state={{ from: location }}
          replace
        />
      );
    }
  } else {
    // The user is not logged in
    nextPage = (
      <Navigate
        to={PATHS.REDIRECT_UNAUTHORIZED_AND_UNLOGGED_USER}
        state={{ from: location }}
        replace
      />
    );
  }

  return nextPage;
};

export default RequireAuth;
