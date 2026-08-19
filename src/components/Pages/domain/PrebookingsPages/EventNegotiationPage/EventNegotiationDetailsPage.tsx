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
import { getClassFromModelName } from '~/models/base/modelHelpers';
import { EventModel } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import {
  EVENT_NEGOTIATION_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_EVENT_NEGOTIATION_DETAIL_PAGE,
} from './config-event-negotiation-detail';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { EventNegotiationModel } from '~/models/domain/prebooking/event-negotiation.model';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import dayjs from 'dayjs';
import { Avatar } from '@mui/material';

const EventNegociationDetailsPage = () => {
  const { navigateToEntity, navigateToInnerPath } = useNavigation();
  const urlParameters = useParams();

  const loggedUser = useSelector(selectCurrentUser);

  const [prebookingNegotiationId, setCurrentPlaceId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
  const [startedRequest, setStartedRequest] = useState(false);
  const [finishedRequest, setFinishedRequest] = useState(false);
  const [currentGalleryImage, setGalleryImage] = useState(undefined);
  const [openChatDialog, setOpenChatDialog] = useState(undefined);

  const placeList: PlaceModel[] = useSelector(selectorPlaces.selectItems);
  const requestIsLoading = useSelector(selectorPlaces.selectLoading);
  const { actions: placesActions } = usePlacesSlice();
  const { actions: usersActions } = useUsersSlice();

  const subPagesInfo = [...EVENT_NEGOTIATION_DETAIL_SUB_PAGE_CONFIG];

  const selectPlaceById = selectorPlaces.makeSelectItemById();
  const currentEventNegotiation: PlaceModel = useSelector((state: RootState) => {
    if (prebookingNegotiationId) {
      return selectPlaceById(state, prebookingNegotiationId);
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
    dispatch(placesActions.getItemById({ id: prebookingNegotiationId }));
  }, [prebookingNegotiationId]);

  useEffect(() => {
    if (prebookingNegotiationId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentPlaceId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
  }, [urlParameters]);

  useEffect(() => {
    if (startedRequest && !requestIsLoading) {
      setFinishedRequest(true);
      setStartedRequest(false);
    }

    if (currentEventNegotiation) {
      document.title = `${currentEventNegotiation.name}  ◃⬡▹  Place Hive`;
      logPageViewEvent({ page_title: `Place - ${currentEventNegotiation.name}` });
    }
  }, [currentEventNegotiation, requestIsLoading, startedRequest]);

  const handlers = {
    onClickFollowSucription: (value: any) => {
      if (loggedUser) {
        let followAction: 'follow' | 'unfollow';
        let id;
        if (value) {
          followAction = 'follow';
          id = 'XX Seguir a:  ' + currentEventNegotiation.identifier;
        } else {
          {
            followAction = 'unfollow';
            id = 'XX dejar de Seguir a:  ' + currentEventNegotiation.identifier;
          }
        }
        dispatch(usersActions.followProfileUser({ action: followAction, profile: currentEventNegotiation }));
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
    console.log('click en chat');
    setOpenChatDialog(true);
  };

  const initialTime = dayjs().hour(16).minute(0);

  let detaTime = 0;
  const data = new EventNegotiationModel({
    description: 'Texto de descripción '.repeat(10),
    event_date: dayjs().add(48, 'day'),
    load_in_time: initialTime.add(0, 'hour'),
    soundcheck_time: initialTime.add(1.5, 'hour'),
    doors_open_time: initialTime.add(4, 'hour'),
    show_start_time: initialTime.add(5, 'hour'),
    show_end_time: initialTime.add(7, 'hour'),
    load_out_time: initialTime.add(9, 'hour'),
    regulatory_closing_time: initialTime.hour(2),
    participants: generateMockData().map((element: any) => new CurrentProfileInfoModel(element)),
    status: 'in_negotiation',
    notes: 'Notas adicionales parala negociación '.repeat(3),
  });
  return (
    <>
      {finishedRequest ? (
        currentEventNegotiation || true ? (
          <ProfileTabsPage
            entityName="Place"
            profileHeaderComponent={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h1 style={{ margin: 0 }}>Lanzamiento del disco</h1>
                  <Avatar variant="rounded" src="/poster.jpg" sx={{ width: '10rem', height: '10rem' }} />
                </div>
              </>
            }
            entityData={data}
            translation_base_path={TRANSLATION_BASE_EVENT_NEGOTIATION_DETAIL_PAGE}
            subpagesConfig={subPagesInfo}
            handlers={handlers}
            fab={{ icon: 'io5 IoLogoWechat', handler: onFABClick }}
          />
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
      {/* {currentEventNegotiation && (
        <PreBookingRequestDialog
          open={openDialogBookDate}
          onClose={() => setOpenDialogBookDate(false)}
          onSubmit={() => console.log('sumbit')}
          // availableParticipants={availableParticipants}
          mainRecipient={currentEventNegotiation}
        />
      )} */}
      <AppDialog
        title="Chat"
        isOpenDialog={openChatDialog}
        onClose={() => setOpenChatDialog(false)}
        content={`Pronto prodrás tener una conversación entre los participantes`}
        icon={'io5 IoLogoWechat'}
      />
    </>
  );
};

function generateMockData() {
  return [
    {
      _data: {
        _template: {
          id: '67e9a8d16466c0a1997e26ca',
          profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb44d316836b4c5d95b9e99fd4',
          name: 'El Caribefunk',
          username: 'caribefunk',
          subtitle: '',
          verified_status: 1,
          roles: ['OWNER'],
          entity: ArtistModel.name,
          fetchTimestamp: 1774153147327,
        },
        fetchTimestamp: 1774153147327,
        maxCacheTimeToLive: 180000,
        rawTemplate: {
          id: '67e9a8d16466c0a1997e26ca',
          profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb44d316836b4c5d95b9e99fd4',
          name: 'El Caribefunk',
          username: 'caribefunk',
          subtitle: '',
          verified_status: 1,
          roles: ['OWNER'],
          entity: ArtistModel.name,
        },
        id: '67e9a8d16466c0a1997e26ca',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb44d316836b4c5d95b9e99fd4',
        name: 'El Caribefunk',
        username: 'caribefunk',
        subtitle: '',
        verified_status: 1,
        roles: ['OWNER'],
        entity: ArtistModel.name,
      },
      _template: {
        id: '67e9a8d16466c0a1997e26ca',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb44d316836b4c5d95b9e99fd4',
        name: 'El Caribefunk',
        username: 'caribefunk',
        subtitle: '',
        verified_status: 1,
        roles: ['OWNER'],
        entity: ArtistModel.name,
        fetchTimestamp: 1774153147327,
      },
      fetchTimestamp: 1774153147327,
      maxCacheTimeToLive: 180000,
      rawTemplate: {
        id: '67e9a8d16466c0a1997e26ca',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb44d316836b4c5d95b9e99fd4',
        name: 'El Caribefunk',
        username: 'caribefunk',
        subtitle: '',
        verified_status: 1,
        roles: ['OWNER'],
        entity: ArtistModel.name,
      },
      id: '67e9a8d16466c0a1997e26ca',
      profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb44d316836b4c5d95b9e99fd4',
      name: 'El Caribefunk',
      username: 'caribefunk',
      subtitle: '',
      verified_status: 1,
      roles: ['OWNER'],
      entity: ArtistModel.name,
    },
    {
      _data: {
        _template: {
          _id: '67e9c094469208888edbabb6',
          id: '67e9a8d96466c0a1997e2837',
          entityType: 'Artist',
          profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb860987a62e2003cb1c5c63f0',
          name: 'La-33',
          username: 'la33orquesta',
          subtitle: '',
          verified_status: 1,
          createdAt: '2025-03-30T20:26:01.579Z',
          updatedAt: '2025-03-30T20:26:01.579Z',
          __v: 0,
          entity: ArtistModel.name,
          fetchTimestamp: 1774153183788,
        },
        fetchTimestamp: 1774153183788,
        maxCacheTimeToLive: 180000,
        rawTemplate: {
          _id: '67e9c094469208888edbabb6',
          id: '67e9a8d96466c0a1997e2837',
          entityType: 'Artist',
          profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb860987a62e2003cb1c5c63f0',
          name: 'La-33',
          username: 'la33orquesta',
          subtitle: '',
          verified_status: 1,
          createdAt: '2025-03-30T20:26:01.579Z',
          updatedAt: '2025-03-30T20:26:01.579Z',
          __v: 0,
          entity: ArtistModel.name,
        },
        _id: '67e9c094469208888edbabb6',
        id: '67e9a8d96466c0a1997e2837',
        entityType: 'Artist',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb860987a62e2003cb1c5c63f0',
        name: 'La-33',
        username: 'la33orquesta',
        subtitle: '',
        verified_status: 1,
        createdAt: '2025-03-30T20:26:01.579Z',
        updatedAt: '2025-03-30T20:26:01.579Z',
        __v: 0,
        entity: ArtistModel.name,
      },
      _template: {
        _id: '67e9c094469208888edbabb6',
        id: '67e9a8d96466c0a1997e2837',
        entityType: 'Artist',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb860987a62e2003cb1c5c63f0',
        name: 'La-33',
        username: 'la33orquesta',
        subtitle: '',
        verified_status: 1,
        createdAt: '2025-03-30T20:26:01.579Z',
        updatedAt: '2025-03-30T20:26:01.579Z',
        __v: 0,
        entity: ArtistModel.name,
        fetchTimestamp: 1774153183788,
      },
      fetchTimestamp: 1774153183788,
      maxCacheTimeToLive: 180000,
      rawTemplate: {
        _id: '67e9c094469208888edbabb6',
        id: '67e9a8d96466c0a1997e2837',
        entityType: 'Artist',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb860987a62e2003cb1c5c63f0',
        name: 'La-33',
        username: 'la33orquesta',
        subtitle: '',
        verified_status: 1,
        createdAt: '2025-03-30T20:26:01.579Z',
        updatedAt: '2025-03-30T20:26:01.579Z',
        __v: 0,
        entity: ArtistModel.name,
      },
      _id: '67e9c094469208888edbabb6',
      id: '67e9a8d96466c0a1997e2837',
      entityType: 'Artist',
      profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb860987a62e2003cb1c5c63f0',
      name: 'La-33',
      username: 'la33orquesta',
      subtitle: '',
      verified_status: 1,
      createdAt: '2025-03-30T20:26:01.579Z',
      updatedAt: '2025-03-30T20:26:01.579Z',
      __v: 0,
      entity: ArtistModel.name,
    },
    {
      _data: {
        _template: {
          _id: '67e9c094469208888edbaa39',
          id: '67e9a8d16466c0a1997e26ba',
          entityType: 'Artist',
          profile_pic: 'https://i.scdn.co/image/ab6761610000e5ebce3f47fd96a4df0a1abb92d1',
          name: 'Puerto Candelaria',
          username: 'puertocandelaria',
          subtitle: '',
          verified_status: 1,
          createdAt: '2025-03-30T20:25:53.354Z',
          updatedAt: '2025-03-30T20:25:53.354Z',
          __v: 0,
          entity: ArtistModel.name,
          fetchTimestamp: 1774153197987,
        },
        fetchTimestamp: 1774153197987,
        maxCacheTimeToLive: 180000,
        rawTemplate: {
          _id: '67e9c094469208888edbaa39',
          id: '67e9a8d16466c0a1997e26ba',
          entityType: 'Artist',
          profile_pic: 'https://i.scdn.co/image/ab6761610000e5ebce3f47fd96a4df0a1abb92d1',
          name: 'Puerto Candelaria',
          username: 'puertocandelaria',
          subtitle: '',
          verified_status: 1,
          createdAt: '2025-03-30T20:25:53.354Z',
          updatedAt: '2025-03-30T20:25:53.354Z',
          __v: 0,
          entity: ArtistModel.name,
        },
        _id: '67e9c094469208888edbaa39',
        id: '67e9a8d16466c0a1997e26ba',
        entityType: 'Artist',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5ebce3f47fd96a4df0a1abb92d1',
        name: 'Puerto Candelaria',
        username: 'puertocandelaria',
        subtitle: '',
        verified_status: 1,
        createdAt: '2025-03-30T20:25:53.354Z',
        updatedAt: '2025-03-30T20:25:53.354Z',
        __v: 0,
        entity: ArtistModel.name,
      },
      _template: {
        _id: '67e9c094469208888edbaa39',
        id: '67e9a8d16466c0a1997e26ba',
        entityType: 'Artist',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5ebce3f47fd96a4df0a1abb92d1',
        name: 'Puerto Candelaria',
        username: 'puertocandelaria',
        subtitle: '',
        verified_status: 1,
        createdAt: '2025-03-30T20:25:53.354Z',
        updatedAt: '2025-03-30T20:25:53.354Z',
        __v: 0,
        entity: ArtistModel.name,
        fetchTimestamp: 1774153197987,
      },
      fetchTimestamp: 1774153197987,
      maxCacheTimeToLive: 180000,
      rawTemplate: {
        _id: '67e9c094469208888edbaa39',
        id: '67e9a8d16466c0a1997e26ba',
        entityType: 'Artist',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5ebce3f47fd96a4df0a1abb92d1',
        name: 'Puerto Candelaria',
        username: 'puertocandelaria',
        subtitle: '',
        verified_status: 1,
        createdAt: '2025-03-30T20:25:53.354Z',
        updatedAt: '2025-03-30T20:25:53.354Z',
        __v: 0,
        entity: ArtistModel.name,
      },
      _id: '67e9c094469208888edbaa39',
      id: '67e9a8d16466c0a1997e26ba',
      entityType: 'Artist',
      profile_pic: 'https://i.scdn.co/image/ab6761610000e5ebce3f47fd96a4df0a1abb92d1',
      name: 'Puerto Candelaria',
      username: 'puertocandelaria',
      subtitle: '',
      verified_status: 1,
      createdAt: '2025-03-30T20:25:53.354Z',
      updatedAt: '2025-03-30T20:25:53.354Z',
      __v: 0,
      entity: ArtistModel.name,
    },
    {
      _data: {
        _template: {
          _id: '67e9c094469208888edbaa7a',
          id: '67e9a8d36466c0a1997e26fb',
          entityType: 'Artist',
          profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb2321d63c2f2013d70803706a',
          name: 'Lucio Feuillet',
          username: 'luciofeuillet',
          subtitle: '',
          verified_status: 1,
          createdAt: '2025-03-30T20:25:55.592Z',
          updatedAt: '2025-03-30T20:25:55.592Z',
          __v: 0,
          entity: ArtistModel.name,
          fetchTimestamp: 1774153215374,
        },
        fetchTimestamp: 1774153215374,
        maxCacheTimeToLive: 180000,
        rawTemplate: {
          _id: '67e9c094469208888edbaa7a',
          id: '67e9a8d36466c0a1997e26fb',
          entityType: 'Artist',
          profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb2321d63c2f2013d70803706a',
          name: 'Lucio Feuillet',
          username: 'luciofeuillet',
          subtitle: '',
          verified_status: 1,
          createdAt: '2025-03-30T20:25:55.592Z',
          updatedAt: '2025-03-30T20:25:55.592Z',
          __v: 0,
          entity: ArtistModel.name,
        },
        _id: '67e9c094469208888edbaa7a',
        id: '67e9a8d36466c0a1997e26fb',
        entityType: 'Artist',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb2321d63c2f2013d70803706a',
        name: 'Lucio Feuillet',
        username: 'luciofeuillet',
        subtitle: '',
        verified_status: 1,
        createdAt: '2025-03-30T20:25:55.592Z',
        updatedAt: '2025-03-30T20:25:55.592Z',
        __v: 0,
        entity: ArtistModel.name,
      },
      _template: {
        _id: '67e9c094469208888edbaa7a',
        id: '67e9a8d36466c0a1997e26fb',
        entityType: 'Artist',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb2321d63c2f2013d70803706a',
        name: 'Lucio Feuillet',
        username: 'luciofeuillet',
        subtitle: '',
        verified_status: 1,
        createdAt: '2025-03-30T20:25:55.592Z',
        updatedAt: '2025-03-30T20:25:55.592Z',
        __v: 0,
        entity: ArtistModel.name,
        fetchTimestamp: 1774153215374,
      },
      fetchTimestamp: 1774153215374,
      maxCacheTimeToLive: 180000,
      rawTemplate: {
        _id: '67e9c094469208888edbaa7a',
        id: '67e9a8d36466c0a1997e26fb',
        entityType: 'Artist',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb2321d63c2f2013d70803706a',
        name: 'Lucio Feuillet',
        username: 'luciofeuillet',
        subtitle: '',
        verified_status: 1,
        createdAt: '2025-03-30T20:25:55.592Z',
        updatedAt: '2025-03-30T20:25:55.592Z',
        __v: 0,
        entity: ArtistModel.name,
      },
      _id: '67e9c094469208888edbaa7a',
      id: '67e9a8d36466c0a1997e26fb',
      entityType: 'Artist',
      profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb2321d63c2f2013d70803706a',
      name: 'Lucio Feuillet',
      username: 'luciofeuillet',
      subtitle: '',
      verified_status: 1,
      createdAt: '2025-03-30T20:25:55.592Z',
      updatedAt: '2025-03-30T20:25:55.592Z',
      __v: 0,
      entity: ArtistModel.name,
    },
    {
      _data: {
        _template: {
          _id: '69ab5f2df85329b8a78cc9b8',
          id: '6812a430e6f878c46fc9a757',
          entityType: 'Place',
          profile_pic: '/lasucursalvenue.jpg',
          name: 'La Sucursal Venue',
          username: 'lasucursalvenue',
          genres: {
            music: {
              l1: ['hip_hop', 'reggae', 'latin'],
              l2: ['latin_hiphop', 'regional_reggae', 'regional_mexican'],
            },
          },
          activity: 'active',
          search_cache:
            'la sucursal venue lasucursalvenue south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc  chapinero',
          location: [
            {
              country_name: 'Colombia',
              country_alpha2: 'co',
              state: 'Bogotá DC',
              city: '',
              address: 'Cl. 59 #13-40, Bogotá, Colombia',
              latitude: 4.6460846,
              longitude: -74.0644414,
              locationPrecision: 'POINT',
            },
          ],
          __v: 0,
          entity: PlaceModel.name,
          fetchTimestamp: 1774153228468,
        },
        fetchTimestamp: 1774153228468,
        maxCacheTimeToLive: 180000,
        rawTemplate: {
          _id: '69ab5f2df85329b8a78cc9b8',
          id: '6812a430e6f878c46fc9a757',
          entityType: 'Place',
          profile_pic: '/lasucursalvenue.jpg',
          name: 'La Sucursal Venue',
          username: 'lasucursalvenue',
          genres: {
            music: {
              l1: ['hip_hop', 'reggae', 'latin'],
              l2: ['latin_hiphop', 'regional_reggae', 'regional_mexican'],
            },
          },
          activity: 'active',
          search_cache:
            'la sucursal venue lasucursalvenue south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc  chapinero',
          location: [
            {
              country_name: 'Colombia',
              country_alpha2: 'co',
              state: 'Bogotá DC',
              city: '',
              address: 'Cl. 59 #13-40, Bogotá, Colombia',
              latitude: 4.6460846,
              longitude: -74.0644414,
              locationPrecision: 'POINT',
            },
          ],
          __v: 0,
          entity: PlaceModel.name,
        },
        _id: '69ab5f2df85329b8a78cc9b8',
        id: '6812a430e6f878c46fc9a757',
        entityType: 'Place',
        profile_pic:
          '/lasucursalvenue.jpg',
        name: 'La Sucursal Venue',
        username: 'lasucursalvenue',
        genres: {
          music: {
            l1: ['hip_hop', 'reggae', 'latin'],
            l2: ['latin_hiphop', 'regional_reggae', 'regional_mexican'],
          },
        },
        activity: 'active',
        search_cache:
          'la sucursal venue lasucursalvenue south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc  chapinero',
        location: [
          {
            country_name: 'Colombia',
            country_alpha2: 'co',
            state: 'Bogotá DC',
            city: '',
            address: 'Cl. 59 #13-40, Bogotá, Colombia',
            latitude: 4.6460846,
            longitude: -74.0644414,
            locationPrecision: 'POINT',
          },
        ],
        __v: 0,
        entity: PlaceModel.name,
        bookingRatesPolicy: [
          '80% de las entradas para el artista y 20% de las entradas más el consumo para el venue',
          'Entradas para el artista, consumo para el venue.',
        ],
        verified_status: 0,
      },
      _template: {
        _id: '69ab5f2df85329b8a78cc9b8',
        id: '6812a430e6f878c46fc9a757',
        entityType: 'Place',
        profile_pic: '/lasucursalvenue.jpg',
        name: 'La Sucursal Venue',
        username: 'lasucursalvenue',
        genres: {
          music: {
            l1: ['hip_hop', 'reggae', 'latin'],
            l2: ['latin_hiphop', 'regional_reggae', 'regional_mexican'],
          },
        },
        activity: 'active',
        search_cache:
          'la sucursal venue lasucursalvenue south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc  chapinero',
        location: [
          {
            country_name: 'Colombia',
            country_alpha2: 'co',
            state: 'Bogotá DC',
            city: '',
            address: 'Cl. 59 #13-40, Bogotá, Colombia',
            latitude: 4.6460846,
            longitude: -74.0644414,
            locationPrecision: 'POINT',
          },
        ],
        __v: 0,
        entity: PlaceModel.name,
        fetchTimestamp: 1774153228468,
      },
      fetchTimestamp: 1774153228468,
      maxCacheTimeToLive: 180000,
      rawTemplate: {
        _id: '69ab5f2df85329b8a78cc9b8',
        id: '6812a430e6f878c46fc9a757',
        entityType: 'Place',
        profile_pic: '/lasucursalvenue.jpg',
        name: 'La Sucursal Venue',
        username: 'lasucursalvenue',
        genres: {
          music: {
            l1: ['hip_hop', 'reggae', 'latin'],
            l2: ['latin_hiphop', 'regional_reggae', 'regional_mexican'],
          },
        },
        activity: 'active',
        search_cache:
          'la sucursal venue lasucursalvenue south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc  chapinero',
        location: [
          {
            country_name: 'Colombia',
            country_alpha2: 'co',
            state: 'Bogotá DC',
            city: '',
            address: 'Cl. 59 #13-40, Bogotá, Colombia',
            latitude: 4.6460846,
            longitude: -74.0644414,
            locationPrecision: 'POINT',
          },
        ],
        __v: 0,
        entity: PlaceModel.name,
      },
      _id: '69ab5f2df85329b8a78cc9b8',
      id: '6812a430e6f878c46fc9a757',
      entityType: 'Place',
      profile_pic:
        '/lasucursalvenue.jpg',
      name: 'La Sucursal Venue',
      username: 'lasucursalvenue',
      genres: {
        music: {
          l1: ['hip_hop', 'reggae', 'latin'],
          l2: ['latin_hiphop', 'regional_reggae', 'regional_mexican'],
        },
      },
      activity: 'active',
      search_cache:
        'la sucursal venue lasucursalvenue south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc  chapinero',
      location: [
        {
          country_name: 'Colombia',
          country_alpha2: 'co',
          state: 'Bogotá DC',
          city: '',
          address: 'Cl. 59 #13-40, Bogotá, Colombia',
          latitude: 4.6460846,
          longitude: -74.0644414,
          locationPrecision: 'POINT',
        },
      ],
      __v: 0,
      entity: PlaceModel.name,
      bookingRatesPolicy: [
        '80% de las entradas para el artista y 20% de las entradas más el consumo para el venue',
        'Entradas para el artista, consumo para el venue.',
      ],
      verified_status: 0,
    },
  ];
}
export default EventNegociationDetailsPage;
