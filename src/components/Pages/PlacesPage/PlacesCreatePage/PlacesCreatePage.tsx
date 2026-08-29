import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorPlaces, usePlacesSlice } from '~/common/slices/domain/places/places.redux';
import { useI18n } from '~/common/utils';
import { uploadFileToServer } from '~/common/utils/amplify/storage/storage.helpers';
import { getPlaceTypeOptions } from '~/common/utils/form-options';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { GenericCrudErrorCode, RootState } from '~/common/utils/redux-injectors/types';
import { BackButton } from '~/components/shared/app/atoms/navigation-buttons/back-buttons';
import {
  DynamicTabbedForm,
  DynamicTabbedFormRef,
} from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { URL_PARAMETER_NAMES } from '~/constants';
import { PlaceModel } from '~/models/domain/place/place.model';
import {
  PLACE_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_PLACE_DETAIL_PAGE,
} from '../PlaceDetailsPage/config-place-detail';

const PlacesCreatePage = () => {
  const { navigateToEntity } = useNavigation();
  const { translateGlobalDict } = useI18n();
  const urlParameters = useParams();
  const dispatch = useDispatch();
  const formRef = useRef<DynamicTabbedFormRef>(null);

  const [placeId, setCurrentPlaceId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
  const [availableLanguages, updateAvailableLanguages] = useState([]);
  const [availableGenres, updateAvailableGenres] = useState([]);
  const [requestHasBeenSended, setRequestHasBeenSended] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const { actions: placesActions } = usePlacesSlice();

  const placeTypeOptions = getPlaceTypeOptions({ translateFn: translateGlobalDict });

  const createdItem = useSelector(selectorPlaces.selectCreatedItem);
  const isSavingPlace = useSelector(selectorPlaces.selectLoading);
  const submitError = useSelector(selectorPlaces.selectError);

  const submitErrorMessage =
    hasAttemptedSubmit && !isSavingPlace && submitError
      ? translateGlobalDict(
          submitError.errorCode === GenericCrudErrorCode.VALIDATION_ERROR
            ? 'forms.errors.validation_error'
            : 'forms.errors.submit_error'
        )
      : undefined;

  const selectPlaceById = selectorPlaces.makeSelectItemById();
  const currentPlace: PlaceModel = useSelector((state: RootState) => {
    if (placeId) {
      return selectPlaceById(state, placeId);
    } else {
      return undefined;
    }
  });

  useEffect(() => {
    if (placeId) {
      dispatch(placesActions.getItemById({ id: placeId }));
    }
  }, [placeId]);

  useEffect(() => {
    if (placeId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentPlaceId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
  }, [urlParameters]);

  useEffect(() => {
    if (requestHasBeenSended && !currentPlace && createdItem) {
      navigateToEntity({ entityType: PlaceModel.name, id: createdItem.identifier });
    }
  }, [createdItem, requestHasBeenSended]);

  useEffect(() => {
    if (requestHasBeenSended && !isSavingPlace && currentPlace && !submitError) {
      navigateToEntity({ entityType: PlaceModel.name, id: currentPlace.identifier });
    }
  }, [isSavingPlace]);

  useEffect(() => {
    if (requestHasBeenSended && !isSavingPlace) {
      setRequestHasBeenSended(false);
    }
  }, [isSavingPlace]);

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
    onSubmit: async (data: any, error?: any) => {
      if (!requestHasBeenSended) {
        setHasAttemptedSubmit(true);
        if (!currentPlace) {
          const response = await uploadFileToServer({ file: data.profile_pic });

          dispatch(placesActions.createItem({ data }));
        } else {
          dispatch(
            placesActions.updateItem({
              id: currentPlace.identifier,
              newItem: {
                ...data,
              },
              // newItem: { spotify: 'InstagramActualizado' },
            })
          );
        }
      }
      setRequestHasBeenSended(true);
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
      <BackButton formRef={formRef} />
      <DynamicTabbedForm
        ref={formRef}
        tabsInfo={PLACE_DETAIL_SUB_PAGE_CONFIG}
        handlers={handlers}
        translationBasePath={TRANSLATION_BASE_PLACE_DETAIL_PAGE}
        entityType={PlaceModel.name}
        elementData={currentPlace}
        fieldOptions={{
          place_type: placeTypeOptions,
          genres: availableGenres,
          arts_languages: availableLanguages,
          spoken_languages: availableLanguages,
          stage_languages: availableLanguages,
        }}
        onlyModifiedFields={true}
        submitLabel={!currentPlace ? 'create' : 'save'}
        submitErrorMessage={submitErrorMessage}
      />
    </>
  );
};

export default PlacesCreatePage;
