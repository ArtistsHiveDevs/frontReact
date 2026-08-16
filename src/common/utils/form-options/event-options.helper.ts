import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { ParametricOptionsParams, sortOptionsByLabel } from './dynamic-form-parametric-options.helper';

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
export const getEventTypeOptions = (params?: ParametricOptionsParams): SelectOption[] => {
  const {
    translateFn,
    defaultValue,
    translationPath = `${ATTRIBUTES_PATH}.event_type`,
    sortByLabel = 'asc',
  } = params || {};

  const options = EVENT_TYPE_OPTIONS.map((eventType) => {
    const translationKey = translationPath ? `${translationPath}.values.${eventType}` : eventType;
    const option: SelectOption = {
      label: translateFn ? translateFn(translationKey) : eventType,
      value: eventType,
    };
    if (eventType === defaultValue) {
      option.selected = true;
    }
    return option;
  });

  return sortOptionsByLabel(options, sortByLabel);
};
