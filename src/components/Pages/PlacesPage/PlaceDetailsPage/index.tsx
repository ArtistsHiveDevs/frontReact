import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorPlaces, usePlacesSlice } from '~/common/slices/domain/places/places.redux';
import { logPageViewEvent } from '~/common/utils/analytics/analytics';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { RootState } from '~/common/utils/redux-injectors/types';
import { GalleryImageParams, ImageGallery } from '~/components/shared/atoms/ImageGallery/ImageGallery';
import { ProfileTabsPage } from '~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage';
import AppLoader from '~/components/shared/organisms/app/loader/loader';
import { SUB_PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { EventModel } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import { PLACE_DETAIL_SUB_PAGE_CONFIG, TRANSLATION_BASE_PLACE_DETAIL_PAGE } from './config-place-detail';

const PlaceDetailPage = () => {
  const { navigateToEntity } = useNavigation();
  const urlParameters = useParams();

  const [placeId, setCurrentPlaceId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
  const [startedRequest, setStartedRequest] = useState(false);
  const [finishedRequest, setFinishedRequest] = useState(false);
  const [currentGalleryImage, setGalleryImage] = useState(undefined);

  const placeList: PlaceModel[] = useSelector(selectorPlaces.selectItems);
  const requestIsLoading = useSelector(selectorPlaces.selectLoading);
  const { actions: placesActions } = usePlacesSlice();

  const subPagesInfo = [...PLACE_DETAIL_SUB_PAGE_CONFIG];

  const selectPlaceById = selectorPlaces.makeSelectItemById();
  const currentPlace: PlaceModel = useSelector((state: RootState) => {
    if (placeId) {
      return selectPlaceById(state, placeId);
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
    dispatch(placesActions.getItemById({ id: placeId }));
  }, [placeId]);

  useEffect(() => {
    if (placeId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentPlaceId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
  }, [urlParameters]);

  useEffect(() => {
    if (startedRequest && !requestIsLoading) {
      setFinishedRequest(true);
      setStartedRequest(false);
    }

    if (currentPlace) {
      document.title = `${currentPlace.name}  ◃⬡▹  Place Hive`;
      logPageViewEvent({ page_title: `Place - ${currentPlace.name}` });
    }
  }, [currentPlace, requestIsLoading, startedRequest]);

  const handlers = {
    onClickGalleryImage: (source: GalleryImageParams, images: GalleryImageParams[]) => {
      const image = <ImageGallery images={images} imageSize="fs" />;
      setGalleryImage(image);
    },
    onCloseGalleryImage: (value: any) => {
      setGalleryImage(undefined);
    },
    onClickNextEvent: (value: any) => {
      navigateToEntity({ entityType: EventModel.name, id: value.identifier });
    },
    onClickPastEvent: (value: any) => {
      navigateToEntity({ entityType: EventModel.name, id: value.identifier });
    },
    onClickEvent: (value: any) => {
      navigateToEntity({ entityType: EventModel.name, id: value.identifier });
    },
    onEditProfile: (value: any) => {
      const entityType = value.constructor.name !== 'Object' ? value.constructor.name : value.entity;
      navigateToEntity({ entityType, id: value.identifier, action: SUB_PATHS.EDIT });
    },
  };

  return (
    <>
      {finishedRequest ? (
        currentPlace ? (
          <ProfileTabsPage
            entityName="Place"
            entityData={currentPlace}
            translation_base_path={TRANSLATION_BASE_PLACE_DETAIL_PAGE}
            subpagesConfig={subPagesInfo}
            handlers={handlers}
          />
        ) : (
          'Place not found'
        )
      ) : (
        <AppLoader />
      )}
    </>
  );
};

export default PlaceDetailPage;
