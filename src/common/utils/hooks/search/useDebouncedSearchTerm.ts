import { useEffect } from 'react';
import { DEBOUNCE_MS } from '~/constants/app.constants';

export function useDebouncedSearchTerm(term: string, onSearch: (term: string) => void) {
  useEffect(() => {
    if (!term) {
      return;
    }

    const debounceTimeoutId = setTimeout(() => onSearch(term), DEBOUNCE_MS);

    return () => clearTimeout(debounceTimeoutId);
  }, [term]);
}
