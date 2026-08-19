// Google Analytics Event Definitions
// Centralized, typed event definitions for the application

/**
 * Event categories for organizing analytics events
 */
export enum EventCategory {
  PROFILE = 'Profile',
  SEARCH = 'Search',
  PREBOOKING = 'Prebooking',
  EVENT = 'Event',
  USER = 'User',
  NAVIGATION = 'Navigation',
  INTERACTION = 'Interaction',
  CONVERSION = 'Conversion',
}

/**
 * Entity types in the application (matches your existing entities)
 */
export enum EntityType {
  ARTIST = 'Artist',
  PLACE = 'Place',
  EVENT = 'Event',
  ACADEMY = 'Academy',
  RIDER = 'Rider',
  TOUR = 'Tour',
  USER = 'User',
}

/**
 * Page view context - derived from routes or specific functionality
 */
export interface PageViewContext {
  page_path: string; // Full URL path
  page_title: string; // Page title (auto-generated or custom)
  entity_type?: EntityType; // If viewing an entity profile
  entity_id?: string; // Entity identifier
  entity_name?: string; // Entity display name
  tab?: string; // Tab within a profile (info, media, contact, rider, stageplot, etc.)
  section?: string; // Section of the app (from PATHS enum)
  function?: string; // Specific functionality (create, edit, filter, etc.)
}

// ========== PROFILE EVENTS ==========

export interface ProfileViewEvent extends PageViewContext {
  category: EventCategory.PROFILE;
  action: 'profile_view';
  label: string; // Profile name
  entity_type: EntityType.ARTIST | EntityType.PLACE | EntityType.ACADEMY;
  entity_id: string;
  viewer_user_id?: string;
  viewer_profile_id?: string;
}

export interface ProfileContactClickEvent {
  category: EventCategory.PROFILE;
  action: 'profile_contact_click';
  label: string; // Profile name
  entity_type: EntityType.ARTIST | EntityType.PLACE;
  profile_id: string;
  contact_method: 'email' | 'phone' | 'whatsapp' | 'other';
}

export interface ProfileShareEvent {
  category: EventCategory.PROFILE;
  action: 'profile_share';
  label: string; // Profile name
  entity_type: EntityType.ARTIST | EntityType.PLACE;
  profile_id: string;
  share_method: 'copy_link' | 'facebook' | 'twitter' | 'whatsapp' | 'other';
}

export interface ProfileMediaViewEvent {
  category: EventCategory.PROFILE;
  action: 'profile_media_view';
  label: string; // Profile name
  entity_type: EntityType.ARTIST | EntityType.PLACE;
  profile_id: string;
  media_type: 'photo' | 'video' | 'audio';
  media_index?: number;
}

export interface ProfileLinkClickEvent {
  category: EventCategory.PROFILE;
  action: 'profile_link_click';
  label: string; // Profile name and link type
  entity_type: EntityType.ARTIST | EntityType.PLACE;
  profile_id: string;
  link_type: 'website' | 'instagram' | 'facebook' | 'youtube' | 'spotify' | 'other';
}

export interface ProfileTabViewEvent {
  category: EventCategory.PROFILE;
  action: 'profile_tab_view';
  label: string; // Profile name + tab name
  entity_type: EntityType.ARTIST | EntityType.PLACE;
  profile_id: string;
  tab: string; // e.g., 'info', 'media', 'contact', 'rider', 'stageplot', 'events'
}

// ========== SEARCH EVENTS ==========

export interface SearchEvent {
  category: EventCategory.SEARCH;
  action: 'search';
  label: string; // Search term
  search_term: string;
  entity_type?: EntityType.ARTIST | EntityType.PLACE;
  results_count?: number;
}

export interface SearchResultClickEvent {
  category: EventCategory.SEARCH;
  action: 'search_result_click';
  label: string; // Result name
  search_term: string;
  entity_type: EntityType.ARTIST | EntityType.PLACE;
  profile_id: string;
  result_position: number;
}

export interface SearchFilterApplyEvent {
  category: EventCategory.SEARCH;
  action: 'search_filter_apply';
  label: string; // Filter type
  filter_type: string;
  filter_value: string;
}

export interface SearchNoResultsEvent {
  category: EventCategory.SEARCH;
  action: 'search_no_results';
  label: string; // Search term
  search_term: string;
  entity_type?: EntityType.ARTIST | EntityType.PLACE;
}

// ========== PREBOOKING EVENTS ==========

export interface PrebookingCreateStartEvent {
  category: EventCategory.PREBOOKING;
  action: 'prebooking_create_start';
  label: string; // e.g., "Artist Name + Place Name"
  viewer_user_id: string;
  viewer_profile_id: string;
}

export interface PrebookingCreateCompleteEvent {
  category: EventCategory.PREBOOKING;
  action: 'prebooking_create_complete';
  label: string; // Event name
  prebooking_id: string;
  creator_user_id: string;
  creator_profile_id: string;
  participants_count: number;
  flexible_dates: boolean;
}

export interface PrebookingCreateAbandonEvent {
  category: EventCategory.PREBOOKING;
  action: 'prebooking_create_abandon';
  label: string;
  viewer_user_id: string;
  viewer_profile_id: string;
  step_abandoned?: string; // e.g., "participant_selection", "date_selection", "details"
}

export interface PrebookingResponseEvent {
  category: EventCategory.PREBOOKING;
  action: 'prebooking_response';
  label: string; // Event name
  prebooking_id: string;
  responder_user_id: string;
  responder_profile_id: string;
  response_status: 'accepted' | 'rejected' | 'pending';
}

export interface PrebookingViewEvent extends PageViewContext {
  category: EventCategory.PREBOOKING;
  action: 'prebooking_view';
  label: string; // Event name or list view
  prebooking_id?: string;
  viewer_user_id: string;
  viewer_profile_id: string;
  view_mode?: 'list' | 'detail' | 'cards' | 'table';
}

export interface PrebookingFilterEvent {
  category: EventCategory.PREBOOKING;
  action: 'prebooking_filter';
  label: string; // Filter description
  filter_type: 'status' | 'my_approval' | 'date' | 'search' | 'sort';
  filter_value: string;
}

export interface PrebookingStatusChangeEvent {
  category: EventCategory.PREBOOKING;
  action: 'prebooking_status_change';
  label: string; // Event name
  prebooking_id: string;
  old_status: string;
  new_status: string;
  changed_by_user_id: string;
}

// ========== EVENT EVENTS ==========

export interface EventViewEvent extends PageViewContext {
  category: EventCategory.EVENT;
  action: 'event_view';
  label: string; // Event name
  event_id: string;
  viewer_user_id?: string;
  viewer_profile_id?: string;
}

export interface EventInterestEvent {
  category: EventCategory.EVENT;
  action: 'event_interest';
  label: string; // Event name
  event_id: string;
  viewer_user_id: string;
  viewer_profile_id: string;
}

export interface EventShareEvent {
  category: EventCategory.EVENT;
  action: 'event_share';
  label: string; // Event name
  event_id: string;
  share_method: 'copy_link' | 'facebook' | 'twitter' | 'whatsapp' | 'other';
}

// ========== RIDER & STAGEPLOT EVENTS ==========

export interface RiderViewEvent extends PageViewContext {
  category: EventCategory.PROFILE;
  action: 'rider_view';
  label: string; // Rider name
  rider_id: string;
  entity_type: EntityType.RIDER;
  viewer_user_id?: string;
}

export interface StagePlotViewEvent extends PageViewContext {
  category: EventCategory.PROFILE;
  action: 'stageplot_view';
  label: string; // Stage plot name
  stageplot_id: string;
  viewer_user_id?: string;
}

export interface StagePlotEditEvent {
  category: EventCategory.PROFILE;
  action: 'stageplot_edit';
  label: string; // Stage plot name
  stageplot_id: string;
  editor_user_id: string;
}

// ========== USER EVENTS ==========

export interface UserLoginEvent {
  category: EventCategory.USER;
  action: 'login';
  label: string; // User identifier or name
  user_id: string;
  login_method?: 'email' | 'google' | 'facebook' | 'other';
}

export interface UserSignupEvent {
  category: EventCategory.USER;
  action: 'signup';
  label: string; // User identifier or name
  user_id: string;
  signup_method?: 'email' | 'google' | 'facebook' | 'other';
}

export interface ProfileSwitchEvent {
  category: EventCategory.USER;
  action: 'profile_switch';
  label: string; // New profile name
  user_id: string;
  from_profile_id: string;
  to_profile_id: string;
  to_profile_entity: EntityType.ARTIST | EntityType.PLACE;
}

// ========== NAVIGATION EVENTS ==========

export interface NavigationEvent {
  category: EventCategory.NAVIGATION;
  action: 'navigation';
  label: string; // Destination page
  from_path?: string;
  to_path: string;
}

export interface PageViewEvent extends PageViewContext {
  category: EventCategory.NAVIGATION;
  action: 'page_view';
  label: string; // Auto-generated from context
}

// ========== CONVERSION EVENTS ==========

export interface ConversionPrebookingAcceptedEvent {
  category: EventCategory.CONVERSION;
  action: 'conversion_prebooking_accepted';
  label: string; // Event name
  prebooking_id: string;
  participants_count: number;
  days_to_accept?: number; // Days from creation to full acceptance
}

export interface ConversionEventCreatedEvent {
  category: EventCategory.CONVERSION;
  action: 'conversion_event_created';
  label: string; // Event name
  event_id: string;
  from_prebooking_id?: string;
  participants_count: number;
}

export interface ConversionProfileCompleteEvent {
  category: EventCategory.CONVERSION;
  action: 'conversion_profile_complete';
  label: string; // Profile name
  profile_id: string;
  entity_type: EntityType.ARTIST | EntityType.PLACE;
  completion_percentage: 100; // Always 100 for this event
}

export interface ConversionProfileClaimEvent {
  category: EventCategory.CONVERSION;
  action: 'conversion_profile_claim';
  label: string; // Profile name
  profile_id: string;
  entity_type: EntityType.ARTIST | EntityType.PLACE;
  claimer_user_id: string;
}

// ========== UNION TYPE FOR ALL EVENTS ==========

export type AnalyticsEvent =
  // Profile
  | ProfileViewEvent
  | ProfileContactClickEvent
  | ProfileShareEvent
  | ProfileMediaViewEvent
  | ProfileLinkClickEvent
  | ProfileTabViewEvent
  // Search
  | SearchEvent
  | SearchResultClickEvent
  | SearchFilterApplyEvent
  | SearchNoResultsEvent
  // Prebooking
  | PrebookingCreateStartEvent
  | PrebookingCreateCompleteEvent
  | PrebookingCreateAbandonEvent
  | PrebookingResponseEvent
  | PrebookingViewEvent
  | PrebookingFilterEvent
  | PrebookingStatusChangeEvent
  // Event
  | EventViewEvent
  | EventInterestEvent
  | EventShareEvent
  // Rider & Stage Plot
  | RiderViewEvent
  | StagePlotViewEvent
  | StagePlotEditEvent
  // User
  | UserLoginEvent
  | UserSignupEvent
  | ProfileSwitchEvent
  // Navigation
  | NavigationEvent
  | PageViewEvent
  // Conversion
  | ConversionPrebookingAcceptedEvent
  | ConversionEventCreatedEvent
  | ConversionProfileCompleteEvent
  | ConversionProfileClaimEvent;
