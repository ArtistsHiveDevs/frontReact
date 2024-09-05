import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorArtists, useArtistsSlice } from '~/common/slices/domain/artists/artist.redux';
import { selectorLanguages, useLanguagesSlice } from '~/common/slices/parametrics/geo/language.redux';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { RootState } from '~/common/utils/redux-injectors/types';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';
import { DynamicTabbedForm } from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { LanguageModel } from '~/models/parametrics/geo/language.model';
import {
  ARTIST_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_ARTIST_DETAIL_PAGE,
} from '../ArtistDetails/config-artist-detail';

const ArtistsCreatePage = () => {
  const { navigateToEntity, navigateToInnerPath } = useNavigation();
  const loggedUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const { actions: userActions } = useUsersSlice();
  const { actions: languageActions } = useLanguagesSlice();
  const urlParameters = useParams();

  const [artistId, setCurrentArtistId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
  // const [availableLanguages, updateAvailableLanguages] = useState([]);
  const [availableGenres, updateAvailableGenres] = useState([]);
  const [currentUserCanEdit, setCurrentUserCanEdit] = useState(false);
  const [requestHasBeenSended, setRequestHasBeenSended] = useState(false);
  const [hasSwitchedProfile, setHasSwitchedProfile] = useState(false);

  const { actions: artistsActions } = useArtistsSlice();

  const availableLanguages: LanguageModel[] = useSelector(selectorLanguages.selectItems);

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
  }, [urlParameters]);

  // useEffect(() => {
  //   if (requestHasBeenSended && !!createdItem) {
  //     console.log()
  //     dispatch(userActions.switchProfile({ id: createdItem.identifier }));
  //     setHasSwitchedProfile(true);
  //   }
  // }, [createdItem]);

  useEffect(() => {
    if (requestHasBeenSended && loggedUser?.currentProfileIdentifier) {
      navigateToEntity({ entityType: ArtistModel.name, id: loggedUser?.currentProfileIdentifier });
    }
  }, [loggedUser]);

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
      { label: 'Cumbia', value: 'genre1' },
      { label: 'Reggaetón', value: 'genre2' },
      { label: 'Rock', value: 'genre3', selected: true },
      { label: 'Jazz', value: 'genr4' },
    ]);
  }, []);

  const handlers = {
    onSubmit: (data: any, error?: any) => {
      console.log('#####----------->>>>  !!! ', data);
      if (!requestHasBeenSended) {
        if (!currentArtist) {
          dispatch(artistsActions.createItem({ data }));
        } else {
          console.log('Actualizando  un nuevo artista ', currentArtist.identifier, data);
          dispatch(
            artistsActions.updateItem({
              id: currentArtist.identifier,
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
      <RequireAuthComponent requiredSession={true}>
        {currentUserCanEdit && (
          <DynamicTabbedForm
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
          />
        )}
        {!currentUserCanEdit && 'No existe o no tiene permisos suficientes'}
      </RequireAuthComponent>
    </>
  );
};

export default ArtistsCreatePage;
