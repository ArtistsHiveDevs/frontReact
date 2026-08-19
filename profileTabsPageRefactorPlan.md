# Plan de Refactorización - ProfileTabsPage Component Builder System

**Fecha Inicio**: 2025-12-03
**Fecha Actualización**: 2025-12-04
**Estado**: ✅ 90% Completado - Requiere Paso Final Manual
**Objetivo**: Separar la lógica de construcción de componentes del layout en ProfileTabsPage, permitiendo reutilización independiente de los component builders.

---

## ✅ PROGRESO ACTUAL

### Completado (Fases 1-4):
- ✅ **Fase 1**: Estructura de carpetas y tipos base creada
- ✅ **Fase 2**: ComponentBuilder core implementado
- ✅ **Fase 3**: 17 builders individuales creados
- ✅ **Fase 4**: Index con registro centralizado y lazy loading

### Pendiente (Fase 5):
- ⏸️ **Fase 5**: Refactorización de ProfileTabsPage.tsx (requiere intervención manual)

### Archivos Creados:
```
✅ componentBuilders/types.ts
✅ componentBuilders/ComponentBuilder.ts
✅ componentBuilders/utils/dataExtraction.ts
✅ componentBuilders/utils/componentProcessing.ts
✅ componentBuilders/index.ts (con lazy loading)
✅ componentBuilders/builders/MapBuilder.tsx
✅ componentBuilders/builders/HtmlContentBuilder.tsx
✅ componentBuilders/builders/TitleBuilder.tsx
✅ componentBuilders/builders/ArtsGenresBuilder.tsx
✅ componentBuilders/builders/ImageGalleryBuilder.tsx
✅ componentBuilders/builders/HorizontalImageGalleryBuilder.tsx
✅ componentBuilders/builders/AttributesIconFieldsBuilder.tsx
✅ componentBuilders/builders/CalendarSimpleLayoutBuilder.tsx
✅ componentBuilders/builders/SocialNetworkWidgetBuilder.tsx
✅ componentBuilders/builders/CrewListRiderViewBuilder.tsx
✅ componentBuilders/builders/TableBuilder.tsx
✅ componentBuilders/builders/DiscographyListViewBuilder.tsx
✅ componentBuilders/builders/TopTracksListViewBuilder.tsx
✅ componentBuilders/builders/VisitedCountriesCitiesBuilder.tsx
✅ componentBuilders/builders/ProfileThumbnailCardBuilder.tsx
✅ componentBuilders/builders/EventThumbnailCardBuilder.tsx
✅ componentBuilders/builders/ProfileFollowersBuilder.tsx
```

---

## Contexto y Motivación

### Situación Actual

`ProfileTabsPage.tsx` es un componente monolítico de ~810 líneas que:

1. **Mezcla responsabilidades**: Layout + Component Building + Business Logic
2. **Función `buildComponent`** (líneas 284-750): 466 líneas con 18 tipos de componentes diferentes
3. **No es reutilizable**: La lógica de construcción está acoplada al layout de tabs
4. **Difícil de mantener**: Agregar nuevos tipos de componentes requiere modificar un archivo gigante

### Arquitectura Actual

```
ProfileTabsPage.tsx
├── transformedConfig() → Genera estructura de tabs
│   └── buildComponent() → Construye cada tipo de componente
│       ├── MAP
│       ├── ATTRIBUTES_ICON_FIELDS
│       ├── HTML_CONTENT
│       ├── PROFILE_THUMBNAIL_CARD
│       ├── ... (18 tipos totales)
│       └── VISITED_COUNTRIES_CITIES_LIST_VIEW
└── Layout (TabbedPanel, ProfileHeader, etc.)
```

### Problemática Similar a DynamicForm

Al igual que DynamicForm, necesitamos:
- ✅ Separar la **creación de componentes** del **layout**
- ✅ Permitir usar builders de forma independiente
- ✅ Mantener backward compatibility total
- ✅ Facilitar testing y mantenimiento

---

## Arquitectura Propuesta

### Nueva Estructura de Archivos

```
src/components/shared/organisms/ProfileTabsPage/
├── ProfileTabsPage.tsx                          # Layout principal (simplificado)
├── profile-details.def.tsx                       # Types (sin cambios)
│
├── componentBuilders/                            # ✨ NUEVO
│   ├── index.ts                                  # Exports centralizados
│   ├── ComponentBuilder.ts                       # Core builder + registry
│   ├── types.ts                                  # Tipos compartidos
│   │
│   ├── builders/                                 # Builders individuales
│   │   ├── MapBuilder.tsx                        # MAP
│   │   ├── AttributesIconFieldsBuilder.tsx       # ATTRIBUTES_ICON_FIELDS
│   │   ├── HtmlContentBuilder.tsx                # HTML_CONTENT
│   │   ├── ProfileThumbnailCardBuilder.tsx       # PROFILE_THUMBNAIL_CARD
│   │   ├── EventThumbnailCardBuilder.tsx         # EVENT_THUMBNAIL_CARD
│   │   ├── ImageGalleryBuilder.tsx               # IMAGE_GALLERY
│   │   ├── HorizontalImageGalleryBuilder.tsx     # HORIZONTAL_IMAGE_GALLERY
│   │   ├── CalendarSimpleLayoutBuilder.tsx       # CALENDAR_SIMPLE_LAYOUT
│   │   ├── SocialNetworkWidgetBuilder.tsx        # SOCIAL_NETWORK_WIDGET
│   │   ├── TitleBuilder.tsx                      # TITLE
│   │   ├── ArtsGenresBuilder.tsx                 # ARTS_GENRES
│   │   ├── CrewListRiderViewBuilder.tsx          # CREW_LIST_RIDER_VIEW
│   │   ├── TableBuilder.tsx                      # TABLE
│   │   ├── DiscographyListViewBuilder.tsx        # DISCOGRAPHY_LIST_VIEW
│   │   ├── TopTracksListViewBuilder.tsx          # TOP_TRACKS_LIST_VIEW
│   │   ├── VisitedCountriesCitiesBuilder.tsx     # VISITED_COUNTRIES_CITIES_LIST_VIEW
│   │   └── ProfileFollowersBuilder.tsx           # PROFILE_FOLLOWERS_COMPONENT
│   │
│   └── utils/                                     # Helpers compartidos
│       ├── dataExtraction.ts                      # getData, getAttributeTitle
│       └── componentProcessing.ts                 # processAttribute
│
└── layouts/                                       # ✨ NUEVO (opcional - Fase 2)
    └── TabbedProfileLayout.tsx                   # Layout extraído
```

---

## Fases de Implementación

### ✅ Fase 1: Preparación y Tipos Base

**Objetivo**: Crear la estructura base sin romper nada existente.

#### 1.1 Crear Tipos Compartidos

**Archivo**: `src/components/shared/organisms/ProfileTabsPage/componentBuilders/types.ts`

```typescript
import { EntityModel, EntityTemplate } from '~/models/base';
import {
  ProfileComponentDescriptor,
  ProfileDetailsSubpage,
  ProfileDetailsSubpageSection
} from '../profile-details.def';

/**
 * Parámetros base que reciben todos los builders
 */
export interface ComponentBuilderParams {
  /** Descriptor del componente a construir */
  componentDescriptor: ProfileComponentDescriptor;

  /** Configuración de la subpage actual */
  subpage: ProfileDetailsSubpage;

  /** Configuración de la sección actual */
  section: ProfileDetailsSubpageSection;

  /** Índice del componente en la sección */
  componentIndex: number;

  /** Entidad principal del perfil */
  entityData: EntityModel<EntityTemplate>;

  /** Data source opcional (para componentes anidados) */
  parentDataSource?: EntityModel<EntityTemplate>;

  /** Handlers de eventos del contexto */
  handlers?: { [handlerName: string]: Function };

  /** Path base para traducciones */
  translationBasePath: string;
}

/**
 * Función que construye un componente React
 */
export type ComponentBuilderFunction = (params: ComponentBuilderParams) => JSX.Element;

/**
 * Registro de builders por tipo de componente
 */
export type BuilderRegistry = {
  [key in ProfileComponentTypes]?: ComponentBuilderFunction;
};
```

#### 1.2 Crear Utils Compartidos

**Archivo**: `src/components/shared/organisms/ProfileTabsPage/componentBuilders/utils/dataExtraction.ts`

```typescript
import { isDayjs } from 'dayjs';
import { EntityModel, EntityTemplate } from '~/models/base';
import { useI18n } from '~/common/utils';
import { ProfileDetailAttributeConfiguration } from '../../profile-details.def';

/**
 * Extrae datos de una entidad usando un path tipo "user.country.name"
 */
export const getData = (
  attribute: string,
  dataSource: EntityModel<EntityTemplate>
): any => {
  if (!attribute) return undefined;

  const propertyPath = attribute.split('.') || [];
  const data = propertyPath.reduce((previous, current) => {
    return previous ? previous[current as keyof typeof previous] : '';
  }, dataSource) || '';

  // Formatear arrays simples
  if (Array.isArray(data) && data.length && (typeof data[0] === 'string' || typeof data[0] === 'number')) {
    return data.join(', ');
  }

  // Formatear fechas Dayjs
  if (isDayjs(data)) {
    return data.format('LL');
  }

  return data;
};

/**
 * Obtiene el título traducido de un atributo
 */
export const getAttributeTitle = (
  subpageName: string,
  sectionName: string,
  attribute: ProfileDetailAttributeConfiguration,
  translationBasePath: string,
  translateText: (path: string) => string
): string => {
  if (attribute.translationPath) {
    return translateText(`${attribute.translationPath}.${attribute.name}`);
  }

  if (attribute.title) {
    return attribute.title;
  }

  if (attribute.useTranslation || attribute.emptyTitle === undefined) {
    return translateText(
      `${translationBasePath}.subpages.${subpageName}.sections.${sectionName}.attributes.${attribute.name}`
    );
  }

  return '';
};

/**
 * Obtiene el data source de un descriptor
 */
export const getDataSource = (
  componentDescriptor: ProfileComponentDescriptor,
  entityData: EntityModel<EntityTemplate>,
  parentDataSource?: EntityModel<EntityTemplate>
): EntityModel<EntityTemplate> => {
  const source = parentDataSource || entityData;

  if (!componentDescriptor.data?.data_source) {
    return source;
  }

  const dsPath = componentDescriptor.data.data_source.split('.') || [];
  return dsPath.reduce((previous: any, current: any) => {
    return previous ? previous[current as keyof typeof previous] : {};
  }, source) || {};
};
```

**Archivo**: `src/components/shared/organisms/ProfileTabsPage/componentBuilders/utils/componentProcessing.ts`

```typescript
import { isDayjs } from 'dayjs';
import { EntityModel, EntityTemplate } from '~/models/base';
import { ProfileDetailAttributeConfiguration } from '../../profile-details.def';
import { getData, getAttributeTitle } from './dataExtraction';
import { IconDetailedAttribute } from '~/components/shared/molecules/general/AttributesIconField';

/**
 * Procesa un atributo individual para ATTRIBUTES_ICON_FIELDS
 */
export const processAttribute = (
  attribute: ProfileDetailAttributeConfiguration,
  componentIndex: number,
  dataSourceElement: EntityModel<EntityTemplate>,
  subpageName: string,
  sectionName: string,
  translationBasePath: string,
  translateText: (path: string) => string,
  buildComponent?: (attribute: any) => JSX.Element
): IconDetailedAttribute => {
  let value = undefined;

  if (attribute.value || attribute.components) {
    if (attribute.value instanceof Function) {
      value = <>{attribute.value(dataSourceElement)}</>;
    } else if (attribute.components && attribute.components.length && buildComponent) {
      // Componentes anidados
      value = (
        <>
          {attribute.components.map((comp, idx) => (
            <div key={`nested-${componentIndex}-${idx}`}>
              {buildComponent(comp)}
            </div>
          ))}
        </>
      );
    } else if (isDayjs(attribute.value)) {
      value = attribute.value.format('LLLL');
    } else {
      value = attribute.value;
    }
  } else {
    value = getData(attribute.name, dataSourceElement);
  }

  return {
    name: attribute.name,
    title: getAttributeTitle(subpageName, sectionName, attribute, translationBasePath, translateText),
    customTitle: !!attribute.title || attribute.useTranslation,
    icon: attribute?.icon,
    value,
    requireSession: attribute.requireSession,
  };
};
```

---

### ✅ Fase 2: Core Builder System

**Objetivo**: Crear el sistema central de registro y dispatch de builders.

#### 2.1 Crear ComponentBuilder Core

**Archivo**: `src/components/shared/organisms/ProfileTabsPage/componentBuilders/ComponentBuilder.ts`

```typescript
import { ProfileComponentTypes } from '../profile-details.def';
import { ComponentBuilderParams, ComponentBuilderFunction, BuilderRegistry } from './types';

/**
 * Registro global de builders
 */
const builderRegistry: BuilderRegistry = {};

/**
 * Registra un builder para un tipo de componente
 */
export const registerBuilder = (
  componentType: ProfileComponentTypes,
  builder: ComponentBuilderFunction
): void => {
  builderRegistry[componentType] = builder;
};

/**
 * Construye un componente usando el builder registrado
 */
export const buildComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor } = params;
  const builder = builderRegistry[componentDescriptor.componentName];

  if (!builder) {
    console.warn(
      `No builder registered for component type: ${ProfileComponentTypes[componentDescriptor.componentName]}`
    );
    return <></>;
  }

  return builder(params);
};

/**
 * Obtiene todos los builders registrados (útil para testing)
 */
export const getRegisteredBuilders = (): BuilderRegistry => {
  return { ...builderRegistry };
};
```

---

### ✅ Fase 3: Implementar Builders Individuales

**Objetivo**: Extraer cada tipo de componente a su propio builder.

#### 3.1 Ejemplo: MapBuilder

**Archivo**: `src/components/shared/organisms/ProfileTabsPage/componentBuilders/builders/MapBuilder.tsx`

```typescript
import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons';
import { GMapsSvgMaker } from '~/common/utils/object-utils/object-utils-index';
import MapContainer from '~/components/shared/mapPrinter/mapContainer';
import { ComponentBuilderParams } from '../types';
import { getData, getDataSource } from '../utils/dataExtraction';

export const createMapComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData, parentDataSource } = params;

  const dataSourceElement = getDataSource(componentDescriptor, entityData, parentDataSource);

  const lat = getData(componentDescriptor.data?.lat, dataSourceElement);
  const lng = getData(componentDescriptor.data?.lng, dataSourceElement);

  const mapData = {
    fitBounds: false,
    zoom: 17,
    center: { lat, lng },
    marksLocation: [
      {
        position: { lat, lng },
        iconData: GMapsSvgMaker(faMicrophoneLines.icon, {
          color: 'rgb(94, 90, 90)',
          scale: 0.07,
        }),
      },
    ],
    anotherOpts: {},
  };

  const mapContainerStyles = {
    width: '100%',
    height: '400px',
  };

  return (
    <MapContainer
      apiKey={import.meta.env.VITE_GMAPS_KEY}
      stylesc={mapContainerStyles}
      mapData={mapData}
    />
  );
};
```

#### 3.2 Ejemplo: AttributesIconFieldsBuilder

**Archivo**: `src/components/shared/organisms/ProfileTabsPage/componentBuilders/builders/AttributesIconFieldsBuilder.tsx`

```typescript
import { useI18n } from '~/common/utils';
import { AttributesIconFieldReadOnly } from '~/components/shared/molecules/general/AttributesIconField';
import { ComponentBuilderParams } from '../types';
import { getDataSource } from '../utils/dataExtraction';
import { processAttribute } from '../utils/componentProcessing';

export const createAttributesIconFieldsComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData, parentDataSource, subpage, section, translationBasePath } = params;
  const { translateText } = useI18n();

  const dataSourceElement = getDataSource(componentDescriptor, entityData, parentDataSource);

  let sectionsAttributes: any[] = [];

  // Caso 1: Data source es array
  if (componentDescriptor.data?.data_source) {
    const dsPath = componentDescriptor.data.data_source.split('.') || [];
    const dsElement = dsPath.reduce((previous: any, current: any) => {
      return previous ? previous[current as keyof typeof previous] : {};
    }, entityData) || {};

    const dsAsArray = Array.isArray(dsElement) ? dsElement : [dsElement];

    sectionsAttributes = dsAsArray.map((dataSource: any, elementIndex: number) => {
      let title = componentDescriptor.data?.data_element_title?.prefix;
      if (componentDescriptor.data?.data_element_title?.isConsecutive) {
        title += ` ${elementIndex + componentDescriptor.data.data_element_title.consecutiveBase}`;
      }

      return {
        title,
        attributes: (componentDescriptor.data?.attributes || componentDescriptor.data?.fields || [])
          .filter((attr: any) => !isAttributeHidden(attr, dataSource))
          .map((attr: any, idx: number) =>
            processAttribute(
              attr,
              idx,
              dataSource,
              subpage.name,
              section.name,
              translationBasePath,
              translateText
            )
          ),
      };
    });
  }
  // Caso 2: Atributos simples
  else if (componentDescriptor.data?.attributes) {
    sectionsAttributes = [
      {
        title: componentDescriptor.data?.title,
        attributes: componentDescriptor.data.attributes
          .filter((attr: any) => !isAttributeHidden(attr, dataSourceElement))
          .map((attr: any, idx: number) =>
            processAttribute(
              attr,
              idx,
              dataSourceElement,
              subpage.name,
              section.name,
              translationBasePath,
              translateText
            )
          ),
      },
    ];
  }

  const useColon = componentDescriptor.data?.useColon;
  const useDivInValue = componentDescriptor.data?.useDivInValue;
  const direction = componentDescriptor.data?.iconDirection;

  return (
    <>
      {sectionsAttributes.map((sectionAttrs: any, idx: number) => (
        <AttributesIconFieldReadOnly
          key={`attributes-${idx}`}
          attributes={sectionAttrs.attributes}
          title={sectionAttrs?.title}
          useDivInValue={useDivInValue}
          useColon={useColon}
          direction={direction}
        />
      ))}
    </>
  );
};

/**
 * Helper para determinar si un atributo está oculto
 */
const isAttributeHidden = (attribute: any, dataSource: any): boolean => {
  if (attribute.hidden === undefined) return false;
  if (typeof attribute.hidden === 'boolean') return attribute.hidden;
  if (typeof attribute.hidden === 'string') return attribute.hidden === 'true';
  if (attribute.hidden instanceof Function) return attribute.hidden(dataSource);
  return false;
};
```

#### 3.3 Lista Completa de Builders a Implementar

**Prioridad Alta** (más usados):
1. ✅ MapBuilder.tsx
2. ✅ AttributesIconFieldsBuilder.tsx
3. ✅ HtmlContentBuilder.tsx
4. ✅ ProfileThumbnailCardBuilder.tsx
5. ✅ ImageGalleryBuilder.tsx
6. ✅ HorizontalImageGalleryBuilder.tsx

**Prioridad Media**:
7. ✅ EventThumbnailCardBuilder.tsx
8. ✅ CalendarSimpleLayoutBuilder.tsx
9. ✅ ArtsGenresBuilder.tsx
10. ✅ TitleBuilder.tsx

**Prioridad Baja**:
11. ✅ SocialNetworkWidgetBuilder.tsx
12. ✅ CrewListRiderViewBuilder.tsx
13. ✅ TableBuilder.tsx
14. ✅ DiscographyListViewBuilder.tsx
15. ✅ TopTracksListViewBuilder.tsx
16. ✅ VisitedCountriesCitiesBuilder.tsx
17. ✅ ProfileFollowersBuilder.tsx

---

### ✅ Fase 4: Registro Centralizado

**Objetivo**: Centralizar el registro de todos los builders.

#### 4.1 Index Central (Híbrido: Objeto de Configuración + Lazy Loading)

**Archivo**: `src/components/shared/organisms/ProfileTabsPage/componentBuilders/index.ts`

**Versión Recomendada - Lazy Loading con Configuración Simple**:

```typescript
import { ProfileComponentTypes } from '../profile-details.def';
import { registerBuilder } from './ComponentBuilder';
import type { ComponentBuilderFunction } from './types';

/**
 * Configuración de builders: mapeo entre tipo y archivo
 * Solo necesitas agregar una línea aquí para registrar un nuevo builder
 */
const BUILDER_CONFIG = {
  [ProfileComponentTypes.MAP]: () => import('./builders/MapBuilder'),
  [ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS]: () => import('./builders/AttributesIconFieldsBuilder'),
  [ProfileComponentTypes.HTML_CONTENT]: () => import('./builders/HtmlContentBuilder'),
  [ProfileComponentTypes.PROFILE_THUMBNAIL_CARD]: () => import('./builders/ProfileThumbnailCardBuilder'),
  [ProfileComponentTypes.EVENT_THUMBNAIL_CARD]: () => import('./builders/EventThumbnailCardBuilder'),
  [ProfileComponentTypes.IMAGE_GALLERY]: () => import('./builders/ImageGalleryBuilder'),
  [ProfileComponentTypes.HORIZONTAL_IMAGE_GALLERY]: () => import('./builders/HorizontalImageGalleryBuilder'),
  [ProfileComponentTypes.CALENDAR_SIMPLE_LAYOUT]: () => import('./builders/CalendarSimpleLayoutBuilder'),
  [ProfileComponentTypes.SOCIAL_NETWORK_WIDGET]: () => import('./builders/SocialNetworkWidgetBuilder'),
  [ProfileComponentTypes.TITLE]: () => import('./builders/TitleBuilder'),
  [ProfileComponentTypes.ARTS_GENRES]: () => import('./builders/ArtsGenresBuilder'),
  [ProfileComponentTypes.CREW_LIST_RIDER_VIEW]: () => import('./builders/CrewListRiderViewBuilder'),
  [ProfileComponentTypes.TABLE]: () => import('./builders/TableBuilder'),
  [ProfileComponentTypes.DISCOGRAPHY_LIST_VIEW]: () => import('./builders/DiscographyListViewBuilder'),
  [ProfileComponentTypes.TOP_TRACKS_LIST_VIEW]: () => import('./builders/TopTracksListViewBuilder'),
  [ProfileComponentTypes.VISITED_COUNTRIES_CITIES_LIST_VIEW]: () => import('./builders/VisitedCountriesCitiesBuilder'),
  [ProfileComponentTypes.PROFILE_FOLLOWERS_COMPONENT]: () => import('./builders/ProfileFollowersBuilder'),
} as const;

/**
 * Registra todos los builders con lazy loading
 * Usa Object.entries + forEach para iterar la configuración
 * Carga el builder solo cuando se usa (mejor performance)
 */
export const registerAllBuilders = (): void => {
  Object.entries(BUILDER_CONFIG).forEach(([type, importFn]) => {
    const componentType = Number(type) as ProfileComponentTypes;

    // Wrapper que carga el builder bajo demanda
    const lazyBuilder: ComponentBuilderFunction = async (params) => {
      const module = await importFn();
      // Asumimos que cada builder exporta una función default o named
      const builderFn = Object.values(module)[0] as ComponentBuilderFunction;
      return builderFn(params);
    };

    registerBuilder(componentType, lazyBuilder);
  });
};

// Re-exports
export { buildComponent, registerBuilder } from './ComponentBuilder';
export * from './types';
```

**Beneficios de este enfoque**:

1. ✅ **Configuración simple**: Solo un objeto con mapeo tipo → import
2. ✅ **Lazy loading**: Carga builders bajo demanda (mejor performance inicial)
3. ✅ **Code splitting**: Webpack/Vite automáticamente divide en chunks
4. ✅ **Fácil mantenimiento**: `Object.entries().forEach()` itera la config
5. ✅ **Agregar builder**: Solo agregar 1 línea al objeto
6. ✅ **Sin boilerplate**: No repetir `registerBuilder()` manualmente

**Cómo agregar un nuevo builder**:

```typescript
const BUILDER_CONFIG = {
  // ... builders existentes
  [ProfileComponentTypes.MY_NEW_COMPONENT]: () => import('./builders/MyNewBuilder'), // ✅ Solo esto
} as const;
```

---

**Alternativa: Eager Loading con Configuración (Sin Lazy)**:

Si prefieres cargar todo inmediatamente (sin lazy loading):

```typescript
import { ProfileComponentTypes } from '../profile-details.def';
import { registerBuilder } from './ComponentBuilder';

// Imports estáticos (todos agrupados)
import { createMapComponent } from './builders/MapBuilder';
import { createAttributesIconFieldsComponent } from './builders/AttributesIconFieldsBuilder';
import { createHtmlContentComponent } from './builders/HtmlContentBuilder';
import { createProfileThumbnailCardComponent } from './builders/ProfileThumbnailCardBuilder';
import { createEventThumbnailCardComponent } from './builders/EventThumbnailCardBuilder';
import { createImageGalleryComponent } from './builders/ImageGalleryBuilder';
import { createHorizontalImageGalleryComponent } from './builders/HorizontalImageGalleryBuilder';
import { createCalendarSimpleLayoutComponent } from './builders/CalendarSimpleLayoutBuilder';
import { createSocialNetworkWidgetComponent } from './builders/SocialNetworkWidgetBuilder';
import { createTitleComponent } from './builders/TitleBuilder';
import { createArtsGenresComponent } from './builders/ArtsGenresBuilder';
import { createCrewListRiderViewComponent } from './builders/CrewListRiderViewBuilder';
import { createTableComponent } from './builders/TableBuilder';
import { createDiscographyListViewComponent } from './builders/DiscographyListViewBuilder';
import { createTopTracksListViewComponent } from './builders/TopTracksListViewBuilder';
import { createVisitedCountriesCitiesComponent } from './builders/VisitedCountriesCitiesBuilder';
import { createProfileFollowersComponent } from './builders/ProfileFollowersBuilder';

/**
 * Configuración de builders: mapeo entre tipo y función
 * Solo necesitas agregar una línea aquí para registrar un nuevo builder
 */
const BUILDER_REGISTRY_CONFIG = {
  [ProfileComponentTypes.MAP]: createMapComponent,
  [ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS]: createAttributesIconFieldsComponent,
  [ProfileComponentTypes.HTML_CONTENT]: createHtmlContentComponent,
  [ProfileComponentTypes.PROFILE_THUMBNAIL_CARD]: createProfileThumbnailCardComponent,
  [ProfileComponentTypes.EVENT_THUMBNAIL_CARD]: createEventThumbnailCardComponent,
  [ProfileComponentTypes.IMAGE_GALLERY]: createImageGalleryComponent,
  [ProfileComponentTypes.HORIZONTAL_IMAGE_GALLERY]: createHorizontalImageGalleryComponent,
  [ProfileComponentTypes.CALENDAR_SIMPLE_LAYOUT]: createCalendarSimpleLayoutComponent,
  [ProfileComponentTypes.SOCIAL_NETWORK_WIDGET]: createSocialNetworkWidgetComponent,
  [ProfileComponentTypes.TITLE]: createTitleComponent,
  [ProfileComponentTypes.ARTS_GENRES]: createArtsGenresComponent,
  [ProfileComponentTypes.CREW_LIST_RIDER_VIEW]: createCrewListRiderViewComponent,
  [ProfileComponentTypes.TABLE]: createTableComponent,
  [ProfileComponentTypes.DISCOGRAPHY_LIST_VIEW]: createDiscographyListViewComponent,
  [ProfileComponentTypes.TOP_TRACKS_LIST_VIEW]: createTopTracksListViewComponent,
  [ProfileComponentTypes.VISITED_COUNTRIES_CITIES_LIST_VIEW]: createVisitedCountriesCitiesComponent,
  [ProfileComponentTypes.PROFILE_FOLLOWERS_COMPONENT]: createProfileFollowersComponent,
} as const;

/**
 * Registra todos los builders usando configuración
 * Se reduce de 34 líneas a 3 líneas
 */
export const registerAllBuilders = (): void => {
  Object.entries(BUILDER_REGISTRY_CONFIG).forEach(([type, builderFn]) => {
    registerBuilder(Number(type) as ProfileComponentTypes, builderFn);
  });
};

// Re-exports
export { buildComponent, registerBuilder } from './ComponentBuilder';
export * from './types';
```

**Beneficios**:

1. ✅ **Más conciso**: De 34 líneas a 3 líneas en `registerAllBuilders()`
2. ✅ **Fácil de mantener**: Solo agregar 1 línea en el objeto para nuevo builder
3. ✅ **Type-safe**: TypeScript valida que el objeto tenga tipos correctos
4. ✅ **DRY**: No repetir `registerBuilder()` para cada tipo

**Agregar nuevo builder**: Solo 2 pasos

```typescript
// 1. Import (agregar al bloque de imports)
import { createMyNewComponent } from './builders/MyNewBuilder';

// 2. Agregar al config (una sola línea)
const BUILDER_REGISTRY_CONFIG = {
  // ... builders existentes
  [ProfileComponentTypes.MY_NEW_TYPE]: createMyNewComponent, // ✅ Solo esto
} as const;
```

#### 4.2 Inicialización en App

**Archivo**: Agregar en `src/App.tsx` o punto de entrada principal

```typescript
import { registerAllBuilders } from './components/shared/organisms/ProfileTabsPage/componentBuilders';

// En el inicio de la app
registerAllBuilders();
```

---

### ✅ Fase 5: Refactorizar ProfileTabsPage

**Objetivo**: Simplificar ProfileTabsPage para usar el nuevo sistema de builders.

#### 5.1 ProfileTabsPage Simplificado

**Archivo**: `src/components/shared/organisms/ProfileTabsPage/ProfileTabsPage.tsx`

**Cambios principales**:

1. **Eliminar función buildComponent** (líneas 284-750)
2. **Importar buildComponent del nuevo sistema**
3. **Extraer helpers a utils**

```typescript
import { buildComponent } from './componentBuilders';
import { ComponentBuilderParams } from './componentBuilders/types';

// ... resto de imports

export const ProfileTabsPage = (props: ProfilePageParams) => {
  // ... código existente

  // ✅ Usar el nuevo buildComponent
  const renderComponent = (
    subpage: ProfileDetailsSubpage,
    section: ProfileDetailsSubpageSection,
    componentDescriptor: ProfileComponentDescriptor,
    componentIndex: number,
    parentDataSource?: EntityModel<EntityTemplate>
  ): JSX.Element => {
    const params: ComponentBuilderParams = {
      componentDescriptor,
      subpage,
      section,
      componentIndex,
      entityData,
      parentDataSource,
      handlers,
      translationBasePath: translation_base_path,
    };

    return buildComponent(params);
  };

  // ... resto del código

  // Uso en transformedConfig
  contentComponents = (section.components || []).map(
    (componentDescriptor, componentIndex) => (
      <div key={`content-comp-${subPageIndex}-${sectionIndex || ''}-${componentIndex}`}>
        {renderComponent(subpage, section, componentDescriptor, componentIndex)}
      </div>
    )
  );

  // ... resto del código
};
```

**Reducción estimada**: De ~810 líneas a ~350 líneas

---

## Beneficios del Refactor

### 1. Separación de Responsabilidades

**Antes**:
```typescript
// ProfileTabsPage.tsx - TODO EN UN ARCHIVO
function buildComponent() {
  if (componentName === MAP) { /* 30 líneas */ }
  else if (componentName === ATTRIBUTES) { /* 100 líneas */ }
  else if (componentName === GALLERY) { /* 40 líneas */ }
  // ... 18 tipos más
}
```

**Después**:
```typescript
// ProfileTabsPage.tsx - Solo layout
const component = buildComponent(params);

// builders/MapBuilder.tsx - Lógica aislada
export const createMapComponent = (params) => {
  // Solo lógica de mapas
};
```

### 2. Reutilización Independiente

**Ejemplo de uso independiente**:

```typescript
import { buildComponent } from '~/components/shared/organisms/ProfileTabsPage/componentBuilders';
import { ProfileComponentTypes } from '~/components/shared/organisms/ProfileTabsPage/profile-details.def';

// Usar un builder en cualquier componente
const MyCustomComponent = ({ artist }) => {
  const mapComponent = buildComponent({
    componentDescriptor: {
      componentName: ProfileComponentTypes.MAP,
      data: { lat: 'latitude', lng: 'longitude' }
    },
    entityData: artist,
    subpage: { name: 'custom' },
    section: { name: 'custom' },
    componentIndex: 0,
    translationBasePath: 'app.custom',
    handlers: {}
  });

  return <div>{mapComponent}</div>;
};
```

### 3. Facilidad de Testing

**Antes**: Imposible testear builders individuales

**Después**:
```typescript
// MapBuilder.test.tsx
import { createMapComponent } from './MapBuilder';

describe('MapBuilder', () => {
  it('should render map with correct coordinates', () => {
    const params = {
      componentDescriptor: {
        componentName: ProfileComponentTypes.MAP,
        data: { lat: 'location.lat', lng: 'location.lng' }
      },
      entityData: mockArtist,
      // ... otros params
    };

    const result = createMapComponent(params);
    expect(result).toBeDefined();
  });
});
```

### 4. Mantenibilidad

- ✅ Agregar nuevo tipo de componente = Crear un solo archivo builder
- ✅ Modificar un builder = Solo afecta ese archivo
- ✅ Code review más simple = Cambios aislados
- ✅ Onboarding más fácil = Estructura clara

### 5. Extensibilidad

```typescript
// Crear builder custom para proyecto específico
import { registerBuilder } from '~/components/shared/organisms/ProfileTabsPage/componentBuilders';

export const createCustomWidget = (params) => {
  // Lógica custom
  return <CustomWidget {...params} />;
};

// Registrar
registerBuilder(ProfileComponentTypes.CUSTOM_WIDGET, createCustomWidget);
```

---

## Backward Compatibility

### Garantías

1. ✅ **ProfileTabsPage sigue funcionando igual**
   - Mismo API externo
   - Mismas props
   - Mismo comportamiento

2. ✅ **Configuraciones existentes sin cambios**
   - `config-artist-detail.tsx` ✅ Sin cambios
   - `config-place-detail.tsx` ✅ Sin cambios
   - `config-event-detail.tsx` ✅ Sin cambios

3. ✅ **Zero Breaking Changes**
   - Solo refactor interno
   - Exports públicos mantienen compatibilidad

### Estrategia de Migración Incremental

**Opción A: Big Bang** (Recomendada - como DynamicForm)
- Implementar todos los builders de una vez
- Reemplazar buildComponent completamente
- Testing exhaustivo antes de merge

**Opción B: Incremental**
1. Crear sistema de builders paralelo
2. Migrar componente por componente
3. Mantener buildComponent legacy hasta completar
4. Eliminar código legacy al final

---

## Checklist de Implementación

### Fase 1: Preparación ✅
- [ ] Crear estructura de carpetas `componentBuilders/`
- [ ] Crear `types.ts` con interfaces base
- [ ] Crear `utils/dataExtraction.ts`
- [ ] Crear `utils/componentProcessing.ts`

### Fase 2: Core System ✅
- [ ] Implementar `ComponentBuilder.ts` (registro + dispatch)
- [ ] Crear tests unitarios para el core

### Fase 3: Builders Individuales ✅

**Prioridad Alta**:
- [ ] MapBuilder.tsx
- [ ] AttributesIconFieldsBuilder.tsx
- [ ] HtmlContentBuilder.tsx
- [ ] ProfileThumbnailCardBuilder.tsx
- [ ] ImageGalleryBuilder.tsx
- [ ] HorizontalImageGalleryBuilder.tsx

**Prioridad Media**:
- [ ] EventThumbnailCardBuilder.tsx
- [ ] CalendarSimpleLayoutBuilder.tsx
- [ ] ArtsGenresBuilder.tsx
- [ ] TitleBuilder.tsx

**Prioridad Baja**:
- [ ] SocialNetworkWidgetBuilder.tsx
- [ ] CrewListRiderViewBuilder.tsx
- [ ] TableBuilder.tsx
- [ ] DiscographyListViewBuilder.tsx
- [ ] TopTracksListViewBuilder.tsx
- [ ] VisitedCountriesCitiesBuilder.tsx
- [ ] ProfileFollowersBuilder.tsx

### Fase 4: Integración ✅
- [ ] Crear `index.ts` con `registerAllBuilders()`
- [ ] Agregar registro en `App.tsx`
- [ ] Refactorizar `ProfileTabsPage.tsx`

### Fase 5: Testing y Validación ✅
- [ ] Tests unitarios para cada builder
- [ ] Tests de integración para ProfileTabsPage
- [ ] Probar todas las configs existentes:
  - [ ] Artist details
  - [ ] Place details
  - [ ] Event details
  - [ ] User details
  - [ ] Rider details
  - [ ] Tour details
  - [ ] Academy details

### Fase 6: Documentación ✅
- [ ] Documentar API de builders
- [ ] Crear guía de "Cómo agregar nuevo builder"
- [ ] Actualizar README con arquitectura

---

## Métricas Esperadas

### Reducción de Complejidad

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Líneas ProfileTabsPage.tsx | ~810 | ~350 | -57% |
| Función buildComponent | 466 líneas | N/A | ✅ Eliminada |
| Archivos en módulo | 2 | ~25 | Modularizado |
| Cyclomatic Complexity | ~80 | ~10 | -87% |
| Testabilidad | ❌ Difícil | ✅ Fácil | 100% |

### Tiempo de Desarrollo

| Tarea | Antes | Después |
|-------|-------|---------|
| Agregar nuevo tipo | 30-60 min | 10-15 min |
| Modificar builder | 20-40 min | 5-10 min |
| Testing unitario | Imposible | 5 min por builder |
| Code review | 2-4 horas | 30 min por builder |

---

## Riesgos y Mitigaciones

### Riesgo 1: Romper Funcionalidad Existente
**Probabilidad**: Media
**Impacto**: Alto
**Mitigación**:
- ✅ Tests exhaustivos antes de merge
- ✅ Probar todas las configs existentes
- ✅ Feature flag para habilitar nuevo sistema gradualmente

### Riesgo 2: Componentes Anidados
**Problema**: Algunos componentes llaman recursivamente a buildComponent
**Mitigación**:
- ✅ Builders reciben referencia a buildComponent en params
- ✅ Utils compartidos manejan recursión

### Riesgo 3: Performance
**Problema**: Registry lookup podría ser más lento
**Mitigación**:
- ✅ Registry es O(1) lookup (objeto JavaScript)
- ✅ Sin overhead significativo vs if/else chain

---

## Ejemplo Completo de Uso

### Antes del Refactor

```typescript
// ProfileTabsPage.tsx - TODO mezclado
function buildComponent(subpage, section, descriptor, index) {
  // 466 líneas de if/else
  if (descriptor.componentName === ProfileComponentTypes.MAP) {
    const lat = getData(descriptor.data?.lat);
    const lng = getData(descriptor.data?.lng);
    return <MapContainer lat={lat} lng={lng} />;
  }
  else if (descriptor.componentName === ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS) {
    // 100 líneas más...
  }
  // ... 16 tipos más
}
```

### Después del Refactor

```typescript
// ProfileTabsPage.tsx - Solo layout
import { buildComponent } from './componentBuilders';

const component = buildComponent({
  componentDescriptor: descriptor,
  subpage,
  section,
  componentIndex: index,
  entityData,
  handlers,
  translationBasePath: translation_base_path
});
```

```typescript
// builders/MapBuilder.tsx - Lógica aislada
export const createMapComponent = (params) => {
  const { componentDescriptor, entityData } = params;
  const dataSource = getDataSource(componentDescriptor, entityData);

  const lat = getData(componentDescriptor.data?.lat, dataSource);
  const lng = getData(componentDescriptor.data?.lng, dataSource);

  return <MapContainer lat={lat} lng={lng} />;
};
```

---

## Próximos Pasos (Post-Refactor)

### Fase 2 Opcional: Layouts

Una vez completado el refactor de builders, se podría extraer también los layouts:

```
src/components/shared/organisms/ProfileTabsPage/
├── layouts/
│   ├── TabbedProfileLayout.tsx       # Layout con tabs
│   ├── SinglePageProfileLayout.tsx   # Layout sin tabs
│   └── GridProfileLayout.tsx         # Layout tipo grid
```

Esto permitiría:
- ✅ Reutilizar builders con diferentes layouts
- ✅ Crear vistas custom (ej: vista móvil diferente)
- ✅ A/B testing de layouts

---

## Conclusión

Este refactor:

1. ✅ **Mejora la arquitectura**: Separación de responsabilidades clara
2. ✅ **Facilita el mantenimiento**: Código modular y testeable
3. ✅ **Habilita reutilización**: Builders independientes del layout
4. ✅ **Mantiene compatibilidad**: Zero breaking changes
5. ✅ **Reduce complejidad**: De 810 líneas a ~350 en ProfileTabsPage

**Esfuerzo estimado**: 2-3 días desarrollo + 1 día testing
**Impacto**: Alto valor a largo plazo

---

**Fecha de completado**: 2025-12-04 (90% - Fase 5 pendiente)
**Versión del plan**: v1.1

---

## 📋 PASO FINAL MANUAL - Fase 5: Refactorizar ProfileTabsPage.tsx

### Instrucciones para completar el refactor:

#### 1. Agregar import del nuevo sistema (línea 18):

```typescript
import { buildComponent as buildComponentFromRegistry, registerAllBuilders } from './componentBuilders';
```

#### 2. Registrar builders al montar (después de línea 103):

```typescript
// Registrar builders al montar el componente
useEffect(() => {
  registerAllBuilders();
}, []);
```

#### 3. Reemplazar la función `buildComponent` completa (líneas 290-756):

**ELIMINAR** todo el código desde:
```typescript
function buildComponent(
  subpage: ProfileDetailsSubpage,
  ...
) {
  const source = parentDataSource || entityData;
  ...
  return renderedComponent;
}
```

**REEMPLAZAR** con:
```typescript
function buildComponent(
  subpage: ProfileDetailsSubpage,
  section: ProfileDetailsSubpageSection,
  componentDescriptor: ProfileComponentDescriptor,
  componentIndex: number,
  parentDataSource: EntityModel<EntityTemplate> = undefined
) {
  // Extender handlers con funciones especiales del estado de ProfileTabsPage
  const extendedHandlers = {
    ...handlers,
    lastVisibleTab,
    setShowSpecificTab,
    showSpecificFollowerType,
  };

  // Llamar al nuevo sistema de builders
  return buildComponentFromRegistry({
    componentDescriptor,
    subpage,
    section,
    componentIndex,
    entityData,
    parentDataSource,
    handlers: extendedHandlers,
    translationBasePath: translation_base_path,
  });
}
```

#### 4. Verificar que funciona:

```bash
npm run build
npm run dev
```

Navegar a cualquier perfil y verificar que todos los componentes se renderizan correctamente.

### Beneficios Post-Refactor:

- **Reducción**: De 810 líneas a ~350 líneas en ProfileTabsPage.tsx
- **Modularidad**: 17 builders independientes y reutilizables
- **Performance**: Lazy loading automático de builders
- **Mantenibilidad**: Agregar nuevo componente = crear nuevo archivo builder
- **Testing**: Cada builder es testeable de forma aislada

---

**Nota**: Si encuentras dificultades con el reemplazo manual, puedes usar un editor con capacidad de "folding" de funciones para colapsar `buildComponent` completa y reemplazarla de una vez.
