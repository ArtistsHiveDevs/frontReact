import { createParametricOptionsGetter } from './dynamic-form-parametric-options.helper';

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
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'entities.open_calls.attributes.support_provision')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con las opciones de provisión traducidas
 */
export const getSupportProvisionOptions = createParametricOptionsGetter({
  values: SUPPORT_PROVISION_OPTIONS,
  defaultTranslationPath: `${ATTRIBUTES_PATH}.support_provision`,
  translationKeySuffix: null,
});
