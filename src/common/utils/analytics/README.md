# Google Analytics - Estructura y Uso

Sistema centralizado de analytics para Artist Hive, con eventos tipados y trackers específicos por dominio.

## 📁 Estructura

```
analytics/
├── analytics.ts          # Funciones core de Google Analytics
├── events.ts            # Definiciones de eventos tipados
├── RouteTracker.ts      # Componente para tracking de vistas de página
├── index.ts             # Exportaciones centralizadas
└── trackers/            # Trackers específicos por dominio
    ├── profileTracker.ts    # Tracking de perfiles (Artist/Place/Academy)
    ├── searchTracker.ts     # Tracking de búsquedas
    ├── prebookingTracker.ts # Tracking de prebookings
    └── index.ts
```

## 🎯 Uso del RouteTracker

El `RouteTracker` es un componente que automáticamente trackea vistas de página y actualiza el título del documento.

### Ejemplos:

```tsx
import { RouteTracker, EntityType } from '~/common/utils/analytics';

// 1. Vista simple de página
<RouteTracker />

// 2. Vista de perfil de artista
<RouteTracker
  entity={artist}
  entityType={EntityType.ARTIST}
/>

// 3. Vista de perfil con tab específico
<RouteTracker
  entity={artist}
  entityType={EntityType.ARTIST}
  tab="media"  // Tab actual: info, media, contact, rider, stageplot, events
/>

// 4. Página de prebookings con filtros
<RouteTracker
  section="prebookings"
  function="filter"
/>

// 5. Vista personalizada
<RouteTracker
  customTitle="Página Especial"
  customProperties={{ campaign: 'summer_2024' }}
/>
```

### Implementación en páginas existentes:

**Artist Details:**
```tsx
// ArtistDetails/index.tsx
import { RouteTracker, EntityType } from '~/common/utils/analytics';

const ArtistDetailsPage = () => {
  const artist = useSelector(selectorCurrentArtist);
  const [currentTab, setCurrentTab] = useState('info');

  return (
    <>
      <RouteTracker
        entity={artist}
        entityType={EntityType.ARTIST}
        tab={currentTab}
      />
      {/* Rest of component */}
    </>
  );
};
```

**Place Details:**
```tsx
// PlaceDetailsPage/index.tsx
import { RouteTracker, EntityType } from '~/common/utils/analytics';

const PlaceDetailsPage = () => {
  const place = useSelector(selectorCurrentPlace);
  const [currentTab, setCurrentTab] = useState('info');

  return (
    <>
      <RouteTracker
        entity={place}
        entityType={EntityType.PLACE}
        tab={currentTab}
      />
      {/* Rest of component */}
    </>
  );
};
```

**Prebookings List:**
```tsx
// PrebookingsListPage.tsx
import { RouteTracker } from '~/common/utils/analytics';

const PrebookingsListPage = () => {
  return (
    <>
      <RouteTracker
        section="prebookings"
        customProperties={{
          view_mode: viewMode,  // cards | table
          has_filters: hasAnyActiveFilter
        }}
      />
      {/* Rest of component */}
    </>
  );
};
```

## 📊 Trackers Específicos

### Profile Tracker

```tsx
import { trackProfileView, trackProfileTabView, trackProfileContactClick } from '~/common/utils/analytics';

// Track vista de perfil
trackProfileView({
  profileId: artist.identifier,
  profileName: artist.name,
  entityType: EntityType.ARTIST,
  viewerUserId: loggedUser?.identifier,
  viewerProfileId: loggedUser?.currentProfileId,
  tab: 'media',
  pagePath: window.location.pathname,
});

// Track cambio de tab
trackProfileTabView({
  profileId: artist.identifier,
  profileName: artist.name,
  entityType: EntityType.ARTIST,
  tab: 'stageplot',
});

// Track click en contacto
trackProfileContactClick({
  profileId: artist.identifier,
  profileName: artist.name,
  entityType: EntityType.ARTIST,
  contactMethod: 'whatsapp',
});
```

### Search Tracker

```tsx
import { trackSearch, trackSearchResultClick } from '~/common/utils/analytics';

// En el slice de search (ya implementado parcialmente)
trackSearch({
  searchTerm: 'salsa band',
  entityType: EntityType.ARTIST,
  resultsCount: 15,
});

// Al hacer click en un resultado
trackSearchResultClick({
  searchTerm: 'salsa band',
  resultName: artist.name,
  entityType: EntityType.ARTIST,
  profileId: artist.identifier,
  resultPosition: 3,  // Posición en los resultados
});
```

### Prebooking Tracker

```tsx
import {
  trackPrebookingCreateStart,
  trackPrebookingCreateComplete,
  trackPrebookingResponse,
  trackPrebookingFilter,
} from '~/common/utils/analytics';

// Al abrir el diálogo de crear prebooking
trackPrebookingCreateStart({
  viewerUserId: loggedUser.identifier,
  viewerProfileId: loggedUser.currentProfileId,
  targetProfiles: `${artist.name} + ${place.name}`,
});

// Al completar la creación
trackPrebookingCreateComplete({
  prebookingId: newPrebooking.identifier,
  eventName: newPrebooking.event_name,
  creatorUserId: loggedUser.identifier,
  creatorProfileId: loggedUser.currentProfileId,
  participantsCount: participants.length,
  flexibleDates: formData.flexible_dates,
});

// Al responder a un prebooking
trackPrebookingResponse({
  prebookingId: prebooking.identifier,
  eventName: prebooking.event_name,
  responderUserId: loggedUser.identifier,
  responderProfileId: loggedUser.currentProfileId,
  responseStatus: 'accepted',  // 'accepted' | 'rejected' | 'pending'
});

// Al aplicar filtros
trackPrebookingFilter({
  filterType: 'my_approval',
  filterValue: 'accepted',
});
```

## 🎯 Eventos Clave a Implementar

### Prioridad Alta (Críticos para el negocio):

1. **Vistas de Perfil** ✅ Implementado
   - Artist view
   - Place view
   - Tab views (media, rider, stageplot, etc.)

2. **Búsquedas** ✅ Parcialmente implementado
   - Search performed
   - Result clicks
   - No results

3. **Prebookings** ⚠️ Por implementar
   - Create start/complete/abandon
   - Response (accept/reject)
   - Filter application
   - Status changes

### Prioridad Media:

4. **Interacciones de Perfil**
   - Contact clicks
   - Share actions
   - Media views
   - External link clicks

5. **Conversiones**
   - Prebooking fully accepted
   - Profile completion
   - Profile claim

### Prioridad Baja:

6. **Eventos**
   - Event views
   - Event interest
   - Event shares

7. **Usuario**
   - Login
   - Signup
   - Profile switch

## 📝 Próximos Pasos

1. **Implementar RouteTracker** en todas las páginas principales:
   - ✅ Artist Details
   - ✅ Place Details
   - ✅ Prebookings List
   - ⬜ Event Details
   - ⬜ Search Page
   - ⬜ Calendar

2. **Agregar tracking de prebookings** en:
   - ⬜ PreBookingRequestDialog (create)
   - ⬜ PrebookingsListPage (filters, status changes)
   - ⬜ PrebookingsDetailsPage (view, response)

3. **Mejorar tracking de búsquedas** en:
   - ⬜ Search slice (ya parcialmente implementado)
   - ⬜ Search results clicks

4. **Configurar Google Analytics**:
   - ⬜ Crear custom dimensions para entity_type, entity_id, tab, etc.
   - ⬜ Configurar conversion goals
   - ⬜ Configurar funnels para prebooking creation

## 🔧 Configuración de Custom Dimensions en GA

Para aprovechar al máximo los datos estructurados, configura estas custom dimensions en Google Analytics:

1. `entity_type` - Artist, Place, Event, etc.
2. `entity_id` - ID del entity
3. `entity_name` - Nombre del entity
4. `tab` - Tab actual en vistas de perfil
5. `section` - Sección de la app
6. `function` - Función específica
7. `viewer_user_id` - ID del usuario que visualiza
8. `viewer_profile_id` - ID del perfil activo

## 📈 Métricas Clave a Monitorear

1. **Profile Engagement**:
   - Vistas por tipo de entidad
   - Tabs más visitados
   - Clicks en contacto/share

2. **Search Performance**:
   - Términos de búsqueda más comunes
   - Tasa de click en resultados
   - Búsquedas sin resultados

3. **Prebooking Funnel**:
   - Tasa de creación (start → complete)
   - Tasa de abandono por paso
   - Tiempo hasta aceptación
   - Tasa de conversión (accepted/total)

4. **User Behavior**:
   - Paths más comunes
   - Tiempo en perfiles
   - Interacciones por sesión
