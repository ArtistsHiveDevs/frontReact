import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { ParametricOptionsParams, sortOptionsByLabel } from './dynamic-form-parametric-options.helper';

/**
 * Ruta base para las traducciones de atributos de usuarios
 */
const ATTRIBUTES_PATH = 'entities.users.attributes';

/**
 * Opciones de género disponibles en la aplicación
 */
export const GENDER_OPTIONS = ['male', 'female', 'non_binary', 'non_specified'] as const;

export type GenderOption = typeof GENDER_OPTIONS[number];

/**
 * Genera las opciones de género traducidas para usar en selects
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción del diccionario global (opcional)
 * @param params.defaultValue - Valor por defecto seleccionado (opcional)
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'genders')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con las opciones de género traducidas
 */
export const getGenderOptions = (params?: ParametricOptionsParams): SelectOption[] => {
  const {
    translateFn,
    defaultValue,
    translationPath = `${ATTRIBUTES_PATH}.gender`,
    sortByLabel = 'asc',
  } = params || {};

  const options = GENDER_OPTIONS.map((gender) => {
    const translationKey = translationPath ? `${translationPath}.values.${gender}` : gender;
    const option: SelectOption = {
      label: translateFn ? translateFn(translationKey) : gender,
      value: gender,
    };
    if (gender === defaultValue) {
      option.selected = true;
    }
    return option;
  });

  return sortOptionsByLabel(options, sortByLabel);
};

/**
 * Genera las opciones de grupos sanguíneos
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción (opcional, no usada actualmente)
 * @param params.defaultValue - Grupo sanguíneo por defecto seleccionado (opcional)
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con los grupos sanguíneos
 */
export const getBloodGroupOptions = (params?: ParametricOptionsParams): SelectOption[] => {
  const { defaultValue, sortByLabel = 'asc' } = params || {};
  const groupList = ['A', 'B', 'AB', 'O'];
  const fullGroup = groupList.map((group) => [`${group}+`, `${group}-`]);

  const options = fullGroup.flat().map((group) => {
    const bloodGroup: SelectOption = { label: group, value: group };
    if (group === defaultValue) {
      bloodGroup.selected = true;
    }
    return bloodGroup;
  });

  return sortOptionsByLabel(options, sortByLabel);
};

/**
 * Opciones de restricciones dietéticas disponibles
 */
export const DIETARY_RESTRICTION_OPTIONS = ['none', 'vegetarian', 'vegan', 'celiac'] as const;

export type DietaryRestrictionOption = typeof DIETARY_RESTRICTION_OPTIONS[number];

/**
 * Genera las opciones de restricciones dietéticas
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción (opcional)
 * @param params.defaultValue - Restricción dietética por defecto seleccionada (opcional)
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'dietary_restrictions')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con las restricciones dietéticas
 */
export const getDietaryRestrictionOptions = (params?: ParametricOptionsParams): SelectOption[] => {
  const {
    translateFn,
    defaultValue,
    translationPath = `${ATTRIBUTES_PATH}.dietary_restrictions`,
    sortByLabel = 'asc',
  } = params || {};

  const options = DIETARY_RESTRICTION_OPTIONS.map((restriction) => {
    const translationKey = translationPath ? `${translationPath}.values.${restriction}` : restriction;
    const option: SelectOption = {
      label: translateFn ? translateFn(translationKey) : restriction,
      value: restriction,
    };
    if (restriction === defaultValue) {
      option.selected = true;
    }
    return option;
  });

  return sortOptionsByLabel(options, sortByLabel);
};
