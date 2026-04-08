import { FollowerListView } from '~/components/shared/molecules/Profile/FollowerListView/FollowerListView';
import { ComponentBuilderParams, ComponentBuilderFunction } from '../types';
import { getData, getDataSource } from '../utils/dataExtraction';
import { ProfilePictureList } from '~/components/shared/atoms/gui/ProfilePictureList/ProfilePictureList';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { TabbedPanel } from '~/components/shared/layout/TabbedPanel';
import { TechRiderParticipantsPanel } from './TechRiderParticipantsPanel';

/**
 * Builder para PROFILE_PICTURE_LIST
 *
 */
export const createGenericTechRiderRequirementsComponent: ComponentBuilderFunction = (
  params: ComponentBuilderParams
): JSX.Element => {
  const { componentDescriptor, entityData, parentDataSource, handlers } = params;

  const dataSourceElement = getDataSource(componentDescriptor, entityData, parentDataSource);

  // Extraer contenido de múltiples fuentes posibles (prioridad descendente)
  const content =
    getData(componentDescriptor.data?.attribute_content, dataSourceElement) ||
    componentDescriptor.data?.content ||
    (componentDescriptor.data?.render && componentDescriptor.data?.render(parentDataSource || dataSourceElement)) ||
    parentDataSource ||
    dataSourceElement;

  const isEditable = true; //componentDescriptor.data?.isEditable?();

  const technical_field = componentDescriptor.data?.technical_field || '<Technical Rider>';

  // Construir handlers con onClickBackButtonFollowers
  const followersListView = {
    ...handlers,
    onClickBackButtonFollowers: () => {
      const lastVisibleTab = handlers?.['lastVisibleTab'];
      const setShowSpecificTab = handlers?.['setShowSpecificTab'];

      console.log(lastVisibleTab);
      if (setShowSpecificTab) {
        setShowSpecificTab(lastVisibleTab);
      }
    },
  };

  // Obtener tipo específico de follower si existe
  const showSpecificFollowerType = handlers?.['showSpecificFollowerType'] as unknown as string | undefined;
  const participantsData: any[] = [
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
          entity: 'ArtistModel',
          fetchTimestamp: 1773791946142,
        },
        fetchTimestamp: 1773791946142,
        maxCacheTimeToLive: 180000,
        rawTemplate: {
          id: '67e9a8d16466c0a1997e26ca',
          profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb44d316836b4c5d95b9e99fd4',
          name: 'El Caribefunk',
          username: 'caribefunk',
          subtitle: '',
          verified_status: 1,
          roles: ['OWNER'],
          entity: 'ArtistModel',
        },
        id: '67e9a8d16466c0a1997e26ca',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb44d316836b4c5d95b9e99fd4',
        name: 'El Caribefunk',
        username: 'caribefunk',
        subtitle: '',
        verified_status: 1,
        roles: ['OWNER'],
        entity: 'ArtistModel',
      },
      _template: {
        id: '67e9a8d16466c0a1997e26ca',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb44d316836b4c5d95b9e99fd4',
        name: 'El Caribefunk',
        username: 'caribefunk',
        subtitle: '',
        verified_status: 1,
        roles: ['OWNER'],
        entity: 'ArtistModel',
        fetchTimestamp: 1773791946142,
      },
      fetchTimestamp: 1773791946142,
      maxCacheTimeToLive: 180000,
      rawTemplate: {
        id: '67e9a8d16466c0a1997e26ca',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb44d316836b4c5d95b9e99fd4',
        name: 'El Caribefunk',
        username: 'caribefunk',
        subtitle: '',
        verified_status: 1,
        roles: ['OWNER'],
        entity: 'ArtistModel',
      },
      id: '67e9a8d16466c0a1997e26ca',
      profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb44d316836b4c5d95b9e99fd4',
      name: 'El Caribefunk',
      username: 'caribefunk',
      subtitle: '',
      verified_status: 1,
      roles: ['OWNER'],
      entity: 'ArtistModel',
    },
    {
      _data: {
        _template: {
          _id: '69ab5f2af85329b8a78cc3a1',
          id: '6812a42ce6f878c46fc9a178',
          entityType: 'Place',
          profile_pic: '/lasucursalvenue.jpg',
          name: 'La Sucursal Venue',
          username: 'lasucursalvenue',
          genres: {
            music: {
              l1: [
                'dance_club',
                'jazz',
                'latin',
                'cumbia',
                'folk',
                'reggae',
                'hip_hop',
                'electronic',
                'salsa',
                'urban_music',
                'world',
              ],
              l2: [
                'latin_dance',
                'latin_jazz',
                'tango_bolero',
                'andean_indigenous',
                'folk_traditional',
                'cumbia_traditional',
                'world_folk',
                'latin_pop_rock',
                'regional_reggae',
                'latin_hiphop',
                'house',
                'classic_salsa',
                'traditional_jazz',
                'regional_mexican',
                'dancehall',
                'trap_drill',
                'reggaeton_classic',
                'european_traditional',
                'singer_songwriter',
                'caribbean_latin',
                'african',
              ],
            },
          },
          activity: 'active',
          search_cache:
            'La Sucursal Venue lasucursalvenue south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc bogota dc teusaquillo armenia',
          location: [
            {
              country_name: 'Colombia',
              country_alpha2: 'co',
              state: 'Bogotá DC',
              city: 'Bogotá DC',
              address: 'Cl. 28a #16a-31, Teusaquillo, Bogotá, Colombia',
              latitude: 4.6178333,
              longitude: -74.0741353,
              locationPrecision: 'POINT',
            },
          ],
          __v: 0,
          entity: 'PlaceModel',
          fetchTimestamp: 1773792104434,
        },
        fetchTimestamp: 1773792104434,
        maxCacheTimeToLive: 180000,
        rawTemplate: {
          _id: '69ab5f2af85329b8a78cc3a1',
          id: '6812a42ce6f878c46fc9a178',
          entityType: 'Place',
          profile_pic: '/lasucursalvenue.jpg',
          name: 'La Sucursal Venue',
          username: 'lasucursalvenue',
          genres: {
            music: {
              l1: [
                'dance_club',
                'jazz',
                'latin',
                'cumbia',
                'folk',
                'reggae',
                'hip_hop',
                'electronic',
                'salsa',
                'urban_music',
                'world',
              ],
              l2: [
                'latin_dance',
                'latin_jazz',
                'tango_bolero',
                'andean_indigenous',
                'folk_traditional',
                'cumbia_traditional',
                'world_folk',
                'latin_pop_rock',
                'regional_reggae',
                'latin_hiphop',
                'house',
                'classic_salsa',
                'traditional_jazz',
                'regional_mexican',
                'dancehall',
                'trap_drill',
                'reggaeton_classic',
                'european_traditional',
                'singer_songwriter',
                'caribbean_latin',
                'african',
              ],
            },
          },
          activity: 'active',
          search_cache:
            'La Sucursal Venue lasucursalvenue south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc bogota dc teusaquillo armenia',
          location: [
            {
              country_name: 'Colombia',
              country_alpha2: 'co',
              state: 'Bogotá DC',
              city: 'Bogotá DC',
              address: 'Cl. 28a #16a-31, Teusaquillo, Bogotá, Colombia',
              latitude: 4.6178333,
              longitude: -74.0741353,
              locationPrecision: 'POINT',
            },
          ],
          __v: 0,
          entity: 'PlaceModel',
        },
        _id: '69ab5f2af85329b8a78cc3a1',
        id: '6812a42ce6f878c46fc9a178',
        entityType: 'Place',
        profile_pic:
          '/lasucursalvenue.jpg',
        name: 'La Sucursal Venue',
        username: 'lasucursalvenue',
        genres: {
          music: {
            l1: [
              'dance_club',
              'jazz',
              'latin',
              'cumbia',
              'folk',
              'reggae',
              'hip_hop',
              'electronic',
              'salsa',
              'urban_music',
              'world',
            ],
            l2: [
              'latin_dance',
              'latin_jazz',
              'tango_bolero',
              'andean_indigenous',
              'folk_traditional',
              'cumbia_traditional',
              'world_folk',
              'latin_pop_rock',
              'regional_reggae',
              'latin_hiphop',
              'house',
              'classic_salsa',
              'traditional_jazz',
              'regional_mexican',
              'dancehall',
              'trap_drill',
              'reggaeton_classic',
              'european_traditional',
              'singer_songwriter',
              'caribbean_latin',
              'african',
            ],
          },
        },
        activity: 'active',
        search_cache:
          'La Sucursal Venue lasucursalvenue south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc bogota dc teusaquillo armenia',
        location: [
          {
            country_name: 'Colombia',
            country_alpha2: 'co',
            state: 'Bogotá DC',
            city: 'Bogotá DC',
            address: 'Cl. 28a #16a-31, Teusaquillo, Bogotá, Colombia',
            latitude: 4.6178333,
            longitude: -74.0741353,
            locationPrecision: 'POINT',
          },
        ],
        __v: 0,
        entity: 'PlaceModel',
        followed_profiles: [],
        followed_by: [],
        events: [],
        bookingRatesPolicy: [
          'Entradas para el artista, consumo para el venue.',
          'Alquiler del lugar entero por un valor fijo',
        ],
        verified_status: 0,
      },
      _template: {
        _id: '69ab5f2af85329b8a78cc3a1',
        id: '6812a42ce6f878c46fc9a178',
        entityType: 'Place',
        profile_pic: '/lasucursalvenue.jpg',
        name: 'La Sucursal Venue',
        username: 'lasucursalvenue',
        genres: {
          music: {
            l1: [
              'dance_club',
              'jazz',
              'latin',
              'cumbia',
              'folk',
              'reggae',
              'hip_hop',
              'electronic',
              'salsa',
              'urban_music',
              'world',
            ],
            l2: [
              'latin_dance',
              'latin_jazz',
              'tango_bolero',
              'andean_indigenous',
              'folk_traditional',
              'cumbia_traditional',
              'world_folk',
              'latin_pop_rock',
              'regional_reggae',
              'latin_hiphop',
              'house',
              'classic_salsa',
              'traditional_jazz',
              'regional_mexican',
              'dancehall',
              'trap_drill',
              'reggaeton_classic',
              'european_traditional',
              'singer_songwriter',
              'caribbean_latin',
              'african',
            ],
          },
        },
        activity: 'active',
        search_cache:
          'La Sucursal Venue lasucursalvenue south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc bogota dc teusaquillo armenia',
        location: [
          {
            country_name: 'Colombia',
            country_alpha2: 'co',
            state: 'Bogotá DC',
            city: 'Bogotá DC',
            address: 'Cl. 28a #16a-31, Teusaquillo, Bogotá, Colombia',
            latitude: 4.6178333,
            longitude: -74.0741353,
            locationPrecision: 'POINT',
          },
        ],
        __v: 0,
        entity: 'PlaceModel',
        fetchTimestamp: 1773792104434,
      },
      fetchTimestamp: 1773792104434,
      maxCacheTimeToLive: 180000,
      rawTemplate: {
        _id: '69ab5f2af85329b8a78cc3a1',
        id: '6812a42ce6f878c46fc9a178',
        entityType: 'Place',
        profile_pic: '/lasucursalvenue.jpg',
        name: 'La Sucursal Venue',
        username: 'lasucursalvenue',
        genres: {
          music: {
            l1: [
              'dance_club',
              'jazz',
              'latin',
              'cumbia',
              'folk',
              'reggae',
              'hip_hop',
              'electronic',
              'salsa',
              'urban_music',
              'world',
            ],
            l2: [
              'latin_dance',
              'latin_jazz',
              'tango_bolero',
              'andean_indigenous',
              'folk_traditional',
              'cumbia_traditional',
              'world_folk',
              'latin_pop_rock',
              'regional_reggae',
              'latin_hiphop',
              'house',
              'classic_salsa',
              'traditional_jazz',
              'regional_mexican',
              'dancehall',
              'trap_drill',
              'reggaeton_classic',
              'european_traditional',
              'singer_songwriter',
              'caribbean_latin',
              'african',
            ],
          },
        },
        activity: 'active',
        search_cache:
          'La Sucursal Venue lasucursalvenue south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc bogota dc teusaquillo armenia',
        location: [
          {
            country_name: 'Colombia',
            country_alpha2: 'co',
            state: 'Bogotá DC',
            city: 'Bogotá DC',
            address: 'Cl. 28a #16a-31, Teusaquillo, Bogotá, Colombia',
            latitude: 4.6178333,
            longitude: -74.0741353,
            locationPrecision: 'POINT',
          },
        ],
        __v: 0,
        entity: 'PlaceModel',
      },
      _id: '69ab5f2af85329b8a78cc3a1',
      id: '6812a42ce6f878c46fc9a178',
      entityType: 'Place',
      profile_pic:
        '/lasucursalvenue.jpg',
      name: 'La Sucursal Venue',
      username: 'lasucursalvenue',
      genres: {
        music: {
          l1: [
            'dance_club',
            'jazz',
            'latin',
            'cumbia',
            'folk',
            'reggae',
            'hip_hop',
            'electronic',
            'salsa',
            'urban_music',
            'world',
          ],
          l2: [
            'latin_dance',
            'latin_jazz',
            'tango_bolero',
            'andean_indigenous',
            'folk_traditional',
            'cumbia_traditional',
            'world_folk',
            'latin_pop_rock',
            'regional_reggae',
            'latin_hiphop',
            'house',
            'classic_salsa',
            'traditional_jazz',
            'regional_mexican',
            'dancehall',
            'trap_drill',
            'reggaeton_classic',
            'european_traditional',
            'singer_songwriter',
            'caribbean_latin',
            'african',
          ],
        },
      },
      activity: 'active',
      search_cache:
        'La Sucursal Venue lasucursalvenue south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc bogota dc teusaquillo armenia',
      location: [
        {
          country_name: 'Colombia',
          country_alpha2: 'co',
          state: 'Bogotá DC',
          city: 'Bogotá DC',
          address: 'Cl. 28a #16a-31, Teusaquillo, Bogotá, Colombia',
          latitude: 4.6178333,
          longitude: -74.0741353,
          locationPrecision: 'POINT',
        },
      ],
      __v: 0,
      entity: 'PlaceModel',
      followed_profiles: [],
      followed_by: [],
      events: [],
      bookingRatesPolicy: [
        'Entradas para el artista, consumo para el venue.',
        'Alquiler del lugar entero por un valor fijo',
      ],
      verified_status: 0,
    },
    {
      _data: {
        _template: {
          _id: '67e9c094469208888edbaa5c',
          id: '67e9a8d26466c0a1997e26dd',
          entityType: 'Artist',
          profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb69f387c2bf99803860f36e17',
          name: 'Briela Ojeda',
          username: 'brielaojeda',
          subtitle: '',
          verified_status: 1,
          location: [],
          createdAt: '2025-03-30T20:25:54.609Z',
          updatedAt: '2025-03-30T20:25:54.609Z',
          __v: 0,
          entity: 'ArtistModel',
          fetchTimestamp: 1773792117634,
        },
        fetchTimestamp: 1773792117634,
        maxCacheTimeToLive: 180000,
        rawTemplate: {
          _id: '67e9c094469208888edbaa5c',
          id: '67e9a8d26466c0a1997e26dd',
          entityType: 'Artist',
          profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb69f387c2bf99803860f36e17',
          name: 'Briela Ojeda',
          username: 'brielaojeda',
          subtitle: '',
          verified_status: 1,
          location: [],
          createdAt: '2025-03-30T20:25:54.609Z',
          updatedAt: '2025-03-30T20:25:54.609Z',
          __v: 0,
          entity: 'ArtistModel',
        },
        _id: '67e9c094469208888edbaa5c',
        id: '67e9a8d26466c0a1997e26dd',
        entityType: 'Artist',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb69f387c2bf99803860f36e17',
        name: 'Briela Ojeda',
        username: 'brielaojeda',
        subtitle: '',
        verified_status: 1,
        location: [],
        createdAt: '2025-03-30T20:25:54.609Z',
        updatedAt: '2025-03-30T20:25:54.609Z',
        __v: 0,
        entity: 'ArtistModel',
        followed_profiles: [],
        followed_by: [],
        events: [],
        since: null,
      },
      _template: {
        _id: '67e9c094469208888edbaa5c',
        id: '67e9a8d26466c0a1997e26dd',
        entityType: 'Artist',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb69f387c2bf99803860f36e17',
        name: 'Briela Ojeda',
        username: 'brielaojeda',
        subtitle: '',
        verified_status: 1,
        location: [],
        createdAt: '2025-03-30T20:25:54.609Z',
        updatedAt: '2025-03-30T20:25:54.609Z',
        __v: 0,
        entity: 'ArtistModel',
        fetchTimestamp: 1773792117634,
      },
      fetchTimestamp: 1773792117634,
      maxCacheTimeToLive: 180000,
      rawTemplate: {
        _id: '67e9c094469208888edbaa5c',
        id: '67e9a8d26466c0a1997e26dd',
        entityType: 'Artist',
        profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb69f387c2bf99803860f36e17',
        name: 'Briela Ojeda',
        username: 'brielaojeda',
        subtitle: '',
        verified_status: 1,
        location: [],
        createdAt: '2025-03-30T20:25:54.609Z',
        updatedAt: '2025-03-30T20:25:54.609Z',
        __v: 0,
        entity: 'ArtistModel',
      },
      _id: '67e9c094469208888edbaa5c',
      id: '67e9a8d26466c0a1997e26dd',
      entityType: 'Artist',
      profile_pic: 'https://i.scdn.co/image/ab6761610000e5eb69f387c2bf99803860f36e17',
      name: 'Briela Ojeda',
      username: 'brielaojeda',
      subtitle: '',
      verified_status: 1,
      location: [],
      createdAt: '2025-03-30T20:25:54.609Z',
      updatedAt: '2025-03-30T20:25:54.609Z',
      __v: 0,
      entity: 'ArtistModel',
      followed_profiles: [],
      followed_by: [],
      events: [],
      since: null,
    },
  ].map((template) => new CurrentProfileInfoModel(template));

  const participantTexts = participantsData.map(
    (participant: CurrentProfileInfoModel) => `Requerimientos técnicos de ${technical_field} para ${participant.name}`
  );

  return (
    <TechRiderParticipantsPanel
      participants={participantsData}
      texts={participantTexts}
      isEditable={isEditable}
      onChange={(index, value) => {
        // TODO: conectar con el modelo/handler real
        console.log('Tech rider text changed', index, value);
      }}
    />
  );
};
