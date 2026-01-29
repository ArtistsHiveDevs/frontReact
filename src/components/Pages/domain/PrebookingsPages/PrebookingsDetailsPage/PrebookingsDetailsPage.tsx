import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { GalleryImageParams, ImageGallery } from '~/components/shared/atoms/ImageGallery/ImageGallery';
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { AcademyModel } from '~/models/domain/academy/academy.model';
import { PREBOOKING_DETAIL_SUB_PAGE_CONFIG } from './config-prebooking-detail';
import './PrebookingsDetailsPage.scss';

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE = 'app.pages.domain.AcademiesPages.AcademiesDetailsPage';

const PrebookingDetailPage = () => {
  const navigate = useNavigate();

  const urlParameters = useParams();

  const [academyId, setCurrentAcademyId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);

  const subPagesInfo = [...PREBOOKING_DETAIL_SUB_PAGE_CONFIG];

  const [currentAcademy, setCurrentAcademy] = useState<AcademyModel>(undefined);
  const [currentGalleryImage, setGalleryImage] = useState(undefined);

  const dispatch = useDispatch();

  const handlers = {
    onClickGalleryImage: (source: GalleryImageParams, images: GalleryImageParams[]) => {
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

  return <></>;
};

export default PrebookingDetailPage;
