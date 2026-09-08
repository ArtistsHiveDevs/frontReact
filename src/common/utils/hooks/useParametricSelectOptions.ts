import { DependencyList, useEffect, useState } from 'react';
import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';

type SelectOptionsMap = Record<string, SelectOption[]>;

/**
 * Genera un mapa de catálogos de SelectOption[] a partir de una factory, y lo regenera cuando
 * cambian las deps (típicamente [translateGlobalDict]). Evita declarar un useState + setState
 * por cada catálogo (event type, stage type, géneros, etc.) en cada página con un formulario.
 */
export function useParametricSelectOptions<T extends SelectOptionsMap>(
  factory: () => T,
  deps: DependencyList
): T {
  const [options, setOptions] = useState<T>(factory);

  useEffect(() => {
    setOptions(factory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return options;
}
