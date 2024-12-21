import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectorArtists, useArtistsSlice } from '~/common/slices/domain/artists/artist.redux';
import { selectorPlaces, usePlacesSlice } from '~/common/slices/domain/places/places.redux';
import { useSearchSlice } from '~/common/slices/search';
import { selectSearch, selectSearchLoading } from '~/common/slices/search/selectors';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { resolveNavigateToEntityPath } from '~/common/utils/hooks/navigation/navigateToEntityResolver';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import MainSection from '~/components/Pages/HomePage/MainSection/MainSection';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from '~/components/shared/organisms/ProfileTabsPage/profile-details.def';
import { SUB_PATHS } from '~/constants';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { EventModel } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import { SearchModel } from '~/models/domain/search/search.model';
import './CreateIndustryEntityPage.scss';

const CreateIndustryEntityPage = () => {
  const loggedUser = useSelector(selectCurrentUser);

  const [count, setCount] = useState(0);
  const [showReset, setShowReset] = useState(false);
  const [isIndustryMemberActivated, setIndustryMemberActivated] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(undefined);
  const [queryText, setQueryText] = useState('');
  const [availableArtists, updateAvailableArtists] = useState([]);
  const [availablePlaces, updateAvailablePlaces] = useState([]);
  const availableArtistsComplete: ArtistModel[] = useSelector(selectorArtists.selectItems);
  const availablePlacesComplete: PlaceModel[] = useSelector(selectorPlaces.selectItems);

  const { actions: artistsActions } = useArtistsSlice();
  const { actions: placesActions } = usePlacesSlice();
  const { actions: usersActions } = useUsersSlice();
  const dispatch = useDispatch();
  const { translateGlobalDict } = useI18n();
  const { navigateToInnerPath } = useNavigation();

  const queriedSearchList: SearchModel = useSelector(selectSearch);
  const querySearchLoading: boolean = useSelector(selectSearchLoading);
  const { actions: searchActions } = useSearchSlice();

  const roles = [
    // 'academies',
    'artists',
    // 'events',
    'places',
    // 'promoters'
  ];

  const EVENT_DETAIL_SUB_PAGE_CONFIG: ProfileDetailsSubpage[] = roles.map((role) => {
    return {
      name: role,
      title: translateGlobalDict(`entities.${role}.plural`),
      sections: [
        {
          name: 'main_artists',
          title: '"',
          components: [
            {
              componentName: ProfileComponentTypes.PROFILE_THUMBNAIL_CARD,
              data: {
                data_source: 'main_artists',
              },
              clickHandlerName: 'onNavigateToEntity',
              formMetaData: { fieldName: 'main_artists' },
            },
          ],
        },
      ],
    };
  });

  // [
  //   {
  //     name: 'artists',
  //     sections: [
  //       {
  //         name: 'main_artists',
  //         components: [
  //           {
  //             componentName: ProfileComponentTypes.PROFILE_THUMBNAIL_CARD,
  //             data: {
  //               data_source: 'main_artists',
  //             },
  //             clickHandlerName: 'onNavigateToEntity',
  //             formMetaData: { fieldName: 'main_artists' },
  //           },
  //         ],
  //       },
  //       {
  //         name: 'other_artists',
  //         components: [
  //           {
  //             componentName: ProfileComponentTypes.PROFILE_THUMBNAIL_CARD,
  //             data: {
  //               data_source: 'other_artists',
  //             },
  //             clickHandlerName: 'onNavigateToEntity',
  //             formMetaData: { fieldName: 'other_artists' },
  //           },
  //         ],
  //         hidden: (event: any) => {
  //           console.log(event, event?.other_artists.length === 0);
  //           return event?.other_artists.length === 0;
  //         },
  //       },
  //     ],
  //   },
  // ];

  const handlers = {
    onSubmit: (data: any, error?: any) => {
      console.log('#####----------->>>>  !!! ', data);
    },
    place_onChange: async (data: any) => {
      const searchedText = data?.target?.value?.trim().toLowerCase() || '';

      const filteredPlaces = availablePlacesComplete.filter((place) => place.name.toLowerCase().includes(searchedText));

      console.log(searchedText, searchedText.length, filteredPlaces);
      updateAvailablePlaces(filteredPlaces);
    },
    main_artists_onChange: async (data: any) => {
      const searchedText = data?.target?.value?.trim().toLowerCase() || '';

      const filteredArtists = availableArtistsComplete.filter((artist) =>
        artist.name.toLowerCase().includes(searchedText)
      );

      updateAvailableArtists(filteredArtists);
    },
  };

  useEffect(() => {
    if (availableArtistsComplete.length === 0) {
      dispatch(artistsActions.loadItems({}));
    }
    if (availablePlacesComplete.length === 0) {
      dispatch(placesActions.loadItems({}));
    }

    setCount(0);
  }, []);

  useEffect(() => {
    if (!!loggedUser && isIndustryMemberActivated) {
      navigateToInnerPath({
        path: `${resolveNavigateToEntityPath(selectedEntity)}/${SUB_PATHS.CREATE}`,
        options: { replace: true },
      });
    }
  }, [loggedUser, isIndustryMemberActivated]);

  const clickOnEntityHandler = (entityNamePlural: string) => {
    if (!!loggedUser) {
      let entityName = undefined;
      let path = undefined;
      if (entityNamePlural === 'artists') {
        entityName = 'Artist';
        path = ArtistModel.name;
      } else if (entityNamePlural === 'places') {
        entityName = 'Place';
        path = PlaceModel.name;
      } else if (entityNamePlural === 'events') {
        entityName = 'Event';
        path = EventModel.name;
      }
      // console.log(entityName);
      dispatch(
        usersActions.updateUser({ id: loggedUser.identifier, newItem: { roles: [{ entityName, entityRoleMap: [] }] } })
      );
      setIndustryMemberActivated(true);
      setSelectedEntity(path);
    }
  };

  const clickOnButton = () => {
    dispatch(searchActions.querySearch(queryText));
  };

  const asociar = (params: { entityType: string; id: string }) => {
    const { entityType, id } = params;
    let entityName = undefined;
    let plural = '';
    if (entityType === ArtistModel.name) {
      entityName = 'Artist';
      plural = 'artists';
    } else if (entityType === PlaceModel.name) {
      entityName = 'Place';
      plural = 'places';
    } else if (entityType === EventModel.name) {
      entityName = 'Event';
      plural = 'events';
    }

    const instance = queriedSearchList[plural]?.find((e: any) => e.identifier == id);
    const attributesToExtract = ['id', 'shortId', 'profile_pic', 'name', 'username', 'subtitle', 'verified_status'];

    if (instance) {
      const extractedObject = attributesToExtract.reduce((acc: any, key) => {
        if (key in instance) {
          acc[key] = instance[key];
        }
        return acc;
      }, {});

      let entityConfig = loggedUser.roles.find((entityRole) => entityRole.entityName === entityName) || {
        entityName,
        entityRoleMap: [],
      };

      // Verifica si `extractedObject` ya está en `entityRoleMap` usando `identifier`
      const isAlreadyInMap = entityConfig.entityRoleMap.some((item) => item.id === extractedObject.id);

      // Si no está en el array `entityRoleMap`, lo añade
      if (!isAlreadyInMap) {
        entityConfig.entityRoleMap.push({ ...extractedObject, roles: ['OWNER'] });
      }

      // Si `entityConfig` no estaba ya en `loggedUser.roles`, lo añadimos
      if (!loggedUser.roles.find((role) => role.entityName === entityName)) {
        loggedUser.roles.push(entityConfig);
      }

      dispatch(
        usersActions.updateUser({
          id: loggedUser.identifier,
          newItem: {
            roles: [...loggedUser.roles],
          },
        })
      );
      setQueryText('');
    }
  };

  const resetOwnerships = (entityType: string) => {
    dispatch(
      usersActions.updateUser({
        id: loggedUser.identifier,
        newItem: {
          roles: [...loggedUser.roles.filter((entity) => entity.entityName !== entityType)],
        },
      })
    );
    setQueryText('');
  };
  return (
    <>
      <div>
        <h2
          onClick={() => {
            setCount(count + 1);
            if (count >= 7) {
              setShowReset(true);
            }
          }}
        >
          Miembro de la industria
        </h2>
        <div style={{ margin: '2rem' }}></div>
        <p>
          Gracias por tu interés en registrarte como miembro de la industria ya sea como artista, agente, dueño de un
          venue, sala de ensayo u otra entidad.
        </p>
        <p>
          Nuestro equipo estará analizando tu perfil y se contactará contigo para poder asociar los perfiles a tu
          cuenta.
        </p>
      </div>
      {showReset && (
        <div className="content">
          <h2 style={{ textAlign: 'center' }}>Find agent</h2>
          <div>
            {/* <DynamicTabbedForm
          tabsInfo={EVENT_DETAIL_SUB_PAGE_CONFIG}
          handlers={handlers}
          translationBasePath={'app.global_dictionary.entities'}
          // entityType={AppUserModel.name}
          fieldOptions={{}}
          externalData={{
            main_artists: { options: availableArtists },
            place: { options: availablePlaces },
          }}
        /> */}
            <input onChange={(e) => setQueryText(e.target.value)} />{' '}
            <Button onClick={() => clickOnButton()}>Buscar</Button>
          </div>
          {queriedSearchList?.artists?.length && (
            <MainSection
              description={'Estos son los artistas relacionados'}
              listView={queriedSearchList?.artists}
              params={{ useNewCard: true }}
              title={
                'Artistas'
                // translateText(`${TRANSLATION_BASE_HOME_PAGE}.artists`)
              }
              callbacks={{
                onClickCard: (data: ArtistModel) => asociar({ entityType: ArtistModel.name, id: data.identifier }),
              }}
            />
          )}
          {queriedSearchList?.places?.length && (
            <MainSection
              description={'Estos son los lugares relacionados'}
              listView={queriedSearchList?.places}
              params={{ useNewCard: true }}
              title={
                'Lugares'
                // translateText(`${TRANSLATION_BASE_HOME_PAGE}.artists`)
              }
              callbacks={{
                onClickCard: (data: PlaceModel) => asociar({ entityType: PlaceModel.name, id: data.identifier }),
              }}
            />
          )}
          <h2 style={{ textAlign: 'center' }}>Create agent</h2>
          <div>
            {/* <DynamicTabbedForm
          tabsInfo={EVENT_DETAIL_SUB_PAGE_CONFIG}
          handlers={handlers}
          translationBasePath={'app.global_dictionary.entities'}
          // entityType={AppUserModel.name}
          fieldOptions={{}}
          externalData={{
            main_artists: { options: availableArtists },
            place: { options: availablePlaces },
          }}
        /> */}
            {roles.map((role: string, index: number) => {
              return (
                <div key={`${role}_${index}`} className="entity" onClick={() => clickOnEntityHandler(role)}>
                  {' '}
                  <DynamicIcons iconName="FaPlusCircle" color={'white'} />
                  {translateGlobalDict(`entities.${role}.plural`)}
                </div>
              );
            })}
          </div>
          <div style={{ margin: '5rem' }}></div>

          <Button onClick={() => resetOwnerships('Artist')}>Reiniciar Artists</Button>
          <Button onClick={() => resetOwnerships('Place')}>Reiniciar Places</Button>
        </div>
      )}
    </>
  );
};

export default CreateIndustryEntityPage;
