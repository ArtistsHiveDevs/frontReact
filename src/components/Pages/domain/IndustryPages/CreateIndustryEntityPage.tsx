import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchSlice } from '~/common/slices/search';
import { selectSearch, selectSearchLoading } from '~/common/slices/search/selectors';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { resolveNavigateToEntityPath } from '~/common/utils/hooks/navigation/navigateToEntityResolver';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import MainSection from '~/components/Pages/HomePage/MainSection/MainSection';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { SUB_PATHS } from '~/constants';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { EventModel } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import { SearchModel } from '~/models/domain/search/search.model';
import './CreateIndustryEntityPage.scss';

const TRANSLATION_BASE_INDUSTRY_PAGE = 'app.pages.domain.IndustryPages.CreateIndustryEntityPage';

const CreateIndustryEntityPage = () => {
  const loggedUser = useSelector(selectCurrentUser);

  const [isIndustryMemberActivated, setIndustryMemberActivated] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(undefined);
  const [queryText, setQueryText] = useState('');
  const [resetTargetEntityType, setResetTargetEntityType] = useState<string | undefined>(undefined);

  const { actions: usersActions } = useUsersSlice();
  const dispatch = useDispatch();
  const { translateText, translateGlobalDict } = useI18n();
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
    setResetTargetEntityType(undefined);
  };

  return (
    <>
      <div>
        <h2>{translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.title`)}</h2>
        <div style={{ margin: '2rem' }}></div>
        <p>{translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.intro`)}</p>
        <p>{translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.intro_secondary`)}</p>
      </div>
      <div className="content">
        <h2 style={{ textAlign: 'center' }}>
          {translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.search_section.title`)}
        </h2>
        <div>
          <input
            placeholder={translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.search_section.input_placeholder`)}
            onChange={(e) => setQueryText(e.target.value)}
          />{' '}
          <Button onClick={() => clickOnButton()} disabled={querySearchLoading}>
            {translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.search_section.search_button`)}
          </Button>
        </div>
        {queriedSearchList?.artists?.length && (
          <MainSection
            description={translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.search_section.artists_found`)}
            listView={queriedSearchList?.artists}
            params={{ useNewCard: true }}
            title={translateGlobalDict('entities.artists.plural')}
            callbacks={{
              onClickCard: (data: ArtistModel) => asociar({ entityType: ArtistModel.name, id: data.identifier }),
            }}
          />
        )}
        {queriedSearchList?.places?.length && (
          <MainSection
            description={translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.search_section.places_found`)}
            listView={queriedSearchList?.places}
            params={{ useNewCard: true }}
            title={translateGlobalDict('entities.places.plural')}
            callbacks={{
              onClickCard: (data: PlaceModel) => asociar({ entityType: PlaceModel.name, id: data.identifier }),
            }}
          />
        )}
        <h2 style={{ textAlign: 'center' }}>
          {translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.create_section.title`)}
        </h2>
        <div>
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

        <Button onClick={() => setResetTargetEntityType('Artist')}>
          {translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.reset_section.remove_artists_button`)}
        </Button>
        <Button onClick={() => setResetTargetEntityType('Place')}>
          {translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.reset_section.remove_places_button`)}
        </Button>

        <AppDialog
          isOpenDialog={!!resetTargetEntityType}
          onClose={() => setResetTargetEntityType(undefined)}
          title={translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.reset_section.confirm_title`)}
          content={translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.reset_section.confirm_content`)}
          actions={[
            {
              label: translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.reset_section.confirm_action`),
              handler: () => resetTargetEntityType && resetOwnerships(resetTargetEntityType),
            },
            {
              label: translateText(`${TRANSLATION_BASE_INDUSTRY_PAGE}.reset_section.cancel_action`),
              handler: () => setResetTargetEntityType(undefined),
            },
          ]}
        />
      </div>
    </>
  );
};

export default CreateIndustryEntityPage;
