import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectApiKey } from '~/common/slices/app-base/APIKey/selectors';
import { selectorArtists, useArtistsSlice } from '~/common/slices/domain/artists/artist.redux';
import { selectorPlaces, usePlacesSlice } from '~/common/slices/domain/places/places.redux';
import { useSearchSlice } from '~/common/slices/search';
import { selectEntitySearch, selectEntitySearchLoading, selectSearch } from '~/common/slices/search/selectors';
import { useUsersSlice } from '~/common/slices/users';
import { getUserByIdentifier } from '~/common/slices/users/saga';
import {
  selectClaimFeedback,
  selectCurrentUser,
  selectLoading as selectUsersLoading,
} from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { resolveNavigateToEntityPath } from '~/common/utils/hooks/navigation/navigateToEntityResolver';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { useDebouncedSearchTerm } from '~/common/utils/hooks/search/useDebouncedSearchTerm';
import MainSection from '~/components/Pages/HomePage/MainSection/MainSection';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import {
  ProfilePictureWithName,
  ProfilePictureWithNameConstants,
} from '~/components/shared/atoms/gui/ProfilePictureList/ProfilePictureWithName';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { SUB_PATHS } from '~/constants';
import { AppUserModel } from '~/models/app/user/user.model';
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
  const [queryUsername, setQueryUsername] = useState('');
  const [otherUser, setOtherUser] = useState<AppUserModel | undefined>(undefined);
  const [pendingAssociation, setPendingAssociation] = useState<{ entityType: string; id: string } | undefined>(
    undefined
  );
  const [queryText, setQueryText] = useState('');
  const [availableArtists, updateAvailableArtists] = useState([]);
  const [availablePlaces, updateAvailablePlaces] = useState([]);
  const availableArtistsComplete: ArtistModel[] = useSelector(selectorArtists.selectItems);
  const availablePlacesComplete: PlaceModel[] = useSelector(selectorPlaces.selectItems);

  const [claimSearchText, setClaimSearchText] = useState('');
  const [hasSentClaimRequest, setHasSentClaimRequest] = useState(false);
  const [claimedArtist, setClaimedArtist] = useState<ArtistModel>(undefined);
  const [showClaimConfirmation, setShowClaimConfirmation] = useState(false);
  const artistClaimSearchResults: SearchModel = useSelector(selectEntitySearch);
  const artistClaimSearchLoading: boolean = useSelector(selectEntitySearchLoading);
  const usersLoading: boolean = useSelector(selectUsersLoading);
  const claimFeedback = useSelector(selectClaimFeedback);

  const { actions: artistsActions } = useArtistsSlice();
  const { actions: placesActions } = usePlacesSlice();
  const { actions: usersActions } = useUsersSlice();
  const dispatch = useDispatch();
  const { translateGlobalDict } = useI18n();
  const { navigateToInnerPath } = useNavigation();

  const queriedSearchList: SearchModel = useSelector(selectSearch);
  const { actions: searchActions } = useSearchSlice();

  const apiKey = useSelector(selectApiKey)?.apiKey;

  const roles = [
    // 'academies',
    'artists',
    // 'events',
    'places',
    // 'promoters'
  ];

  // [
  //   {
  //     name: 'artists',
  //     sections: [
  //       {
  //         name: 'main_artists',
  //         components: [
  //           {
  //             componentName: ComponentTypes.PROFILE_THUMBNAIL_CARD,
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
  //             componentName: ComponentTypes.PROFILE_THUMBNAIL_CARD,
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
    if (!!loggedUser && !loggedUser.request_industry_member) {
      dispatch(
        usersActions.updateUser({
          id: loggedUser.identifier,
          newItem: { request_industry_member: new Date().getTime() },
        })
      );
    }
  }, [loggedUser, isIndustryMemberActivated]);

  useDebouncedSearchTerm(claimSearchText, (term) => {
    dispatch(searchActions.entityQuerySearch({ term, entity: 'Artist' }));
  });

  useDebouncedSearchTerm(queryText, (term) => {
    dispatch(searchActions.querySearch(term));
  });

  useDebouncedSearchTerm(queryUsername, async (term) => {
    if (!apiKey) {
      return;
    }
    const fetchedUser = await getUserByIdentifier(term, apiKey);
    setOtherUser(fetchedUser ? new AppUserModel(fetchedUser) : undefined);
  });

  useEffect(() => {
    if (!queryUsername) {
      setOtherUser(undefined);
    }
  }, [queryUsername]);

  useEffect(() => {
    if (!usersLoading && hasSentClaimRequest) {
      setHasSentClaimRequest(false);
      setShowClaimConfirmation(true);
    }
  }, [usersLoading]);

  const isArtistAlreadyOwned = (artist: ArtistModel) => {
    const candidateIds = [artist.id, artist.identifier, artist.username].filter(Boolean);
    return candidateIds.some((candidateId) => loggedUser?.checkPermissions(candidateId)?.canEdit);
  };

  const claimArtistProfile = (artist: ArtistModel) => {
    if (isArtistAlreadyOwned(artist)) {
      return;
    }
    dispatch(usersActions.claimProfileUser({ profile: artist }));
    setClaimedArtist(artist);
    setHasSentClaimRequest(true);
    setClaimSearchText('');
  };

  const clickOnEntityHandler = (entityNamePlural: string) => {
    if (!!loggedUser) {
      let path = undefined;
      if (entityNamePlural === 'artists') {
        path = ArtistModel.name;
      } else if (entityNamePlural === 'places') {
        path = PlaceModel.name;
      } else if (entityNamePlural === 'events') {
        path = EventModel.name;
      }
      // El backend crea la entrada de roles al crear la entidad; persistirla acá pisaba los roles previos.
      setIndustryMemberActivated(true);
      setSelectedEntity(path);
    }
  };

  const asociar = (params: { entityType: string; id: string }) => {
    // Si hay un queryUsername activo, el destino es otherUser en vez del usuario logueado:
    // pedimos confirmación explícita antes de tocar los roles de otra cuenta.
    if (queryUsername.trim() && !otherUser) {
      return;
    }
    if (queryUsername.trim() && otherUser && otherUser.identifier !== loggedUser.identifier) {
      setPendingAssociation(params);
      return;
    }
    performAssociation(params);
  };

  const cancelPendingAssociation = () => {
    setPendingAssociation(undefined);
    setOtherUser(undefined);
    setQueryUsername('');
  };

  const resolveAssociationTarget = (params: { entityType: string; id: string }) => {
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
    return { entityName, plural, instance };
  };

  const pendingAssociationInstance = pendingAssociation
    ? resolveAssociationTarget(pendingAssociation).instance
    : undefined;

  const performAssociation = (params: { entityType: string; id: string }) => {
    const { entityName, instance } = resolveAssociationTarget(params);
    const attributesToExtract = ['id', 'sID', 'profile_pic', 'name', 'username', 'subtitle', 'verified_status'];

    const targetUser = queryUsername.trim() ? otherUser : loggedUser;

    if (instance) {
      const extractedObject = attributesToExtract.reduce((acc: any, key) => {
        if (key in instance) {
          acc[key] = instance[key];
        }
        return acc;
      }, {});

      let entityConfig = targetUser.roles.find((entityRole) => entityRole.entityName === entityName) || {
        entityName,
        entityRoleMap: [],
      };

      // Verifica si `extractedObject` ya está en `entityRoleMap` usando `identifier`
      // Dos ids `undefined` nunca deben considerarse "el mismo" registro.
      const isAlreadyInMap = entityConfig.entityRoleMap.some(
        (item) => !!extractedObject.id && item.id === extractedObject.id
      );

      // Si no está en el array `entityRoleMap`, lo añade
      if (!isAlreadyInMap) {
        entityConfig.entityRoleMap.push({ ...extractedObject, roles: ['OWNER'] });
      }

      // Si `entityConfig` no estaba ya en `targetUser.roles`, lo añadimos
      if (!targetUser.roles.find((role) => role.entityName === entityName)) {
        targetUser.roles.push(entityConfig);
      }

      dispatch(
        usersActions.updateUser({
          id: targetUser.identifier,
          newItem: {
            roles: [...targetUser.roles],
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
          // El backend mergea `roles` por defecto; acá sí queremos borrar el grupo.
          rolesReplace: true,
        } as any,
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
        <div style={{ marginTop: '2rem' }}>
          <h3>Reclamar tu perfil</h3>
          <p>
            Busca tu proyecto artístico y reclama tu perfil para que puedas completarlo y aplicar a las convocatorias
            disponibles.
          </p>
          <input
            type="text"
            className="artist-claim-search-input"
            placeholder="Buscar tu perfil de artista..."
            value={claimSearchText}
            onChange={(e) => setClaimSearchText(e.target.value)}
          />
          {!!artistClaimSearchResults?.artists?.length && (
            <div className="artist-claim-search-results">
              {artistClaimSearchResults.artists.map((artist: ArtistModel) => {
                const alreadyOwned = isArtistAlreadyOwned(artist);
                return (
                  <div
                    key={artist.identifier || artist.id}
                    className={`artist-claim-result${alreadyOwned ? ' artist-claim-result--owned' : ''}`}
                  >
                    <ProfilePictureWithName
                      element={artist}
                      direction={ProfilePictureWithNameConstants.DISPLAY_HORIZONTAL}
                      showSubtitle
                      actionable={!alreadyOwned}
                      onProfileClick={alreadyOwned ? undefined : () => claimArtistProfile(artist)}
                    />
                    {alreadyOwned && (
                      <p className="artist-claim-result__owned-message">
                        Ya tienes a "{artist.name}" asociado a tu cuenta.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {!!claimSearchText && !artistClaimSearchLoading && !artistClaimSearchResults?.artists?.length && (
            <p className="artist-claim-search-empty">No encontramos artistas que coincidan con tu búsqueda.</p>
          )}
        </div>

        <AppDialog
          isOpenDialog={showClaimConfirmation}
          onClose={() => setShowClaimConfirmation(false)}
          title={claimFeedback?.alreadyRequested ? 'Solicitud ya existente' : 'Solicitud enviada'}
          content={
            <>
              {!!claimedArtist && (
                <div className="claimed-artist-preview">
                  <ProfilePictureWithName
                    element={claimedArtist}
                    direction={ProfilePictureWithNameConstants.DISPLAY_VERTICAL}
                    styles={{ avatarSize: 6 }}
                  />
                </div>
              )}
              <p>
                {claimFeedback?.alreadyRequested
                  ? claimFeedback?.message ||
                    `Ya habías solicitado el perfil de "${claimedArtist?.name}" anteriormente.`
                  : `Recibimos tu solicitud. Pronto nos contactaremos contigo para validar y asociar el perfil de "${claimedArtist?.name}" a tu cuenta.`}
              </p>
            </>
          }
          actions={[{ label: 'OK', handler: () => setShowClaimConfirmation(false) }]}
        />

        <AppDialog
          isOpenDialog={!!pendingAssociation}
          onClose={cancelPendingAssociation}
          title="Confirmar asociación"
          content={
            <p>
              Vas a asociar el perfil <br />
              <br />
              <strong>{pendingAssociationInstance?.name || pendingAssociationInstance?.username}</strong>
              <br />
              <br /> a la cuenta de <br />
              <br />
              <strong>{otherUser?.nameKnownAs || otherUser?.username}</strong> (usuario:{' '}
              <strong>{otherUser?.username}</strong>
              {otherUser?.email ? (
                <>
                  , email: <strong>{otherUser.email}</strong>
                </>
              ) : null}
              )<br />
              <br />
              <br />
              ¿Deseas continuar?
            </p>
          }
          actions={[
            { label: 'Cancelar', handler: cancelPendingAssociation },
            {
              label: 'Confirmar',
              handler: () => {
                performAssociation(pendingAssociation);
                setPendingAssociation(undefined);
              },
            },
          ]}
        />
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
            <div>
              Username:
              <br />
              <input value={queryUsername} onChange={(e) => setQueryUsername(e.target.value)} />{' '}
              {queryUsername.trim() && (
                <span style={{ marginLeft: '0.5rem' }}>
                  {otherUser ? `Asociando a: ${otherUser.username || otherUser.identifier}` : 'Buscando usuario...'}
                </span>
              )}
            </div>
            <div>
              Search:
              <br />
              <input onChange={(e) => setQueryText(e.target.value)} />{' '}
            </div>
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
