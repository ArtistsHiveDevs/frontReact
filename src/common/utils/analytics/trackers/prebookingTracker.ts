// Prebooking Analytics Tracker
// Track all prebooking-related events

import { logEvent } from '../analytics';

/**
 * Track prebooking creation start
 */
export const trackPrebookingCreateStart = (params: {
  viewerUserId: string;
  viewerProfileId: string;
  targetProfiles?: string; // e.g., "Artist Name + Place Name"
}) => {
  const { viewerUserId, viewerProfileId, targetProfiles } = params;

  const label = targetProfiles || 'New Prebooking';

  logEvent('prebooking_create_start', 'Prebooking', label, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'prebooking_create_start', {
      event_category: 'Prebooking',
      event_label: label,
      viewer_user_id: viewerUserId,
      viewer_profile_id: viewerProfileId,
    });
  }
};

/**
 * Track prebooking creation complete
 */
export const trackPrebookingCreateComplete = (params: {
  prebookingId: string;
  eventName: string;
  creatorUserId: string;
  creatorProfileId: string;
  participantsCount: number;
  flexibleDates: boolean;
}) => {
  const { prebookingId, eventName, creatorUserId, creatorProfileId, participantsCount, flexibleDates } = params;

  logEvent('prebooking_create_complete', 'Prebooking', eventName, participantsCount);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'prebooking_create_complete', {
      event_category: 'Prebooking',
      event_label: eventName,
      prebooking_id: prebookingId,
      creator_user_id: creatorUserId,
      creator_profile_id: creatorProfileId,
      participants_count: participantsCount,
      flexible_dates: flexibleDates,
    });
  }
};

/**
 * Track prebooking creation abandon
 */
export const trackPrebookingCreateAbandon = (params: {
  viewerUserId: string;
  viewerProfileId: string;
  stepAbandoned?: string; // e.g., 'participant_selection', 'date_selection', 'details'
}) => {
  const { viewerUserId, viewerProfileId, stepAbandoned } = params;

  const label = stepAbandoned ? `Abandoned at: ${stepAbandoned}` : 'Abandoned';

  logEvent('prebooking_create_abandon', 'Prebooking', label, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'prebooking_create_abandon', {
      event_category: 'Prebooking',
      event_label: label,
      viewer_user_id: viewerUserId,
      viewer_profile_id: viewerProfileId,
      step_abandoned: stepAbandoned,
    });
  }
};

/**
 * Track prebooking response (accept/reject/pending)
 */
export const trackPrebookingResponse = (params: {
  prebookingId: string;
  eventName: string;
  responderUserId: string;
  responderProfileId: string;
  responseStatus: 'accepted' | 'rejected' | 'pending';
}) => {
  const { prebookingId, eventName, responderUserId, responderProfileId, responseStatus } = params;

  logEvent('prebooking_response', 'Prebooking', `${eventName} - ${responseStatus}`, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'prebooking_response', {
      event_category: 'Prebooking',
      event_label: `${eventName} - ${responseStatus}`,
      prebooking_id: prebookingId,
      responder_user_id: responderUserId,
      responder_profile_id: responderProfileId,
      response_status: responseStatus,
    });
  }
};

/**
 * Track prebooking view
 */
export const trackPrebookingView = (params: {
  prebookingId?: string;
  eventName?: string;
  viewerUserId: string;
  viewerProfileId: string;
  viewMode?: 'list' | 'detail' | 'cards' | 'table';
}) => {
  const { prebookingId, eventName, viewerUserId, viewerProfileId, viewMode } = params;

  const label = eventName || 'Prebookings List';

  logEvent('prebooking_view', 'Prebooking', label, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'prebooking_view', {
      event_category: 'Prebooking',
      event_label: label,
      prebooking_id: prebookingId,
      viewer_user_id: viewerUserId,
      viewer_profile_id: viewerProfileId,
      view_mode: viewMode,
    });
  }
};

/**
 * Track prebooking filter application
 */
export const trackPrebookingFilter = (params: {
  filterType: 'status' | 'my_approval' | 'date' | 'search' | 'sort';
  filterValue: string;
}) => {
  const { filterType, filterValue } = params;

  logEvent('prebooking_filter', 'Prebooking', `${filterType}: ${filterValue}`, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'prebooking_filter', {
      event_category: 'Prebooking',
      event_label: `${filterType}: ${filterValue}`,
      filter_type: filterType,
      filter_value: filterValue,
    });
  }
};

/**
 * Track prebooking status change
 */
export const trackPrebookingStatusChange = (params: {
  prebookingId: string;
  eventName: string;
  oldStatus: string;
  newStatus: string;
  changedByUserId: string;
}) => {
  const { prebookingId, eventName, oldStatus, newStatus, changedByUserId } = params;

  logEvent('prebooking_status_change', 'Prebooking', `${eventName}: ${oldStatus} → ${newStatus}`, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'prebooking_status_change', {
      event_category: 'Prebooking',
      event_label: `${eventName}: ${oldStatus} → ${newStatus}`,
      prebooking_id: prebookingId,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by_user_id: changedByUserId,
    });
  }
};

/**
 * CONVERSION: Track fully accepted prebooking
 */
export const trackPrebookingAccepted = (params: {
  prebookingId: string;
  eventName: string;
  participantsCount: number;
  daysToAccept?: number;
}) => {
  const { prebookingId, eventName, participantsCount, daysToAccept } = params;

  logEvent('conversion_prebooking_accepted', 'Conversion', eventName, participantsCount);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'conversion_prebooking_accepted', {
      event_category: 'Conversion',
      event_label: eventName,
      prebooking_id: prebookingId,
      participants_count: participantsCount,
      days_to_accept: daysToAccept,
      value: participantsCount * 10, // Assign value to conversion
    });
  }
};
