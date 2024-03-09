import { useEffect, useState } from "react";
import {
  DynamicForm,
  convertTabbedProfileDetailIntoTabbedForm,
} from "~/components/shared/organisms/gui/dynamicForms";
import { PlaceModel } from "~/models/domain/place/place.model";
import {
  PLACE_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_PLACE_DETAIL_PAGE,
} from "../PlaceDetailsPage/config-place-detail";

const PlacesCreatePage = () => {
  const [fieldsForm, updateFields] = useState([]);

  useEffect(() => {
    updateFields(
      convertTabbedProfileDetailIntoTabbedForm(PLACE_DETAIL_SUB_PAGE_CONFIG)
    );
  }, []);

  const handlers = {
    onSubmit: (data: any, error?: any) => {
      console.log("#####----------->>>>  !!! ", data);
    },
    onChangecountry: (data: any) => {
      console.log("#####----------->>>> **** !!! ", fieldsForm, data);
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

      updateFields(fieldsForm);
      // updateCiudades(ciudades);
    },
  };

  return (
    <>
      <h1>Crear Lugar</h1>

      <DynamicForm
        fields={fieldsForm}
        handlers={handlers}
        translationBasePath={TRANSLATION_BASE_PLACE_DETAIL_PAGE}
        entityType={PlaceModel.name}
      />
    </>
  );
};

export default PlacesCreatePage;
