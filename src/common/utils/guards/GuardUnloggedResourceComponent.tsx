import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { getStoredUserIdToken } from '~/common/slices/app-base/APIKey/saga';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { PATHS } from '~/constants';
import {
  hasUnloggedAvailableQuota,
  registerResourceViewUsage,
  registerSearchTermUsage
} from './unloggedServicesGuard';

export interface GuardUnloggedResourceParams {
  searchTerm?: string;
  entityType?: string;
  resourceId?: string;
  children: any;
}

export const GuardUnloggedResourceComponent = (props: GuardUnloggedResourceParams) => {
  const { entityType, resourceId, children, searchTerm } = props;
  const loggedUser = useSelector(selectCurrentUser);

  const isAuthResolved = !!getStoredUserIdToken() === !!loggedUser;

  const isAllowed =
    !!loggedUser ||
    !resourceId ||
    hasUnloggedAvailableQuota();

  useEffect(() => {
    if (isAuthResolved && !loggedUser && resourceId && isAllowed) {
      if (!!entityType) {
        registerResourceViewUsage({ entityType, id: resourceId });
      } else if (!!searchTerm) {
        registerSearchTermUsage(searchTerm);
      }
    }
  }, [isAuthResolved, loggedUser, entityType, resourceId, isAllowed]);

  if (!isAuthResolved) {
    return null;
  }

  if (!isAllowed) {
    return <Navigate to={`/${PATHS.LOGIN}`} replace />;
  }

  return <>{children}</>;
};
