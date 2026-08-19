import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileModel } from '~/models/base';
import { logPageViewEvent } from './analytics';
import { EntityType, PageViewContext } from './events';

export interface RouteTrackerProps {
  /**
   * Entity being viewed (Artist, Place, Event, etc.)
   * If provided, will extract entity info for tracking
   */
  entity?: ProfileModel<any> | any;

  /**
   * Entity type - auto-detected from entity if not provided
   */
  entityType?: EntityType;

  /**
   * Current tab/section within the page
   * e.g., 'info', 'media', 'contact', 'rider', 'stageplot', 'events'
   */
  tab?: string;

  /**
   * Section of the app (derived from PATHS)
   * e.g., 'artists', 'places', 'prebookings', 'calendar'
   */
  section?: string;

  /**
   * Specific function/action being performed
   * e.g., 'create', 'edit', 'filter', 'search'
   */
  function?: string;

  /**
   * Custom page title override
   * If not provided, will be auto-generated
   */
  customTitle?: string;

  /**
   * Additional custom properties to include in the event
   */
  customProperties?: Record<string, any>;
}

/**
 * Component that tracks page views and automatically logs to Google Analytics
 *
 * Usage examples:
 *
 * // Simple page view
 * <RouteTracker />
 *
 * // Artist profile view
 * <RouteTracker entity={artist} entityType={EntityType.ARTIST} />
 *
 * // Artist profile with tab
 * <RouteTracker entity={artist} entityType={EntityType.ARTIST} tab="media" />
 *
 * // Prebookings list with function
 * <RouteTracker section="prebookings" function="filter" />
 *
 * // Custom title and properties
 * <RouteTracker
 *   customTitle="Special Page"
 *   customProperties={{ campaign: 'promo_2024' }}
 * />
 */
export const RouteTracker = (props: RouteTrackerProps): null => {
  const { entity, entityType, tab, section, function: pageFunction, customTitle, customProperties } = props;
  const location = useLocation();

  useEffect(() => {
    // Build page title
    let pageTitle = customTitle || document.title || 'Artist Hive';

    // If entity is provided, enhance the title
    if (entity && entity.name) {
      pageTitle = entity.name;

      // Update document title
      document.title = `${entity.name}  ◃⬡▹  Artist Hive`;

      // Add tab to title if provided
      if (tab) {
        pageTitle = `${entity.name} - ${tab}`;
        document.title = `${entity.name} - ${tab}  ◃⬡▹  Artist Hive`;
      }
    } else if (section) {
      // Use section for title
      const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1);
      pageTitle = sectionTitle;
      document.title = `${sectionTitle}  ◃⬡▹  Artist Hive`;

      if (pageFunction) {
        pageTitle = `${sectionTitle} - ${pageFunction}`;
        document.title = `${sectionTitle} - ${pageFunction}  ◃⬡▹  Artist Hive`;
      }
    }

    // Build context for analytics
    const context: PageViewContext = {
      page_path: location.pathname + location.search,
      page_title: pageTitle,
      tab,
      section,
      function: pageFunction,
    };

    // Add entity information if available
    if (entity) {
      context.entity_id = entity.identifier || entity.id;
      context.entity_name = entity.name;

      // Auto-detect entity type if not provided
      if (entityType) {
        context.entity_type = entityType;
      } else if (entity.entity) {
        // Try to map from entity.entity field
        const entityMap: Record<string, EntityType> = {
          Artist: EntityType.ARTIST,
          Place: EntityType.PLACE,
          Event: EntityType.EVENT,
          Academy: EntityType.ACADEMY,
        };
        context.entity_type = entityMap[entity.entity];
      }
    }

    // Log to Google Analytics
    logPageViewEvent({
      page_title: context.page_title,
      page_path: context.page_path,
      page_location: window.location.href,
      ...customProperties,
      // Add context as custom dimensions
      entity_type: context.entity_type,
      entity_id: context.entity_id,
      entity_name: context.entity_name,
      tab: context.tab,
      section: context.section,
      function: context.function,
    } as any);
  }, [location, entity, entityType, tab, section, pageFunction, customTitle, customProperties]);

  return null;
};
