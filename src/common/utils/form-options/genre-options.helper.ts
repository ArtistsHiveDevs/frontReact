import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { EnMessages } from '~/translations/en';
import { ParametricOptionsParams, sortOptionsByLabel } from './dynamic-form-parametric-options.helper';

/**
 * Ruta base para las traducciones de géneros musicales
 */
const TRANSLATION_BASE_MUSIC_GENRES = 'app.global_dictionary.music_genres';

/**
 * Géneros musicales disponibles para los formularios de perfiles
 */
export const MUSIC_GENRE_OPTIONS = Object.keys(EnMessages.app.global_dictionary.music_genres);

export interface MusicGenreOptionsParams extends ParametricOptionsParams {
  selectedValues?: string[];
}

/**
 * Indica si un género pertenece al catálogo traducido
 * @param genre - Clave del género
 * @returns true si el género existe en el diccionario de traducciones
 */
export const isKnownMusicGenre = (genre: string): boolean => MUSIC_GENRE_OPTIONS.includes(genre);

/**
 * Traduce un género musical del catálogo
 * @param genre - Clave del género
 * @param translateFn - Función de traducción (opcional)
 * @returns El género traducido, o el valor original si no pertenece al catálogo
 */
export const translateMusicGenre = (genre: string, translateFn?: (key: string) => string): string =>
  translateFn && isKnownMusicGenre(genre) ? translateFn(`${TRANSLATION_BASE_MUSIC_GENRES}.${genre}`) : genre;

/**
 * Genera las opciones de géneros musicales
 * @param params - Parámetros de configuración (opcionales)
 * @param params.translateFn - Función de traducción del diccionario global (opcional)
 * @param params.selectedValues - Géneros ya seleccionados en la entidad (opcional)
 * @param params.translationPath - Ruta base para las traducciones
 * @param params.sortByLabel - Orden de las opciones por label: 'asc' o 'desc' (opcional)
 * @returns Array de SelectOption con los géneros musicales traducidos
 */
export const getMusicGenreOptions = (params?: MusicGenreOptionsParams): SelectOption[] => {
  const {
    translateFn,
    selectedValues = [],
    translationPath = TRANSLATION_BASE_MUSIC_GENRES,
    sortByLabel = 'asc',
  } = params || {};

  const options = MUSIC_GENRE_OPTIONS.map((genre) => {
    const translationKey = translationPath ? `${translationPath}.${genre}` : genre;
    const option: SelectOption = {
      label: translateFn ? translateFn(translationKey) : genre,
      value: genre,
    };
    if (selectedValues.includes(genre)) {
      option.selected = true;
    }
    return option;
  });

  return sortOptionsByLabel(options, sortByLabel);
};
