import { fetchUserAttributes } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectorAllergies, useAllergiesSlice } from '~/common/slices/parametrics/demographics/allergies.redux';
import { selectorLanguages, useLanguagesSlice } from '~/common/slices/parametrics/geo/language.redux';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { IndustrySignUpBanner } from '~/components/shared/atoms/IndustrySignUpBanner/IndustrySignUpBanner';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { DynamicTabbedForm } from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { AppUserModel } from '~/models/app/user/user.model';
import { TRANSLATION_BASE_USER_DETAIL_PAGE, USER_DETAIL_SUB_PAGE_CONFIG } from '../UserDetails/config-user-detail';
import './UserCreatePage.scss';

const UserCreatePage = () => {
  const loggedUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const { translateText, translateGlobalDict } = useI18n();

  const { actions: languageActions } = useLanguagesSlice();
  const { actions: allergyActions } = useAllergiesSlice();
  const { actions: userActions } = useUsersSlice();

  const availableAllergies = useSelector(selectorAllergies.selectItems);
  const availableLanguages = useSelector(selectorLanguages.selectItems);

  // const [availableLanguages, updateAvailableLanguages] = useState([]);
  const [availableGenres, updateAvailableGenres] = useState([]);
  const [availableGenders, updateAvailableGenders] = useState([]);
  // const [availableAllergies, updateAvailableAllergies] = useState([]);
  const [availableBloodGroups, updateAvailableBloodGroups] = useState([]);
  const [availableDietaryRestritions, updateAvailableDietaryRestrictions] = useState([]);

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

    updateAvailableGenders(
      ['male', 'female', 'non_binary', 'non_specified'].map((gender) => {
        return { label: translateGlobalDict(`genders.${gender}`), value: gender };
      })
    );

    updateAvailableDietaryRestrictions([
      { label: 'None', value: 'none' },
      { label: 'Vegetarian', value: 'vegetarian' },
      { label: 'Vegan', value: 'vegan' },
      { label: 'Celiac', value: 'celiac' },
    ]);

    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const user = await fetchUserAttributes();

    // console.log('username', user.username);
    // console.log('user id', user.userId);
    // console.log('sign-in details', user.signInDetails);
    console.log(user, ' - ', loggedUser);
  };

  const handlers = {
    onSubmit: (data: any, error?: any) => {
      console.log('#####----------->>>>  !!! ', data);
      dispatch(
        userActions.updateUser({
          id: loggedUser.identifier,
          newItem: {
            ...data,
          },
        })
      );
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
      {loggedUser && !loggedUser.hasFilledProfile && (
        <div className="fill-profile-banner">
          <div>
            <DynamicIcons iconName="FaInfoCircle" size={40} color={'white'} />
          </div>
          <div>{translateText(`${TRANSLATION_BASE_USER_DETAIL_PAGE}.fillProfileBanner.content`)}</div>
        </div>
      )}
      <DynamicTabbedForm
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
      />
      <IndustrySignUpBanner />
    </>
  );
};

export default UserCreatePage;
