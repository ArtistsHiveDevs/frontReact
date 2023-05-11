import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAcademiesSlice } from "~/common/slices/domain/academies";
import { selectAcademies } from "~/common/slices/domain/academies/selectors";

import {
  GalleryImageParams,
  ImageGallery,
} from "~/components/shared/atoms/ImageGallery/ImageGallery";
import { ProfileTabsPage } from "~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage";
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from "~/constants";
import { AcademyModel } from "~/models/domain/academy/academy.model";
import { ACADEMY_DETAIL_SUB_PAGE_CONFIG } from "./config-academy-detail";
import "./index.scss";

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE =
  "app.pages.domain.AcademiesPages.AcademiesDetailsPage";

const AcademyDetailPage = () => {
  const navigate = useNavigate();

  const urlParameters = useParams();

  const [academyId, setCurrentAcademyId] = useState(
    urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]
  );

  const academiesList: AcademyModel[] = useSelector(selectAcademies);
  const { actions: academiesActions } = useAcademiesSlice();

  const subPagesInfo = [...ACADEMY_DETAIL_SUB_PAGE_CONFIG];

  const [currentAcademy, setCurrentAcademy] = useState<AcademyModel>(undefined);
  const [currentGalleryImage, setGalleryImage] = useState(undefined);

  const dispatch = useDispatch();
  useEffect(() => {
    if (academiesList.length === 0) {
      dispatch(academiesActions.loadAcademies());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!academiesList.length) {
      setCurrentAcademy(getAcademyInfo(academyId));
    }
  }, [academiesList]);

  useEffect(() => {
    getAcademyInfo(academyId);
    setCurrentAcademy(getAcademyInfo(academyId));

    if (academyId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentAcademyId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
  }, [academyId, urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]]);

  const getAcademyInfo = (id: string) => {
    return academiesList.find((academy) => academy.id === id);
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
      {!!currentAcademy && (
        <ProfileTabsPage
          entityName="Academy"
          entityData={currentAcademy}
          translation_base_path={TRANSLATION_BASE_ARTIST_DETAIL_PAGE}
          subpagesConfig={subPagesInfo}
          handlers={handlers}
        />
      )}
    </>
  );
};

export default AcademyDetailPage;
