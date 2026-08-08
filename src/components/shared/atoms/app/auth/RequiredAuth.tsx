import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { PATHS } from '~/constants';
import { AppUserModel } from '~/models/app/user/user.model';

export enum AuthorizationStates {
  ALLOWED,
  UNAUTHORIZED_AND_LOGGED_USER,
  UNAUTHORIZED_AND_UNLOGGED_USER,
}

export interface AllowedEntityRole {
  entityName: string;
  allowedEntityInstances?: AllowedEntityInstanceRole[];
  checkCurrentProfileInfo?: boolean;
}

export interface AllowedEntityInstanceRole {
  entityInstanceId: string;
  allowedRoles?: string[];
}

export function validateUserAuthorization(
  user: AppUserModel,
  allowedRoles?: AllowedEntityRole[],
  requiredSession: boolean = false,
  name: string = ''
): AuthorizationStates {
  let authorizationResult = AuthorizationStates.UNAUTHORIZED_AND_UNLOGGED_USER;

  const shouldVerifyUserAuthorization = requiredSession || (allowedRoles && allowedRoles.length);

  if (!shouldVerifyUserAuthorization) {
    authorizationResult = AuthorizationStates.ALLOWED;
  } else {
    if (user && !!user?.id) {
      let isAllowed =
        !allowedRoles ||
        !allowedRoles.length ||
        allowedRoles.find((allowedRole) => {
          if (allowedRole?.allowedEntityInstances && allowedRole.allowedEntityInstances.length) {
            const currentProfileInfo = user.currentProfileInfo;
            return !!allowedRole.allowedEntityInstances.find(
              (instance) =>
                instance.entityInstanceId === currentProfileInfo?.identifier ||
                instance.entityInstanceId === currentProfileInfo?.id
            );
          }

          const shouldCheckCurrentProfile = allowedRole.checkCurrentProfileInfo !== undefined
            ? allowedRole.checkCurrentProfileInfo
            : checkCurrentProfileInfo;

          if (shouldCheckCurrentProfile) {
            const currentProfileEntityName = getModelInfoFromClassName(user.currentProfileInfo?.entity)?.entityName;
            return currentProfileEntityName === allowedRole.entityName;
          }

          return !!user.roles.find((userRoles) => userRoles.entityName === allowedRole.entityName);
        });

      if (isAllowed) {
        authorizationResult = AuthorizationStates.ALLOWED;
      } else {
        authorizationResult = AuthorizationStates.UNAUTHORIZED_AND_LOGGED_USER;
      }
    }
  }
  return authorizationResult;
}

export interface RequireAuthParameters {
  children: any;
  allowedRoles?: AllowedEntityRole[];
  requiredSession?: boolean;
  name?: string;
}

export const RequireAuthComponent = (props: RequireAuthParameters) => {
  const { children, allowedRoles, requiredSession, name } = props;
  const loggedUser = useSelector(selectCurrentUser);
  const authAppUser: AppUserModel = loggedUser;

  let nextPage;

  const authResult = validateUserAuthorization(authAppUser, allowedRoles, requiredSession, name);

  switch (authResult) {
    case AuthorizationStates.ALLOWED:
      // User is allowed to access by role
      nextPage = children;
      break;

    default:
      // The user is not logged in
      nextPage = <></>;
      break;
  }
  return nextPage;
};

export const RequireAuthPageNavigation = ({ allowedRoles = [] }) => {
  const loggedUser = useSelector(selectCurrentUser);
  const authAppUser: AppUserModel = loggedUser;
  const location = useLocation();

  let nextPage;

  const authResult = validateUserAuthorization(authAppUser, allowedRoles);

  switch (authResult) {
    case AuthorizationStates.ALLOWED:
      // User is allowed to access by role
      nextPage = <Outlet />;
      break;

    case AuthorizationStates.UNAUTHORIZED_AND_LOGGED_USER:
      // User is not allowed by role
      nextPage = <Navigate to={PATHS.REDIRECT_UNAUTHORIZED_AND_LOGGED_USER} state={{ from: location }} replace />;
      break;

    default:
      // The user is not logged in
      nextPage = <Navigate to={PATHS.REDIRECT_UNAUTHORIZED_AND_UNLOGGED_USER} state={{ from: location }} replace />;
      break;
  }
  return nextPage;
};
