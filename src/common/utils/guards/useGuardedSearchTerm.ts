import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { useDebouncedSearchTerm } from '~/common/utils/hooks/search/useDebouncedSearchTerm';
import { PATHS } from '~/constants';
import { hasSearchQuotaAvailable, hasUnloggedAvailableQuota, registerSearchTermUsage } from './unloggedServicesGuard';

// Solo para SearchPage: limita a 3 términos únicos por día a usuarios no logueados. El buscador del navbar usa useDebouncedSearchTerm directo, sin este límite.
export function useGuardedSearchTerm(term: string, onSearch: (term: string) => void) {
  const loggedUser = useSelector(selectCurrentUser);
  const { navigateToInnerPath } = useNavigation();

  useDebouncedSearchTerm(term, (settledTerm) => {
    if (!loggedUser && !hasUnloggedAvailableQuota() && !hasSearchQuotaAvailable(settledTerm)) {
      navigateToInnerPath({ path: PATHS.LOGIN });
      return;
    }
    if (!loggedUser) {
      registerSearchTermUsage(settledTerm);
    }
    onSearch(settledTerm);
  });
}
