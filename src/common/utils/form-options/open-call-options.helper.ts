import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { ParametricOptionsParams, sortOptionsByLabel } from './dynamic-form-parametric-options.helper';

/**
 * Ruta base para las traducciones de atributos de convocatorias
 */
const ATTRIBUTES_PATH = 'entities.open_calls.attributes';

/**
 * Opciones de soporte disponible (para campos como provided_sound, provided_backline, etc.)
 */
export const SUPPORT_PROVISION_OPTIONS = ['no', 'yes', 'partial', 'negotiable'] as const;

export type SupportProvisionOption = typeof SUPPORT_PROVISION_OPTIONS[number];

/**
 * Genera las opciones de provisión/soporte
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción del diccionario global (opcional)
 * @param params.defaultValue - Valor por defecto seleccionado (opcional)
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'support_provision')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con las opciones de provisión traducidas
 */
export const getSupportProvisionOptions = (params?: ParametricOptionsParams): SelectOption[] => {
  const {
    translateFn,
    defaultValue,
    translationPath = `${ATTRIBUTES_PATH}.support_provision`,
    sortByLabel = 'asc',
  } = params || {};

  const options = SUPPORT_PROVISION_OPTIONS.map((provision) => {
    const translationKey = translationPath ? `${translationPath}.${provision}` : provision;
    const option: SelectOption = {
      label: translateFn ? translateFn(translationKey) : provision,
      value: provision,
    };
    if (provision === defaultValue) {
      option.selected = true;
    }
    return option;
  });

  return sortOptionsByLabel(options, sortByLabel);
};
