import { EnMessages } from '~/translations/en';
import { createParametricOptionsGetter } from './dynamic-form-parametric-options.helper';

/**
 * Ruta base para las traducciones de atributos de artistas
 */
const ATTRIBUTES_PATH = 'entities.artists.attributes';

/**
 * Tipos de proyectos artísticos disponibles
 */
export const PROJECT_FORMAT_TYPE_OPTIONS = Object.keys(
  EnMessages.app.global_dictionary.entities.artists.attributes.project_format.values
);

export type ProjectFormatTypeOption = typeof PROJECT_FORMAT_TYPE_OPTIONS[number];

/**
 * Genera las opciones de tipos de proyecto artístico
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción del diccionario global (opcional)
 * @param params.defaultValue - Valor por defecto seleccionado (opcional)
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'entities.artists.attributes.project_format')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con los tipos de proyecto traducidos
 */
export const getMusicArtistProjectFormatTypeOptions = createParametricOptionsGetter({
  values: PROJECT_FORMAT_TYPE_OPTIONS,
  defaultTranslationPath: `${ATTRIBUTES_PATH}.project_format`,
});
