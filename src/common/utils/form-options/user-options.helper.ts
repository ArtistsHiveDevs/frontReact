import { createParametricOptionsGetter } from './dynamic-form-parametric-options.helper';

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
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'entities.users.attributes.gender')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con las opciones de género traducidas
 */
export const getGenderOptions = createParametricOptionsGetter({
  values: GENDER_OPTIONS,
  defaultTranslationPath: `${ATTRIBUTES_PATH}.gender`,
});

/**
 * Opciones de identidad de género: autodeclaración opcional de pertenencia a la comunidad
 * LGBTIQ+. Campo separado de `gender` (que registra el género de la persona).
 */
export const GENDER_IDENTITY_OPTIONS = ['yes', 'no', 'prefer_not_to_say'] as const;

export type GenderIdentityOption = typeof GENDER_IDENTITY_OPTIONS[number];

/**
 * Genera las opciones de identidad de género traducidas para usar en selects
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción del diccionario global (opcional)
 * @param params.defaultValue - Valor por defecto seleccionado (opcional)
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'entities.users.attributes.gender_identity')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con las opciones de identidad de género traducidas
 */
export const getGenderIdentityOptions = createParametricOptionsGetter({
  values: GENDER_IDENTITY_OPTIONS,
  defaultTranslationPath: `${ATTRIBUTES_PATH}.gender_identity`,
  defaultSortByLabel: false,
});

/**
 * Grupos sanguíneos disponibles
 */
export const BLOOD_GROUP_OPTIONS = ['A', 'B', 'AB', 'O'].flatMap((group) => [
  `${group}+`,
  `${group}-`,
]) as readonly string[];

/**
 * Genera las opciones de grupos sanguíneos
 * @param params - Parámetros de configuración (opcionales)
 * @param params.defaultValue - Grupo sanguíneo por defecto seleccionado (opcional)
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con los grupos sanguíneos
 */
export const getBloodGroupOptions = createParametricOptionsGetter({
  values: BLOOD_GROUP_OPTIONS,
  translatable: false,
});

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
 * @param params.translationPath - Ruta base para las traducciones (por defecto: 'entities.users.attributes.dietary_restrictions')
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con las restricciones dietéticas
 */
export const getDietaryRestrictionOptions = createParametricOptionsGetter({
  values: DIETARY_RESTRICTION_OPTIONS,
  defaultTranslationPath: `${ATTRIBUTES_PATH}.dietary_restrictions`,
});
