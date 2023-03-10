import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useRidersSlice } from "~/common/slices/domain/riders";
import { selectRiders } from "~/common/slices/domain/riders/selectors";
import {
  GalleryImageParams,
  ImageGallery,
} from "~/components/shared/atoms/ImageGallery/ImageGallery";
import { ProfileTabsPage } from "~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage";
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from "~/constants";
import { ArtistRiderModel } from "~/models/domain/rider/rider.model";
import { RIDER_DETAILS_SUB_PAGE_CONFIG } from "./config-rider-detail";
import "./index.scss";

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE =
  "app.pages.domain.RidersPages.RidersDetailsPage";

const RiderDetailPage = () => {
  const navigate = useNavigate();

  const urlParameters = useParams();

  const [riderId, setCurrentRiderId] = useState(
    urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]
  );

  const riderList: ArtistRiderModel[] = useSelector(selectRiders);
  const { actions: ridersActions } = useRidersSlice();

  const subPagesInfo = [...RIDER_DETAILS_SUB_PAGE_CONFIG];

  const [currentRider, setCurrentRider] = useState<ArtistRiderModel>(undefined);
  const [currentGalleryImage, setGalleryImage] = useState(undefined);

  const dispatch = useDispatch();
  useEffect(() => {
    if (riderList.length === 0) {
      dispatch(ridersActions.loadRiders());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!riderList.length) {
      setCurrentRider(getRiderInfo(riderId));
    }
  }, [riderList]);

  useEffect(() => {
    setCurrentRider(getRiderInfo(riderId));

    if (riderId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentRiderId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
  }, [riderId, urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]]);

  const getRiderInfo = (id: string) => {
    return riderList.find((rider) => rider.id === id);
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
    onClickEvent: (value: any) => {
      navigateTo(PATHS.EVENTS, value.id);
    },
  };

  function navigateTo(newEntity: PATHS, id: string = null) {
    navigate(`${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${id}`);
  }

  return (
    <>
      {!!currentRider && (
        <ProfileTabsPage
          entityName="Rider"
          entityData={currentRider}
          translation_base_path={TRANSLATION_BASE_ARTIST_DETAIL_PAGE}
          subpagesConfig={subPagesInfo}
          profileHeaderComponent={
            <>
              <h1>{currentRider.name}</h1>
            </>
          }
          handlers={handlers}
        />
      )}
    </>
  );
};

export default RiderDetailPage;
