import { createParametricOptionsGetter } from './dynamic-form-parametric-options.helper';

/**
 * Ruta base para las traducciones de atributos de lugares
 */
const ATTRIBUTES_PATH = 'entities.places.attributes';

/**
 * Tipos de lugares/venues disponibles
 */
export const PLACE_TYPE_OPTIONS = [
  'arena',
  'bar',
  'club',
  'theater',
  'concert_hall',
  'cultural_center',
  'restaurant',
  'outdoor',
  'other',
] as const;

export type PlaceTypeOption = typeof PLACE_TYPE_OPTIONS[number];

/**
 * Genera las opciones de tipos de lugar/venue
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción del diccionario global (opcional)
 * @param params.defaultValue - Valor por defecto seleccionado (opcional)
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'entities.places.attributes.place_types')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con los tipos de lugar traducidos
 */
export const getPlaceTypeOptions = createParametricOptionsGetter({
  values: PLACE_TYPE_OPTIONS,
  defaultTranslationPath: `${ATTRIBUTES_PATH}.place_types`,
});

/**
 * Opciones de tipos de escenario
 */
export const STAGE_TYPE_OPTIONS = [ 'indoor', 'outdoor'] as const;

export type StageTypeOption = typeof STAGE_TYPE_OPTIONS[number];

/**
 * Genera las opciones de tipos de escenario
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción del diccionario global (opcional)
 * @param params.defaultValue - Valor por defecto seleccionado (opcional)
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'entities.places.attributes.stage_types')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con los tipos de escenario traducidos
 */
export const getStageTypeOptions = createParametricOptionsGetter({
  values: STAGE_TYPE_OPTIONS,
  defaultTranslationPath: `${ATTRIBUTES_PATH}.stage_types`,
});
