# Plan de Implementación: Sistema de Pre-Reservas de Eventos

## Resumen Ejecutivo

Implementar un sistema completo de **pre-reservas multi-participantes** que permita a artistas, venues y bookers solicitar fechas para eventos, con un flujo de **aprobación colaborativa** donde TODOS los involucrados deben aceptar antes de convertirse en un evento formal.

**Características principales:**
- ✅ Soporte multi-party (N artistas + M venues + booker)
- ✅ Cualquier rechazo veta toda la solicitud
- ✅ Calendario de disponibilidad híbrido (ultra rápido)
- ✅ Dashboard tipo Google Calendar
- ✅ Conversión automática a EventModel al aprobar todos
- ✅ Sistema de notas/comentarios por participante
- ✅ Máxima reutilización de componentes existentes

---

## Análisis del Problema

### Contexto Actual
- Existe EventModel con confirmation_status pero los eventos son entidades complejas y definitivas
- PlaceDetailsPage y ArtistDetailsPage ya tienen FAB preparado para booking
- Hay CalendarSimpleLayout para mostrar eventos
- Sistema de Redux Saga establecido para operaciones CRUD
- DynamicForm disponible para formularios complejos

### Necesidad
- Sistema ligero de "intención de reserva" previo al evento formal
- Flujo bilateral: Artist → Place o Place → Artist
- Dashboard tipo Google Calendar para gestión de solicitudes
- Reutilización máxima de componentes existentes

---

## Arquitectura de la Solución

## Sistema de Componentes Actualizado

### Component Builder System (ProfileTabsPage)

El sistema de construcción de componentes ha sido **refactorizado** para separar la lógica de construcción del layout:

```
src/components/shared/organisms/ProfileTabsPage/
├── ProfileTabsPage.tsx                    # Layout principal
├── componentBuilders/                     # ✨ Sistema de builders
│   ├── index.ts                          # Registro centralizado con lazy loading
│   ├── ComponentBuilder.ts               # Core (registro + dispatch)
│   ├── types.ts                          # ComponentBuilderParams, BuilderRegistry
│   ├── builders/                         # 17 builders individuales
│   │   ├── MapBuilder.tsx
│   │   ├── AttributesIconFieldsBuilder.tsx
│   │   ├── HtmlContentBuilder.tsx
│   │   ├── ProfileThumbnailCardBuilder.tsx
│   │   └── ... (13 más)
│   └── utils/
│       ├── dataExtraction.ts             # getData, getAttributeTitle
│       └── componentProcessing.ts        # processAttribute
```

**Beneficios**:
- ✅ **Reutilización**: Los builders se pueden usar fuera de ProfileTabsPage
- ✅ **Modularidad**: Cada tipo de componente en su propio archivo
- ✅ **Testing**: Builders testeables de forma aislada
- ✅ **Performance**: Lazy loading automático de builders
- ✅ **Backward Compatible**: ProfileTabsPage sigue funcionando igual

**Uso independiente**:
```typescript
import { buildComponent } from '~/components/shared/organisms/ProfileTabsPage/componentBuilders';

const mapComponent = buildComponent({
  componentDescriptor: {
    componentName: ProfileComponentTypes.MAP,
    data: { lat: 'latitude', lng: 'longitude' }
  },
  entityData: artist,
  subpage: { name: 'custom' },
  section: { name: 'custom' },
  componentIndex: 0,
  translationBasePath: 'app.custom'
});
```

### DynamicForm System (Refactorizado)

El sistema de formularios dinámicos ha sido **refactorizado** para permitir uso independiente de `create*` functions:

**Cambios principales**:
1. ✅ **Parámetro `formContext` opcional** en todos los `create*` functions
2. ✅ **Híbrido**: `formContext || useFormContext()` (backward compatible)
3. ✅ **Uso independiente**: Se pueden usar sin `DynamicTabbedForm`

**Componentes refactorizados prioritarios** (para PreBookingDialog):
- ✅ `createDatePicker()` - DateSelector.tsx
- ✅ `createTextField()` - TextField.tsx
- ✅ `createSelectField()` - SelectField.tsx
- ✅ `createAutocomplete()` - Autocomplete.tsx

**Uso con DynamicForm** (sin cambios - backward compatible):
```typescript
<DynamicForm
  fields={fields}
  onSubmit={handleSubmit}
/>
// Internamente usa FormProvider + useFormContext()
```

**Uso independiente** (nuevo):
```typescript
const methods = useForm();

const datePicker = createDatePicker({
  formContext: methods,        // ✅ Pasa explícitamente
  fieldData: {
    fieldName: 'requested_date_start',
    label: 'Fecha de inicio',
    inputType: 'date',
    config: { required: true },
    componentParams: { disablePast: true }
  },
  register: methods.register,
  errors: methods.formState.errors
});

return <Dialog>{datePicker}</Dialog>;
```

**Estado actual**: ✅ Refactor completado en Fase 3 (4 componentes prioritarios)

---

### 1. Modelo de Datos (PreBookingRequest)

**Nombre mejorado**: `PreBookingRequestTemplate` - refleja mejor que es una solicitud previa al booking formal.

```typescript
interface PreBookingRequestTemplate extends EntityTemplate {
  // ===== PARTICIPANTES (Multi-party support) =====
  // Quien inicia la solicitud (puede ser artist, place, booker, etc.)
  requester: ProfileModel;        // Referencia completa al profile
  requester_id: string;           // ID para queries rápidos

  // A quienes se solicita (puede ser múltiple: venue + varios artists)
  recipients: ProfileModel[];     // Array de perfiles involucrados
  recipient_ids: string[];        // IDs para queries

  // Artistas adicionales que también deben aceptar
  additional_participants: ProfileModel[]; // Todos deben aprobar
  additional_participant_ids: string[];

  // Estado de aprobación por participante
  participant_approvals: ParticipantApprovalStatus[];

  // ===== DETALLES TEMPORALES (con hora y minuto) =====
  requested_date_start: Dayjs;    // Fecha Y HORA inicio (ej: 2025-01-15 20:00)
  requested_date_end: Dayjs;      // Fecha Y HORA fin (ej: 2025-01-15 23:30)
  request_type: 'single_date' | 'date_range' | 'week' | 'month' | 'quarter';
  flexible_dates: boolean;        // ¿Acepta fechas alternativas?
  alternative_dates?: DateRange[]; // Rangos alternativos si flexible (también con hora)

  // ===== DETALLES BÁSICOS =====
  event_name: string;             // Nombre tentativo
  description: string;            // Descripción breve
  expected_attendance: number;    // Asistencia esperada

  // ===== PRESUPUESTO (V2 - Removido por complejidad) =====
  // estimated_cost: CostRange;   // Postponed - Muy complejo, depende de negociaciones
  // currency: string;             // Postponed - Se manejará en EventModel final

  // ===== ESTADO =====
  status: PreBookingRequestStatus;
  overall_approval_status: ApprovalStatus; // ALL_PENDING, PARTIAL, ALL_APPROVED, REJECTED

  // Notas por participante
  notes: ParticipantNote[];       // Cada uno puede agregar notas

  // ===== METADATA =====
  created_by: string;             // user_id del creador
  event_id?: string;              // Si se convierte en evento
  response_deadline: Dayjs;       // Plazo para responder (DEFAULT: +90 días)
  created_at: Dayjs;
  updated_at: Dayjs;
  last_viewed_by?: Record<string, Dayjs>; // Tracking de vistas por user
}

// ===== TIPOS AUXILIARES =====

// CostRange - REMOVIDO (V2)
// Muy complejo para V1 - Se manejará en EventModel
// interface CostRange {
//   min: number;
//   max: number;
//   is_negotiable: boolean;
//   includes_expenses: boolean;
// }

interface DateRange {
  start: Dayjs;                   // Incluye fecha, hora y minuto
  end: Dayjs;                     // Incluye fecha, hora y minuto
  priority: number;               // 1 = preferida, 2 = alternativa, etc.
}

interface ParticipantApprovalStatus {
  participant_id: string;
  participant_type: string;       // 'artist' | 'place' | 'booker' | etc.
  status: 'pending' | 'viewed' | 'accepted' | 'rejected';
  responded_at?: Dayjs;
  response_notes?: string;
}

interface ParticipantNote {
  author_id: string;
  author_name: string;
  note: string;
  created_at: Dayjs;
  is_private: boolean;            // Solo visible para el autor
}

enum PreBookingRequestStatus {
  DRAFT = 'DRAFT',               // Borrador no enviado
  PENDING = 'PENDING',           // Enviada, esperando respuestas (requester NO cuenta)
  PARTIALLY_VIEWED = 'PARTIALLY_VIEWED', // Algunos la vieron (sin contar requester)
  PARTIALLY_ACCEPTED = 'PARTIALLY_ACCEPTED', // Algunos aceptaron (sin contar requester)
  ALL_ACCEPTED = 'ALL_ACCEPTED', // Cumple mínimo: 1 de cada tipo
  REJECTED = 'REJECTED',         // Todos de al menos un tipo rechazaron
  CANCELLED = 'CANCELLED',       // Cancelada por solicitante
  CONVERTED = 'CONVERTED',       // Convertida en evento
  EXPIRED = 'EXPIRED'            // Expiró response_deadline (90 días default)
}

enum ApprovalStatus {
  ALL_PENDING = 'ALL_PENDING',           // Nadie ha respondido (excepto requester)
  PARTIAL = 'PARTIAL',                   // Algunos aceptaron (sin contar requester)
  ALL_APPROVED = 'ALL_APPROVED',         // Al menos 1 de cada tipo aceptó
  REJECTED = 'REJECTED'                  // TODOS de un tipo rechazaron
}
```

**Lógica de Aprobación Multi-Party (ACTUALIZADA V2):**

**Regla de Aprobación por Tipo de Perfil:**
- Se requiere **al menos UNA aprobación** de cada TIPO de perfil involucrado (sin contar requester)
- Ejemplo: 3 artistas + 1 venue → Necesita mínimo 1 artist ACCEPTED + 1 place ACCEPTED
- Ejemplo: 2 artistas + 2 venues → Necesita mínimo 1 artist ACCEPTED + 1 place ACCEPTED

**Regla de Rechazo (ACTUALIZADA):**
- Status = REJECTED solo si **TODOS los participantes de UN MISMO tipo** rechazan
- Ejemplos:
  - 3 artists (TODOS rechazan) + 1 place (acepta) → REJECTED ❌
  - 2 artists (1 acepta, 1 rechaza) + 1 place (rechaza) → REJECTED ❌ (solo 1 place y rechazó)
  - 2 artists (1 acepta, 1 rechaza) + 2 places (1 acepta, 1 rechaza) → ALL_ACCEPTED ✅
  - 3 artists (2 rechazan, 1 acepta) + 2 places (2 aceptan) → ALL_ACCEPTED ✅

**Auto-aprobación del Requester:**
- Al crear la solicitud, el requester se marca automáticamente como ACCEPTED
- Su aprobación cuenta para su tipo de perfil
- Ejemplo: Artist crea solicitud → Ya tiene 1 artist ACCEPTED desde el inicio
- Solo necesita esperar aprobación de al menos 1 place (o del tipo faltante)
- **IMPORTANTE**: El requester NO cuenta para PARTIALLY_ACCEPTED (solo otros participantes)

**Response Deadline (DEFAULT: 90 días):**
- Al crear: `response_deadline = created_at + 90 días`
- Usuario puede editarlo al crear (ej: 30, 60, 120 días)
- Si pasa deadline sin ALL_ACCEPTED → Status = EXPIRED

**Cancelación:**
- El requester puede cancelar en cualquier momento antes de conversión

### 2. Backend Considerations (MongoDB Optimization)

**Calendario de Disponibilidad - Enfoque Híbrido (Opción 2 + Opción 1):**

Combinamos ambas estrategias para máxima agilidad en comparación multi-participantes:

```javascript
// ===== COLECCIÓN 1: availability_calendar (Lectura ultra rápida) =====
// IMPORTANTE: Incluye slots con HORA Y MINUTO para múltiples eventos por día
{
  _id: ObjectId("..."),
  profile_id: "artist_abc123",
  profile_type: "artist",           // 'artist' | 'place' | 'booker'
  year_month: "2025-01",            // Índice compuesto para O(1) lookup

  // Días del mes con SLOTS DE TIEMPO (array de bloques horarios)
  days: {
    "1": {
      status: "available",
      slots: []                     // Sin eventos = completamente disponible
    },
    "15": {
      status: "partially_occupied", // Ocupado parcialmente (algunos slots)
      slots: [
        {
          start: ISODate("2025-01-15T20:00:00Z"),  // 8:00 PM
          end: ISODate("2025-01-15T23:30:00Z"),    // 11:30 PM
          status: "occupied",
          type: "event",
          ref_id: "evt_123",
          name: "Concierto Rock"
        },
        {
          start: ISODate("2025-01-15T14:00:00Z"),  // 2:00 PM
          end: ISODate("2025-01-15T16:00:00Z"),    // 4:00 PM
          status: "tentative",
          type: "prebooking",
          ref_id: "pb_789",
          name: "Soundcheck tentativo"
        }
      ]
    },
    "16": {
      status: "occupied",           // Completamente ocupado (día completo)
      slots: [
        {
          start: ISODate("2025-01-16T00:00:00Z"),
          end: ISODate("2025-01-16T23:59:59Z"),
          status: "occupied",
          type: "event",
          ref_id: "evt_456",
          name: "Festival todo el día"
        }
      ]
    },
    "20": {
      status: "blocked",
      slots: [
        {
          start: ISODate("2025-01-20T00:00:00Z"),
          end: ISODate("2025-01-20T23:59:59Z"),
          status: "blocked",
          type: "manual",
          reason: "Vacaciones"
        }
      ]
    }
  },

  // Resumen del mes
  summary: {
    fully_available: 18,            // Días sin ningún slot
    partially_occupied: 8,          // Días con algunos slots ocupados
    fully_occupied: 3,              // Días completamente ocupados
    blocked: 2
  },

  last_updated: ISODate("2025-01-10T10:30:00Z")
}

// ===== COLECCIÓN 2: availability_ranges (Para comparación multi-party) =====
{
  _id: ObjectId("..."),
  profile_id: "artist_abc123",
  profile_type: "artist",

  // Array ordenado por fecha (eficiente para intersecciones)
  ranges: [
    {
      start: ISODate("2025-01-15"),
      end: ISODate("2025-01-15"),
      type: "event",
      ref_id: "evt_123",
      status: "confirmed"
    },
    {
      start: ISODate("2025-02-01"),
      end: ISODate("2025-02-28"),
      type: "tour",
      ref_id: "tour_789",
      status: "confirmed"
    },
    {
      start: ISODate("2025-03-14"),
      end: ISODate("2025-03-16"),
      type: "prebooking",
      ref_id: "pb_456",
      status: "pending"
    }
  ],

  last_sync: ISODate("2025-01-10T10:30:00Z")
}

// ===== ESTRATEGIA DE CONSULTA =====

// CASO 1: Mostrar calendario de UN perfil (UI individual)
// → Usar availability_calendar (1 query, ~5ms)
db.availability_calendar.find({
  profile_id: "artist_abc123",
  year_month: { $in: ["2025-01", "2025-02", "2025-03"] }
})

// CASO 2: Comparar MÚLTIPLES participantes (crear pre-booking)
// → Usar availability_ranges en PARALELO, intersección en frontend
const participantIds = ["artist_1", "artist_2", "artist_3", "place_1"];

// Backend retorna 4 documentos en paralelo (~50ms total)
const allRanges = await Promise.all(
  participantIds.map(id =>
    db.availability_ranges.findOne({ profile_id: id })
  )
);

// Frontend calcula fechas libres para TODOS (más eficiente que JOIN)
const commonAvailability = calculateIntersection(allRanges, dateRange);

// ===== ÍNDICES CRÍTICOS (Performance) =====

// Calendario mensual (query más frecuente)
db.availability_calendar.createIndex({
  "profile_id": 1,
  "year_month": 1
}, { unique: true })

// Ranges por perfil (comparación multi-party)
db.availability_ranges.createIndex({ "profile_id": 1 }, { unique: true })

// Búsqueda por rango de fechas
db.availability_ranges.createIndex({
  "profile_id": 1,
  "ranges.start": 1,
  "ranges.end": 1
})

// Pre-bookings por participante y fecha
db.preBookingRequests.createIndex({
  "recipient_ids": 1,
  "requested_date_start": 1,
  "status": 1
})

db.preBookingRequests.createIndex({
  "additional_participant_ids": 1,
  "requested_date_start": 1
})

// Búsqueda por estado de aprobación individual
db.preBookingRequests.createIndex({
  "participant_approvals.participant_id": 1,
  "participant_approvals.status": 1
})

// ===== SINCRONIZACIÓN =====
// Al crear/actualizar evento o pre-booking:
// 1. Actualizar availability_calendar (días específicos)
// 2. Actualizar availability_ranges (agregar/modificar range)
// 3. Usar transactions para consistencia

// ===== PERFORMANCE ESPERADO =====
// Con slots de tiempo (hora/minuto):
// ✅ Lectura 1 mes (single): ~5-10ms
// ✅ Lectura 12 meses (single): ~60-100ms
// ✅ Comparar 5-10 perfiles (3 meses): ~300-500ms  // Caso típico
// ✅ Comparar 50 perfiles (3 meses): ~2-3 segundos  // Caso extremo (raro)
// ✅ Total para UI multi-party (5-10 participantes): < 500ms ✅

// Lógica de detección de conflictos:
// Para saber si hay conflicto entre slots, frontend compara:
// - newSlot.start < existingSlot.end && newSlot.end > existingSlot.start
// Si TRUE → HAY CONFLICTO (overlap de tiempo)
```

**Ventajas del Híbrido:**
- **Opción 2 (calendar)**: UI rápida, visualización individual
- **Opción 1 (ranges)**: Comparación eficiente multi-party
- **Frontend calcula intersecciones**: Evita queries complejas en Mongo
- **Escalable**: Funciona con 2 o 20 participantes
- **Cacheable**: `month_summary` se puede cachear por horas

---

## Lista de Tareas Pendientes

### FASE 1: Modelo y Redux (Backend Integration)
- [ ] 1.1 Crear PreBookingRequestModel en `src/models/domain/prebooking/prebooking-request.model.tsx`
- [ ] 1.2 Crear interfaces:
  - PreBookingRequestTemplate (campos principales)
  - CostRange, DateRange, ParticipantApprovalStatus, ParticipantNote
  - Enums: PreBookingRequestStatus, ApprovalStatus
- [ ] 1.3 Implementar métodos auxiliares del modelo:
  - `isActive()` - Si está en estado activo (no cancelled/converted/expired)
  - `canCancel(userId)` - Si el usuario puede cancelar (requester_id === userId)
  - `canEdit(userId)` - Si puede editar (requester + status DRAFT/PENDING)
  - `canApprove(userId)` - Si el usuario es participante y puede aprobar
  - `getUserApprovalStatus(userId)` - Estado de aprobación del usuario
  - `hasMinimumApprovalsPerType()` - **CLAVE**: Valida que al menos 1 de cada tipo de perfil aprobó
  - `getApprovalsByProfileType(type)` - Retorna aprobaciones filtradas por tipo ('artist' | 'place' | etc.)
  - `isFullyRejectedByType(type)` - Si TODOS los perfiles de un tipo rechazaron
  - `getAllParticipants()` - Array completo de participantes (requester + recipients + additional)
  - `getRequiredProfileTypes()` - Array de tipos únicos requeridos (ej: ['artist', 'place'])
  - `autoApproveRequester()` - Marca al requester como ACCEPTED al crear
- [ ] 1.4 Crear Redux slice en `src/common/slices/domain/prebooking/prebooking-requests.redux.ts`
- [ ] 1.5 Crear selectores específicos:
  - `selectPendingRequests` - Solicitudes pendientes del usuario
  - `selectReceivedRequests` - Solicitudes recibidas
  - `selectSentRequests` - Solicitudes enviadas
  - `selectRequestsByDateRange` - Por rango de fechas
  - `selectRequestsRequiringAction` - Que requieren acción del usuario
- [ ] 1.6 Agregar traducciones en `src/translations/es.tsx` y `en.tsx`:
  - Estados de pre-booking
  - Campos del formulario
  - Mensajes de éxito/error
  - Labels del dashboard

### FASE 2: Componente de Creación de Solicitud (FAB Flow)

**NOTA IMPORTANTE**: Esta fase utiliza el **DynamicForm System refactorizado** descrito arriba.

#### 2.1 Crear PreBookingRequestDialog Component

**Archivo**: `src/components/shared/organisms/domain/prebooking/PreBookingRequestDialog/PreBookingRequestDialog.tsx`

**Estrategia de Implementación**:
- ✅ **SIN usar DynamicTabbedForm** (layout custom)
- ✅ **Usar create\* functions directamente** con `formContext` explícito
- ✅ **Material-UI Dialog** para el modal
- ✅ **react-hook-form** con `useForm()` manual

**Arquitectura del componente**:
```typescript
import { useForm, FormProvider } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { createDatePicker } from '~/components/shared/organisms/gui/dynamicForms/components/DateSelector';
import { createTextField } from '~/components/shared/organisms/gui/dynamicForms/components/TextField';
import { createAutocomplete } from '~/components/shared/organisms/gui/dynamicForms/components/Autocomplete';

export const PreBookingRequestDialog = ({ open, onClose, recipient }) => {
  const methods = useForm<PreBookingFormData>();

  // ✅ Crear componentes pasando formContext explícitamente
  const startDateField = createDatePicker({
    formContext: methods,  // ✅ Sin FormProvider necesario
    fieldData: { /* config */ },
    register: methods.register,
    errors: methods.formState.errors
  });

  const endDateField = createDatePicker({
    formContext: methods,
    fieldData: { /* config */ },
    register: methods.register,
    errors: methods.formState.errors
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <DialogContent>
          {startDateField}
          {endDateField}
          {/* Más campos */}
        </DialogContent>
      </form>
    </Dialog>
  );
};
```

**Checklist detallado**:
- [ ] 2.1.1 Crear estructura de carpeta `PreBookingRequestDialog/`
- [ ] 2.1.2 Configurar types para `PreBookingFormData`
- [ ] 2.1.3 Implementar layout base del Dialog (Material-UI)
- [ ] 2.1.4 Configurar `useForm()` con validación schema (Yup o Zod)
- [ ] 2.2 Implementar selector de tipo de reserva (tabs: Día | Rango | Semana | Mes | Trimestre)
  - [ ] 2.2.1 Usar Material-UI Tabs para tipo de reserva
  - [ ] 2.2.2 Condicionar campos según tipo seleccionado
- [ ] 2.3 Integrar CalendarDatePicker para selección de fechas
  - [ ] 2.3.1 Fecha inicio con `createDatePicker({ formContext: methods })`
  - [ ] 2.3.2 Fecha fin con `createDatePicker({ formContext: methods })`
  - [ ] 2.3.3 Agregar validación: end >= start
  - [ ] 2.3.4 Agregar selector de hora (time picker) con minutos
  - [ ] 2.3.5 Configurar `disablePast: true` en componentParams
- [ ] 2.4 Crear formulario con campos básicos usando create* functions:
  - [ ] 2.4.1 Nombre del evento: `createTextField({ formContext: methods, config: { required: true } })`
  - [ ] 2.4.2 Descripción: `createTextField({ formContext: methods, multiline: true, maxLength: 500 })`
  - [ ] 2.4.3 Asistencia esperada: `createTextField({ formContext: methods, type: 'number' })`
- [ ] 2.5 Agregar selector multi-party:
  - [ ] 2.5.1 Recipients: `createAutocomplete({ formContext: methods, multiple: true })`
  - [ ] 2.5.2 Artistas adicionales: `createAutocomplete({ formContext: methods, multiple: true })`
  - [ ] 2.5.3 Componente visual: Contador de participantes totales
  - [ ] 2.5.4 Validación: Mínimo 1 recipient
- [ ] 2.6 Agregar campos de presupuesto:
  - [ ] 2.6.1 Costo mínimo: `createTextField({ formContext: methods, type: 'number' })`
  - [ ] 2.6.2 Costo máximo: `createTextField({ formContext: methods, type: 'number' })`
  - [ ] 2.6.3 Moneda: `createSelectField({ formContext: methods, options: ['USD', 'EUR', 'COP'] })`
  - [ ] 2.6.4 Checkbox "Incluye gastos": `createSwitchField({ formContext: methods })`
  - [ ] 2.6.5 Checkbox "Es negociable": `createSwitchField({ formContext: methods })`
- [ ] 2.7 Agregar fechas flexibles:
  - [ ] 2.7.1 Toggle "Acepta fechas alternativas": `createSwitchField({ formContext: methods })`
  - [ ] 2.7.2 Si activado, mostrar lista de rangos alternativos
  - [ ] 2.7.3 Cada rango: start, end, priority (1, 2, 3...)
  - [ ] 2.7.4 Botón "Agregar rango alternativo"
- [ ] 2.8 Implementar validación de formulario (react-hook-form + Yup)
  - [ ] 2.8.1 Schema de validación con `yup.object().shape({})`
  - [ ] 2.8.2 Validaciones cross-field (end >= start, max >= min, etc.)
  - [ ] 2.8.3 Mostrar errores con `methods.formState.errors`
- [ ] 2.9 Conectar formulario con Redux action `createPreBookingRequest`
  - [ ] 2.9.1 `const dispatch = useDispatch()`
  - [ ] 2.9.2 `onSubmit`: transformar data y dispatch action
  - [ ] 2.9.3 Cerrar dialog on success
  - [ ] 2.9.4 Mostrar loading state durante submit
- [ ] 2.10 Integrar el dialog en PlaceDetailsPage (FAB click)
  - [ ] 2.10.1 Agregar state `openPreBookingDialog` en PlaceDetailsPage
  - [ ] 2.10.2 FAB onClick → `setOpenPreBookingDialog(true)`
  - [ ] 2.10.3 Pasar `recipient={place}` al dialog
- [ ] 2.11 Integrar el dialog en ArtistDetailsPage (FAB click)
  - [ ] 2.11.1 Similar a PlaceDetailsPage
  - [ ] 2.11.2 Pasar `recipient={artist}` al dialog

**Ventajas de este enfoque**:
- ✅ **Reutilización**: Usa los mismos `create*` functions que DynamicForm
- ✅ **Flexibilidad**: Layout 100% custom (no limitado por tabs)
- ✅ **Mantenibilidad**: Si se mejora `createDatePicker`, se beneficia automáticamente
- ✅ **Consistencia**: Misma UX que otros formularios del sistema

### FASE 3: Visualización de Disponibilidad Multi-Party
- [ ] 3.1 Crear `AvailabilityCalendar` component:
  - Modo single: Mostrar calendario de UN perfil
  - Modo multi: Comparar disponibilidad de TODOS los participantes
  - Indicadores visuales: disponible (verde), ocupado (rojo), tentative (amarillo), bloqueado (gris)
- [ ] 3.2 Crear utilidad `calculateCommonAvailability`:
  - Recibe array de availability_ranges de múltiples perfiles
  - Calcula intersección de fechas disponibles
  - Retorna solo días libres para TODOS
- [ ] 3.3 Crear Redux actions para disponibilidad:
  - `loadAvailabilityCalendar({ profileId, yearMonth })` - Un perfil
  - `loadAvailabilityRanges({ profileIds, dateRange })` - Multi-party
- [ ] 3.4 Crear API endpoint mocks (temporal para desarrollo):
  - `GET /api/availability/calendar/:profileId/:yearMonth`
  - `GET /api/availability/ranges/:profileId`
  - `GET /api/availability/compare` (body: { profileIds, dateRange })
- [ ] 3.5 Integrar calendario en PreBookingRequestDialog:
  - Mostrar disponibilidad del recipient principal
  - Si hay múltiples participantes, mostrar solo fechas comunes
  - Deshabilitar fechas no disponibles en el picker
- [ ] 3.6 Agregar leyenda de colores en calendario
- [ ] 3.7 Optimizar: Cachear availability_calendar por 15 minutos

### FASE 4: Dashboard de Solicitudes
- [ ] 4.1 Crear página `PreBookingDashboardPage` en `src/components/Pages/PreBookingPage/`
- [ ] 4.2 Crear layout con dos vistas toggleables:
  - Vista Calendario (tipo Google Calendar)
  - Vista Lista (cards)
- [ ] 4.3 Implementar tabs principales:
  - "Recibidas" (solicitudes donde el usuario es recipient/participant)
  - "Enviadas" (solicitudes donde el usuario es requester)
  - "Todas" (combinadas)
- [ ] 4.4 Crear `PreBookingRequestCard` component:
  - Avatar(s) de participantes
  - Nombre del evento + fecha
  - Badge de estado (color según status)
  - Badge de aprobación (X/Y aprobaron)
  - Botón "Ver detalles"
  - Acciones rápidas según rol (Aprobar/Rechazar si es recipient pending)
- [ ] 4.5 Implementar filtros avanzados:
  - Estado (PENDING, ACCEPTED, REJECTED, etc.)
  - Fecha del evento (rango)
  - Tipo de solicitud (single/range/week/etc.)
  - Participantes (buscar por nombre)
  - Requiere mi acción (pending approval del usuario)
- [ ] 4.6 Agregar búsqueda global:
  - Por nombre de evento
  - Por artista
  - Por venue
  - Por fecha
- [ ] 4.7 Separar automáticamente:
  - Solicitudes futuras (fecha evento >= hoy)
  - Solicitudes pasadas (fecha evento < hoy)
  - Criterio: requested_date_start, NO created_at
- [ ] 4.8 Implementar ordenamientos:
  - Por fecha de evento (default)
  - Por fecha de creación
  - Por estado
  - Por número de aprobaciones pendientes
- [ ] 4.9 Agregar contadores y badges:
  - Badge en sidenav con número de solicitudes pendientes de acción
  - Badge en header con total de pendientes
  - Contador en cada tab (Recibidas: 5, Enviadas: 3)
- [ ] 4.10 Agregar paginación (20 items por página)

### FASE 5: Detalle de Solicitud y Acciones Multi-Party
- [ ] 5.1 Crear `PreBookingRequestDetailsPage` usando ProfileTabsPage pattern
- [ ] 5.2 Crear config `config-prebooking-detail.tsx` con secciones:
  - Información General (nombre, descripción, fechas, tipo)
  - Participantes (lista con avatares y estado de aprobación individual)
  - Detalles Económicos (costo estimado, moneda, negociable)
  - Fechas Alternativas (si flexible_dates = true)
  - Notas (thread de notas por participante, con timestamp)
- [ ] 5.3 Crear componente `ParticipantApprovalList`:
  - Muestra lista de todos los participantes
  - Indica estado de cada uno: pending (reloj), viewed (ojo), accepted (check), rejected (X)
  - Progreso visual: "3/5 aprobaron"
  - Resalta al usuario actual
- [ ] 5.4 Implementar acciones según rol y estado:
  - **Requester (creador)**:
    - Cancelar (si no CONVERTED/CANCELLED)
    - Editar (solo si DRAFT o todos PENDING)
    - Ver quién aceptó/rechazó
  - **Recipient/Participant (invitado)**:
    - Aceptar (si su status = pending/viewed)
    - Rechazar (si su status = pending/viewed)
    - Agregar nota privada
    - Agregar nota pública (visible para todos)
    - Ver disponibilidad de otros participantes
- [ ] 5.5 Crear modales de confirmación:
  - Modal "Aceptar solicitud" (confirma que tiene disponibilidad)
  - Modal "Rechazar solicitud" (pide motivo opcional)
  - Modal "Cancelar solicitud" (solo para requester)
  - Modal "Convertir a evento" (cuando ALL_ACCEPTED)
- [ ] 5.6 Implementar lógica de conversión a evento:
  - Validar que overall_approval_status = ALL_APPROVED
  - Crear EventModel borrador con datos pre-llenados:
    - name = event_name
    - artists = extraer de participants tipo 'artist'
    - place = extraer de participants tipo 'place'
    - timetable__initial_date = requested_date_start
    - timetable__end_date = requested_date_end
  - Actualizar PreBookingRequest.status = CONVERTED
  - Actualizar PreBookingRequest.event_id = nuevo event_id
  - Redirigir a EventCreatePage con datos pre-llenados
- [ ] 5.7 Crear sistema de notas/comentarios:
  - Componente `ParticipantNoteThread`
  - Input para agregar nota
  - Toggle: Nota privada vs pública
  - Mostrar autor, timestamp, contenido
  - Actualizar en tiempo real (polling cada 30s)
- [ ] 5.8 Agregar notificaciones de cambio de estado:
  - Toast al aprobar/rechazar
  - Toast cuando alguien más aprueba
  - Toast cuando se convierte a evento
  - Opcional: Integrar con sistema de notificaciones existente
- [ ] 5.9 Implementar actualización automática:
  - Polling cada 30 segundos para detectar cambios
  - Indicador visual "Actualizado hace X minutos"
  - Botón manual "Refrescar"
  - Opcional (V2): WebSocket para real-time

### FASE 6: Integración con Perfiles
- [ ] 6.1 Agregar subpage "Pre-Reservas" en config-place-detail.tsx:
  - Sección "Solicitudes Recibidas" (como venue)
  - Sección "Solicitudes Enviadas" (si el place envió alguna)
  - Usar ProfileComponentTypes.HTML_CONTENT con componente custom
- [ ] 6.2 Agregar subpage "Pre-Reservas" en config-artist-detail.tsx:
  - Sección "Solicitudes Recibidas" (como artista invitado)
  - Sección "Solicitudes Enviadas" (si el artista inició)
  - Lista de pre-bookings relacionadas al artista
- [ ] 6.3 Actualizar ProfileHeader para mostrar:
  - Contador de solicitudes pendientes (badge)
  - Link rápido a "Ver solicitudes"
  - Solo visible si el perfil pertenece al usuario logueado
- [ ] 6.4 Integrar calendario de disponibilidad en perfil público:
  - Nueva subpage "Disponibilidad" (opcional, configurable)
  - Mostrar AvailabilityCalendar en modo read-only
  - Indicar fechas ocupadas sin revelar detalles privados
  - Útil para que otros vean cuándo está disponible
- [ ] 6.5 Actualizar FAB params en PlaceDetailsPage y ArtistDetailsPage:
  - Agregar badge numérico si hay solicitudes pendientes de acción
  - Badge rojo con número de pending approvals del usuario
- [ ] 6.6 Crear componente `ProfilePreBookingsList`:
  - Reutilizable en ambos perfiles (artist/place)
  - Filtra por profile_id en recipients o requester
  - Muestra mini-cards con acciones rápidas

### FASE 7: Routing y Navegación
- [ ] 7.1 Agregar rutas en `src/routes/routes.config.ts`:
  - `/prebooking/dashboard` - Dashboard principal
  - `/prebooking/details/:prebookingId` - Detalle de solicitud
  - `/prebooking/create` - Crear nueva (con query params: recipientId, recipientType)
  - Lazy loading para todas las páginas
- [ ] 7.2 Actualizar sidenav config (`src/components/shared/sidenav/sidenav.config.tsx`):
  - Agregar entrada "Pre-Reservas" en sección domain
  - Icono: calendario con reloj (lu LuCalendarClock)
  - Badge dinámico con contador de pendientes
  - Solo visible si usuario está autenticado
- [ ] 7.3 Configurar protección de rutas:
  - redirectToIfNotLoggedUser: PATHS.LOGIN
  - requireSession: true en todas las rutas de prebooking
- [ ] 7.4 Agregar breadcrumbs en páginas:
  - Dashboard: "Inicio > Pre-Reservas"
  - Detalle: "Inicio > Pre-Reservas > [Nombre Evento]"
  - Crear: "Inicio > Pre-Reservas > Nueva Solicitud"
- [ ] 7.5 Implementar navegación desde notificaciones:
  - Link directo a /prebooking/details/:id
  - Marcar solicitud como "viewed" al abrir

### FASE 8: Optimizaciones y Pulido
- [ ] 8.1 Agregar loading states:
  - Skeleton loaders en dashboard mientras carga lista
  - Spinner en calendar mientras obtiene disponibilidad
  - Loading overlay en modal al crear/actualizar
  - Disable buttons durante operaciones async
- [ ] 8.2 Implementar error handling robusto:
  - Try-catch en todas las Redux actions
  - Mensajes user-friendly (traducidos)
  - Toast notifications para errores
  - Fallback UI si falla carga de datos
  - Retry logic para requests fallidos
- [ ] 8.3 Agregar animaciones de transición:
  - Fade in/out en modals
  - Slide in para notifications
  - Smooth transitions en cambios de estado (badges)
  - Animación al aprobar/rechazar (check/X animado)
- [ ] 8.4 Optimizar performance:
  - useCallback para handlers que se pasan como props
  - useMemo para cálculos costosos (intersección de disponibilidad)
  - React.memo para PreBookingRequestCard (evitar re-renders)
  - Debounce en búsqueda (300ms)
  - Virtualización si lista > 100 items (react-window)
- [ ] 8.5 Agregar tests:
  - Tests unitarios para PreBookingRequestModel métodos
  - Tests para calculateCommonAvailability utility
  - Tests para selectores de Redux
  - Tests de integración para flujo create → approve → convert
- [ ] 8.6 Responsive design completo:
  - Mobile: Cards en columna única, tabs colapsibles
  - Tablet: Grid de 2 columnas para cards
  - Desktop: Grid de 3 columnas
  - Modal responsive: full-screen en mobile
  - Calendar responsive: ajustar tamaño de celdas
- [ ] 8.7 Accessibility (a11y):
  - ARIA labels en todos los botones
  - aria-live para cambios de estado dinámicos
  - Keyboard navigation en calendar (arrow keys)
  - Focus management en modals (trap focus)
  - Color contrast >= 4.5:1 (WCAG AA)
  - Screen reader announcements para acciones
- [ ] 8.8 Agregar tooltips y ayuda contextual:
  - Tooltip en badges de estado (hover para ver significado)
  - Info icons con explicaciones
  - Popover en "¿Qué es una pre-reserva?"
  - Help text en campos del formulario
  - Tour guiado opcional (primera vez)

### FASE 9: Testing y Documentación
- [ ] 9.1 Testing manual - Flujo Artist → Place (single artist):
  - Artist crea solicitud para Place
  - Place recibe notificación
  - Place aprueba
  - Status cambia a ALL_ACCEPTED
  - Conversión a evento exitosa
- [ ] 9.2 Testing manual - Flujo Place → Artist:
  - Place solicita a Artist
  - Artist aprueba
  - Verificar conversión
- [ ] 9.3 Testing manual - Flujo Multi-Party (3 artists + 1 place):
  - Artist A1 (requester) crea solicitud con A2, A3 y Place P1
  - Verificar auto-aprobación: A1 → ACCEPTED desde el inicio
  - Verificar contador inicial: "1/4 participantes aprobó"
  - Artist A2 aprueba → "2/4 aprobaron" (status = PARTIALLY_ACCEPTED)
  - Artist A3 RECHAZA → Aún válido (hay 2 artists aprobados)
  - Place P1 aprueba → Status = ALL_ACCEPTED ✅ (cumple: 2 artists + 1 place)
  - Verificar que puede convertirse a evento
- [ ] 9.3b Testing - Rechazo total por tipo:
  - Same setup: A1 (requester), A2, A3, Place P1
  - A1 → auto-approved
  - A2 RECHAZA
  - A3 RECHAZA
  - Verificar: A1 es el único artist aprobado
  - P1 aprueba
  - Status → ALL_ACCEPTED ✅ (hay 1 artist aprobado)
- [ ] 9.3c Testing - Rechazo que veta:
  - Place P1 (requester) crea solicitud con A1, A2, A3
  - P1 → auto-approved
  - A1 RECHAZA, A2 RECHAZA, A3 RECHAZA
  - Status → REJECTED ❌ (ningún artist aprobó)
  - Verificar que NO puede convertirse
- [ ] 9.4 Testing de edge cases:
  - Solicitud con fecha pasada (debe rechazar)
  - Cancelar solicitud después de aprobaciones parciales
  - Editar solicitud con aprobaciones (debe resetear aprobaciones, excepto requester)
  - Expiración automática después de deadline
  - **Conflictos horarios**:
    - Artist tiene evento 20:00-23:30, se solicita 21:00-22:00 → Mostrar warning de overlap
    - Artist tiene evento 14:00-16:00 y 20:00-23:00, se solicita 17:00-19:00 → ✅ Disponible
    - Artist tiene evento todo el día → Marcar día como no disponible
    - Múltiples participantes: Mostrar solo horas libres para TODOS
  - **Auto-aprobación del requester**:
    - Crear solicitud → Verificar requester.status = 'accepted'
    - Verificar contador incluye al requester desde inicio
  - Crear evento y verificar sincronización de calendarios (slots se actualizan)
- [ ] 9.5 Documentar API endpoints para backend team:
  - `POST /api/prebooking` - Crear pre-booking
  - `GET /api/prebooking/:id` - Obtener detalle
  - `GET /api/prebooking?userId=X&role=received` - Listar recibidas
  - `GET /api/prebooking?userId=X&role=sent` - Listar enviadas
  - `PATCH /api/prebooking/:id/approve` - Aprobar (body: userId, notes)
  - `PATCH /api/prebooking/:id/reject` - Rechazar (body: userId, reason)
  - `PATCH /api/prebooking/:id/cancel` - Cancelar
  - `POST /api/prebooking/:id/convert` - Convertir a evento
  - `POST /api/prebooking/:id/note` - Agregar nota
  - `GET /api/availability/calendar/:profileId/:yearMonth` - Calendario mensual
  - `GET /api/availability/ranges/:profileId` - Ranges de disponibilidad
  - `POST /api/availability/compare` - Comparar múltiples (body: profileIds, dateRange)
  - Documentar request/response schemas
  - Documentar códigos de error
  - Documentar reglas de negocio (ej: any rejection veta toda la solicitud)
- [ ] 9.6 Crear guía de usuario con screenshots:
  - Cómo crear una pre-reserva desde perfil
  - Cómo aprobar/rechazar
  - Cómo usar el dashboard
  - Cómo convertir a evento
  - FAQ: "¿Qué pasa si rechazo?", "¿Puedo editar?", etc.
- [ ] 9.7 Actualizar este documento con review final:
  - Sección "Cambios Realizados" con lista completa
  - "Desviaciones del Plan" si hubo ajustes
  - "Lecciones Aprendidas" técnicas y de UX
  - "Próximas Mejoras" (backlog V2)

---

## Detalles de Implementación

### Componentes a Reutilizar

| Componente Existente | Uso en Sistema de Booking |
|---------------------|---------------------------|
| `CalendarSimpleLayout` | Vista de disponibilidad en dashboard |
| `CalendarDatePicker` | Selector de fechas en formulario |
| `DynamicForm` | Formulario de creación de booking |
| `ProfileTabsPage` | Template para BookingDetailsPage |
| `AppDialog` | Modal de BookingRequestDialog |
| `DynamicIcons` | Iconos en FAB y estados |
| `TableView` | Lista de bookings en dashboard (alternativa) |
| `AttributesIconFieldReadOnly` | Mostrar detalles en booking detail |
| `SectionsPanel` | Organizar información en detail page |

### Campos del Formulario de Solicitud

**Básicos (Obligatorios):**
1. Tipo de reserva (single/range/week/month/quarter) - Radio buttons
2. Fecha(s) - CalendarDatePicker (single o range según tipo)
3. Nombre del evento - Input text
4. Descripción breve - Textarea (max 500 chars)

**Adicionales (Opcionales):**
5. Asistencia esperada - Number input
6. Rango de presupuesto - Select (bajo/medio/alto/a negociar)
7. Artistas adicionales - Autocomplete multi-select
8. Horario tentativo - Time picker (inicio/fin)
9. Notas especiales - Textarea
10. Contacto preferido - Select (email/phone/whatsapp)

### Estados y Transiciones (Multi-Party)

```
DRAFT (opcional, borrador)
  ↓
  └→ PENDING (al enviar)

PENDING (inicial, esperando respuestas)
  ↓
  ├→ PARTIALLY_VIEWED (algunos participantes vieron)
  ├→ CANCELLED (requester cancela)
  └→ EXPIRED (pasó response_deadline)

PARTIALLY_VIEWED (al menos uno vio)
  ↓
  ├→ PARTIALLY_ACCEPTED (algunos aprobaron, otros pending)
  ├→ REJECTED (al menos uno rechazó → FIN)
  └→ CANCELLED

PARTIALLY_ACCEPTED (progreso parcial)
  ↓
  ├→ ALL_ACCEPTED (TODOS aprobaron)
  ├→ REJECTED (uno rechazó → veta todo)
  └→ CANCELLED

ALL_ACCEPTED (todos aprobaron, listo)
  ↓
  └→ CONVERTED (requester crea evento formal → FIN)

REJECTED (final)
  - No permite más acciones
  - Razón: al menos un participante rechazó
  - Efecto: Libera fechas en calendario de todos

CANCELLED (final)
  - Solo requester puede cancelar
  - Libera fechas en calendario

CONVERTED (final, éxito)
  - Se creó EventModel
  - Referencia en event_id
  - Calendarios se actualizan: tentative → occupied

EXPIRED (final)
  - Pasó response_deadline sin aprobación completa
  - Libera fechas automáticamente
```

**Reglas de Transición (ACTUALIZADAS):**
1. **Auto-aprobación**: Al crear, requester → ACCEPTED automáticamente
2. **Rechazo total por tipo**: Si TODOS de un tipo rechazan → Status = REJECTED
   - Ejemplo: 3 artists (todos rechazan) + 1 place (acepta) → REJECTED
   - Ejemplo: 2 artists (1 acepta, 1 rechaza) + 1 place (acepta) → ✅ Puede continuar
3. **Aprobación mínima**: Requiere al menos 1 ACCEPTED de cada tipo → ALL_ACCEPTED
   - Ejemplo: 3 artists (1 acepta) + 2 places (1 acepta) → ✅ ALL_ACCEPTED
4. **Solo requester** puede cancelar o convertir a evento
5. **Participantes** solo pueden aprobar/rechazar su propia participación
6. **Editar** una solicitud con aprobaciones parciales → Resetea todas (excepto requester)

**Ejemplos Prácticos:**

**Caso 1: Artist crea solicitud para Place**
- Requester: Artist A (auto-approved)
- Recipients: Place P1
- Al crear: Artist A → ACCEPTED (auto)
- Solo falta: Place P1 apruebe
- Si P1 acepta → ALL_ACCEPTED ✅

**Caso 2: Booker crea solicitud multi-party**
- Requester: Booker B (auto-approved, tipo 'booker')
- Recipients: Artist A1, Artist A2, Place P1
- Additional: Artist A3
- Al crear: Booker B → ACCEPTED
- Tipos involucrados: booker, artist, place
- Necesita: mínimo 1 artist ACCEPTED + 1 place ACCEPTED
- Si A1 acepta + P1 acepta → ALL_ACCEPTED ✅ (A2 y A3 pueden rechazar)
- Si TODOS los artists rechazan → REJECTED ❌

**Caso 3: Place crea solicitud para 3 artists**
- Requester: Place P1 (auto-approved)
- Recipients: Artist A1, Artist A2, Artist A3
- Al crear: Place P1 → ACCEPTED
- Necesita: mínimo 1 artist ACCEPTED
- Si A1 acepta → ALL_ACCEPTED ✅ (A2 y A3 pueden rechazar)
- Si TODOS rechazan (A1, A2, A3) → REJECTED ❌

### Atributos del Modelo PreBookingRequest (Actualizado)

**Esenciales (Participantes):**
- `requester` / `requester_id` - ProfileModel del creador
- `recipients[]` / `recipient_ids[]` - Array de destinatarios principales
- `additional_participants[]` / `additional_participant_ids[]` - Participantes extras
- `participant_approvals[]` - Estado de aprobación de cada uno (ParticipantApprovalStatus)

**Esenciales (Temporales):**
- `requested_date_start` - Fecha inicio (Dayjs)
- `requested_date_end` - Fecha fin (Dayjs)
- `request_type` - 'single_date' | 'date_range' | 'week' | 'month' | 'quarter'
- `flexible_dates` - boolean
- `alternative_dates[]` - DateRange[] con prioridades

**Esenciales (Evento):**
- `event_name` - Nombre tentativo
- `description` - Descripción breve
- `expected_attendance` - Número estimado

**Económicos:**
- `estimated_cost` - CostRange { min, max, is_negotiable, includes_expenses }
- `currency` - 'USD' | 'EUR' | 'COP' | etc.

**Estado y Aprobaciones:**
- `status` - PreBookingRequestStatus (DRAFT, PENDING, PARTIALLY_ACCEPTED, etc.)
- `overall_approval_status` - ApprovalStatus (ALL_PENDING, PARTIAL, ALL_APPROVED, REJECTED)

**Comunicación:**
- `notes[]` - ParticipantNote[] con { author_id, note, created_at, is_private }

**Metadata:**
- `created_by` - user_id del creador
- `event_id` - Si se convierte en evento
- `response_deadline` - Dayjs opcional
- `created_at` / `updated_at` - Timestamps
- `last_viewed_by` - Record<userId, Dayjs> para tracking

**Atributos Futuros (V2):**
- `event_type` - 'concert' | 'festival' | 'private' | 'rehearsal'
- `technical_requirements` - Brief de requerimientos técnicos
- `preferred_contact_method` - 'email' | 'phone' | 'whatsapp'
- `attachment_urls[]` - Riders, stage plots, contratos previos
- `priority` - 'low' | 'medium' | 'high' | 'urgent'

---

## Estructura de Archivos Nueva

```
src/
├── models/domain/prebooking/
│   ├── prebooking-request.model.tsx       # PreBookingRequestModel + Template
│   ├── prebooking-types.ts                # CostRange, DateRange, ParticipantApprovalStatus, etc.
│   └── index.ts                            # Exports
│
├── common/slices/domain/prebooking/
│   ├── prebooking-requests.redux.ts       # Redux slice + saga
│   ├── selectors.ts                        # Selectores específicos
│   └── index.ts
│
├── common/slices/domain/availability/
│   ├── availability.redux.ts               # Slice para calendarios
│   ├── availability-utils.ts               # calculateCommonAvailability
│   └── index.ts
│
├── components/Pages/PreBookingPage/
│   ├── PreBookingDashboardPage/
│   │   ├── index.tsx                       # Página principal del dashboard
│   │   ├── PreBookingDashboardPage.scss
│   │   └── components/
│   │       ├── PreBookingRequestCard.tsx   # Card individual
│   │       ├── PreBookingFilters.tsx       # Filtros avanzados
│   │       ├── PreBookingCalendarView.tsx  # Vista calendario
│   │       └── PreBookingListView.tsx      # Vista lista
│   │
│   └── PreBookingRequestDetailsPage/
│       ├── index.tsx                       # Página de detalle
│       ├── config-prebooking-detail.tsx    # Config ProfileTabsPage pattern
│       ├── PreBookingRequestDetailsPage.scss
│       └── components/
│           ├── ParticipantApprovalList.tsx # Lista de aprobaciones
│           ├── ParticipantNoteThread.tsx   # Thread de notas
│           └── ConversionModal.tsx         # Modal para convertir a evento
│
├── components/shared/organisms/prebooking/
│   ├── PreBookingRequestDialog/
│   │   ├── PreBookingRequestDialog.tsx     # Modal principal
│   │   ├── PreBookingRequestDialog.scss
│   │   └── components/
│   │       ├── DateTypeSelector.tsx        # Selector día/rango/semana/etc
│   │       ├── ParticipantSelector.tsx     # Multi-select de participantes
│   │       ├── CostRangeInput.tsx          # Input de rango de costo
│   │       ├── AlternativeDatesInput.tsx   # Fechas alternativas
│   │       └── AvailabilityPreview.tsx     # Preview de disponibilidad
│   │
│   ├── AvailabilityCalendar/
│   │   ├── AvailabilityCalendar.tsx        # Calendario visual
│   │   ├── AvailabilityCalendar.scss
│   │   └── components/
│   │       ├── CalendarLegend.tsx          # Leyenda de colores
│   │       └── MultiPartyIndicator.tsx     # Indicador multi-party
│   │
│   └── ProfilePreBookingsList/
│       ├── ProfilePreBookingsList.tsx      # Lista para perfiles
│       └── ProfilePreBookingsList.scss
│
├── components/shared/molecules/prebooking/
│   ├── PreBookingStatusBadge.tsx           # Badge de estado
│   ├── ApprovalProgressBar.tsx             # Barra "3/5 aprobaron"
│   └── PreBookingQuickActions.tsx          # Botones de acción rápida
│
├── routes/
│   └── routes.config.ts                    # Agregar rutas de prebooking
│
├── constants/
│   └── prebooking.const.ts                 # Constantes (estados, colores, etc.)
│
└── translations/
    ├── es.tsx                               # Traducciones español
    │   └── prebooking: { ... }
    └── en.tsx                               # Traducciones inglés
        └── prebooking: { ... }
```

**Rutas a Agregar en routes.config.ts:**
```typescript
prebooking: {
  path: '/prebooking',
  subpaths: {
    PreBookingDashboardPage: {
      component: lazy(() => import('~/components/Pages/PreBookingPage/PreBookingDashboardPage')),
      path: '/dashboard'
    },
    PreBookingRequestDetailsPage: {
      component: lazy(() => import('~/components/Pages/PreBookingPage/PreBookingRequestDetailsPage')),
      path: '/details/:prebookingId'
    }
  }
}
```

---

## Consideraciones Técnicas

### Performance
- Lazy loading de componentes de booking
- Paginación en dashboard (20 items por página)
- Caché de calendarios de disponibilidad (15 min)
- Optimistic updates en cambios de estado

### UX/UI Patterns (Airbnb-style)
- Modal grande con pasos claros
- Calendar con visual claro de disponibilidad
- Preview de la solicitud antes de enviar
- Confirmación visual al enviar
- Loading states con skeletons
- Toast notifications para feedback

### Seguridad
- Validar permisos: solo el solicitante puede cancelar
- Validar permisos: solo el receptor puede aceptar/rechazar
- Validar fechas: no permitir fechas pasadas
- Rate limiting en creación de solicitudes

### Accessibility
- Calendario navegable por teclado
- Screen reader support
- Focus management en modals
- Color contrast en estados

---

## Mockups de Flujo (Descripción)

### 1. FAB Click (Artist viewing Place)
```
[FAB Button] → [BookingRequestDialog Modal]
  ├─ Header: "Solicitar fecha a [Place Name]"
  ├─ Step 1: Tipo de reserva (tabs: Día | Rango | Semana | Mes)
  ├─ Step 2: Calendario con disponibilidad visible
  ├─ Step 3: Formulario básico
  └─ Footer: [Cancelar] [Enviar Solicitud]
```

### 2. Dashboard View
```
[Header con tabs: Enviadas | Recibidas]
[Filters: Estado | Fecha | Búsqueda]
[Vista Calendar tipo Google Calendar]
  ├─ Mes actual con marcadores
  ├─ Click en día → Ver solicitudes de ese día
[Vista Lista alternativa]
  ├─ BookingRequestCard × N
  │   ├─ Avatar del artist/place
  │   ├─ Nombre evento + fecha
  │   ├─ Estado (badge)
  │   └─ [Ver detalles]
```

### 3. Detail Page
```
[Header con nombre evento]
[Section: Información General]
  ├─ Solicitante (avatar + name)
  ├─ Receptor (avatar + name)
  ├─ Fechas solicitadas
  ├─ Tipo de evento
[Section: Detalles]
  ├─ Descripción
  ├─ Asistencia esperada
  ├─ Artistas adicionales
[Section: Notas]
  ├─ Notas del solicitante
  ├─ Notas del receptor (si las hay)
[Actions según rol]
  Solicitante: [Cancelar]
  Receptor: [Rechazar] [Aceptar y Crear Evento]
```

---

## Dependencias

### Nuevas (posibles)
- `react-big-calendar` (opcional, para vista calendar avanzada)
- Ya existe: `dayjs`, `@mui/material`, `react-hook-form`

### Endpoints Backend Necesarios
```
GET    /api/booking-requests              # Lista con filtros
GET    /api/booking-requests/:id          # Detalle
POST   /api/booking-requests              # Crear
PUT    /api/booking-requests/:id          # Actualizar
DELETE /api/booking-requests/:id          # Cancelar
PATCH  /api/booking-requests/:id/accept   # Aceptar
PATCH  /api/booking-requests/:id/reject   # Rechazar
GET    /api/availability/:type/:id        # Calendario disponibilidad
POST   /api/booking-requests/:id/convert  # Convertir a evento
```

---

## Estado Actual del Proyecto

### ✅ Refactorizaciones Completadas (Preparación)

#### 1. Component Builder System (ProfileTabsPage)
- **Estado**: ✅ 90% Completado
- **Archivos creados**: 17 builders + utils + core system
- **Pendiente**: Fase 5 manual (refactorizar ProfileTabsPage.tsx para usar nuevo sistema)
- **Impacto**: Permite crear componentes visuales complejos reutilizables
- **Beneficio para PreBooking**: Se pueden usar builders como MAP, CALENDAR, etc. en el dashboard

#### 2. DynamicForm System Refactor
- **Estado**: ✅ Completado (4 componentes prioritarios)
- **Componentes refactorizados**:
  - ✅ `createDatePicker()` - Con soporte de hora/minuto
  - ✅ `createTextField()` - Para campos de texto
  - ✅ `createSelectField()` - Para dropdowns
  - ✅ `createAutocomplete()` - Para selección multi-participantes
- **Impacto**: Permite usar componentes de formulario sin DynamicTabbedForm
- **Beneficio para PreBooking**: PreBookingRequestDialog puede usar estos componentes directamente

### 📋 Plan de Implementación Pre-Booking

#### Resumen de Fases

| Fase | Nombre | Estado | Prioridad | Tiempo Estimado |
|------|--------|--------|-----------|-----------------|
| 1 | Modelo y Redux | ⏳ Pendiente | Alta | 1-2 días |
| 2 | PreBookingRequestDialog | ⏳ Pendiente | Alta | 2-3 días |
| 3 | Visualización Multi-Party | ⏳ Pendiente | Alta | 2 días |
| 4 | Dashboard | ⏳ Pendiente | Media | 2-3 días |
| 5 | Detalle y Acciones | ⏳ Pendiente | Media | 2-3 días |
| 6 | Integración Perfiles | ⏳ Pendiente | Media | 1-2 días |
| 7 | Routing y Navegación | ⏳ Pendiente | Baja | 1 día |
| 8 | Optimizaciones | ⏳ Pendiente | Baja | 2 días |
| 9 | Testing y Docs | ⏳ Pendiente | Baja | 2 días |

**Tiempo total estimado**: 15-22 días (3-4 semanas)

### 🎯 Próximos Pasos Inmediatos

#### Opción A: Completar Refactors Primero
1. ✅ Completar Fase 5 de ProfileTabsPage (refactorizar para usar builders)
2. ✅ Validar que todo funciona (smoke tests)
3. 🚀 Comenzar Fase 1 de PreBooking (Modelo y Redux)

#### Opción B: Comenzar PreBooking Ya (Recomendado)
1. 🚀 **Comenzar Fase 1: Modelo y Redux** (los refactors ya están listos)
2. 🚀 **Comenzar Fase 2: PreBookingRequestDialog** (usar create\* functions refactorizados)
3. ⏸️ Completar refactor de ProfileTabsPage en paralelo (si es necesario)

### 📊 Preparación Completada

**Sistemas listos para usar**:
- ✅ `createDatePicker({ formContext })` - Para fecha/hora de inicio y fin
- ✅ `createTextField({ formContext })` - Para nombre, descripción, asistencia
- ✅ `createAutocomplete({ formContext })` - Para selección multi-participantes
- ✅ Component builders disponibles - Para dashboard y visualizaciones

**Lo que esto significa**:
- 🎉 **No hay blockers técnicos** para comenzar implementación
- 🎉 **Arquitectura sólida** gracias a refactors completados
- 🎉 **Reutilización máxima** de componentes existentes
- 🎉 **Código mantenible** desde el inicio

## Próximos Pasos

1. ✅ Análisis completado
2. ✅ Refactors de preparación completados
3. ⏳ **ESPERANDO APROBACIÓN DEL PLAN**
4. 🚀 Comenzar Fase 1: Modelo y Redux (PreBookingRequestTemplate)
5. 🚀 Comenzar Fase 2: PreBookingRequestDialog (usando create\* refactorizados)
6. Iteración rápida con feedback continuo

---

## Notas y Decisiones

### ¿Por qué no usar EventModel directamente?
- EventModel es muy complejo (20+ campos obligatorios)
- Bookings son "intenciones" ligeras
- Permite iteración rápida sin commitment
- Mejor UX: formulario simple vs complejo

### ¿Por qué calendario separado de eventos?
- Events confirmados vs bookings tentativas
- Evita conflictos de scheduling
- Clara separación de concerns
- Backend puede optimizar queries independientes

### Simplificaciones iniciales
- V1: Sin notificaciones push (solo in-app)
- V1: Sin chat integrado (usar notas)
- V1: Sin pago/depósito (solo coordinación)
- V1: Sin sincronización con calendarios externos

---

## Review Final
*(Se completará después de la implementación)*

### Cambios Realizados
- TBD

### Desviaciones del Plan
- TBD

### Lecciones Aprendidas
- TBD

### Próximas Mejoras
- TBD
