import { LocalStorageVariables } from '~/constants/localstorage';

// Límite de recursos únicos y de términos de búsqueda que un usuario no logueado puede consultar antes de forzar login.
const MAX_UNIQUE_VIEWED_RESOURCES = 3;
const MAX_UNIQUE_SEARCH_TERMS = 3;
const GUARD_PERIOD_MS = 24 * 60 * 60 * 1000;

export interface ViewedResourceReference {
  entityType: string;
  id: string;
}

export interface UnloggedServicesGuardState {
  periodStartedAt?: number;
  searchTerms: string[];
  viewedResources: ViewedResourceReference[];
}

const EMPTY_GUARD_STATE: UnloggedServicesGuardState = {
  periodStartedAt: undefined,
  searchTerms: [],
  viewedResources: [],
};

function isPeriodExpired(periodStartedAt: number | undefined): boolean {
  if (!periodStartedAt) {
    return true;
  }
  return Date.now() - periodStartedAt >= GUARD_PERIOD_MS;
}

function getGuardState(): UnloggedServicesGuardState {
  const rawState = localStorage.getItem(LocalStorageVariables.GUARD_UNLOGGED_SERVICES);
  if (!rawState) {
    return { ...EMPTY_GUARD_STATE };
  }
  try {
    const parsedState = JSON.parse(rawState);
    if (isPeriodExpired(parsedState?.periodStartedAt)) {
      return { ...EMPTY_GUARD_STATE };
    }
    return {
      periodStartedAt: parsedState.periodStartedAt,
      searchTerms: Array.isArray(parsedState?.searchTerms) ? parsedState.searchTerms : [],
      viewedResources: Array.isArray(parsedState?.viewedResources) ? parsedState.viewedResources : [],
    };
  } catch {
    return { ...EMPTY_GUARD_STATE };
  }
}

function saveGuardState(state: UnloggedServicesGuardState) {
  const stateToSave: UnloggedServicesGuardState = {
    ...state,
    periodStartedAt: state.periodStartedAt || Date.now(),
  };
  localStorage.setItem(LocalStorageVariables.GUARD_UNLOGGED_SERVICES, JSON.stringify(stateToSave));
}

export function resetUnloggedServicesGuard() {
  localStorage.removeItem(LocalStorageVariables.GUARD_UNLOGGED_SERVICES);
}

export function hasUnloggedAvailableQuota() {
  const { searchTerms, viewedResources } = getGuardState();
  return viewedResources.length <= MAX_UNIQUE_VIEWED_RESOURCES && searchTerms.length <= MAX_UNIQUE_SEARCH_TERMS;
}

export function hasSearchQuotaAvailable(searchTerm?: string): boolean {
  const { searchTerms } = getGuardState();
  return searchTerms.length < MAX_UNIQUE_SEARCH_TERMS || (!!searchTerm && searchTerms.includes(searchTerm));
}

export function registerSearchTermUsage(searchTerm: string) {
  const state = getGuardState();
  if (!state.searchTerms.includes(searchTerm)) {
    state.searchTerms.push(searchTerm);
    saveGuardState(state);
  }
}

function isSameViewedResource(a: ViewedResourceReference, b: ViewedResourceReference): boolean {
  return a.entityType === b.entityType && a.id === b.id;
}

export function hasResourceViewQuotaAvailable(resource: ViewedResourceReference): boolean {
  const { viewedResources } = getGuardState();
  return (
    viewedResources.length < MAX_UNIQUE_VIEWED_RESOURCES ||
    (!!resource && viewedResources.some((viewed) => isSameViewedResource(viewed, resource)))
  );
}

export function registerResourceViewUsage(resource: ViewedResourceReference) {
  const state = getGuardState();
  if (!state.viewedResources.some((viewed) => isSameViewedResource(viewed, resource))) {
    state.viewedResources.push(resource);
    saveGuardState(state);
  }
}
