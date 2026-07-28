// Search Analytics Tracker
// Track all search-related events

import { logEvent } from '../analytics';
import { EntityType } from '../events';

/**
 * Track search performed
 */
export const trackSearch = (params: {
  searchTerm: string;
  entityType?: EntityType.ARTIST | EntityType.PLACE;
  resultsCount?: number;
}) => {
  const { searchTerm, entityType, resultsCount } = params;

  const label = entityType ? `${searchTerm} (${entityType})` : searchTerm;

  logEvent('search', 'Search', label, resultsCount);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'search', {
      event_category: 'Search',
      event_label: label,
      search_term: searchTerm,
      entity_type: entityType,
      results_count: resultsCount,
    });
  }
};

/**
 * Track search result click
 */
export const trackSearchResultClick = (params: {
  searchTerm: string;
  resultName: string;
  entityType: EntityType.ARTIST | EntityType.PLACE;
  profileId: string;
  resultPosition: number;
}) => {
  const { searchTerm, resultName, entityType, profileId, resultPosition } = params;

  logEvent('search_result_click', 'Search', `${resultName} (${searchTerm})`, resultPosition);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'search_result_click', {
      event_category: 'Search',
      event_label: resultName,
      search_term: searchTerm,
      entity_type: entityType,
      profile_id: profileId,
      result_position: resultPosition,
    });
  }
};

/**
 * Track filter application in search
 */
export const trackSearchFilterApply = (params: { filterType: string; filterValue: string }) => {
  const { filterType, filterValue } = params;

  logEvent('search_filter_apply', 'Search', `${filterType}: ${filterValue}`, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'search_filter_apply', {
      event_category: 'Search',
      event_label: `${filterType}: ${filterValue}`,
      filter_type: filterType,
      filter_value: filterValue,
    });
  }
};

/**
 * Track search with no results
 */
export const trackSearchNoResults = (params: {
  searchTerm: string;
  entityType?: EntityType.ARTIST | EntityType.PLACE;
}) => {
  const { searchTerm, entityType } = params;

  const label = entityType ? `${searchTerm} (${entityType})` : searchTerm;

  logEvent('search_no_results', 'Search', label, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'search_no_results', {
      event_category: 'Search',
      event_label: label,
      search_term: searchTerm,
      entity_type: entityType,
    });
  }
};
