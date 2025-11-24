import { useI18n } from '~/common/utils';
import { Badge } from '~/components/shared/atoms/gui/badge/Badge';
import './GenresListView.scss';

const TRANSLATION_BASE_ART_TYPES = 'app.global_dictionary.art_types';

/**
 * Tipo para la estructura de géneros anidada
 */
export interface NestedGenres {
  l1: string[];
  l2?: string[];
}

/**
 * Tipo unión que soporta ambas estructuras:
 * - Estructura antigua: string[]
 * - Estructura nueva: {l1: string[], l2?: string[]}
 */
export type GenresValue = string[] | NestedGenres;

export interface GenresListViewParams {
  genres: { [artType: string]: GenresValue };
}

/**
 * Extrae la lista de géneros de nivel 1 (l1) de la estructura de géneros
 * Soporta tanto la estructura antigua (string[]) como la nueva ({l1, l2})
 */
const extractGenresList = (genresValue: GenresValue): string[] => {
  // Si es un array simple, retornarlo directamente (estructura antigua)
  if (Array.isArray(genresValue)) {
    return genresValue;
  }

  // Si es la estructura nueva con l1 y l2, retornar solo l1
  if (genresValue && typeof genresValue === 'object' && 'l1' in genresValue) {
    return genresValue.l1 || [];
  }

  // Fallback: retornar array vacío
  return [];
};

export const GenresListView = (props: GenresListViewParams) => {
  const { genres } = props;

  const { translateText } = useI18n();

  return (
    <>
      {Object.keys(genres).map((artType) => {
        const genresList = extractGenresList(genres[artType]);

        return (
          <div key={`art_${artType}`}>
            <h4 className="art-title">{translateText(`${TRANSLATION_BASE_ART_TYPES}.${artType}`)}</h4>
            <div className="genre-container">
              {(genresList || []).map((genre: string) => (
                <Badge key={`art_${artType}_${genre}`} text={genre}></Badge>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};
