import { StorageGetUrlOutput } from '@aws-amplify/storage/dist/esm/types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorArtists, useArtistsSlice } from '~/common/slices/domain/artists/artist.redux';
import { selectorCountries } from '~/common/slices/parametrics/geo/country.redux';
import { selectorLanguages, useLanguagesSlice } from '~/common/slices/parametrics/geo/language.redux';
import { selectorLocationEntities } from '~/common/slices/parametrics/geo/location-entity.redux';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { getImageURL, uploadFileToServer } from '~/common/utils/amplify/storage/storage.helpers';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { buildLocationPayload, stripLocationSelectorFields } from '~/common/utils/location-payload.utils';
import { RootState } from '~/common/utils/redux-injectors/types';
import { BackButton } from '~/components/shared/app/atoms/navigation-buttons/back-buttons';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';
import {
  DynamicTabbedForm,
  DynamicTabbedFormRef,
} from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { CountryModel } from '~/models/parametrics/geo/country.model';
import { LanguageModel } from '~/models/parametrics/geo/language.model';
import { LocationEntityModel } from '~/models/parametrics/geo/location-entity.model';
import {
  ARTIST_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_ARTIST_DETAIL_PAGE,
} from '../ArtistDetails/config-artist-detail';

// Prefijo de campos que CitySelector genera para el atributo 'home_city' del config.
const HOME_CITY_FIELD_PREFIX = 'home_city';

const ArtistsCreatePage = () => {
  const { navigateToEntity, navigateToInnerPath } = useNavigation();
  const loggedUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const { actions: userActions } = useUsersSlice();
  const { actions: languageActions } = useLanguagesSlice();
  const urlParameters = useParams();
  const formRef = useRef<DynamicTabbedFormRef>(null);

  const [artistId, setCurrentArtistId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
  // const [availableLanguages, updateAvailableLanguages] = useState([]);
  const [availableGenres, updateAvailableGenres] = useState([]);
  const [currentUserCanEdit, setCurrentUserCanEdit] = useState(false);
  const [requestHasBeenSended, setRequestHasBeenSended] = useState(false);
  const [hasSwitchedProfile, setHasSwitchedProfile] = useState(false);

  const { actions: artistsActions } = useArtistsSlice();

  const availableLanguages: LanguageModel[] = useSelector(selectorLanguages.selectItems);
  const availableCountries: CountryModel[] = useSelector(selectorCountries.selectItems);
  const allLocationEntities: LocationEntityModel[] = useSelector(selectorLocationEntities.selectItems);

  const loading = useSelector(selectorArtists.selectLoading);
  const submitError = useSelector(selectorArtists.selectError);
  const createdItem = useSelector(selectorArtists.selectCreatedItem);
  const selectArtistById = selectorArtists.makeSelectItemById();
  const currentArtist: ArtistModel = useSelector((state: RootState) => {
    if (artistId) {
      return selectArtistById(state, artistId);
    } else {
      return undefined;
    }
  });

  useEffect(() => {
    const currentUserIsAwolled = loggedUser && (!artistId || loggedUser.checkPermissions(artistId).canEdit);
    setCurrentUserCanEdit(currentUserIsAwolled);
    if (currentUserIsAwolled && artistId) {
      dispatch(artistsActions.getItemById({ id: artistId }));
    } else if (!loggedUser) {
      navigateToInnerPath({ path: PATHS.LOGIN });
    }
  }, [artistId]);

  useEffect(() => {
    if (artistId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentArtistId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
    getURL();
  }, [urlParameters]);

  useEffect(() => {
    if (requestHasBeenSended && !currentArtist && createdItem) {
      navigateToEntity({ entityType: ArtistModel.name, id: createdItem.identifier });
    }
  }, [createdItem, requestHasBeenSended]);

  // Tras un update exitoso se navega al detalle del Artist.
  useEffect(() => {
    if (requestHasBeenSended && !loading && currentArtist && !submitError) {
      navigateToEntity({ entityType: ArtistModel.name, id: currentArtist.identifier });
    }
  }, [loading]);

  // Rehabilita el submit al terminar, sino un create/update fallido queda bloqueado sin poder reintentar.
  useEffect(() => {
    if (requestHasBeenSended && !loading) {
      setRequestHasBeenSended(false);
    }
  }, [loading]);

  useEffect(() => {
    if (!availableLanguages || availableLanguages.length === 0) {
      dispatch(languageActions.loadItems({}));
    }
    // const langsOR = [
    //   { label: 'ES', value: 'es', selected: false },
    //   { label: 'DE', value: 'de' },
    //   { label: 'FR', value: 'fr' },
    //   { label: 'PT', value: 'pt' },
    // ];
    // let langs = [...langsOR];

    // Array(20)
    //   .fill('x')
    //   .forEach((valu, number) =>
    //     langsOR.forEach((lng) =>
    //       langs.push({
    //         label: `${lng.label}${number}`,
    //         value: `${lng.value}${number}`,
    //         selected: Math.random() > 1 - 90 / 100,
    //       })
    //     )
    //   );

    // updateAvailableLanguages(langs);
    updateAvailableGenres([
      { label: 'Cumbia', value: 'Cumbia' },
      { label: 'Reggaetón', value: 'Reggaetón' },
      { label: 'Rock', value: 'Rock' },
      { label: 'Jazz', value: 'Jazz' },
    ]);
  }, []);

  // Si el país no llega dirty, usamos el ya guardado en currentArtist como fallback para resolver los niveles.
  const buildArtistLocationUpdate = (data: any) => {
    const hasLocationChange = Object.entries(data).some(([key, value]) => key.startsWith(`${HOME_CITY_FIELD_PREFIX}_`) && !!value);
    if (!hasLocationChange) {
      return data;
    }

    const dataWithFallbackCountry = {
      ...data,
      [`${HOME_CITY_FIELD_PREFIX}_country`]:
        data[`${HOME_CITY_FIELD_PREFIX}_country`] ?? currentArtist?.country?.identifier,
    };

    return {
      ...stripLocationSelectorFields(data, HOME_CITY_FIELD_PREFIX),
      ...buildLocationPayload(dataWithFallbackCountry, HOME_CITY_FIELD_PREFIX, availableCountries, allLocationEntities),
    };
  };

  const handlers = {
    onSubmit: async (data: any, error?: any) => {
      const locationNormalizedData = buildArtistLocationUpdate(data);
      const normalizedData = Array.isArray(locationNormalizedData.genres)
        ? { ...locationNormalizedData, genres: { music: locationNormalizedData.genres } }
        : locationNormalizedData;

      if (!currentArtist) {
        await uploadFileToServer({ file: normalizedData.profile_pic });
        dispatch(artistsActions.createItem({ data: normalizedData }));
      } else {
        // No hacer request si no hay datos que actualizar
        // El formulario ya incluye filesWrapperData automáticamente en 'data'
        if (Object.keys(normalizedData).length === 0) {
          return;
        }

        const updatePayload = {
          id: currentArtist.identifier,
          newItem: normalizedData,
        };

        dispatch(artistsActions.updateItem(updatePayload));
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

  const getURL = async () => {
    const linkToStorageFile = await getImageURL({ path: 'public', fileName: '1725765544035-Carlos Navarrete.jpg' });

    // await getUrl({
    //   path: 'picture-submissions/',
    //   // Alternatively, path: ({identityId}) => `album/{identityId}/1.jpg`
    // });
    setURL(linkToStorageFile);
  };
  const [url, setURL] = useState<StorageGetUrlOutput>();

  return (
    <>
      <RequireAuthComponent resourceEntity={currentArtist} requiredSession={true}>
        {currentUserCanEdit && (
          <>
            <BackButton formRef={formRef} />
            {/* <h1>IMAGEN 2</h1>
            <FileUploader acceptedFileTypes={['image/*']} path="galeria/" maxFileCount={500} isResumable />
            <h2>FIN</h2>
            {/* {url?.url?.href} }
            <Avatar src={url?.url?.href} sx={{ width: '5rem', height: '5rem' }}></Avatar>
            <br /> */}
            {/* {url?.expiresAt} */}
            <DynamicTabbedForm
              ref={formRef}
              tabsInfo={ARTIST_DETAIL_SUB_PAGE_CONFIG}
              handlers={handlers}
              translationBasePath={TRANSLATION_BASE_ARTIST_DETAIL_PAGE}
              entityType={ArtistModel.name}
              elementData={currentArtist}
              fieldOptions={{
                genres: availableGenres,
                arts_languages: availableLanguages,
                spoken_languages: availableLanguages,
                stage_languages: availableLanguages,
              }}
              submitLabel={!currentArtist ? 'create' : 'save'}
              onlyModifiedFields={true}
              resourceConfig={
                loggedUser?.currentProfileIdentifier
                  ? {
                      resourceType: 'profiles',
                      identifier: loggedUser.currentProfileIdentifier,
                    }
                  : undefined
              }
            />
          </>
        )}
        {!currentUserCanEdit && 'No existe o no tiene permisos suficientes'}
      </RequireAuthComponent>
    </>
  );
};

export default ArtistsCreatePage;
