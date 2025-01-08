import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useEventsSlice } from '~/common/slices/domain/events/events.redux';
import { useSearchSlice } from '~/common/slices/search';
import { selectEntitySearch, selectEntitySearchLoading } from '~/common/slices/search/selectors';
import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { DynamicTabbedForm } from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { EventModel } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import { SearchModel } from '~/models/domain/search/search.model';
import {
  EVENT_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_EVENT_DETAILS_PAGE,
} from '../EventDetailsPage/config-event-detail';

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const EventCreatePage = () => {
  const [availableLanguages, updateAvailableLanguages] = useState([]);
  const [availableGenres, updateAvailableGenres] = useState([]);
  const [availableGenders, updateAvailableGenders] = useState([]);
  const [availableAllergies, updateAvailableAllergies] = useState([]);
  const [availableBloodGroups, updateAvailableBloodGroups] = useState([]);
  const [availableDietaryRestritions, updateAvailableDietaryRestrictions] = useState([]);
  const [availableArtists, updateAvailableArtists] = useState([]);
  const [availablePlaces, updateAvailablePlaces] = useState([]);
  const [defaultArtists, setDefaultArtists] = useState([]);
  const [defaultPlaces, setDefaultPlaces] = useState([]);

  const [queriedEntity, setQueriedEntity] = useState(null);
  const queriedSearchList: SearchModel = useSelector(selectEntitySearch);
  const querySearchLoading: boolean = useSelector(selectEntitySearchLoading);
  const { actions: searchActions } = useSearchSlice();

  const { actions: eventsActions } = useEventsSlice();

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const langsOR = [
      { label: 'ES', value: 'es', selected: false },
      { label: 'DE', value: 'de' },
      { label: 'FR', value: 'fr' },
      { label: 'PT', value: 'pt' },
    ];
    let langs = [...langsOR];

    Array(20)
      .fill('x')
      .forEach((valu, number) =>
        langsOR.forEach((lng) =>
          langs.push({
            label: `${lng.label}${number}`,
            value: `${lng.value}${number}`,
            selected: Math.random() > 1 - 10 / 100,
          })
        )
      );

    updateAvailableLanguages(langs);
    updateAvailableGenres([
      { label: 'Cumbia', value: 'genre1' },
      { label: 'Reggaetón', value: 'genre2' },
      { label: 'Rock', value: 'genre3', selected: true },
      { label: 'Jazz', value: 'genr4' },
    ]);

    //
    const groupList = ['A', 'B', 'AB', 'O'];
    const fullGroup = groupList.map((group) => {
      return [`${group}+`, `${group}-`];
    });
    const defaultBloodGroup = 'O+';
    updateAvailableBloodGroups(
      fullGroup.flat().map((group) => {
        let bloodGroup: SelectOption = { label: group, value: group };
        if (group === defaultBloodGroup) {
          bloodGroup = { ...bloodGroup, selected: true };
        }
        return bloodGroup;
      })
    );

    updateAvailableAllergies([
      { label: 'Polen', value: 'Polen' },
      { label: 'Polvo', value: 'Polvo' },
      { label: 'Leche', value: 'Leche' },
      { label: 'Maní', value: 'Maní' },
      { label: 'Gluten', value: 'Gluten' },
      { label: 'Ibuprofeno', value: 'Ibuprofeno' },
      { label: 'Perros', value: 'Perros' },
      { label: 'Gatos', value: 'Gatos' },
    ]);

    updateAvailableGenders([
      { label: 'Man', value: 'male' },
      { label: 'Woman', value: 'female' },
      { label: 'Non binary', value: 'non_binary' },
      { label: 'Non specified', value: 'non_specified' },
    ]);

    updateAvailableDietaryRestrictions([
      { label: 'None', value: 'none' },
      { label: 'Vegetarian', value: 'vegetarian' },
      { label: 'Vegan', value: 'vegan' },
      { label: 'Celiac', value: 'celiac' },
    ]);

    const data = location.state;

    if (data?.originProfile) {
      const profile: CurrentProfileInfoModel = data?.originProfile as CurrentProfileInfoModel;
      if (profile.entity === ArtistModel.name) {
        setDefaultArtists([profile]);
      } else if (profile.entity === PlaceModel.name) {
        setDefaultPlaces([profile]);
      }
    }
  }, []);

  const handlers = {
    onSubmit: (data: any, error?: any) => {
      data.artists = [...(data.main_artists || [])];
      data.timetable__initial_date = dayjs(data.timetable__initial_date).format('YYYY-MM-DD');
      data.timetable__openning_doors = Number(dayjs(data.timetable__openning_doors).format('HHmm')); //Number(data.timetable__openning_doors?.replace(':', '') || '0');
      data.timetable__main_artist_time = Number(dayjs(data.initial_time).format('HHmm')); //Number(data.initial_time?.replace(':', '') || '0');
      data.price = Number(data.price);

      console.log('#####----------->>>>  !!! ', data);
      dispatch(eventsActions.createItem({ data }));
    },
    place_onChange: async (data: any) => {
      const searchedText = data?.target?.value?.trim().toLowerCase() || '';

      dispatch(searchActions.entityQuerySearch({ term: searchedText, entity: 'Place' }));
      setQueriedEntity('Place');
    },
    main_artists_onChange: async (data: any) => {
      const searchedText = data?.target?.value?.trim().toLowerCase() || '';

      dispatch(searchActions.entityQuerySearch({ term: searchedText, entity: 'Artist' }));
      setQueriedEntity('Artist');
    },
  };

  useEffect(() => {
    updateAvailableArtists(queriedSearchList?.artists || []);
    updateAvailablePlaces(queriedSearchList?.places || []);
    setQueriedEntity(null);
  }, [queriedSearchList]);

  return (
    <>
      <DynamicTabbedForm
        tabsInfo={EVENT_DETAIL_SUB_PAGE_CONFIG}
        handlers={handlers}
        translationBasePath={TRANSLATION_BASE_EVENT_DETAILS_PAGE}
        entityType={EventModel.name}
        fieldOptions={{
          allergies: availableAllergies,
          blood_group: availableBloodGroups,
          dietary_restrictions: availableDietaryRestritions,
          gender: availableGenders,
          genres: availableGenres,
          user_language: availableLanguages,
          spoken_languages: availableLanguages,
          stage_languages: availableLanguages,
        }}
        externalData={{
          main_artists: {
            options: availableArtists,
            isLoading: queriedEntity === 'Artist' && querySearchLoading,
            defaultSelection: defaultArtists,
          },
          place: {
            options: availablePlaces,
            isLoading: queriedEntity === 'Place' && querySearchLoading,
            defaultSelection: defaultPlaces,
          },
        }}
        customHeaderConfig={[
          {
            name: 'name',
            label: 'Nombre',
            config: { required: false, minLength: 3 },
            showEditableField: false,
            // renderField: 'nameKnownAs',
          },
          { name: 'subtitle', label: 'Subtitle' },
          // {
          //   name: 'username',
          //   label: 'username',
          //   config: { required: true, minLength: 3 },
          // },
        ]}
      />
    </>
  );
};

export default EventCreatePage;
