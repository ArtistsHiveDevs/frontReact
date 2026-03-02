import { PrebookingParticipantStatus, PreBookingRequestStatus } from '~/models/domain/prebooking';
import { TableColumn } from '../types';

// Configuración de filtros de estado
export const statusFilters = [
  'all',
  PrebookingParticipantStatus.PENDING,
  PreBookingRequestStatus.CONVERTED,
  PreBookingRequestStatus.EXPIRED,
];

// Configuración de opciones de ordenamiento
export const sortOptions = [
  { value: 'event_date_asc', label: 'Fecha evento (próximos)' },
  { value: 'event_date_desc', label: 'Fecha evento (lejanos)' },
  // { value: 'created_at_desc', label: 'Más recientes' },
  // { value: 'created_at_asc', label: 'Más antiguos' },
  { value: 'event_name_asc', label: 'Nombre evento (A-Z)' },
  { value: 'event_name_desc', label: 'Nombre evento (Z-A)' },
  { value: 'status', label: 'Estado general' },
  { value: 'creator', label: 'Creador' },
];

// Configuración de opciones de items por página
export const itemsPerPageOptions = [5, 10, 20, 50];

// Configuración de paginación
export const paginationConfig = {
  defaultItemsPerPage: 20,
  options: itemsPerPageOptions,
  showFirstButton: true,
  showLastButton: true,
};

// Configuración de columnas de la tabla
export const tableColumns: TableColumn[] = [
  { id: 'event', label: 'Evento', className: 'pb-table-event-name' },
  { id: 'date', label: 'Fecha', className: 'pb-table-date' },
  { id: 'venue', label: 'Lugar', className: 'pb-table-venue' },
  // { id: 'status', label: 'Estado', className: 'pb-table-status' },
  { id: 'myResponse', label: 'Mi respuesta', className: 'pb-table-my-response' },
  { id: 'actions', label: '', className: 'pb-table-actions' },
];
