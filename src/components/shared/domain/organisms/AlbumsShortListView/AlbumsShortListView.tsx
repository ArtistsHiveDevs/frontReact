import { useEffect, useState } from 'react';
import { useI18n } from '~/common/utils';
import { AlbumShortView } from '~/components/shared/domain/molecules/AlbumShortView/AlbumShortView';
import './AlbumsShortListView.scss';

const DISCOGRAPHY_PAGINATION_LIMIT = 4;
const TRANSLATION_BASE_GLOBAL_DICT_ACTIONS = 'app.global_dictionary.actions';

export const AlbumsShortListView = (props: any) => {
  const { discography } = props;

  const { translateText } = useI18n();

  const [seeMoreVisible, setVisibleSeeMore] = useState(false);
  const [seeMoreOpened, setOpenSeeMore] = useState(false);

  useEffect(() => {
    setVisibleSeeMore(discography.length > DISCOGRAPHY_PAGINATION_LIMIT);
    setOpenSeeMore(false);
  }, []);

  useEffect(() => {
    setVisibleSeeMore(discography.length > DISCOGRAPHY_PAGINATION_LIMIT);
    setOpenSeeMore(false);
  }, [discography]);

  const btnSeeMore = () => {
    const text = seeMoreOpened
      ? translateText(`${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS}.show_less`)
      : `${translateText(`${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS}.show_more`)} (${
          discography.length - DISCOGRAPHY_PAGINATION_LIMIT
        }+)`;
    return (
      <div className="btn-see-more" onClick={() => setOpenSeeMore(!seeMoreOpened)}>
        {text}
      </div>
    );
  };

  if (!discography || !Array.isArray(discography) || !discography.length) {
    return <div>No se encontró ningún álbum.</div>;
  } else {
    const discographyShortList =
      seeMoreVisible && !seeMoreOpened ? discography.slice(0, DISCOGRAPHY_PAGINATION_LIMIT) : discography;

    return (
      <div>
        {discographyShortList.map((album: any, index: number) => {
          return <AlbumShortView key={`album-${index}`} album={album} />;
        })}
        {seeMoreVisible && btnSeeMore()}
      </div>
    );
  }
};
