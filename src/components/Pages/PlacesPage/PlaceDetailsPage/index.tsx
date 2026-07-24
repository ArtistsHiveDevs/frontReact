import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorPlaces, usePlacesSlice } from '~/common/slices/domain/places/places.redux';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { logPageViewEvent } from '~/common/utils/analytics/analytics';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { RootState } from '~/common/utils/redux-injectors/types';
import NotFoundPage from '~/components/Pages/NotFoundPage';
import { GalleryImageParams, ImageGallery } from '~/components/shared/atoms/ImageGallery/ImageGallery';
import { ClaimProfileBanner } from '~/components/shared/molecules/Profile/ClaimProfileBanner/ClaimProfileBanner';
import { ProfileTabsPage } from '~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { PreBookingRequestDialog } from '~/components/shared/organisms/domain/PreBookingDialog';
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { Button } from '@mui/material';
import { getClassFromModelName } from '~/models/base/modelHelpers';
import { EventModel } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import { PLACE_DETAIL_SUB_PAGE_CONFIG, TRANSLATION_BASE_PLACE_DETAIL_PAGE } from './config-place-detail';

const PlaceDetailPage = () => {
  const { navigateToEntity, navigateToInnerPath } = useNavigation();
  const urlParameters = useParams();

  const loggedUser = useSelector(selectCurrentUser);

  const [placeId, setCurrentPlaceId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
  const [startedRequest, setStartedRequest] = useState(false);
  const [finishedRequest, setFinishedRequest] = useState(false);
  const [currentGalleryImage, setGalleryImage] = useState(undefined);
  const [openDialogBookDate, setOpenDialogBookDate] = useState(undefined);

  const placeList: PlaceModel[] = useSelector(selectorPlaces.selectItems);
  const requestIsLoading = useSelector(selectorPlaces.selectLoading);
  const { actions: placesActions } = usePlacesSlice();
  const { actions: usersActions } = useUsersSlice();

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
    onClickFollowSucription: (value: any) => {
      if (loggedUser) {
        let followAction: 'follow' | 'unfollow';
        let id;
        if (value) {
          followAction = 'follow';
          id = 'XX Seguir a:  ' + currentPlace.identifier;
        } else {
          {
            followAction = 'unfollow';
            id = 'XX dejar de Seguir a:  ' + currentPlace.identifier;
          }
        }
        dispatch(usersActions.followProfileUser({ action: followAction, profile: currentPlace }));
      } else {
        console.log('Debe iniciar sesión');

        navigateToInnerPath({ path: PATHS.LOGIN });
      }
    },

    onClickOnFollower: (value: any) => {
      const entityType = getClassFromModelName(value?.entityType)?.name;
      if (entityType) {
        navigateToEntity({ entityType, id: value.username || value.id });
      }
    },
  };

  const onFABClick = () => {
    if (!loggedUser) {
      navigateToInnerPath({ path: PATHS.LOGIN });
    } else {
      setOpenDialogBookDate(true);
    }
  };

  const onCreateOpenCall = () => {
    if (!loggedUser) {
      navigateToInnerPath({ path: PATHS.LOGIN });
    } else {
      // El backend hace PlaceModel.findById(place_id): necesita el ObjectId real, no el username (currentPlace.identifier).
      navigateToInnerPath({ path: `${PATHS.OPEN_CALLS}/${SUB_PATHS.CREATE}?placeId=${currentPlace?.id}` });
    }
  };

  // Se compara por `.id` (estable) y no por `.identifier`: este último depende del username cacheado en
  // roles[].entityRoleMap[], que puede quedar desincronizado si el Place cambia su username después de creado.
  const isPlaceOwner = loggedUser && currentPlace && loggedUser.currentProfileInfo?.id === currentPlace.id;

  return (
    <>
      {finishedRequest ? (
        currentPlace ? (
          <>
            {isPlaceOwner && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 16px' }}>
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={onCreateOpenCall}
                  startIcon={<span style={{ fontSize: '1.1em' }}>&#128227;</span>}
                >
                  Crear Convocatoria
                </Button>
              </div>
            )}
            <ProfileTabsPage
              entityName="Place"
              entityData={currentPlace}
              translation_base_path={TRANSLATION_BASE_PLACE_DETAIL_PAGE}
              subpagesConfig={subPagesInfo}
              handlers={handlers}
              footer={<ClaimProfileBanner entityName="Place" entityData={currentPlace} />}
              fab={{ icon: 'lu LuCalendarPlus', handler: onFABClick }}
            />

          </>
        ) : (
          <NotFoundPage />
        )
      ) : (
        <AppLoader />
      )}
      {/* <AppDialog
              title="Agendar evento"
              isOpenDialog={openDialogBookDate}
              onClose={() => setOpenDialogBookDate(false)}
              content={`Pronto prodrás solicitar una fecha para tu evento a ${currentArtist?.name}`}
              icon={'FaInfoCircle'}
            /> */}
      {currentPlace && (
        <PreBookingRequestDialog
          open={openDialogBookDate}
          onClose={() => setOpenDialogBookDate(false)}
          onSubmit={() => console.log('sumbit')}
          // availableParticipants={availableParticipants}
          mainRecipient={currentPlace}
        />
      )}
    </>
  );
};

export default PlaceDetailPage;
