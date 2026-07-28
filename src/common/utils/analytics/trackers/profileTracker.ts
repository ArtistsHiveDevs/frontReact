// Profile Analytics Tracker
// Track all profile-related events (Artist, Place, Academy)

import { logEvent } from '../analytics';
import {
  EntityType,
  ProfileContactClickEvent,
  ProfileLinkClickEvent,
  ProfileMediaViewEvent,
  ProfileShareEvent,
  ProfileTabViewEvent,
  ProfileViewEvent,
} from '../events';

/**
 * Track profile view
 *
 * IMPORTANT: This sends viewer information to GA4.
 * Make sure viewer IDs are anonymized/hashed and comply with privacy laws.
 */
export const trackProfileView = (params: {
  profileId: string;
  profileName: string;
  entityType: EntityType.ARTIST | EntityType.PLACE | EntityType.ACADEMY;
  viewerUserId?: string;
  viewerProfileId?: string;
  tab?: string;
  pagePath?: string;
}) => {
  const { profileId, profileName, entityType, viewerUserId, viewerProfileId, tab, pagePath } = params;

  const label = tab ? `${profileName} - ${tab}` : profileName;

  // Legacy event for backwards compatibility
  logEvent('profile_view', 'Profile', label, undefined);

  // Send structured event to GA4 with custom parameters
  // These will be available as custom dimensions once configured in GA4
  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'profile_view', {
      // Standard parameters
      event_category: 'Profile',
      event_label: label,

      // Custom parameters (configure as custom dimensions in GA4)
      entity_type: entityType,
      entity_id: profileId,
      entity_name: profileName,
      viewer_user_id: viewerUserId || 'anonymous',
      viewer_profile_id: viewerProfileId || 'none',
      tab: tab || 'main',
      page_path: pagePath || window.location.pathname,

      // Add timestamp for time-based analysis
      view_timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Track profile tab change/view
 */
export const trackProfileTabView = (params: {
  profileId: string;
  profileName: string;
  entityType: EntityType.ARTIST | EntityType.PLACE;
  tab: string;
}) => {
  const { profileId, profileName, entityType, tab } = params;

  logEvent('profile_tab_view', 'Profile', `${profileName} - ${tab}`, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'profile_tab_view', {
      event_category: 'Profile',
      event_label: `${profileName} - ${tab}`,
      entity_type: entityType,
      profile_id: profileId,
      tab: tab,
    });
  }
};

/**
 * Track contact button click
 */
export const trackProfileContactClick = (params: {
  profileId: string;
  profileName: string;
  entityType: EntityType.ARTIST | EntityType.PLACE;
  contactMethod: 'email' | 'phone' | 'whatsapp' | 'other';
}) => {
  const { profileId, profileName, entityType, contactMethod } = params;

  logEvent('profile_contact_click', 'Profile', `${profileName} - ${contactMethod}`, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'profile_contact_click', {
      event_category: 'Profile',
      event_label: `${profileName} - ${contactMethod}`,
      entity_type: entityType,
      profile_id: profileId,
      contact_method: contactMethod,
    });
  }
};

/**
 * Track profile share
 */
export const trackProfileShare = (params: {
  profileId: string;
  profileName: string;
  entityType: EntityType.ARTIST | EntityType.PLACE;
  shareMethod: 'copy_link' | 'facebook' | 'twitter' | 'whatsapp' | 'other';
}) => {
  const { profileId, profileName, entityType, shareMethod } = params;

  logEvent('profile_share', 'Profile', `${profileName} - ${shareMethod}`, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'profile_share', {
      event_category: 'Profile',
      event_label: `${profileName} - ${shareMethod}`,
      entity_type: entityType,
      profile_id: profileId,
      share_method: shareMethod,
    });
  }
};

/**
 * Track media view (photo, video, audio)
 */
export const trackProfileMediaView = (params: {
  profileId: string;
  profileName: string;
  entityType: EntityType.ARTIST | EntityType.PLACE;
  mediaType: 'photo' | 'video' | 'audio';
  mediaIndex?: number;
}) => {
  const { profileId, profileName, entityType, mediaType, mediaIndex } = params;

  const label = mediaIndex !== undefined ? `${profileName} - ${mediaType} #${mediaIndex}` : `${profileName} - ${mediaType}`;

  logEvent('profile_media_view', 'Profile', label, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'profile_media_view', {
      event_category: 'Profile',
      event_label: label,
      entity_type: entityType,
      profile_id: profileId,
      media_type: mediaType,
      media_index: mediaIndex,
    });
  }
};

/**
 * Track external link click
 */
export const trackProfileLinkClick = (params: {
  profileId: string;
  profileName: string;
  entityType: EntityType.ARTIST | EntityType.PLACE;
  linkType: 'website' | 'instagram' | 'facebook' | 'youtube' | 'spotify' | 'other';
}) => {
  const { profileId, profileName, entityType, linkType } = params;

  logEvent('profile_link_click', 'Profile', `${profileName} - ${linkType}`, undefined);

  if ((window as any)?.gtag) {
    (window as any).gtag('event', 'profile_link_click', {
      event_category: 'Profile',
      event_label: `${profileName} - ${linkType}`,
      entity_type: entityType,
      profile_id: profileId,
      link_type: linkType,
    });
  }
};
