import { useEffect, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { useI18n } from '~/common/utils';
import {
  CustomObjectListViewer,
  CustomObjectElementHandleClickTemplate,
  CustomObjectListElementFieldTemplate,
} from '~/components/shared/CustomObjectListViewer/CustomObjectListViewer';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { ComponentGeneratorParams } from '../DynamicControl';
import { DynamicForm } from '../dynamic-form';
import { FileUploaderOptions } from './FileUpload';

export const createCustomObjectList = (params: ComponentGeneratorParams) => {
  const { translateText } = useI18n();
  const { fieldData, handlers } = params;
  const { componentParams, config, fieldName, externalData, nestedOptions } = fieldData;
  const { fields, dialogTitle = '', translationPath, dialogLabelAddCustomObjectElement, enableVerticalView } = componentParams;

  const formMethods = useForm({
    mode: 'onChange', // Validar en cada cambio
    reValidateMode: 'onChange', // Re-validar en cada cambio
  });

  const [showAddCustomObjectElement, setShowAddCustomObjectElement] = useState(false);
  const [customObjectList, setCustomObjectList] = useState([]);
  const [prechargedExternalInfo, setPrechargedExternalInfo] = useState(false);

  const hookContext = useFormContext();
  const finalContext = hookContext;
  const { register, formState, setValue } = finalContext;
  const { errors } = formState || {};
  const translatedFieldLabels = fields?.map((field: CustomObjectListElementFieldTemplate) => {
    return { ...field, label: translateText(`${translationPath}.${field.label}`) };
  });

  config.value = customObjectList;

  useEffect(() => {
    if (externalData?.length > 0 && externalData && Array.isArray(externalData) && !prechargedExternalInfo) {
      setCustomObjectList(externalData);
      setValue?.(fieldName, externalData);
      setPrechargedExternalInfo(true);
    }
  }, [externalData]);

  const generateRandomInternalIdentifier = () => {
    return Math.random().toString(36).slice(2, 11);
  };

  const mapDynamicFormDataToModel = (customObjectElement: any) => {
    return {
      ...{internal_id: generateRandomInternalIdentifier()},
      ...customObjectElement,
    };
  };

  const customHandlers = {
    ...handlers,
    onSubmit: (event: any) => {
      const data = mapDynamicFormDataToModel(event);
      const totalValues = [...customObjectList, ...[data]];
      setCustomObjectList(totalValues);
      setShowAddCustomObjectElement(false);
      setValue?.(fieldName, totalValues, { shouldDirty: true });
    },
  };

  const handleRemoveItem = (externalIdentifier: string) => {
    const data = customObjectList?.filter((customObjectElementToFilter) => customObjectElementToFilter?.internal_id !== externalIdentifier);
    setCustomObjectList(data);
    setValue?.(fieldName, data, { shouldDirty: true });
  };

  const handleCustomObjectListViewerClick = (event: CustomObjectElementHandleClickTemplate) => {
    const { selectedOption, objectElementToRemove } = event;

    switch (selectedOption) {
      case FileUploaderOptions.addItem:
        setShowAddCustomObjectElement(true);
        break;

      case FileUploaderOptions.removeItem:
        handleRemoveItem(objectElementToRemove);
    }
  };

  return (
    <>
      <CustomObjectListViewer
        {...(register ? register(fieldName, config) : {})}
        fields={fields}
        objectList={customObjectList}
        enableAddButton={true}
        enableRemoveButton={true}
        enableVerticalView={enableVerticalView}
        translationPath={translationPath}
        handleClickEvent={(e: CustomObjectElementHandleClickTemplate) => handleCustomObjectListViewerClick(e)}
      />
      <AppDialog
        title={'NUEVO'}
        content={
          <DynamicForm
            fields={translatedFieldLabels}
            handlers={customHandlers}
            formMethods={formMethods}
            fieldOptions={nestedOptions}
            translationBasePath={translationPath}
            submitLabel={dialogLabelAddCustomObjectElement}
          />
        }
        isOpenDialog={showAddCustomObjectElement}
        onClose={() => setShowAddCustomObjectElement(false)}
        key={`dialog_${fieldData.fieldName}`}
      />
    </>
  );
};
