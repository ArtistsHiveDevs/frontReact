import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { usePlacesSlice } from '~/common/slices/places';
import { selectPlaces } from '~/common/slices/places/selectors';
import { DynamicTabbedForm } from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { URL_PARAMETER_NAMES } from '~/constants';
import { PlaceModel } from '~/models/domain/place/place.model';
import {
  PLACE_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_PLACE_DETAIL_PAGE,
} from '../PlaceDetailsPage/config-place-detail';

const PlacesCreatePage = () => {
  const urlParameters = useParams();

  const [placeId, setCurrentPlaceId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);

  const placesList: PlaceModel[] = useSelector(selectPlaces);
  const { actions: placesActions } = usePlacesSlice();
  const [currentPlace, setCurrentPlace] = useState<PlaceModel>(undefined);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!!placeId) {
      if (placesList.length === 0) {
        dispatch(placesActions.loadPlaces());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!placesList.length) {
      setCurrentPlace(getPlaceInfo(placeId));
    }
  }, [placesList]);

  const getPlaceInfo = (id: string) => {
    return placesList.find((place) => place.id === id);
  };

  const [availableLanguages, updateAvailableLanguages] = useState([]);
  const [availableGenres, updateAvailableGenres] = useState([]);

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
            selected: Math.random() > 1 - 90 / 100,
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
  }, []);

  const handlers = {
    onSubmit: (data: any, error?: any) => {
      console.log('#####----------->>>>  !!! ', data);
    },
    onChangecountry: (data: any) => {
      console.log('#####----------->>>>  !!! ', data);
      // const ciudades =
      //   !!data &&
      //   !!data.value &&
      //   Object.keys(provincias).indexOf(data?.value) >= 0
      //     ? provincias[data.value as keyof typeof provincias]
      //     : [];
      // const provinceField = fields.find(
      //   (fieldData) => fieldData.fieldName === "province"
      // );
      // provinceField.options = ciudades;
      // // provinceField.defaultValue =
      // //   (ciudades && ciudades.length && ciudades[1].value) || "";

      // updateFields(fields);
      // updateCiudades(ciudades);
    },
  };

  return (
    <>
      <DynamicTabbedForm
        tabsInfo={PLACE_DETAIL_SUB_PAGE_CONFIG}
        handlers={handlers}
        translationBasePath={TRANSLATION_BASE_PLACE_DETAIL_PAGE}
        entityType={PlaceModel.name}
        elementData={currentPlace}
        fieldOptions={{
          genres: availableGenres,
          arts_languages: availableLanguages,
          spoken_languages: availableLanguages,
          stage_languages: availableLanguages,
        }}
      />
    </>
  );
};

export default PlacesCreatePage;
