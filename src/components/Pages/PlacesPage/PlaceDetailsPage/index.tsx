import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { usePlacesSlice } from "~/common/slices/places";
import { selectPlaces } from "~/common/slices/places/selectors";
import { PLACE_DETAIL_SUB_PAGE_CONFIG } from "~/components/Pages/PlacesPage/PlaceDetailsPage/config-place-detail";
import {
  GalleryImageParams,
  ImageGallery,
} from "~/components/shared/atoms/ImageGallery/ImageGallery";
import { ProfileTabsPage } from "~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage";
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from "~/constants";
import { PlaceModel } from "~/models/domain/place/place.model";

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE =
  "app.pages.PlacesPages.PlacesDetailsPage";

const PlaceDetailPage = () => {
  const navigate = useNavigate();

  const urlParameters = useParams();

  const [placeId, setCurrentPlaceId] = useState(
    urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]
  );

  const placesList: PlaceModel[] = useSelector(selectPlaces);
  const { actions: placesActions } = usePlacesSlice();

  const subPagesInfo = [...PLACE_DETAIL_SUB_PAGE_CONFIG];

  const [currentPlace, setCurrentPlace] = useState<PlaceModel>(undefined);
  const [currentGalleryImage, setGalleryImage] = useState(undefined);

  const dispatch = useDispatch();
  useEffect(() => {
    if (placesList.length === 0) {
      dispatch(placesActions.loadPlaces());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!placesList.length) {
      setCurrentPlace(getPlaceInfo(placeId));
    }
  }, [placesList]);

  useEffect(() => {
    getPlaceInfo(placeId);
    setCurrentPlace(getPlaceInfo(placeId));

    if (placeId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentPlaceId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }

  }, [placeId, urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]]);

  const getPlaceInfo = (id: string) => {
    return placesList.find((place) => place.id === id);
  };

  const handlers = {
    onClickGalleryImage: (
      source: GalleryImageParams,
      images: GalleryImageParams[]
    ) => {
      const image = <ImageGallery images={images} imageSize="fs" />;
      setGalleryImage(image);
    },
    onCloseGalleryImage: (value: any) => {
      setGalleryImage(undefined);
    },
    onClickNextEvent: (value: any) => {
      navigateTo(PATHS.EVENTS, value.id);
    },
    onClickPastEvent: (value: any) => {
      navigateTo(PATHS.EVENTS, value.id);
    },
  };

  function navigateTo(newEntity: PATHS, id: string = null) {
    navigate(`${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${id}`);
  }

  // Data config
  subPagesInfo;

  return (
    <>
      {!!currentPlace && (
        <ProfileTabsPage
          entityName="Place"
          entityData={currentPlace}
          translation_base_path={TRANSLATION_BASE_ARTIST_DETAIL_PAGE}
          subpagesConfig={subPagesInfo}
          handlers={handlers}
        />
      )}
    </>
  );
};

export default PlaceDetailPage;
