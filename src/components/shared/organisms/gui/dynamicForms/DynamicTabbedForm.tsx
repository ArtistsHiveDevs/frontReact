import { Alert, Button, Stack } from '@mui/material';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { I18nPaths, useI18n } from '~/common/utils';
import { removeFilesFromServer, uploadFilesToServer } from '~/common/utils/amplify/storage/storage.helpers';
import { UploadFileToServerResponse } from '~/common/utils/amplify/storage/storage.types';
import {
  USERNAME_FORMAT_PATTERN,
  createDebouncedUsernameValidation,
} from '~/common/utils/validation/username-validation';
import { isVisible } from '~/common/utils/visibility-utils';
import { SectionsPanel } from '~/components/shared/layout/SectionPanel';
import { TabbedPanel } from '~/components/shared/layout/TabbedPanel';
import { ProfileHeader } from '~/components/shared/molecules/Profile/ProfileHeader';
import {
  AttributeConfiguration,
  ComponentDescriptor,
  ComponentTypes,
  ContentSection,
  PageSection,
} from '~/components/shared/organisms/gui/builders/component-types.def';
import { SocialNetworks } from '~/constants/social-networks.const';
import { AppUserModel } from '~/models/app/user/user.model';
import { EntityModel, EntityTemplate } from '~/models/base';
import { DynamicControl } from './DynamicControl';
import { FileUploadHandleEvent, FileUploaderOptions } from './components/FileUpload';
import { ControlType, DynamicFieldData, SelectOption } from './dynamic-control-types';

export interface ResourceConfig {
  resourceType: string; // 'profiles', 'res/openCalls', 'res/events', 'res/festivals', etc.
  identifier: string; // Profile identifier, openCall ID, event ID, etc.
}

export interface DynamicTabbedFormParams {
  tabsInfo: PageSection[];
  handlers: { onSubmit?: Function; [handlerName: string]: Function };
  translationBasePath: string;
  entityType?: string;
  profileHeaderComponent?: any;
  elementData?: EntityModel<EntityTemplate>;
  fieldOptions?: { [fieldName: string]: any };
  externalData?: { [fieldName: string]: any };
  customHeaderConfig?: any;
  submitLabel?: string;
  enableUsernameValidation?: boolean;
  onlyModifiedFields?: boolean;
  submitErrorMessage?: string; // Error de servidor (ej. falló el create/update); lo controla la página, no este componente.
  resourceConfig?: ResourceConfig; // Configuration for file upload paths
}

export interface DynamicTabbedFormRef {
  submit: () => Promise<void> | void;
  getModifiedFields: () => any;
  updateUploadedFiles: (fieldName: string, filesData: any[]) => void;
  removeUploadedFiles: (fieldName: string, filePaths: string[]) => void;
  handleFileUpload: (handledUploadFileData: FileUploadHandleEvent) => Promise<void>;
}

export const DynamicTabbedForm = forwardRef<DynamicTabbedFormRef, DynamicTabbedFormParams>((params, ref) => {
  let {
    tabsInfo,
    elementData,
    handlers,
    translationBasePath,
    fieldOptions,
    externalData,
    entityType,
    submitLabel,
    customHeaderConfig,
    enableUsernameValidation = true,
    onlyModifiedFields = false,
    submitErrorMessage,
    resourceConfig,
  } = params;

  const [relationshipsValues, setRelationshipsValues] = useState<{ [relationship: string]: any[] }>({});
  const [timeValues, setTimeValues] = useState<{ [relationship: string]: any }>({});
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [filesWrapperData, setFilesWrapperData] = useState<{ [fieldName: string]: any }>({});

  const { translateText } = useI18n();
  const formMethods = useForm({
    mode: 'onChange', // Validar en cada cambio
    reValidateMode: 'onChange', // Re-validar en cada cambio
  });

  const onSubmitNotImplemented = () => {
    console.warn('onSubmit is not implemented yet');
  };
  const onSubmit: any = handlers['onSubmit'] || onSubmitNotImplemented;

  const translateSubpage = (subpage: string) => {
    return translateText(`${translationBasePath}.subpages.${subpage}.name`);
  };
  const translateSection = (subpage: string, section: string) => {
    return section ? translateText(`${translationBasePath}.subpages.${subpage}.sections.${section}.name`) : undefined;
  };
  const translateAttribute = (subpage: string, section: string, attribute: string, suffix: string) => {
    return translateText(
      `${translationBasePath}.subpages.${subpage}.sections.${section}.attributes.${attribute}`,
      suffix
    );
  };
  // const getAttributeTitle = (subpageName: string, sectionName: string, attribute: AttributeConfiguration) => {
  //   let title: string = '';
  //   if (attribute.translationPath) {
  //     title = translateText(`${attribute.translationPath}.${attribute.name}`, attribute.labelChild);
  //   } else if (attribute.title) {
  //     title = attribute.title;
  //   } else {
  //     // if (attribute.useTranslation || attribute.emptyTitle === undefined || attribute.emptyTitle === false) {
  //     title = translateAttribute(subpageName, sectionName, attribute.name, attribute.labelChild);
  //   }

  //   return title;
  // };

  /**
   * Obtiene el título traducido de un atributo
   */
  const getAttributeTitle = (
    subpageName: string,
    sectionName: string,
    attribute: AttributeConfiguration
    // translationBasePath: string,
    // translateText: (path: string) => string
  ): string => {
    if (attribute.emptyTitle !== true) {
      if (attribute.translationPath) {
        const labelSuffix = attribute.labelChild ? `.${attribute.labelChild}` : '';
        return translateText(`${attribute.translationPath}.${attribute.name}${labelSuffix}`);
      }

      if (attribute.title) {
        return attribute.title;
      }

      if (attribute.useTranslation || attribute.emptyTitle === undefined) {
        return translateText(
          `${translationBasePath}.subpages.${subpageName}.sections.${sectionName}.attributes.${attribute.name}`
        );
      }
    }

    return '';
  };

  const generateSectionFormFields = (
    subpage: PageSection,
    section: ContentSection,
    componentDescriptor: ComponentDescriptor,
    componentIndex: number,
    handlers: any,
    formMethods: any,
    entityData: any
  ) => {
    // console.log('Generando secciones', relationshipsValues);

    const fields: JSX.Element[] = [];
    const {
      handleSubmit,
      formState: { errors },
    } = formMethods;

    // const fieldNameComponent = section.name || componentDescriptor?.formMetaData?.fieldName;
    const fieldNameComponent = componentDescriptor?.formMetaData?.fieldName;
    let componentParamsComponent = componentDescriptor?.formMetaData?.componentParams || {};
    let fieldExternalData = externalData || {};
    if (fieldExternalData && fieldExternalData[fieldNameComponent]) {
      componentParamsComponent = { ...componentParamsComponent, ...fieldExternalData[fieldNameComponent] };
    }
    // Preparar options y nestedOptions
    const fieldOption = fieldOptions?.[componentDescriptor?.formMetaData?.fieldName];
    const componentOptions = Array.isArray(fieldOption) ? fieldOption : [];
    const componentNestedOptions = fieldOption && !Array.isArray(fieldOption) ? fieldOption : undefined;

    const componentFieldData: DynamicFieldData = {
      inputType: 'text',
      fieldName: fieldNameComponent,
      // label: getAttributeTitle(subpage.name, section.name, attributeInfo),
      componentParams: componentParamsComponent,
      config: componentDescriptor?.formMetaData?.config || {},
      options: componentOptions,
      nestedOptions: componentNestedOptions,
      externalData: fieldExternalData[componentDescriptor?.formMetaData?.fieldName] || {},
    };

    let addComponentField = false;

    if (componentDescriptor.componentName === ComponentTypes.ATTRIBUTES_ICON_FIELDS) {
      (componentDescriptor.data?.attributes || [])
        .filter((attributeInfo: AttributeConfiguration) => isVisible(attributeInfo.formMetaData, entityData))
        .forEach((attributeInfo: AttributeConfiguration, index: number) => {
          const { formMetaData } = attributeInfo;

          let inputType: ControlType = formMetaData?.inputType || 'text';

          const socialNetwork = SocialNetworks[attributeInfo.name];
          if (inputType === 'text' && !!socialNetwork) {
            inputType = 'socialNetwork';
          }

          if (attributeInfo.name === 'description') {
            attributeInfo.emptyTitle = false;
          }

          const fieldName: string = attributeInfo.name;
          let currentValue: any;
          if (elementData) {
            if (attributeInfo.valueFieldName) {
              const dsPath = attributeInfo.valueFieldName.split('.') || [];
              const element = elementData;
              currentValue =
                dsPath.reduce((previous: any, current: any) => {
                  return previous ? previous[current as keyof typeof previous] : {};
                }, element) || {};
            } else {
              currentValue = elementData[fieldName as keyof typeof elementData] ?? formMetaData?.defaultValue;
            }
          } else {
            currentValue = formMetaData?.defaultValue;
          }

          if (['date', 'dateinterval', 'time'].includes(inputType)) {
            handlers = handlers ?? {};
            handlers[`${fieldName}_value_onchange`] = (value: any) => {
              timeValues[fieldName] = value;
            };

            formMetaData.config ??= {};
            formMetaData.config.value = timeValues[fieldName];
          }

          let componentParams = formMetaData?.componentParams || {};
          let fieldExternalData = externalData || {};
          if (fieldExternalData && fieldExternalData[fieldName]) {
            componentParams = { ...componentParams, ...fieldExternalData[fieldName] };
          }

          // Preparar options y nestedOptions
          const fieldOption = fieldOptions?.[attributeInfo.name];
          const attributeOptions = Array.isArray(fieldOption) ? fieldOption : [];
          const attributeNestedOptions = fieldOption && !Array.isArray(fieldOption) ? fieldOption : undefined;

          const fieldData: DynamicFieldData = {
            inputType,
            fieldName: attributeInfo.name,
            fieldNamePrefix: attributeInfo.namePrefix,
            label: getAttributeTitle(subpage.name, section.name, attributeInfo),
            componentParams,
            config: formMetaData?.config || {},
            options: attributeOptions,
            nestedOptions: attributeNestedOptions,
            defaultValue: currentValue,
            externalData: { ...fieldExternalData, elementData: entityData },
          };

          const field = (
            <DynamicControl
              fieldData={fieldData}
              errors={errors}
              handlers={handlers}
              key={`${attributeInfo.name}-${index}`}
            />
          );

          fields.push(field);
        });
    } else if (componentDescriptor?.formMetaData?.inputType === 'address') {
      componentFieldData.inputType = 'address';
      addComponentField = true;
    } else if (componentDescriptor.componentName === ComponentTypes.ARTS_GENRES) {
      componentFieldData.inputType = 'chipPicker';
      addComponentField = true;
    } else if (
      [ComponentTypes.IMAGE_GALLERY, ComponentTypes.HORIZONTAL_IMAGE_GALLERY].includes(
        componentDescriptor.componentName
      ) &&
      isVisible(componentDescriptor.formMetaData)
    ) {
      componentFieldData.inputType = 'file';
      addComponentField = true;
      componentFieldData.externalData = entityData?.[componentDescriptor?.formMetaData?.fieldName];
    } else if (componentDescriptor.componentName === ComponentTypes.PROFILE_THUMBNAIL_CARD) {
      componentFieldData.inputType = 'relationship';
      if (!!relationshipsValues && !Object.keys(relationshipsValues).find((key) => key === fieldNameComponent)) {
        relationshipsValues[fieldNameComponent] = [];
      }
      componentFieldData.externalData['relationshipSelectedOptions'] = relationshipsValues[fieldNameComponent];
      handlers[`${fieldNameComponent}_selection_changed`] = (selectedValues: any) => {
        relationshipsValues[fieldNameComponent] = selectedValues;
        componentFieldData.externalData['relationshipSelectedOptions'] = relationshipsValues[fieldNameComponent];
        componentFieldData.componentParams = { ...componentParamsComponent, ...fieldExternalData[fieldNameComponent] };
      };
      addComponentField = true;
    } else if (componentDescriptor.componentName === ComponentTypes.HTML_CONTENT) {
      componentFieldData.inputType = 'textarea';
      addComponentField = true;
    } else if (
      [ComponentTypes.IMAGE_GALLERY, ComponentTypes.DOCUMENT_FILE_VIEWER].includes(componentDescriptor.componentName)
    ) {
      componentFieldData.inputType = 'file';
      addComponentField = true;
      componentFieldData.externalData = entityData?.[componentDescriptor?.formMetaData?.fieldName];
    } else if (componentDescriptor.componentName === ComponentTypes.CUSTOM_OBJECT_LIST) {
      componentFieldData.inputType = 'customObjectList';
      addComponentField = true;
      componentFieldData.externalData = entityData?.[componentDescriptor?.formMetaData?.fieldName];
    }

    if (addComponentField) {
      const field = (
        <DynamicControl
          fieldData={componentFieldData}
          errors={errors}
          handlers={handlers}
          key={`${componentDescriptor?.formMetaData?.fieldName}-${componentIndex}`}
        />
      );

      fields.push(field);
    }
    return (
      <>
        <Stack spacing={2}>{fields}</Stack>
      </>
    );
  };

  const transformedConfig = (subpagesConfig: PageSection[], elementData?: EntityModel<EntityTemplate>) => {
    return (subpagesConfig || [])
      .filter(
        (subpageConfig) =>
          isVisible(subpageConfig.formMetaData, elementData) && isVisible(subpageConfig, elementData, 'fullyHidden')
      )
      .map((subpage, subPageIndex) => {
        return {
          name: subpage.title || translateSubpage(subpage.name),
          allowedRoles: subpage.allowedRoles,
          requireSession: subpage.requireSession,
          hideMainMenu: subpage.hideMainMenu,
          tabContent: () => {
            //   return <h1>asdasd {subPageIndex}</h1>;

            return (
              <>
                {(subpage.sections || [])
                  .filter((section) => isVisible(section.formMetaData, elementData))
                  .map((section, sectionIndex) => {
                    // Icon Detailed Attributes

                    let contentComponents: any = <></>;
                    if (section.components) {
                      contentComponents = (section.components || []).map(
                        (componentDescriptor: ComponentDescriptor, componentIndex: number) => (
                          <div key={`content-comp-${subPageIndex}-${sectionIndex || ''}-${componentIndex}`}>
                            {generateSectionFormFields(
                              subpage,
                              section,
                              componentDescriptor,
                              componentIndex,
                              handlers,
                              formMethods,
                              elementData
                            )}
                          </div>
                        )
                      );
                    }

                    const sectionContent = () => <div style={{ paddingTop: '1rem' }}>{contentComponents}</div>;

                    const filteredSections = (subpage.sections || []).filter((section) =>
                      isVisible(section.formMetaData, elementData)
                    );

                    return (
                      <SectionsPanel
                        sectionName={!section?.emptyTitle ? translateSection(subpage.name, section?.name) : undefined}
                        sectionContent={sectionContent}
                        isCollapsible={filteredSections.length > 1}
                        key={`${subpage.name}-${section?.name}`}
                      />
                    );
                  })}
              </>
            );
          },
        };
      });
  };

  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    getValues,
    setFocus,
  } = formMethods;

  // Función para obtener solo los campos modificados
  const getModifiedFields = () => {
    const allValues = getValues();
    const modifiedData: any = {};

    // Agregar campos marcados como dirty por react-hook-form
    Object.keys(dirtyFields).forEach((key) => {
      modifiedData[key] = allValues[key];
    });

    // Buscar campos de tipo File o FileList que tengan valor aunque no estén en dirtyFields
    Object.keys(allValues).forEach((key) => {
      const value = allValues[key];
      // Verificar si es un File o FileList con contenido
      if (
        value &&
        (value instanceof File || value instanceof FileList || (value && value.constructor?.name === 'File'))
      ) {
        // Solo agregarlo si no está ya en modifiedData
        if (!modifiedData[key]) {
          modifiedData[key] = value;
        }
      }
    });

    // Agregar archivos que fueron subidos y están en filesWrapperData
    // Estos son archivos que se subieron mediante FileUpload y se guardaron en state
    if (filesWrapperData && Object.keys(filesWrapperData).length > 0) {
      Object.keys(filesWrapperData).forEach((key) => {
        modifiedData[key] = filesWrapperData[key];
      });
    }

    return modifiedData;
  };

  // Funciones para manejar archivos subidos
  const updateUploadedFiles = (fieldName: string, filesData: any[]) => {
    const previousData = filesWrapperData[fieldName] || [];
    setFilesWrapperData((prev) => ({
      ...prev,
      [fieldName]: [...previousData, ...filesData],
    }));
  };

  const removeUploadedFiles = (fieldName: string, filePaths: string[]) => {
    setFilesWrapperData((prev) => {
      const currentFiles = prev[fieldName] || [];
      const updatedFiles = currentFiles.filter((file: any) => !filePaths.includes(file.path));

      if (updatedFiles.length === 0) {
        const { [fieldName]: removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [fieldName]: updatedFiles,
      };
    });
  };

  // Helper functions for file upload handling
  const updateFileUploadAddElements = (filesData: UploadFileToServerResponse[], fieldName: string) => {
    const extractFilesDataPaths = filesData?.map((fileData: any) => {
      return {
        src: `s3://${fileData.customPath}`,
        path: fileData?.customPath,
        fileName: fileData?.fileName,
      };
    });
    updateUploadedFiles(fieldName, extractFilesDataPaths);
  };

  const findRemovalFilesPath = (files: any[], fieldName: string) => {
    const filePaths: string[] = [];
    files.forEach((file) => {
      filePaths.push(file.path);
    });
    return filePaths;
  };

  const updateFileUploadRemoveElements = (paths: string[], fieldName: string) => {
    removeUploadedFiles(fieldName, paths);
  };

  // Generic file upload handler
  const handleFileUpload = async (handledUploadFileData: FileUploadHandleEvent) => {
    if (!resourceConfig) {
      console.warn('resourceConfig is not provided. File upload cannot proceed.');
      return;
    }

    const { files, optionType, destinationPath, fieldName } = handledUploadFileData;
    const uploadPath = `${resourceConfig.resourceType}/${resourceConfig.identifier}${destinationPath}`;

    if (optionType === FileUploaderOptions.addItem) {
      const responses = await uploadFilesToServer({
        files,
        path: uploadPath,
      });
      if (responses?.length > 0) {
        updateFileUploadAddElements(responses, fieldName);
      }
    } else if (optionType === FileUploaderOptions.removeItem) {
      const findPaths = findRemovalFilesPath(files, fieldName);
      const responses = await removeFilesFromServer({ paths: findPaths });
      if (responses?.length > 0) {
        updateFileUploadRemoveElements(findPaths, fieldName);
      }
    }
  };

  // Automatically inject the file upload handler if resourceConfig is provided
  if (resourceConfig && !handlers['fileUploadfilesChanged']) {
    handlers['fileUploadfilesChanged'] = handleFileUpload;
  }

  // Exponer métodos al ref
  useImperativeHandle(ref, () => ({
    submit: async () => {
      return new Promise<void>((resolve, reject) => {
        handleSubmit(
          async (data) => {
            try {
              await handleFormSubmit(data);
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          (errors) => {
            handleFormErrors(errors);
            reject(new Error('Form validation failed'));
          }
        )();
      });
    },
    getModifiedFields,
    updateUploadedFiles,
    removeUploadedFiles,
    handleFileUpload,
  }));

  // 🔍 Logging de errores para debugging
  const handleFormSubmit = async (data: any) => {
    setHasValidationErrors(false);
    let dataToSubmit = onlyModifiedFields ? getModifiedFields() : data;

    // Combinar con filesWrapperData (archivos subidos mediante FileUpload)
    if (filesWrapperData && Object.keys(filesWrapperData).length > 0) {
      dataToSubmit = {
        ...dataToSubmit,
        ...filesWrapperData,
      };
    }

    return await onSubmit(dataToSubmit);
  };

  const handleFormErrors = (errors: any) => {
    setHasValidationErrors(true);

    const firstErroredField = Object.keys(errors || {})[0];
    if (!firstErroredField) {
      window.scrollTo(0, 0);
      return;
    }

    try {
      setFocus(firstErroredField, { shouldSelect: false });
    } catch (error) {
      window.scrollTo(0, 0);
      return;
    }

    document
      .getElementsByName(firstErroredField)?.[0]
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // customHeaderConfig = undefined;

  if (entityType === AppUserModel.name) {
    // Capturar el username original del usuario (si existe)
    const originalUsername = elementData?.['username' as keyof typeof elementData] as string | undefined;

    customHeaderConfig = [
      // {
      //   name: 'name',
      //   label: 'Nombre',
      //   config: { required: false, minLength: 3 },
      //   showEditableField: false,
      //   renderField: 'nameKnownAs',
      // },
      { name: 'subtitle', label: 'Subtitle' },
      {
        name: 'username',
        label: 'username',
        showEditableField: true, // Mostrar el campo editable desde el inicio
        config: {
          required: true,
          minLength: 3,
          pattern: {
            value: USERNAME_FORMAT_PATTERN,
            message: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ERROR_CODES}.VALIDATION_USERNAME_FORMAT`),
          },
          ...(enableUsernameValidation && {
            validate: {
              available: createDebouncedUsernameValidation(originalUsername),
            },
          }),
        },
      },
    ];
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, handleFormErrors)} noValidate className="fullwidth">
      <FormProvider {...formMethods}>
        <div className="place-container">
          {/* {profileHeaderComponent || <ProfileHeader element={entityData} />} */}
          {entityType && (
            <ProfileHeader
              element={elementData}
              formMethods={formMethods}
              customHeaderConfig={customHeaderConfig}
              enableUsernameValidation={enableUsernameValidation}
            />
          )}
          <TabbedPanel
            rawConfig={tabsInfo}
            configTransformer={(config: PageSection[]) => transformedConfig(config, elementData)}
          />
        </div>
      </FormProvider>
      {hasValidationErrors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY}.forms.errors.validation_error`)}
        </Alert>
      )}
      {submitErrorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitErrorMessage}
        </Alert>
      )}
      <Button type="submit" variant="contained" fullWidth>
        {translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.${submitLabel || 'submit'}`)}
      </Button>
    </form>
  );
});

DynamicTabbedForm.displayName = 'DynamicTabbedForm';

export const findFieldMetadata = (fieldName: string, fieldsForm: any) => {
  let searchedField: any;
  fieldsForm.forEach((tabInfo: any) => {
    tabInfo.sections.forEach((section: any) => {
      if (!searchedField) {
        searchedField = section.fields.find((fieldData: any) => fieldData.fieldName === fieldName);
      }
    });
  });
  return searchedField;
};

export const setOptionsToField = (fieldName: string, options: SelectOption[], fieldsForm: any) => {
  const field = findFieldMetadata(fieldName, fieldsForm);
  if (field) {
    field.options = options;
  }
};
