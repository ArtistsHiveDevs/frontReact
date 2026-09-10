import { useI18n } from '~/common/utils';
import { getGenderIdentityOptions, getGenderOptions } from '~/common/utils/form-options/user-options.helper';
import {
  CustomObjectListElementFieldTemplate,
  CustomObjectListViewer,
} from '~/components/shared/CustomObjectListViewer/CustomObjectListViewer';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';

export const createCustomObjectListBuiderComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData } = params;
  const { data: componentDescriptorData, formMetaData } = componentDescriptor || {};
  const { externalData } = componentDescriptorData;
  const { translateGlobalDict } = useI18n();

  let memberList: any = getData(externalData, entityData);
  const fields = formMetaData?.componentParams?.fields || [];
  const translationPath = formMetaData?.componentParams?.translationPath || '';
  const enableVerticalViewFromExt =  formMetaData?.componentParams?.enableVerticalView;

  // Catálogos de select conocidos, para traducir el valor crudo guardado (ej. 'male') al label
  // correspondiente al mostrarlo en modo lectura. Mismo mapeo que usa el formulario de edición
  // (ver ArtistCreatePage.tsx fieldOptions.music_performance).
  const knownSelectFieldOptions: Record<string, { label: string; value: string }[]> = {
    gender: getGenderOptions({ translateFn: translateGlobalDict }),
    gender_identity: getGenderIdentityOptions({ translateFn: translateGlobalDict }),
  };

  const fieldsWithOptions = fields.map((field: CustomObjectListElementFieldTemplate) =>
    knownSelectFieldOptions[field.fieldName]
      ? { ...field, options: knownSelectFieldOptions[field.fieldName] }
      : field
  );

  return (
    <>
      <CustomObjectListViewer
        fields={fieldsWithOptions}
        objectList={[...memberList]}
        translationPath={translationPath}
        enableVerticalView={enableVerticalViewFromExt}
      />
    </>
  );
};
