import { Box } from '@mui/material';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectorAllergies, useAllergiesSlice } from '~/common/slices/parametrics/demographics/allergies.redux';
import { selectorLanguages, useLanguagesSlice } from '~/common/slices/parametrics/geo/language.redux';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { uploadFileToServer } from '~/common/utils/amplify/storage/storage.helpers';
import {
  getBloodGroupOptions,
  getDietaryRestrictionOptions,
  getGenderOptions,
} from '~/common/utils/form-options/dynamic-form-parametric-options.helper';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { BackButton } from '~/components/shared/app/atoms/navigation-buttons/back-buttons';
import { IndustrySignUpBanner } from '~/components/shared/atoms/IndustrySignUpBanner/IndustrySignUpBanner';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import {
  DynamicTabbedForm,
  DynamicTabbedFormRef,
} from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { AppUserModel } from '~/models/app/user/user.model';
import { TRANSLATION_BASE_USER_DETAIL_PAGE, USER_DETAIL_SUB_PAGE_CONFIG } from '../UserDetails/config-user-detail';
import './UserCreatePage.scss';

const UserCreatePage = () => {
  const loggedUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const formRef = useRef<DynamicTabbedFormRef>(null);

  const { translateText, translateGlobalDict } = useI18n();
  const { navigateToEntity } = useNavigation();

  const { actions: languageActions } = useLanguagesSlice();
  const { actions: allergyActions } = useAllergiesSlice();
  const { actions: userActions } = useUsersSlice();

  const availableAllergies = useSelector(selectorAllergies.selectItems);
  const availableLanguages = useSelector(selectorLanguages.selectItems);

  // const [availableLanguages, updateAvailableLanguages] = useState([]);
  const [updateRequestWasSended, setUpdateRequestSended] = useState(false);
  const [availableGenres, updateAvailableGenres] = useState([]);
  const [availableGenders, updateAvailableGenders] = useState([]);
  // const [availableAllergies, updateAvailableAllergies] = useState([]);
  const [availableBloodGroups, updateAvailableBloodGroups] = useState([]);
  const [availableDietaryRestritions, updateAvailableDietaryRestrictions] = useState([]);

  const [openDialogCompleteProfile, setOpenDialogFillProfileBanner] = useState(false);

  useEffect(() => {
    dispatch(languageActions.loadItems({}));
    dispatch(allergyActions.loadItems({}));
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
    //         selected: Math.random() > 1 - 10 / 100,
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

    //
    updateAvailableBloodGroups(getBloodGroupOptions({ defaultValue: 'O+' }));

    // updateAvailableAllergies([
    //   { label: 'Polen', value: 'Polen' },
    //   { label: 'Polvo', value: 'Polvo' },
    //   { label: 'Leche', value: 'Leche' },
    //   { label: 'Maní', value: 'Maní' },
    //   { label: 'Gluten', value: 'Gluten' },
    //   { label: 'Ibuprofeno', value: 'Ibuprofeno' },
    //   { label: 'Perros', value: 'Perros' },
    //   { label: 'Gatos', value: 'Gatos' },
    // ]);

    updateAvailableGenders(getGenderOptions({ translateFn: translateGlobalDict }));

    updateAvailableDietaryRestrictions(getDietaryRestrictionOptions({ translateFn: translateGlobalDict }));

    getUserInfo();
  }, []);

  useEffect(() => {
    // console.log(updateRequestWasSended, '  -  ', loggedUser, '---  ', !!loggedUser.hasFilledProfile);
    if (updateRequestWasSended && loggedUser && !!loggedUser.hasFilledProfile) {
      navigateToEntity({ entityType: AppUserModel.name, id: loggedUser?.currentProfileIdentifier });
    }
  }, [loggedUser, updateRequestWasSended]);

  const getUserInfo = async () => {
    const user = await fetchUserAttributes();

    // console.log('username', user.username);
    // console.log('user id', user.userId);
    // console.log('sign-in details', user.signInDetails);

    setOpenDialogFillProfileBanner(loggedUser && !loggedUser.hasFilledProfile);
  };

  const handlers = {
    onSubmit: async (data: any, error?: any) => {
      // console.log('#####----------->>>>  !!! ', data);

      // No hacer request si no hay datos que actualizar
      if (!data || Object.keys(data).length === 0) {
        return;
      }

      if (!!data.profile_pic) {
        const prefferedFilename = `${loggedUser.sub}.${data.profile_pic.name.split('.').pop()}`;
        const response = await uploadFileToServer({
          file: data.profile_pic,
          prefferedFilename,
        });
        // console.log('DESPUÉS de SUBIR FOTO, ', response);
        dispatch(
          userActions.updateUser({
            id: loggedUser.identifier,
            newItem: {
              ...data,
              profile_pic: `s3://public/${prefferedFilename}`,
            },
          })
        );
      } else {
        dispatch(
          userActions.updateUser({
            id: loggedUser.identifier,
            newItem: {
              ...data,
            },
          })
        );
      }
      setUpdateRequestSended(true);
    },
  };

  return (
    <>
      {!!loggedUser?.hasFilledProfile && <BackButton formRef={formRef} />}
      <DynamicTabbedForm
        ref={formRef}
        tabsInfo={USER_DETAIL_SUB_PAGE_CONFIG}
        handlers={handlers}
        translationBasePath={TRANSLATION_BASE_USER_DETAIL_PAGE}
        entityType={AppUserModel.name}
        elementData={loggedUser}
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
        onlyModifiedFields={true}
      />
      <IndustrySignUpBanner />
      <AppDialog
        title="Completa tu perfil"
        isOpenDialog={openDialogCompleteProfile}
        onClose={() => setOpenDialogFillProfileBanner(false)}
        content={
          <>
            {translateText(`${TRANSLATION_BASE_USER_DETAIL_PAGE}.fillProfileBanner.content`)}

            <h5 style={{ marginTop: '1rem' }}>TIP:</h5>
            <span style={{ margin: '1rem', fontSize: 22, textAlign: 'center' }}>
              {' '}
              <strong>Una</strong> cuenta personal <strong>Muchos</strong> roles
            </span>
            <Box
              component="img"
              sx={{
                height: 'auto',
                width: '90%',
                maxWidth: { xs: '90%', md: '600px' },
                display: 'block', // Necesario para que el margen funcione
                mx: 'auto', // Centra horizontalmente
                padding: '1rem',
              }}
              alt="Description"
              src="/img/InfoPerfiles.png"
            />
          </>
        }
        // icon={'FaInfoCircle'}
      />
      {/* <Dialog id="zoomAlbumImg" open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle className="dialog-title">
          Completa tu perfil
          <IconButton onClick={() => setOpenDialog(false)} className="close-icon">
            <DynamicIcons iconName="MdClose" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="zoom-dialog">
          <div>
            <div>{translateText(`${TRANSLATION_BASE_USER_DETAIL_PAGE}.fillProfileBanner.content`)}</div>
            <div>
              <DynamicIcons iconName="FaInfoCircle" size={40} color={'white'} />
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default UserCreatePage;
