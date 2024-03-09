import { useEffect, useState } from "react";
import { SelectOption } from "~/components/shared/organisms/gui/dynamicForms";
import { DynamicTabbedForm } from "~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import {
  ARTIST_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_ARTIST_DETAIL_PAGE,
} from "../ArtistDetails/config-artist-detail";

const ArtistsCreatePage = () => {
  const [fieldsForm, updateFields] = useState([]);
  const [availableLanguages, updateAvailableLanguages] = useState([]);
  const [availableGenres, updateAvailableGenres] = useState([]);

  useEffect(() => {
    // updateFields(
    //   convertTabbedProfileDetailIntoTabbedForm(ARTIST_DETAIL_SUB_PAGE_CONFIG)
    // );
  }, []);

  useEffect(() => {
    const langsOR = [
      { label: "ES", value: "es", selected: true },
      { label: "DE", value: "de" },
      { label: "FR", value: "fr" },
      { label: "PT", value: "pt" },
    ];
    let langs = [...langsOR];

    Array(20)
      .fill("x")
      .forEach((valu, number) =>
        langsOR.forEach((lng) =>
          langs.push({
            label: `${lng.label}${number}`,
            value: `${lng.value}${number}`,
          })
        )
      );

    updateAvailableLanguages(langs);
    updateAvailableGenres([
      { label: "Cumbia", value: "cumbia" },
      { label: "Reggaetón", value: "reggaetón" },
      { label: "Rock", value: "rock", selected: true },
      { label: "Jazz", value: "jazz" },
    ]);
  }, [fieldsForm]);

  useEffect(() => {
    if (availableLanguages && availableLanguages.length) {
      setOptionsToField("spoken_languages", availableLanguages, fieldsForm);
      setOptionsToField("stage_languages", availableLanguages, fieldsForm);
      setOptionsToField("arts_languages", availableLanguages, fieldsForm);
    }
  }, [availableLanguages]);

  useEffect(() => {
    if (availableGenres && availableGenres.length) {
      const genresField = findFieldMetadata("genres", fieldsForm);

      if (genresField) {
        genresField.options = availableGenres;
      }
    }
  }, [availableGenres]);

  const handlers = {
    onSubmit: (data: any, error?: any) => {
      console.log("#####----------->>>>  !!! ", data);
    },
    onChangecountry: (data: any) => {
      console.log("#####----------->>>>  !!! ", data);
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
      <h1>Crear Artista</h1>
      <DynamicTabbedForm
        tabsInfo={ARTIST_DETAIL_SUB_PAGE_CONFIG}
        handlers={handlers}
        translationBasePath={TRANSLATION_BASE_ARTIST_DETAIL_PAGE}
        entityType={ArtistModel.name}
      />
    </>
  );
};

const findFieldMetadata = (fieldName: string, fieldsForm: any) => {
  let searchedField: any;
  fieldsForm.forEach((tabInfo: any) => {
    tabInfo.sections.forEach((section: any) => {
      if (!searchedField) {
        searchedField = section.fields.find(
          (fieldData: any) => fieldData.fieldName === fieldName
        );
      }
    });
  });
  return searchedField;
};

const setOptionsToField = (
  fieldName: string,
  options: SelectOption[],
  fieldsForm: any
) => {
  const field = findFieldMetadata(fieldName, fieldsForm);
  if (field) {
    field.options = options;
  }
};

export default ArtistsCreatePage;
