import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { usePlacesSlice } from '~/common/slices/places';
import { makeSelectPlaceById } from '~/common/slices/places/selectors';
import { logPageViewEvent } from '~/common/utils/analytics/analytics';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { RootState } from '~/common/utils/redux-injectors/types';
import {
  PLACE_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_PLACE_DETAIL_PAGE,
} from '~/components/Pages/PlacesPage/PlaceDetailsPage/config-place-detail';
import { GalleryImageParams, ImageGallery } from '~/components/shared/atoms/ImageGallery/ImageGallery';
import { ProfileTabsPage } from '~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage';
import { URL_PARAMETER_NAMES } from '~/constants';
import { EventModel } from '~/models/domain/event/event.model';

const PlaceDetailPage = () => {
  const { navigateToEntity } = useNavigation();

  const urlParameters = useParams();

  const [placeId, setCurrentPlaceId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);

  const { actions: placesActions } = usePlacesSlice();

  const subPagesInfo = [...PLACE_DETAIL_SUB_PAGE_CONFIG];

  const [currentGalleryImage, setGalleryImage] = useState(undefined);

  const selectPlaceById = makeSelectPlaceById();
  const currentPlace = useSelector((state: RootState) => {
    if (placeId) {
      return selectPlaceById(state, placeId);
    } else {
      return undefined;
    }
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(placesActions.getPlaceById(placeId));
  }, [placeId]);

  useEffect(() => {
    if (placeId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentPlaceId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
  }, [urlParameters]);

  useEffect(() => {
    if (currentPlace) {
      document.title = `${currentPlace.name}  ◃ ⬡ ▹  Place Hive`;
      logPageViewEvent({ page_title: `Place - ${currentPlace.name}` });
    }
  }, [currentPlace]);

  const handlers = {
    onClickGalleryImage: (source: GalleryImageParams, images: GalleryImageParams[]) => {
      const image = <ImageGallery images={images} imageSize="fs" />;
      setGalleryImage(image);
    },
    onCloseGalleryImage: (value: any) => {
      setGalleryImage(undefined);
    },
    onClickNextEvent: (value: any) => {
      navigateToEntity({ entityType: EventModel.name, id: value.id });
    },
    onClickPastEvent: (value: any) => {
      navigateToEntity({ entityType: EventModel.name, id: value.id });
    },
  };

  // Data config
  subPagesInfo;

  return (
    <>
      {!!currentPlace && (
        <ProfileTabsPage
          entityName="Place"
          entityData={currentPlace}
          translation_base_path={TRANSLATION_BASE_PLACE_DETAIL_PAGE}
          subpagesConfig={subPagesInfo}
          handlers={handlers}
        />
      )}
      {!currentPlace && 'Place not found'}
    </>
  );
};

export default PlaceDetailPage;
