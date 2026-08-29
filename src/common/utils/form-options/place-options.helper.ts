import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { ParametricOptionsParams, sortOptionsByLabel } from './dynamic-form-parametric-options.helper';

/**
 * Ruta base para las traducciones de atributos de lugares
 */
const ATTRIBUTES_PATH = 'entities.places.attributes';

/**
 * Tipos de lugares/venues disponibles
 */
export const PLACE_TYPE_OPTIONS = [
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
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'place_types')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con los tipos de lugar traducidos
 */
export const getPlaceTypeOptions = (params?: ParametricOptionsParams): SelectOption[] => {
  const {
    translateFn,
    defaultValue,
    translationPath = `${ATTRIBUTES_PATH}.place_types`,
    sortByLabel = 'asc',
  } = params || {};

  const options = PLACE_TYPE_OPTIONS.map((placeType) => {
    const translationKey = translationPath ? `${translationPath}.values.${placeType}` : placeType;
    const option: SelectOption = {
      label: translateFn ? translateFn(translationKey) : placeType,
      value: placeType,
    };
    if (placeType === defaultValue) {
      option.selected = true;
    }
    return option;
  });

  return sortOptionsByLabel(options, sortByLabel);
};

/**
 * Opciones de tipos de escenario
 */
export const STAGE_TYPE_OPTIONS = ['indoor', 'outdoor', 'amphitheater', 'club', 'theater', 'other'] as const;

export type StageTypeOption = typeof STAGE_TYPE_OPTIONS[number];

/**
 * Genera las opciones de tipos de escenario
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción del diccionario global (opcional)
 * @param params.defaultValue - Valor por defecto seleccionado (opcional)
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'stage_types')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con los tipos de escenario traducidos
 */
export const getStageTypeOptions = (params?: ParametricOptionsParams): SelectOption[] => {
  const {
    translateFn,
    defaultValue,
    translationPath = `${ATTRIBUTES_PATH}.stage_types`,
    sortByLabel = 'asc',
  } = params || {};

  const options = STAGE_TYPE_OPTIONS.map((stageType) => {
    const translationKey = translationPath ? `${translationPath}.values.${stageType}` : stageType;
    const option: SelectOption = {
      label: translateFn ? translateFn(translationKey) : stageType,
      value: stageType,
    };
    if (stageType === defaultValue) {
      option.selected = true;
    }
    return option;
  });

  return sortOptionsByLabel(options, sortByLabel);
};
