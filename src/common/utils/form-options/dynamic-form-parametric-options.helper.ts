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

export * from './artist-options.helper';
export * from './event-options.helper';
export * from './open-call-options.helper';
export * from './place-options.helper';
export * from './user-options.helper';
