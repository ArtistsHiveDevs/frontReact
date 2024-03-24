import { useEffect, useState } from 'react';
import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { DynamicTabbedForm } from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { AppUserModel } from '~/models/app/user/user.model';
import { TRANSLATION_BASE_USER_DETAIL_PAGE, USER_DETAIL_SUB_PAGE_CONFIG } from '../UserDetails/config-user-detail';

const UserCreatePage = () => {
  const [availableLanguages, updateAvailableLanguages] = useState([]);
  const [availableGenres, updateAvailableGenres] = useState([]);
  const [availableGenders, updateAvailableGenders] = useState([]);
  const [availableAllergies, updateAvailableAllergies] = useState([]);
  const [availableBloodGroups, updateAvailableBloodGroups] = useState([]);
  const [availableDietaryRestritions, updateAvailableDietaryRestrictions] = useState([]);

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
        console.log(group, defaultBloodGroup, defaultBloodGroup === group);
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
        tabsInfo={USER_DETAIL_SUB_PAGE_CONFIG}
        handlers={handlers}
        translationBasePath={TRANSLATION_BASE_USER_DETAIL_PAGE}
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
      />
    </>
  );
};

export default UserCreatePage;
