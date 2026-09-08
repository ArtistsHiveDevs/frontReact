import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';

/**
 * Parámetros comunes para las funciones de opciones paramétricas
 */
export interface ParametricOptionsParams {
  defaultValue?: string;
  translateFn?: (key: string) => string;
  translationPath?: string;
  sortByLabel?: 'asc' | 'desc';
}

/**
 * Ordena un array de SelectOption por su label
 * @param options - Array de opciones a ordenar
 * @param sortOrder - Orden de ordenamiento: 'asc' (ascendente) o 'desc' (descendente)
 * @returns Array de SelectOption ordenado
 */
export const sortOptionsByLabel = (options: SelectOption[], sortOrder?: 'asc' | 'desc'): SelectOption[] => {
  if (!sortOrder) {
    return options;
  }

  return [...options].sort((a, b) => {
    const labelA = a.label.toLowerCase();
    const labelB = b.label.toLowerCase();

    if (sortOrder === 'asc') {
      return labelA.localeCompare(labelB);
    } else {
      return labelB.localeCompare(labelA);
    }
  });
};

/**
 * Configuración para generar una función "getXxxOptions" a partir de un array fijo de valores.
 */
export interface ParametricOptionsGetterConfig<V extends string = string> {
  /** Valores posibles (el orden es el orden por defecto, antes de aplicar sortByLabel) */
  values: readonly V[];
  /** translationPath por defecto cuando el caller no pasa uno explícito */
  defaultTranslationPath?: string;
  /**
   * Segmento intermedio entre el translationPath y el valor, ej. 'values' produce
   * `${translationPath}.values.${value}`. Pasar null/'' para usar `${translationPath}.${value}` directo.
   * Por defecto 'values', que es el patrón que siguen la mayoría de estos catálogos.
   */
  translationKeySuffix?: string | null;
  /** Si es false, el label siempre es el valor crudo (sin traducir), ej. grupos sanguíneos */
  translatable?: boolean;
}

/**
 * Crea una función "getXxxOptions(params)" para un catálogo fijo de valores, evitando
 * reescribir el mismo map/translate/selected/sort en cada helper de opciones paramétricas.
 * @param config - Valores del catálogo y cómo resolver su traducción
 * @returns Función que genera SelectOption[] a partir de ParametricOptionsParams
 */
export const createParametricOptionsGetter = <V extends string>(config: ParametricOptionsGetterConfig<V>) => {
  const { values, defaultTranslationPath, translationKeySuffix = 'values', translatable = true } = config;

  return (params?: ParametricOptionsParams): SelectOption[] => {
    const {
      translateFn,
      defaultValue,
      translationPath = defaultTranslationPath,
      sortByLabel = 'asc',
    } = params || {};

    const options = values.map((value) => {
      const canTranslate = translatable && !!translateFn && !!translationPath;
      const translationKey = canTranslate
        ? translationKeySuffix
          ? `${translationPath}.${translationKeySuffix}.${value}`
          : `${translationPath}.${value}`
        : undefined;
      const option: SelectOption = {
        label: canTranslate ? translateFn(translationKey) : value,
        value,
      };
      if (value === defaultValue) {
        option.selected = true;
      }
      return option;
    });

    return sortOptionsByLabel(options, sortByLabel);
  };
};
