/**
 * Component Builders Registry - Index
 *
 * Sistema de registro centralizado para builders de componentes.
 *
 * Arquitectura:
 * - BUILDER_CONFIG: Mapeo de ComponentTypes a funciones builder
 * - registerAllBuilders(): Registra todos los builders
 *
 * Uso:
 * ```typescript
 * import { registerAllBuilders, buildComponent } from './componentBuilders';
 *
 * // En el componente principal
 * useEffect(() => {
 *   registerAllBuilders();
 * }, []);
 *
 * // Para construir componentes
 * const component = buildComponent({
 *   componentDescriptor,
 *   subpage,
 *   section,
 *   // ...otros params
 * });
 * ```
 */

import { ComponentTypes } from '../component-types.def';
import { registerBuilder } from './ComponentBuilder';

// Imports de todos los builders
import { createArtsGenresComponent } from './builders/ArtsGenresBuilder';
import { createAttributesIconFieldsComponent } from './builders/AttributesIconFieldsBuilder';
import { createCalendarSimpleLayoutComponent } from './builders/CalendarSimpleLayoutBuilder';
import { createCrewListRiderViewComponent } from './builders/CrewListRiderViewBuilder';
import { createDiscographyListViewComponent } from './builders/DiscographyListViewBuilder';
import { createEventThumbnailCardComponent } from './builders/EventThumbnailCardBuilder';
import { createHorizontalImageGalleryComponent } from './builders/HorizontalImageGalleryBuilder';
import { createHtmlContentComponent } from './builders/HtmlContentBuilder';
import { createImageGalleryComponent } from './builders/ImageGalleryBuilder';
import { createMapComponent } from './builders/MapBuilder';
import { createProfileFollowersComponent } from './builders/ProfileFollowersBuilder';
import { createProfileThumbnailCardComponent } from './builders/ProfileThumbnailCardBuilder';
import { createSocialNetworkChartmetricAnalyticsWidgetComponent } from './builders/SocialNetworkChartmetricWidgetWidgetBuilder';
import { createSocialNetworkWidgetComponent } from './builders/SocialNetworkWidgetBuilder';
import { createTableComponent } from './builders/TableBuilder';
import { createTitleComponent } from './builders/TitleBuilder';
import { createTopTracksListViewComponent } from './builders/TopTracksListViewBuilder';
import { createVisitedCountriesCitiesComponent } from './builders/VisitedCountriesCitiesBuilder';

// Placeholder builder for IMAGE component type (not implemented yet)
const createImageComponent = () => null as any;

/**
 * Configuración de builders
 * Mapea cada ComponentTypes a su función builder
 */
const BUILDER_CONFIG = {
  [ComponentTypes.MAP]: createMapComponent,
  [ComponentTypes.HTML_CONTENT]: createHtmlContentComponent,
  [ComponentTypes.TITLE]: createTitleComponent,
  [ComponentTypes.ARTS_GENRES]: createArtsGenresComponent,
  [ComponentTypes.IMAGE]: createImageComponent,
  [ComponentTypes.IMAGE_GALLERY]: createImageGalleryComponent,
  [ComponentTypes.HORIZONTAL_IMAGE_GALLERY]: createHorizontalImageGalleryComponent,
  [ComponentTypes.ATTRIBUTES_ICON_FIELDS]: createAttributesIconFieldsComponent,
  [ComponentTypes.CALENDAR_SIMPLE_LAYOUT]: createCalendarSimpleLayoutComponent,
  [ComponentTypes.SOCIAL_NETWORK_WIDGET]: createSocialNetworkWidgetComponent,
  [ComponentTypes.SOCIAL_NETWORK_CHARTMETRIC_ANALYTICS_WIDGET]: createSocialNetworkChartmetricAnalyticsWidgetComponent,
  [ComponentTypes.CREW_LIST_RIDER_VIEW]: createCrewListRiderViewComponent,
  [ComponentTypes.TABLE]: createTableComponent,
  [ComponentTypes.DISCOGRAPHY_LIST_VIEW]: createDiscographyListViewComponent,
  [ComponentTypes.TOP_TRACKS_LIST_VIEW]: createTopTracksListViewComponent,
  [ComponentTypes.VISITED_COUNTRIES_CITIES_LIST_VIEW]: createVisitedCountriesCitiesComponent,
  [ComponentTypes.PROFILE_THUMBNAIL_CARD]: createProfileThumbnailCardComponent,
  [ComponentTypes.EVENT_THUMBNAIL_CARD]: createEventThumbnailCardComponent,
  [ComponentTypes.PROFILE_FOLLOWERS_COMPONENT]: createProfileFollowersComponent,
} as const;

/**
 * Registra todos los builders
 */
export const registerAllBuilders = (): void => {
  Object.entries(BUILDER_CONFIG).forEach(([type, builderFn]) => {
    registerBuilder(Number(type) as ComponentTypes, builderFn);
  });
};

// Re-exportar funcionalidades core
export { buildComponent, getRegisteredBuilders } from './ComponentBuilder';
export type { BuilderRegistry, ComponentBuilderFunction, ComponentBuilderParams } from './types';
