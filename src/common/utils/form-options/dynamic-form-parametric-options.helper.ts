import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';

/**
 * Parámetros comunes para las funciones de opciones paramétricas
 */
export interface ParametricOptionsParams {
  translateFn?: (key: string) => string;
  defaultValue?: string;
}

/**
 * Opciones de género disponibles en la aplicación
 */
export const GENDER_OPTIONS = ['male', 'female', 'non_binary', 'non_specified'] as const;

export type GenderOption = (typeof GENDER_OPTIONS)[number];

/**
 * Genera las opciones de género traducidas para usar en selects
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción del diccionario global (opcional)
 * @param params.defaultValue - Valor por defecto seleccionado (opcional)
 * @returns Array de SelectOption con las opciones de género traducidas
 */
export const getGenderOptions = (params?: ParametricOptionsParams): SelectOption[] => {
  const { translateFn, defaultValue } = params || {};

  return GENDER_OPTIONS.map((gender) => {
    const option: SelectOption = {
      label: translateFn ? translateFn(`genders.${gender}`) : gender,
      value: gender,
    };
    if (gender === defaultValue) {
      option.selected = true;
    }
    return option;
  });
};

/**
 * Genera las opciones de grupos sanguíneos
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción (opcional, no usada actualmente)
 * @param params.defaultValue - Grupo sanguíneo por defecto seleccionado (opcional)
 * @returns Array de SelectOption con los grupos sanguíneos
 */
export const getBloodGroupOptions = (params?: ParametricOptionsParams): SelectOption[] => {
  const { defaultValue } = params || {};
  const groupList = ['A', 'B', 'AB', 'O'];
  const fullGroup = groupList.map((group) => [`${group}+`, `${group}-`]);

  return fullGroup.flat().map((group) => {
    const bloodGroup: SelectOption = { label: group, value: group };
    if (group === defaultValue) {
      bloodGroup.selected = true;
    }
    return bloodGroup;
  });
};

/**
 * Opciones de restricciones dietéticas disponibles
 */
export const DIETARY_RESTRICTION_OPTIONS = ['none', 'vegetarian', 'vegan', 'celiac'] as const;

export type DietaryRestrictionOption = (typeof DIETARY_RESTRICTION_OPTIONS)[number];

/**
 * Genera las opciones de restricciones dietéticas
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción (opcional)
 * @param params.defaultValue - Restricción dietética por defecto seleccionada (opcional)
 * @returns Array de SelectOption con las restricciones dietéticas
 */
export const getDietaryRestrictionOptions = (params?: ParametricOptionsParams): SelectOption[] => {
  const { translateFn, defaultValue } = params || {};

  return DIETARY_RESTRICTION_OPTIONS.map((restriction) => {
    const option: SelectOption = {
      label: translateFn ? translateFn(`dietary_restrictions.${restriction}`) : restriction,
      value: restriction,
    };
    if (restriction === defaultValue) {
      option.selected = true;
    }
    return option;
  });
};
