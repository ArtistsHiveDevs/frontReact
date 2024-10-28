import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectorArtists, useArtistsSlice } from '~/common/slices/domain/artists/artist.redux';
import { selectorPlaces, usePlacesSlice } from '~/common/slices/domain/places/places.redux';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { resolveNavigateToEntityPath } from '~/common/utils/hooks/navigation/navigateToEntityResolver';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from '~/components/shared/organisms/ProfileTabsPage/profile-details.def';
import { SUB_PATHS } from '~/constants';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { EventModel } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import './CreateIndustryEntityPage.scss';

const CreateIndustryEntityPage = () => {
  const loggedUser = useSelector(selectCurrentUser);

  const [isIndustryMemberActivated, setIndustryMemberActivated] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(undefined);
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
  }, []);

  useEffect(() => {
    if (!!loggedUser && isIndustryMemberActivated) {
      console.log(`./${selectedEntity}/${SUB_PATHS.CREATE}`);
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
      console.log(entityName);
      dispatch(
        usersActions.updateUser({ id: loggedUser.identifier, newItem: { roles: [{ entityName, entityRoleMap: [] }] } })
      );
      setIndustryMemberActivated(true);
      setSelectedEntity(path);
    }
  };

  return (
    <div>
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
        {roles.map((role) => {
          return (
            <div className="entity" onClick={() => clickOnEntityHandler(role)}>
              {' '}
              <DynamicIcons iconName="FaPlusCircle" color={'white'} />
              {translateGlobalDict(`entities.${role}.plural`)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreateIndustryEntityPage;
