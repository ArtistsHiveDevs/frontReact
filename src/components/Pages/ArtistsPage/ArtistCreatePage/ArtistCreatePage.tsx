import { StorageGetUrlOutput } from '@aws-amplify/storage/dist/esm/types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorArtists, useArtistsSlice } from '~/common/slices/domain/artists/artist.redux';
import { selectorLanguages, useLanguagesSlice } from '~/common/slices/parametrics/geo/language.redux';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { getImageURL, removeImages, uploadImage, uploadImages } from '~/common/utils/amplify/storage/storage.helpers';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { RootState } from '~/common/utils/redux-injectors/types';
import { BackButton } from '~/components/shared/app/atoms/navigation-buttons/back-buttons';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';
import { FileUploaderOptions } from '~/components/shared/organisms/gui/dynamicForms/components/FileUpload';
import {
  DynamicTabbedForm,
  DynamicTabbedFormRef,
} from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
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
  const formRef = useRef<DynamicTabbedFormRef>(null);

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

  const [filesWrapperData, setFilesWrapperData] = useState(undefined);

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
  }, [loggedUser, requestHasBeenSended]);

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

  const updateFileUploadAddElements = (filesData: any, fieldName: string) => {
    const extractFilesDataPaths = filesData?.map((fileData: any) => {
      return {
        src: `s3://${fileData.customPath}`,
        path: fileData?.customPath,
        fileName: fileData?.fileName,
      };
    });

    const previousData = filesWrapperData?.[`${fieldName}`]?.length > 0 ? filesWrapperData?.[`${fieldName}`] : [];
    const formattedFileImageElement = [...previousData, ...extractFilesDataPaths];
    setFilesWrapperData((previousData: any) => ({
      ...previousData,
      [`${fieldName}`]: formattedFileImageElement,
    }));
  };

  const findRemovalFilesPath = (fileData: any, fieldName: string) => {
    const removalPaths = fileData?.path
      ? [fileData.path]
      : filesWrapperData?.[`${fieldName}`]
          ?.filter((imageData: any) => imageData.fileName?.includes(fileData.name))
          .map((pathElement: any) => pathElement?.path);
    return removalPaths;
  };

  const updateFileUploadRemoveElements = (paths: any, fieldName: string) => {
    paths?.forEach((path: string) => {
      const filterFileWrapperData = filesWrapperData?.[`${fieldName}`];
      const indexToRemove = filterFileWrapperData?.findIndex((fileElement: any) => fileElement?.path == path);
      if (indexToRemove != -1) {
        const dataAfterRemove = filesWrapperData?.[`$fieldName`]?.splice(indexToRemove, 1);
        if (dataAfterRemove?.length > 0) {
          setFilesWrapperData((previousData: any) => ({
            ...previousData,
            [`${fieldName}`]: dataAfterRemove,
          }));
        } else {
          setFilesWrapperData((previousData: any) => {
            const clonePrev = { ...previousData };
            delete clonePrev?.[`${fieldName}`];
            return clonePrev;
          });
        }
      }
    });
  };

  const handlers = {
    onSubmit: async (data: any, error?: any) => {
      if (!currentArtist) {
        await uploadImage({ file: data.profile_pic });
        dispatch(artistsActions.createItem({ data }));
      } else {
        const updatePayload = {
          id: currentArtist.identifier,
          newItem: {
            ...data,
            ...filesWrapperData,
          },
        };

        dispatch(artistsActions.updateItem(updatePayload));
      }
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
    fileUploadfilesChanged: async (handledUploadFileData: any) => {
      console.log({ handledUploadFileData });
      const { files, optionType, destinationPath, fieldName } = handledUploadFileData;
      if (optionType === FileUploaderOptions.addItem) {
        const responses = await uploadImages({
          files,
          path: `profiles/${loggedUser.currentProfileIdentifier}${destinationPath}`,
        });
        if (responses?.length > 0) {
          updateFileUploadAddElements(responses, fieldName);
        }
      } else if (optionType === FileUploaderOptions.removeItem) {
        const findPaths = findRemovalFilesPath(files, fieldName);
        const responses = await removeImages({ paths: findPaths });

        if (responses?.length > 0) {
          updateFileUploadRemoveElements(findPaths, fieldName);
        }
      }
    },
  };

  const getURL = async () => {
    const linkToStorageFile = await getImageURL({ path: 'public', fileName: '1725765544035-Carlos Navarrete.jpg' });

    // await getUrl({
    //   path: 'picture-submissions/',
    //   // Alternatively, path: ({identityId}) => `album/{identityId}/1.jpg`
    // });
    console.log(linkToStorageFile);
    setURL(linkToStorageFile);
  };
  const [url, setURL] = useState<StorageGetUrlOutput>();

  const backHandler = async () => {
    if (formRef.current) {
      try {
        await formRef.current.submit();
        // Esperar a que el saga complete
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (error) {
        console.error('Error en submit:', error);
      }
    }
  };

  return (
    <>
      <RequireAuthComponent requiredSession={true}>
        {currentUserCanEdit && (
          <>
            <BackButton onClick={backHandler} />
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
            />
          </>
        )}
        {!currentUserCanEdit && 'No existe o no tiene permisos suficientes'}
      </RequireAuthComponent>
    </>
  );
};

export default ArtistsCreatePage;
