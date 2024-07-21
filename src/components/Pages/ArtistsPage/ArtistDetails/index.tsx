import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useArtistsSlice } from '~/common/slices/artists';
import { artistsSelectLoading, makeSelectArtistById, selectArtists } from '~/common/slices/artists/selectors';
import { logPageViewEvent } from '~/common/utils/analytics/analytics';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { RootState } from '~/common/utils/redux-injectors/types';
import {
  ARTIST_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_ARTIST_DETAIL_PAGE,
} from '~/components/Pages/ArtistsPage/ArtistDetails/config-artist-detail';
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

  const artistList: ArtistModel[] = useSelector(selectArtists);
  const requestIsLoading = useSelector(artistsSelectLoading);
  const { actions: artistsActions } = useArtistsSlice();

  const subPagesInfo = [...ARTIST_DETAIL_SUB_PAGE_CONFIG];
  const selectArtistById = makeSelectArtistById();
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
    dispatch(artistsActions.getArtistById(artistId));
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
      navigateToEntity({ entityType: EventModel.name, id: value.id });
    },
    onEditProfile: (value: any) => {
      const entityType = value.constructor.name !== 'Object' ? value.constructor.name : value.entity;
      navigateToEntity({ entityType, id: value.id, action: SUB_PATHS.EDIT });
    },
  };

  return (
    <>
      {finishedRequest ? (
        currentArtist ? (
          <ProfileTabsPage
            entityName="Artist"
            entityData={currentArtist}
            translation_base_path={TRANSLATION_BASE_ARTIST_DETAIL_PAGE}
            subpagesConfig={subPagesInfo}
            handlers={handlers}
          />
        ) : (
          'Artist not found'
        )
      ) : (
        <AppLoader />
      )}
    </>
  );
};

export default ArtistDetailPage;
