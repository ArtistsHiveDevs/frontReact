import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorPlaces, usePlacesSlice } from '~/common/slices/domain/places/places.redux';
import { selectorCountries } from '~/common/slices/parametrics/geo/country.redux';
import { selectorLanguages, useLanguagesSlice } from '~/common/slices/parametrics/geo/language.redux';
import { selectorLocationEntities } from '~/common/slices/parametrics/geo/location-entity.redux';
import { useI18n } from '~/common/utils';
import { uploadFileToServer } from '~/common/utils/amplify/storage/storage.helpers';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { DEFAULT_COUNTRY_STRUCTURE, getCountryStructure } from '~/common/utils/location-structure.utils';
import { GenericCrudErrorCode, RepoErrorPayload, RootState } from '~/common/utils/redux-injectors/types';
import { USERNAME_FORMAT_PATTERN, debouncedUsernameValidation } from '~/common/utils/validation/username-validation';
import { BackButton } from '~/components/shared/app/atoms/navigation-buttons/back-buttons';
import {
  DynamicTabbedForm,
  DynamicTabbedFormRef,
} from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { URL_PARAMETER_NAMES } from '~/constants';
import { PlaceModel } from '~/models/domain/place/place.model';
import { CountryModel } from '~/models/parametrics/geo/country.model';
import { LanguageModel } from '~/models/parametrics/geo/language.model';
import { LocationEntityModel } from '~/models/parametrics/geo/location-entity.model';
import {
  PLACE_DETAIL_SUB_PAGE_CONFIG,
  PLACE_TYPE_OPTIONS,
  TRANSLATION_BASE_PLACE_DETAIL_PAGE,
} from '../PlaceDetailsPage/config-place-detail';

// Prefijo de campos que genera CitySelector para el atributo 'cityWithCountry' del config
// (ver formMetaData.inputType: 'citySelector' en config-place-detail.tsx): '<prefijo>_country' y '<prefijo>_level{N}'.
const CITY_COUNTRY_FIELD_PREFIX = 'cityWithCountry';

const PlacesCreatePage = () => {
  const { navigateToEntity } = useNavigation();
  const urlParameters = useParams();
  const dispatch = useDispatch();
  const formRef = useRef<DynamicTabbedFormRef>(null);

  const { translateGlobalDict } = useI18n();

  const [placeId, setCurrentPlaceId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
  const [availableGenres, updateAvailableGenres] = useState([]);
  const [requestHasBeenSended, setRequestHasBeenSended] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const { actions: placesActions } = usePlacesSlice();
  const { actions: languageActions } = useLanguagesSlice();

  const availableLanguages: LanguageModel[] = useSelector(selectorLanguages.selectItems);
  const availableCountries: CountryModel[] = useSelector(selectorCountries.selectItems);
  const allLocationEntities: LocationEntityModel[] = useSelector(selectorLocationEntities.selectItems);

  const selectPlaceById = selectorPlaces.makeSelectItemById();
  const currentPlace: PlaceModel = useSelector((state: RootState) => {
    if (placeId) {
      return selectPlaceById(state, placeId);
    } else {
      return undefined;
    }
  });

  const loading = useSelector(selectorPlaces.selectLoading);
  const submitError = useSelector(selectorPlaces.selectError);
  const createdItem: PlaceModel = useSelector(selectorPlaces.selectCreatedItem);

  // Tras un create exitoso (no aplica a edición, `currentPlace` ya existe en ese caso) se navega
  // al detalle del Place recién creado; `requestHasBeenSended` evita disparar esto con un
  // `createdItem` residual de una creación anterior en la misma sesión.
  useEffect(() => {
    if (requestHasBeenSended && !currentPlace && createdItem) {
      navigateToEntity({ entityType: PlaceModel.name, id: createdItem.identifier });
    }
  }, [createdItem, requestHasBeenSended]);

  // Rehabilita el submit al terminar, sino un create fallido queda bloqueado sin poder reintentar.
  useEffect(() => {
    if (requestHasBeenSended && !loading) {
      setRequestHasBeenSended(false);
    }
  }, [loading]);

  // El CRUD genérico distingue duplicado de clave única (409) y validación de campos (400) del resto
  // de errores (500); acá se traduce cada `errorCode` a un mensaje accionable para el usuario.
  const buildSubmitErrorMessage = (error: RepoErrorPayload) => {
    if (error.errorCode === GenericCrudErrorCode.VALIDATION_DUPLICATE_KEY) {
      return translateGlobalDict('forms.submit_error_duplicate_key');
    }
    if (error.errorCode === GenericCrudErrorCode.VALIDATION_ERROR) {
      return translateGlobalDict('forms.submit_error_validation');
    }
    return translateGlobalDict('forms.submit_error');
  };

  const submitErrorMessage =
    hasAttemptedSubmit && !loading && submitError ? buildSubmitErrorMessage(submitError) : undefined;

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
    if (!availableLanguages || availableLanguages.length === 0) {
      dispatch(languageActions.loadItems({}));
    }
    updateAvailableGenres([
      { label: 'Cumbia', value: 'genre1' },
      { label: 'Reggaetón', value: 'genre2' },
      { label: 'Rock', value: 'genre3', selected: true },
      { label: 'Jazz', value: 'genr4' },
    ]);
  }, []);

  // El backend espera genres como Map { [categoria]: string[] }; el picker hoy solo ofrece géneros musicales,
  // así que se agrupan todos bajo 'music' (pendiente definir categorías si se agregan géneros no musicales).
  const buildGenresPayload = (selectedGenres: string[]) => {
    return selectedGenres && selectedGenres.length > 0 ? { music: selectedGenres } : undefined;
  };

  // CitySelector no produce 'city'/'country' directamente: guarda el id del país en
  // '<prefijo>_country' y el id de la entidad geográfica seleccionada en '<prefijo>_level{N}' por
  // cada nivel de la jerarquía del país. Place.schema.js espera country: ObjectId (ref Country) y
  // city: String plano, así que acá se resuelve el nivel cuyo `name` es 'city' (según la estructura
  // del país, con el mismo fallback que usa CitySelector) y se toma el nombre de esa entidad,
  // no su id.
  const buildLocationPayload = (data: any) => {
    const countryId = data[`${CITY_COUNTRY_FIELD_PREFIX}_country`];
    const selectedCountry = availableCountries.find((country) => country.identifier === countryId);
    const countryStructure = selectedCountry ? getCountryStructure(selectedCountry) : DEFAULT_COUNTRY_STRUCTURE;
    const cityLevel = countryStructure.levels.find((level) => level.name === 'city')?.level;
    const cityEntityId = cityLevel ? data[`${CITY_COUNTRY_FIELD_PREFIX}_level${cityLevel}`] : undefined;
    const cityEntity = cityEntityId
      ? allLocationEntities.find((entity) => entity.id === cityEntityId && entity.level === cityLevel)
      : undefined;

    return { country: countryId, city: cityEntity?.name };
  };

  // El payload real de Place no tiene estas claves sueltas (son un detalle interno del control de UI).
  const stripCityWithCountryFields = (payload: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(payload).filter(([key]) => !key.startsWith(`${CITY_COUNTRY_FIELD_PREFIX}_`))
    );
  };

  // ProfileHeader arranca con el campo Nombre colapsado y sin registrar en RHF, lo que permite enviar
  // un create de Place sin nombre. Se fuerza expandido solo acá (no afecta a otras entidades) para que
  // quede registrado y el required se valide desde el primer submit.
  const placeCreateHeaderConfig = !currentPlace
    ? [
        {
          name: 'name',
          label: 'Nombre',
          config: { required: 'Este campo es obligatorio', minLength: 3 },
          renderField: 'nameKnownAs',
          showEditableField: true,
        },
        {
          name: 'username',
          label: 'username',
          config: {
            required: true,
            minLength: 3,
            pattern: {
              value: USERNAME_FORMAT_PATTERN,
              message: translateGlobalDict('errors.VALIDATION_USERNAME_FORMAT'),
            },
            validate: { available: debouncedUsernameValidation },
          },
        },
      ]
    : undefined;

  const handlers = {
    onSubmit: async (data: any, error?: any) => {
      if (!requestHasBeenSended) {
        // setHasAttemptedSubmit(true);
        // // El cast a `any` preserva el tipado laxo que ya tenía este payload (createItem/updateItem
        // // no reciben un Place completo en creación, sino un subconjunto parcial de campos del form).
        // const normalizedData: any = {
        //   ...(stripCityWithCountryFields(data) as any),
        //   genres: buildGenresPayload(data.genres),
        //   ...buildLocationPayload(data),
        // };

        // // No hacer request si no hay datos que actualizar (solo aplica a edición)
        // if (currentPlace && Object.keys(normalizedData).length === 0) {
        //   return;
        // }

        if (!currentPlace) {
          const response = await uploadFileToServer({ file: data.profile_pic });

          // dispatch(placesActions.createItem({ data: normalizedData }));
        } else {
          // const newInfo = {
          //   id: currentPlace.identifier,
          //   // newItem: {
          //   //   ...normalizedData,
          //   // },
          //   // newItem: { spotify: 'InstagramActualizado' },
          // };
          // console.log('ACTALIZANDO.... ', newInfo);
          // dispatch(placesActions.updateItem(newInfo));
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
        customHeaderConfig={placeCreateHeaderConfig}
        fieldOptions={{
          genres: availableGenres,
          arts_languages: availableLanguages,
          spoken_languages: availableLanguages,
          stage_languages: availableLanguages,
          place_type: PLACE_TYPE_OPTIONS,
        }}
        onlyModifiedFields={true}
        submitLabel={!currentPlace ? 'create' : 'save'}
        submitErrorMessage={submitErrorMessage}
      />
    </>
  );
};

export default PlacesCreatePage;
