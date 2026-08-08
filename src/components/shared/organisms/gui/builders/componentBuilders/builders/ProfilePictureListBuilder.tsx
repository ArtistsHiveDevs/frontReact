import { FollowerListView } from '~/components/shared/molecules/Profile/FollowerListView/FollowerListView';
import { ComponentBuilderParams, ComponentBuilderFunction } from '../types';
import { getData, getDataSource } from '../utils/dataExtraction';
import { ProfilePictureList } from '~/components/shared/atoms/gui/ProfilePictureList/ProfilePictureList';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';

/**
 * Builder para PROFILE_PICTURE_LIST
 *
 */
export const createProfilePictureListComponent: ComponentBuilderFunction = (
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

  const isSelectable = componentDescriptor?.data?.isSelectable || false;
  const display_direction = componentDescriptor?.data?.display_direction || false;

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
          profile_pic: 's3://public/casakilele.jpg',
          name: 'Casa Kilele',
          username: 'casakilele',
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
            'casa kilele casakilele south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc bogota dc teusaquillo armenia',
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
          profile_pic: 's3://public/casakilele.jpg',
          name: 'Casa Kilele',
          username: 'casakilele',
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
            'casa kilele casakilele south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc bogota dc teusaquillo armenia',
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
          'https://amplify-artistshive-paopa-s3c11d41b3bucket64b589cc-nkbh2yautuk1.s3.us-east-1.amazonaws.com/public/casakilele.jpg?x-amz-content-sha256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA6KRLGZPFCLJDW2EZ%2F20260318%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260318T000144Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDAaCXVzLWVhc3QtMSJIMEYCIQCu9usGhidrXmbM6nzt4wyI%2F8wt%2BuagggIvDlHfLXYwQwIhAKxOnATHdQw2BD4fhpuC7Rc0noh6T8x7f%2FMOCKeYOWyBKs8ECPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMOTg0NzExODc1NTMwIgyPapJHiE%2FGDRuDccEqowSyKoZfIKBwfzCI3s1mz4uWLEKFw8MLMoQbnVrm%2Fu9U37yYnU79fXUSYN9DPO0CHWkh4hE0tRgFn6iasRJ%2Bic87LCuXH50GdJCgX9AA1L3wp1KzYz9YY4AaEuihaCfdx3Qzm6Nus9QAsArEa7uyldC6FeRWCjOaMwimrAr5Vt7c0yLTzSyxg3vygIAXaKigFYczoEv0aOmhH2HI5i25J%2BAhtYZN1Yy0LiLlu68P5PVv%2FiatKKCaBg%2BQkb57UW1F9yw4reO3to15%2BdcjLARbQyfqSO3ml2EbBoOdpVyY8AcHwa4f0z4m6Vo5xOeHzOxcEWs99SRxbW6ym7RM4ApCMxsM8%2BeX%2B8grXFbcf%2BMw1OyoCbHl4h%2FyShuJoXfj3lXBVQp5o9%2B4FiGDXHOodKnfZm8z8URfbAaFuTa5aqDHsNrm7wgrRzABkbEKdmsFMjU4X7xs0MFBJZgP4RXX9c2cHji0AYphv5A29Mwht96D8dWs5YapA2rxiMzWIZpd%2BwucTPaVko2B%2FINJ371M8TQSxpouv7ulIFrZAchuqXJuAtxGPBiZnWlnbVDPcm55zxGqJDzyHvMwtQePPOjo%2B%2BpzWKVXLM%2B0nCzEUQWu1zTuCFQ0K8NIM83JOhIMecH%2FD%2FH7sEtn7llJnrCq%2FQ9%2FVMUp9w2gDnA7JQmhK0Z%2BJZJtygCDBXiMHkXvOMh678u7j0rqbmgrhDVnCkk4Xs7Bag7xJt9liwNBMMfV580GOoIC7kGx7yOSjBzOWKK2a9c3gXZRCtxXKYe05euN1pEg7VYYldkSoBF%2Fl4Ib%2FvC9K5e1iScRfA8O4vVwRhe9g%2BPIqK8WfarwlVWOBKE9CY77V%2B8JwN6WlunQJ%2FRBa%2FHL%2Fhrmyjv9peJlOjlLGYhfRbgWN%2Bxt6R6Oq1XBK2tA%2Fk%2BxHhG6ATWrtd1nxI%2BUJtAZ80dkvdSiWpVvrNB78bH%2BAiPpzcXLL%2FuETHuoWKWKS3XOutpB480b6l7arI9yPMY4SrVJ%2BUdTOQmK%2FYlNMllvA8wwzXPdCL6WxP4PHxJ3Vm2%2FPYcyM7xtdT%2B77ISrbImSawFlXjAK7H3mpK%2BLjRTWuLoitAnh&X-Amz-Signature=12b17e19e9d9e5e8a343a4e214715c5d3091369bd8f309c0a6bb0339e7599728',
        name: 'Casa Kilele',
        username: 'casakilele',
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
          'casa kilele casakilele south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc bogota dc teusaquillo armenia',
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
        profile_pic: 's3://public/casakilele.jpg',
        name: 'Casa Kilele',
        username: 'casakilele',
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
          'casa kilele casakilele south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc bogota dc teusaquillo armenia',
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
        profile_pic: 's3://public/casakilele.jpg',
        name: 'Casa Kilele',
        username: 'casakilele',
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
          'casa kilele casakilele south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc bogota dc teusaquillo armenia',
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
        'https://amplify-artistshive-paopa-s3c11d41b3bucket64b589cc-nkbh2yautuk1.s3.us-east-1.amazonaws.com/public/casakilele.jpg?x-amz-content-sha256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA6KRLGZPFCLJDW2EZ%2F20260318%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260318T000144Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDAaCXVzLWVhc3QtMSJIMEYCIQCu9usGhidrXmbM6nzt4wyI%2F8wt%2BuagggIvDlHfLXYwQwIhAKxOnATHdQw2BD4fhpuC7Rc0noh6T8x7f%2FMOCKeYOWyBKs8ECPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMOTg0NzExODc1NTMwIgyPapJHiE%2FGDRuDccEqowSyKoZfIKBwfzCI3s1mz4uWLEKFw8MLMoQbnVrm%2Fu9U37yYnU79fXUSYN9DPO0CHWkh4hE0tRgFn6iasRJ%2Bic87LCuXH50GdJCgX9AA1L3wp1KzYz9YY4AaEuihaCfdx3Qzm6Nus9QAsArEa7uyldC6FeRWCjOaMwimrAr5Vt7c0yLTzSyxg3vygIAXaKigFYczoEv0aOmhH2HI5i25J%2BAhtYZN1Yy0LiLlu68P5PVv%2FiatKKCaBg%2BQkb57UW1F9yw4reO3to15%2BdcjLARbQyfqSO3ml2EbBoOdpVyY8AcHwa4f0z4m6Vo5xOeHzOxcEWs99SRxbW6ym7RM4ApCMxsM8%2BeX%2B8grXFbcf%2BMw1OyoCbHl4h%2FyShuJoXfj3lXBVQp5o9%2B4FiGDXHOodKnfZm8z8URfbAaFuTa5aqDHsNrm7wgrRzABkbEKdmsFMjU4X7xs0MFBJZgP4RXX9c2cHji0AYphv5A29Mwht96D8dWs5YapA2rxiMzWIZpd%2BwucTPaVko2B%2FINJ371M8TQSxpouv7ulIFrZAchuqXJuAtxGPBiZnWlnbVDPcm55zxGqJDzyHvMwtQePPOjo%2B%2BpzWKVXLM%2B0nCzEUQWu1zTuCFQ0K8NIM83JOhIMecH%2FD%2FH7sEtn7llJnrCq%2FQ9%2FVMUp9w2gDnA7JQmhK0Z%2BJZJtygCDBXiMHkXvOMh678u7j0rqbmgrhDVnCkk4Xs7Bag7xJt9liwNBMMfV580GOoIC7kGx7yOSjBzOWKK2a9c3gXZRCtxXKYe05euN1pEg7VYYldkSoBF%2Fl4Ib%2FvC9K5e1iScRfA8O4vVwRhe9g%2BPIqK8WfarwlVWOBKE9CY77V%2B8JwN6WlunQJ%2FRBa%2FHL%2Fhrmyjv9peJlOjlLGYhfRbgWN%2Bxt6R6Oq1XBK2tA%2Fk%2BxHhG6ATWrtd1nxI%2BUJtAZ80dkvdSiWpVvrNB78bH%2BAiPpzcXLL%2FuETHuoWKWKS3XOutpB480b6l7arI9yPMY4SrVJ%2BUdTOQmK%2FYlNMllvA8wwzXPdCL6WxP4PHxJ3Vm2%2FPYcyM7xtdT%2B77ISrbImSawFlXjAK7H3mpK%2BLjRTWuLoitAnh&X-Amz-Signature=12b17e19e9d9e5e8a343a4e214715c5d3091369bd8f309c0a6bb0339e7599728',
      name: 'Casa Kilele',
      username: 'casakilele',
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
        'casa kilele casakilele south america america del sur  amerique du sud sudamerika  colombia colombia colombia colombie kolumbien bogota dc bogota dc teusaquillo armenia',
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

  return (
    <>
      <ProfilePictureList
        isEditable={false}
        mainRecipient={undefined}
        entities={[ArtistModel.name, PlaceModel.name]}
        elements={
          content || []
          // availableParticipants
          // ...participantsData,
          // ...participantsData,
          // ...participantsData,
          // ...participantsData,
          // ...participantsData,
        }
        //  styles?: { avatarSize?: number; topRightIcon?: string };
        handlers={handlers}
        showTopRightIcon={true}
        isSelectable={isSelectable}
        displayDirection={display_direction}
      />
    </>
  );
};
