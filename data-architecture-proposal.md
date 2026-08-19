# Propuesta de Arquitectura: Data Registry Pattern

## Resumen Ejecutivo

Este documento describe una arquitectura desacoplada para manejar fuentes de datos (Redux selectors/actions) de manera independiente a los componentes de UI. La solución permite:

- **Desacoplamiento**: Los componentes no conocen la fuente de datos específica
- **Lazy Loading**: Carga de datos bajo demanda (especialmente útil para tabs)
- **Reutilización**: La misma configuración se puede usar en múltiples lugares
- **Testabilidad**: Fácil de mockear y testear
- **Type Safety**: Totalmente tipado con TypeScript

---

## Problema Actual

### Caso 1: Badges en Sidenav

```typescript
// ❌ Problema: Acoplamiento directo al selector
const selectorBadge = useSelector((state) =>
  selectRequestsRequiringActionCount(state, loggedUser?.identifier || '')
);

// El componente necesita:
// 1. Conocer el selector específico
// 2. Conocer los parámetros que necesita
// 3. Obtener esos parámetros (loggedUser)
```

### Caso 2: Tabs de Perfil

```typescript
// ❌ Problema: Se cargan TODOS los datos del perfil
const profile = useSelector(selectFullProfile);

// Aunque solo se muestre un tab, se carga todo:
// - Información básica
// - Eventos
// - Social networks
// - Membresías
// - etc.
```

---

## Solución Propuesta

### Arquitectura en Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Components Layer                      │
│  (Sidenav, ProfilePage, EventsPage, etc.)                  │
└─────────────────────┬───────────────────────────────────────┘
                      │ usa
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Configuration Layer                        │
│  (sidenav.config.tsx, profile-tabs.config.tsx, etc.)       │
└─────────────────────┬───────────────────────────────────────┘
                      │ define qué datos necesita
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Registry Layer                      │
│  (Mapea keys → selectors/actions)                          │
└─────────────────────┬───────────────────────────────────────┘
                      │ accede a
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     Redux Layer                             │
│  (Selectors, Actions, Reducers, Sagas)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementación Detallada

### Fase 1: Core - Data Registry

**Ubicación**: `src/common/core/data-registry/`

#### 1.1 Types (`types.ts`)

```typescript
import { RootState } from '~/common/utils/redux-injectors/types';

/**
 * Configuración de una fuente de datos
 */
export interface DataSourceConfig<TParams extends any[] = any[], TResult = any> {
  /**
   * Selector de Redux para obtener los datos del estado
   */
  selector: (state: RootState, ...params: TParams) => TResult;

  /**
   * Acción opcional para cargar/recargar los datos
   */
  action?: (...params: TParams) => any;

  /**
   * Función para generar una clave de caché única
   * Útil para evitar cargas duplicadas
   */
  cacheKey?: (...params: TParams) => string;

  /**
   * Indica si los datos deben cargarse automáticamente
   * cuando se use el hook con autoLoad: true
   */
  autoLoad?: boolean;

  /**
   * Tiempo de vida del caché en milisegundos
   * Después de este tiempo, los datos se consideran obsoletos
   */
  cacheTTL?: number;
}

/**
 * Opciones para el hook useDataSource
 */
export interface UseDataSourceOptions {
  /**
   * Cargar datos automáticamente al montar el componente
   */
  autoLoad?: boolean;

  /**
   * Forzar recarga incluso si ya hay datos en caché
   */
  forceReload?: boolean;

  /**
   * Callback cuando los datos se cargan exitosamente
   */
  onSuccess?: (data: any) => void;

  /**
   * Callback cuando hay un error al cargar
   */
  onError?: (error: any) => void;
}

/**
 * Resultado del hook useDataSource
 */
export interface DataSourceResult<TData = any> {
  /**
   * Los datos obtenidos del selector
   */
  data: TData | undefined;

  /**
   * Indica si los datos están siendo cargados
   */
  loading: boolean;

  /**
   * Error si ocurrió alguno durante la carga
   */
  error: any | null;

  /**
   * Función para recargar los datos manualmente
   */
  reload: () => void;

  /**
   * Indica si los datos están en caché
   */
  cached: boolean;

  /**
   * Timestamp de la última actualización
   */
  lastUpdated: number | null;
}
```

#### 1.2 Registry Class (`registry.ts`)

```typescript
import { DataSourceConfig } from './types';

/**
 * Registry centralizado para todas las fuentes de datos
 * Patrón Singleton
 */
class DataRegistry {
  private static instance: DataRegistry;
  private sources = new Map<string, DataSourceConfig>();

  private constructor() {}

  /**
   * Obtiene la instancia única del registry
   */
  static getInstance(): DataRegistry {
    if (!DataRegistry.instance) {
      DataRegistry.instance = new DataRegistry();
    }
    return DataRegistry.instance;
  }

  /**
   * Registra una nueva fuente de datos
   * @param key - Identificador único (ej: 'badge.requests', 'profile.basic-info')
   * @param config - Configuración de la fuente de datos
   */
  register<TParams extends any[] = any[], TResult = any>(
    key: string,
    config: DataSourceConfig<TParams, TResult>
  ): void {
    if (this.sources.has(key)) {
      console.warn(`DataRegistry: Overwriting existing source "${key}"`);
    }
    this.sources.set(key, config);
  }

  /**
   * Obtiene la configuración de una fuente de datos
   * @param key - Identificador de la fuente
   */
  get(key: string): DataSourceConfig | undefined {
    const source = this.sources.get(key);
    if (!source) {
      console.error(`DataRegistry: Source "${key}" not found`);
    }
    return source;
  }

  /**
   * Verifica si una fuente está registrada
   * @param key - Identificador de la fuente
   */
  has(key: string): boolean {
    return this.sources.has(key);
  }

  /**
   * Elimina una fuente del registry
   * @param key - Identificador de la fuente
   */
  unregister(key: string): boolean {
    return this.sources.delete(key);
  }

  /**
   * Lista todas las fuentes registradas
   */
  list(): string[] {
    return Array.from(this.sources.keys());
  }

  /**
   * Limpia todas las fuentes (útil para testing)
   */
  clear(): void {
    this.sources.clear();
  }
}

export const dataRegistry = DataRegistry.getInstance();
```

#### 1.3 Hook Principal (`useDataSource.ts`)

```typescript
import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/common/utils/redux-injectors/types';
import { dataRegistry } from './registry';
import { UseDataSourceOptions, DataSourceResult } from './types';

/**
 * Hook para usar una fuente de datos registrada
 *
 * @example
 * ```typescript
 * const { data, loading, reload } = useDataSource(
 *   'profile.basic-info',
 *   [userId],
 *   { autoLoad: true }
 * );
 * ```
 */
export const useDataSource = <TData = any>(
  key: string,
  params: any[] = [],
  options: UseDataSourceOptions = {}
): DataSourceResult<TData> => {
  const dispatch = useDispatch();
  const source = dataRegistry.get(key);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  // Ref para evitar múltiples cargas simultáneas
  const loadingRef = useRef(false);

  // Obtener datos del selector
  const data = useSelector((state: RootState) => {
    if (!source?.selector) return undefined;
    try {
      return source.selector(state, ...params) as TData;
    } catch (err) {
      console.error(`Error in selector for "${key}":`, err);
      return undefined;
    }
  });

  /**
   * Función para cargar/recargar datos
   */
  const reload = useCallback(() => {
    if (!source?.action) {
      console.warn(`DataSource "${key}" has no action defined`);
      return;
    }

    if (loadingRef.current) {
      console.log(`DataSource "${key}" is already loading, skipping...`);
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const action = source.action(...params);
      dispatch(action);
      setLastUpdated(Date.now());

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (err) {
      console.error(`Error loading data source "${key}":`, err);
      setError(err);

      if (options.onError) {
        options.onError(err);
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [key, source, dispatch, params, options, data]);

  /**
   * Auto-cargar datos si está habilitado
   */
  useEffect(() => {
    const shouldAutoLoad = options.autoLoad || source?.autoLoad;
    const shouldForceReload = options.forceReload;
    const hasNoData = data === undefined || data === null;

    if (shouldAutoLoad && (hasNoData || shouldForceReload)) {
      reload();
    }
  }, [key, ...params]); // Solo recargar cuando cambie la key o los params

  /**
   * Verificar TTL del caché
   */
  const isCacheValid = useCallback(() => {
    if (!source?.cacheTTL || !lastUpdated) return false;
    return Date.now() - lastUpdated < source.cacheTTL;
  }, [source, lastUpdated]);

  return {
    data,
    loading,
    error,
    reload,
    cached: isCacheValid(),
    lastUpdated,
  };
};
```

#### 1.4 Hook para Badges (`useBadgeValue.ts`)

```typescript
import { useDataSource } from './useDataSource';

/**
 * Hook especializado para obtener valores de badges
 * Simplifica el uso común de badges numéricos
 *
 * @example
 * ```typescript
 * const badgeValue = useBadgeValue('badge.requests', [userId]);
 * ```
 */
export const useBadgeValue = (
  key: string,
  params: any[] = []
): number => {
  const { data } = useDataSource<number>(key, params, {
    autoLoad: false, // Los badges no necesitan disparar acciones
  });

  return data ?? 0;
};
```

#### 1.5 Index (`index.ts`)

```typescript
export { dataRegistry } from './registry';
export { useDataSource } from './useDataSource';
export { useBadgeValue } from './useBadgeValue';
export * from './types';
```

---

### Fase 2: Registrar Fuentes de Datos

**Ubicación**: `src/common/core/data-registry/sources/`

#### 2.1 Badges (`badges.sources.ts`)

```typescript
import { createSelector } from '@reduxjs/toolkit';
import { dataRegistry } from '../registry';
import {
  selectRequestsRequiringActionCount,
  selectRequestsRequiringAction
} from '~/common/slices/domain/prebooking/prebooking-requests.redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { RootState } from '~/common/utils/redux-injectors/types';

/**
 * Helper: Crear un selector de badge que automáticamente inyecta el userId
 *
 * Este helper resuelve el problema de selectores que necesitan parámetros
 * creando un selector compuesto que obtiene el userId automáticamente
 */
const createUserBadgeSelector = (
  selectorWithUserId: (state: RootState, userId: string) => number
) => {
  return createSelector(
    [(state: RootState) => state, selectCurrentUser],
    (state, user) => {
      const userId = user?.identifier || '';
      return selectorWithUserId(state, userId);
    }
  );
};

/**
 * Registrar badges en el data registry
 */
export const registerBadgeSources = () => {
  // Badge: Solicitudes que requieren acción
  dataRegistry.register('badge.requests.requiring-action', {
    selector: createUserBadgeSelector(selectRequestsRequiringActionCount),
    autoLoad: false, // Los badges no necesitan cargar datos
  });

  // Podemos agregar más badges aquí
  // dataRegistry.register('badge.notifications.unread', { ... });
  // dataRegistry.register('badge.messages.new', { ... });
};
```

#### 2.2 Perfiles (`profiles.sources.ts`)

```typescript
import { dataRegistry } from '../registry';
import {
  selectProfileBasicInfo,
  selectProfileEvents,
  selectProfileSocialNetworks,
  selectProfileMemberships,
} from '~/common/slices/users/selectors';
import {
  fetchProfileBasicInfo,
  fetchProfileEvents,
  fetchProfileSocialNetworks,
  fetchProfileMemberships,
} from '~/common/slices/users/actions';

/**
 * Registrar fuentes de datos de perfiles
 */
export const registerProfileSources = () => {
  // Información básica del perfil
  dataRegistry.register('profile.basic-info', {
    selector: selectProfileBasicInfo,
    action: fetchProfileBasicInfo,
    cacheKey: (profileId: string) => `profile-basic-${profileId}`,
    autoLoad: true,
    cacheTTL: 5 * 60 * 1000, // 5 minutos
  });

  // Eventos del perfil
  dataRegistry.register('profile.events', {
    selector: selectProfileEvents,
    action: fetchProfileEvents,
    cacheKey: (profileId: string) => `profile-events-${profileId}`,
    autoLoad: true,
    cacheTTL: 2 * 60 * 1000, // 2 minutos
  });

  // Redes sociales
  dataRegistry.register('profile.social-networks', {
    selector: selectProfileSocialNetworks,
    action: fetchProfileSocialNetworks,
    cacheKey: (profileId: string) => `profile-social-${profileId}`,
    autoLoad: true,
    cacheTTL: 10 * 60 * 1000, // 10 minutos
  });

  // Membresías
  dataRegistry.register('profile.memberships', {
    selector: selectProfileMemberships,
    action: fetchProfileMemberships,
    cacheKey: (profileId: string) => `profile-memberships-${profileId}`,
    autoLoad: true,
    cacheTTL: 5 * 60 * 1000, // 5 minutos
  });
};
```

#### 2.3 Inicialización (`index.ts`)

```typescript
import { registerBadgeSources } from './badges.sources';
import { registerProfileSources } from './profiles.sources';

/**
 * Inicializa todas las fuentes de datos
 * Debe llamarse una vez al inicio de la aplicación
 */
export const initializeDataSources = () => {
  registerBadgeSources();
  registerProfileSources();

  // Agregar más registros aquí según sea necesario
  // registerEventSources();
  // registerNotificationSources();
  // etc.
};
```

---

### Fase 3: Configuración de Componentes

#### 3.1 Sidenav Config (`sidenav.config.tsx`)

```typescript
import { RootState } from '~/common/utils/redux-injectors/types';

export interface SideMenuItem {
  name: string;
  icon?: string;
  path?: string;
  handler?: string;
  rightIcon?: string;
  rightPath?: string;
  rightHandler?: string;
  randomId?: boolean;
  subMenu?: SideMenuItem[];

  /**
   * Badge config: ahora solo necesita la key del data registry
   */
  badge?: {
    dataSourceKey: string;
    params?: any[]; // Parámetros opcionales si el badge los necesita
  };
}

export const LEFT_SIDENAV_MENU_CONFIG: SideMenuItem[] = [
  {
    name: `${TRANSLATION_BASE_SIDENAV}.options.home`,
    icon: 'AiFillHome',
    path: PATHS.home,
  },
  {
    name: `${TRANSLATION_BASE_SIDENAV}.options.requests`,
    icon: 'AiFillBell',
    path: PATHS.prebookingRequests,
    badge: {
      dataSourceKey: 'badge.requests.requiring-action',
      // No necesita params porque el selector ya inyecta el userId
    },
  },
  {
    name: `${TRANSLATION_BASE_SIDENAV}.options.events`,
    icon: 'AiFillCalendar',
    path: PATHS.events,
  },
  // ... más opciones
];

export const RIGHT_SIDENAV_MENU_CONFIG: SideMenuItem[] = [
  // ... configuración del menú derecho
];
```

#### 3.2 Profile Tabs Config (`config-profile-tabs.tsx`)

```typescript
import { ComponentType } from 'react';

export interface ProfileTabConfig {
  label: string;
  translationKey: string;
  dataSourceKey: string;
  component: ComponentType<any>;
  icon?: string;
  requiresAuth?: boolean;
  visible?: (profile: any) => boolean;
}

export const PROFILE_TABS_CONFIG: ProfileTabConfig[] = [
  {
    label: 'Información Básica',
    translationKey: 'profile.tabs.basic-info',
    dataSourceKey: 'profile.basic-info',
    component: BasicInfoTab,
    icon: 'AiOutlineUser',
  },
  {
    label: 'Eventos',
    translationKey: 'profile.tabs.events',
    dataSourceKey: 'profile.events',
    component: EventsTab,
    icon: 'AiOutlineCalendar',
  },
  {
    label: 'Redes Sociales',
    translationKey: 'profile.tabs.social-networks',
    dataSourceKey: 'profile.social-networks',
    component: SocialNetworksTab,
    icon: 'AiOutlineGlobal',
  },
  {
    label: 'Membresías',
    translationKey: 'profile.tabs.memberships',
    dataSourceKey: 'profile.memberships',
    component: MembershipsTab,
    icon: 'AiOutlineTeam',
    visible: (profile) => profile?.type === 'artist', // Solo para artistas
  },
];
```

---

### Fase 4: Uso en Componentes

#### 4.1 Sidenav (`sidenav/index.tsx`)

```typescript
import { useBadgeValue } from '~/common/core/data-registry';
import { LEFT_SIDENAV_MENU_CONFIG, SideMenuItem } from './sidenav.config';

const SideNav = () => {
  const loggedUser = useSelector(selectCurrentUser);
  const { translateText } = useI18n();

  /**
   * Renderizar una opción de menú
   */
  const renderMenuItem = (menuOption: SideMenuItem, level: number = 0) => {
    // Obtener el valor del badge si existe
    const badgeValue = useBadgeValue(
      menuOption.badge?.dataSourceKey || '',
      menuOption.badge?.params || []
    );

    return (
      <a
        className="menu-option"
        onClick={() => {
          if (menuOption?.path) {
            navigateTo({ path: menuOption?.path });
          } else if (menuOption?.handler) {
            handlers[menuOption?.handler]();
          }
        }}
        style={{ paddingLeft: `${level * 3}rem` }}
      >
        <DynamicIcons iconName={menuOption.icon || 'AiFillFile'} size={25} />
        <span className="menu-option-label">
          {translateText(menuOption.name)}
        </span>

        {/* Mostrar badge solo si tiene valor > 0 */}
        {menuOption.badge && badgeValue > 0 && (
          <Badge
            badgeContent={badgeValue}
            color="success"
            sx={{
              marginLeft: '1.5rem',
              '& .MuiBadge-badge': {
                fontSize: '0.85rem',
                height: '22px',
                minWidth: '22px',
                padding: '0 6px',
              },
            }}
          />
        )}
      </a>
    );
  };

  return (
    <Offcanvas show={show} onHide={handleClose}>
      <Offcanvas.Body>
        <div className="general-sec">
          <div className="option-menu-list">
            {LEFT_SIDENAV_MENU_CONFIG.map((menuOption, index) => (
              <div key={index}>
                {renderMenuItem(menuOption)}
                {menuOption.subMenu?.map((subOption, subIndex) => (
                  <div key={subIndex}>
                    {renderMenuItem(subOption, 1)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
```

#### 4.2 Profile Page con Tabs (`ProfilePage.tsx`)

```typescript
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import { useDataSource } from '~/common/core/data-registry';
import { PROFILE_TABS_CONFIG } from './config-profile-tabs';

const ProfilePage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [activeTab, setActiveTab] = useState(0);

  const currentTabConfig = PROFILE_TABS_CONFIG[activeTab];

  /**
   * Hook que automáticamente:
   * 1. Obtiene los datos del selector
   * 2. Dispara la acción para cargarlos si no existen
   * 3. Maneja el estado de loading
   */
  const { data, loading, error, reload } = useDataSource(
    currentTabConfig.dataSourceKey,
    [profileId],
    {
      autoLoad: true,
      onError: (err) => {
        console.error('Error loading tab data:', err);
      },
    }
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      {/* Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange}>
        {PROFILE_TABS_CONFIG.map((tab, index) => (
          <Tab key={index} label={tab.label} icon={tab.icon} />
        ))}
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <div>
            Error loading data
            <button onClick={reload}>Retry</button>
          </div>
        ) : (
          <currentTabConfig.component
            data={data}
            profileId={profileId}
            onReload={reload}
          />
        )}
      </Box>
    </Box>
  );
};
```

---

## Ventajas de esta Arquitectura

### 1. **Desacoplamiento Total**
- Los componentes no conocen los selectores o acciones específicos
- Los configs solo definen "qué" datos necesitan, no "cómo" obtenerlos
- Fácil cambiar la fuente de datos sin tocar los componentes

### 2. **Lazy Loading Automático**
- Los datos de cada tab solo se cargan cuando se accede al tab
- Sistema de caché para evitar cargas repetidas
- TTL configurable por fuente de datos

### 3. **Reutilización**
- Un mismo data source puede usarse en múltiples componentes
- Los badges pueden compartir lógica de selección

### 4. **Testabilidad**
```typescript
// Mockear fuentes de datos en tests
beforeEach(() => {
  dataRegistry.clear();
  dataRegistry.register('badge.requests', {
    selector: () => 5, // Mock
  });
});
```

### 5. **Type Safety**
- Generics para tipar correctamente los datos
- TypeScript infiere los tipos automáticamente
- Autocomplete en el IDE

### 6. **Debugging**
- Console warnings cuando una fuente no existe
- Fácil rastrear qué componente usa qué datos
- Lista de todas las fuentes: `dataRegistry.list()`

---

## Migración Gradual

### Paso 1: Implementar el Core
1. Crear `src/common/core/data-registry/`
2. Implementar las clases y hooks base
3. **No rompe nada existente**

### Paso 2: Registrar Primera Fuente (Badges)
1. Crear `badges.sources.ts`
2. Registrar badges en `initializeDataSources()`
3. Llamar `initializeDataSources()` en `App.tsx`

### Paso 3: Migrar Sidenav
1. Actualizar `sidenav.config.tsx`
2. Usar `useBadgeValue()` en `sidenav/index.tsx`
3. **Eliminar código acoplado**

### Paso 4: Migrar Perfiles (Tab por Tab)
1. Registrar `profile.basic-info` source
2. Actualizar un tab para usar `useDataSource()`
3. Repetir para cada tab
4. **Mantener compatibilidad mientras se migra**

---

## Casos de Uso Futuros

### 1. Refresh Manual
```typescript
const { data, reload } = useDataSource('profile.events', [userId]);

<button onClick={reload}>Refresh Events</button>
```

### 2. Invalidar Caché
```typescript
// Después de crear un nuevo evento
dispatch(createEvent(newEvent));
reload(); // Recargar la lista de eventos
```

### 3. Datos Condicionales
```typescript
// Solo cargar si es premium
const { data } = useDataSource(
  'profile.premium-features',
  [userId],
  { autoLoad: user?.isPremium }
);
```

### 4. Optimistic Updates
```typescript
const { data, reload } = useDataSource('profile.events', [userId]);

const handleCreateEvent = async (newEvent) => {
  // Optimistic update
  setLocalEvents([...data, newEvent]);

  await dispatch(createEvent(newEvent));

  // Recargar para sincronizar con servidor
  reload();
};
```

---

## Próximos Pasos

1. **Revisar y aprobar** esta propuesta
2. **Implementar Fase 1**: Core del Data Registry
3. **Implementar Fase 2**: Registrar badges (caso simple)
4. **Migrar Sidenav**: Probar con un caso real
5. **Evaluar resultados** antes de migrar perfiles
6. **Documentar patrones** para el equipo

---

## Preguntas Abiertas

1. ¿Debería el registry manejar el estado de loading/error o delegarlo a Redux?
2. ¿Necesitamos un sistema de caché más sofisticado (ej: Redux Toolkit Query)?
3. ¿Qué nivel de granularidad queremos en los data sources?
   - Un source por tab completo
   - Múltiples sources por secciones dentro de un tab
4. ¿Cómo manejar dependencias entre fuentes de datos?
   - Ej: Para cargar eventos, primero necesito el perfil básico

---

## Alternativas Consideradas

### Redux Toolkit Query (RTK Query)
**Pros:**
- Sistema de caché muy robusto
- Invalidación automática
- Manejo de loading/error integrado

**Contras:**
- Más complejo
- Requiere refactorizar mucho código existente
- Curva de aprendizaje

**Decisión:** Empezar con nuestra solución custom, migrar a RTK Query si es necesario

### Context API
**Pros:**
- Más simple que Redux
- Fácil de implementar

**Contras:**
- Ya usamos Redux
- No aprovecha la infraestructura existente
- Performance issues con muchos consumers

**Decisión:** Mantener Redux como single source of truth

---

## Referencias

- [Redux Toolkit - createSelector](https://redux-toolkit.js.org/api/createSelector)
- [React Patterns - Registry Pattern](https://www.patterns.dev/posts/registry-pattern)
- [Dependency Injection in React](https://blog.logrocket.com/dependency-injection-react/)
