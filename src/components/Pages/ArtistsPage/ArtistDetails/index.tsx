import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorArtists, useArtistsSlice } from '~/common/slices/domain/artists/artist.redux';
import { logPageViewEvent } from '~/common/utils/analytics/analytics';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { RootState } from '~/common/utils/redux-injectors/types';
import {
  ARTIST_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_ARTIST_DETAIL_PAGE,
} from '~/components/Pages/ArtistsPage/ArtistDetails/config-artist-detail';
import MainSection from '~/components/Pages/HomePage/MainSection/MainSection';
import NotFoundPage from '~/components/Pages/NotFoundPage';
import { GalleryImageParams, ImageGallery } from '~/components/shared/atoms/ImageGallery/ImageGallery';
import { ProfileTabsPage } from '~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage';
import AppLoader from '~/components/shared/organisms/app/loader/loader';
import { SUB_PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { EventModel } from '~/models/domain/event/event.model';
import './index.scss';

const ArtistDetailPage = () => {
  const { navigateToEntity } = useNavigation();
  const urlParameters = useParams();

  const [artistId, setCurrentArtistId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
  const [startedRequest, setStartedRequest] = useState(false);
  const [finishedRequest, setFinishedRequest] = useState(false);
  const [currentGalleryImage, setGalleryImage] = useState(undefined);

  const requestIsLoading = useSelector(selectorArtists.selectLoading);
  const requestError = useSelector(selectorArtists.selectError);
  const { actions: artistsActions } = useArtistsSlice();

  const subPagesInfo = [...ARTIST_DETAIL_SUB_PAGE_CONFIG];
  const selectArtistById = selectorArtists.makeSelectItemById();
  const currentArtist = useSelector((state: RootState) => {
    if (artistId) {
      return selectArtistById(state, artistId);
    } else {
      return undefined;
    }
  });

  const dispatch = useDispatch();

  useEffect(() => {
    setStartedRequest(false);
    setFinishedRequest(false);
  }, []);

  useEffect(() => {
    setStartedRequest(true);
    setFinishedRequest(false);
    dispatch(artistsActions.getItemById({ id: artistId }));
  }, [artistId]);

  useEffect(() => {
    if (artistId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentArtistId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
  }, [urlParameters]);

  useEffect(() => {
    if (startedRequest && !requestIsLoading) {
      setFinishedRequest(true);
      setStartedRequest(false);
    }

    if (currentArtist) {
      document.title = `${currentArtist.name}  ◃⬡▹  Artist Hive`;
      logPageViewEvent({ page_title: `Artist - ${currentArtist.name}` });
    }
  }, [currentArtist, requestIsLoading, startedRequest]);

  const handlers = {
    onClickGalleryImage: (source: GalleryImageParams, images: GalleryImageParams[]) => {
      const image = <ImageGallery images={images} imageSize="fs" />;
      setGalleryImage(image);
    },
    onCloseGalleryImage: (value: any) => {
      setGalleryImage(undefined);
    },
    onClickEvent: (value: any) => {
      navigateToEntity({ entityType: EventModel.name, id: value.identifier });
    },
    onEditProfile: (value: any) => {
      const entityType = value.constructor.name !== 'Object' ? value.constructor.name : value.entity;
      navigateToEntity({ entityType, id: value.identifier, action: SUB_PATHS.EDIT });
    },
  };
  console.log(currentArtist);

  return (
    <>
      {finishedRequest ? (
        currentArtist ? (
          <>
            <ProfileTabsPage
              entityName="Artist"
              entityData={currentArtist}
              translation_base_path={TRANSLATION_BASE_ARTIST_DETAIL_PAGE}
              subpagesConfig={subPagesInfo}
              handlers={handlers}
            />
            {currentArtist.arts?.music?.related_artists?.length ? (
              <MainSection
                description={'Estos son los artistas relacionados'}
                listView={currentArtist.arts?.music?.related_artists}
                params={{ useNewCard: true }}
                title={
                  'Artistas relacionados'
                  // translateText(`${TRANSLATION_BASE_HOME_PAGE}.artists`)
                }
                callbacks={{
                  onClickCard: (data: ArtistModel) =>
                    navigateToEntity({ entityType: ArtistModel.name, id: data.identifier }),
                }}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <NotFoundPage />
            {/* Artist not found {JSON.stringify(requestError, null, 4)} */}
          </>
        )
      ) : (
        <AppLoader />
      )}
    </>
  );
};

export default ArtistDetailPage;
