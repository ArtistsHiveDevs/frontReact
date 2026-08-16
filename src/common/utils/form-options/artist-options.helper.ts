import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { ParametricOptionsParams, sortOptionsByLabel } from './dynamic-form-parametric-options.helper';

/**
 * Ruta base para las traducciones de atributos de artistas
 */
const ATTRIBUTES_PATH = 'entities.artists.attributes';

/**
 * Tipos de proyectos artísticos disponibles
 */
export const PROJECT_FORMAT_TYPE_OPTIONS = [
  'solo_artist',
  'duo',
  'band',
  'dj',
  'group',
  'collective',
  'orchestra',
  'choir',
  'symphonic_choral',
  'other',
] as const;

export type ProjectFormatTypeOption = typeof PROJECT_FORMAT_TYPE_OPTIONS[number];

/**
 * Genera las opciones de tipos de proyecto artístico
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción del diccionario global (opcional)
 * @param params.defaultValue - Valor por defecto seleccionado (opcional)
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'project_types')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con los tipos de proyecto traducidos
 */
export const getProjectFormatTypeOptions = (params?: ParametricOptionsParams): SelectOption[] => {
  const {
    translateFn,
    defaultValue,
    translationPath = `${ATTRIBUTES_PATH}.project_format`,
    sortByLabel = 'asc',
  } = params || {};

  const options = PROJECT_FORMAT_TYPE_OPTIONS.map((projectFormatType) => {
    const translationKey = translationPath ? `${translationPath}.values.${projectFormatType}` : projectFormatType;
    const option: SelectOption = {
      label: translateFn ? translateFn(translationKey) : projectFormatType,
      value: projectFormatType,
    };
    if (projectFormatType === defaultValue) {
      option.selected = true;
    }
    return option;
  });

  return sortOptionsByLabel(options, sortByLabel);
};
