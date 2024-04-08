import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useArtistsSlice } from '~/common/slices';
import { selectArtists } from '~/common/slices/artists/selectors';
import { usePlacesSlice } from '~/common/slices/places';
import { selectPlaces } from '~/common/slices/places/selectors';
import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { DynamicTabbedForm } from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { AppUserModel } from '~/models/app/user/user.model';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { PlaceModel } from '~/models/domain/place/place.model';
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

  const availableArtistsComplete: ArtistModel[] = useSelector(selectArtists);
  const availablePlacesComplete: PlaceModel[] = useSelector(selectPlaces);

  const [selectedArtists, updateSelectedArtists] = useState([]);
  const [selectedPlaces, updateSelectedPlaces] = useState([]);

  const { actions: artistsActions } = useArtistsSlice();
  const { actions: placesActions } = usePlacesSlice();

  const dispatch = useDispatch();

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

    if (availableArtistsComplete.length === 0) {
      dispatch(artistsActions.loadArtists());
    }
    if (availablePlacesComplete.length === 0) {
      dispatch(placesActions.loadPlaces());
    }
  }, []);

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

  return (
    <>
      <DynamicTabbedForm
        tabsInfo={EVENT_DETAIL_SUB_PAGE_CONFIG}
        handlers={handlers}
        translationBasePath={TRANSLATION_BASE_EVENT_DETAILS_PAGE}
        entityType={AppUserModel.name}
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
          main_artists: { options: availableArtists },
          place: { options: availablePlaces },
        }}
      />
    </>
  );
};

export default EventCreatePage;
