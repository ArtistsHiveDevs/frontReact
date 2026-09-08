import { createParametricOptionsGetter } from './dynamic-form-parametric-options.helper';

/**
 * Ruta base para las traducciones de atributos de eventos
 */
const ATTRIBUTES_PATH = 'entities.events.attributes';

/**
 * Tipos de eventos disponibles
 */
export const EVENT_TYPE_OPTIONS = [
  'concert',
  'conversation',
  'festival',
  'jam_session',
  'market',
  'other',
  'residency',
  'showcase',
  'workshop',
] as const;

export type EventTypeOption = typeof EVENT_TYPE_OPTIONS[number];

/**
 * Genera las opciones de tipos de evento
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción del diccionario global (opcional)
 * @param params.defaultValue - Valor por defecto seleccionado (opcional)
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'entities.events.attributes.event_type')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con los tipos de evento traducidos
 */
export const getEventTypeOptions = createParametricOptionsGetter({
  values: EVENT_TYPE_OPTIONS,
  defaultTranslationPath: `${ATTRIBUTES_PATH}.event_type`,
});
