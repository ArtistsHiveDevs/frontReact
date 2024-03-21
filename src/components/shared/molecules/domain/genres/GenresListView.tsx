import { useI18n } from '~/common/utils';
import { Badge } from '~/components/shared/atoms/gui/badge/Badge';
import './GenresListView.scss';

const TRANSLATION_BASE_ART_TYPES = 'app.global_dictionary.art_types';

export interface GenresListViewParams {
  genres: { [artType: string]: string[] };
}

export const GenresListView = (props: GenresListViewParams) => {
  const { genres } = props;

  const { translateText } = useI18n();

  return (
    <>
      {Object.keys(genres).map((artType) => {
        const genresList = genres[artType] || [];

        return (
          <div key={`art_${artType}`}>
            <h4 className="art-title">{translateText(`${TRANSLATION_BASE_ART_TYPES}.${artType}`)}</h4>
            <div className="genre-container">
              {genresList.map((genre: string) => (
                <Badge key={`art_${artType}_${genre}`} text={genre}></Badge>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};
