import './TourDetailsPage.scss';

import { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTourOutlineSlice } from '~/common/slices/domain/favourites/tour-outlines';
import { selectTourOutlineById } from '~/common/slices/domain/favourites/tour-outlines/selectors';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import {
  FavoriteSubscription,
  FavoriteSubscritionIconDefaultTypes,
} from '~/components/shared/molecules/general/favoriteSubscribe/favoriteSubscribe';
import { ProfileTabsPage } from '~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage';
import { URL_PARAMETER_NAMES } from '~/constants';
import { TourOutlineModel } from '~/models/domain/favourites/tourOutline';
import { TOUR_OUTLINE_DETAIL_SUB_PAGE_CONFIG } from './config-tour-detail';

const TRANSLATION_BASE_EVENT_DETAILS_PAGE: string = 'app.pages.domain.TourPlansPages.TourPlanDetailsPage';

const TourPlanDetailsPage = () => {
  // Component URL Params
  const urlParameters = useParams();
  const navigation = useNavigation();
  const [tourPlanId, setCurrentTourPlanId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);

  // States

  const { actions: tourPlanActions } = useTourOutlineSlice();

  const subPagesInfo = [...TOUR_OUTLINE_DETAIL_SUB_PAGE_CONFIG];

  const tourOutlineDetails: TourOutlineModel = useSelector(selectTourOutlineById);
  // Hooks
  const dispatch = useDispatch();

  const { translateText } = useI18n();

  const { navigateToEntity } = useNavigation();

  // Effects
  useEffect(() => {
    dispatch(tourPlanActions.getTourOutlineById(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]));

    if (tourPlanId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentTourPlanId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
  }, [urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]]);

  useEffect(() => {}, [tourOutlineDetails]);

  // function navigateTo(newEntity: PATHS, id: string = null) {
  //   navigate(`${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${id}`);
  // }

  const handlers = {
    onNavigateToEntity: (value: any) => {
      const entityType = value.constructor.name;
      navigateToEntity({ entityType, id: value.id });
    },
  };

  return (
    <>
      <a onClick={() => navigation.goBack()}>{'<'} Volver</a>
      {tourOutlineDetails && (
        <>
          <ProfileTabsPage
            entityName="TourPlan"
            entityData={tourOutlineDetails}
            translation_base_path={TRANSLATION_BASE_EVENT_DETAILS_PAGE}
            subpagesConfig={subPagesInfo}
            handlers={handlers}
            profileHeaderComponent={
              <>
                <h1 className="tourPlan-title">
                  {tourOutlineDetails.name}{' '}
                  <FavoriteSubscription
                    color={'#7a260a'}
                    size={22}
                    iconType={FavoriteSubscritionIconDefaultTypes.BELL}
                  />
                </h1>
                <Image
                  alt={tourOutlineDetails.name}
                  src={
                    tourOutlineDetails.pictures.thumbnail || 'https://npcarlos.co/artistsHive_mocks/tour_default.png'
                  }
                  width={'80rem'}
                  fluid={true}
                />
              </>
            }
          />
        </>
      )}
      {!tourOutlineDetails && <h2>{translateText(`${TRANSLATION_BASE_EVENT_DETAILS_PAGE}.tourPlanNotFound`)}</h2>}
    </>
  );
};

export default TourPlanDetailsPage;
