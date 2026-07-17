import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { I18nPaths, useI18n } from '~/common/utils';
import { createDebouncedUsernameValidation } from '~/common/utils/validation/username-validation';
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
import { ControlType, DynamicFieldData, SelectOption } from './dynamic-control-types';

export interface DynamicTabbedFormParams {
  tabsInfo: PageSection[];
  handlers: { onSubmit: Function; [handlerName: string]: Function };
  translationBasePath: string;
  entityType?: string;
  profileHeaderComponent?: any;
  elementData?: EntityModel<EntityTemplate>;
  fieldOptions?: { [fieldName: string]: any };
  externalData?: { [fieldName: string]: any };
  customHeaderConfig?: any;
  submitLabel?: string;
  enableUsernameValidation?: boolean;
}
export const DynamicTabbedForm = (params: DynamicTabbedFormParams) => {
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
  } = params;

  const [relationshipsValues, setRelationshipsValues] = useState<{ [relationship: string]: any[] }>({});
  const [timeValues, setTimeValues] = useState<{ [relationship: string]: any }>({});

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
  const getAttributeTitle = (subpageName: string, sectionName: string, attribute: AttributeConfiguration) => {
    let title: string = '';
    if (attribute.translationPath) {
      title = translateText(`${attribute.translationPath}.${attribute.name}`, attribute.labelChild);
    } else if (attribute.title) {
      title = attribute.title;
    } else {
      // if (attribute.useTranslation || attribute.emptyTitle === undefined || attribute.emptyTitle === false) {
      title = translateAttribute(subpageName, sectionName, attribute.name, attribute.labelChild);
    }

    return title;
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

    const fieldNameComponent = section.name || componentDescriptor?.formMetaData?.fieldName;
    let componentParamsComponent = componentDescriptor?.formMetaData?.componentParams || {};
    let fieldExternalData = externalData || {};
    if (fieldExternalData && fieldExternalData[fieldNameComponent]) {
      componentParamsComponent = { ...componentParamsComponent, ...fieldExternalData[fieldNameComponent] };
    }
    const componentFieldData: DynamicFieldData = {
      inputType: 'text',
      fieldName: fieldNameComponent,
      // label: getAttributeTitle(subpage.name, section.name, attributeInfo),
      componentParams: componentParamsComponent,
      config: componentDescriptor?.formMetaData?.config || {},
      options: fieldOptions[componentDescriptor?.formMetaData?.fieldName] || [],
      externalData: fieldExternalData[componentDescriptor?.formMetaData?.fieldName] || {},
    };

    let addComponentField = false;

    if (componentDescriptor.componentName === ComponentTypes.ATTRIBUTES_ICON_FIELDS) {
      (componentDescriptor.data?.attributes || [])
        .filter(
          (attributeInfo: AttributeConfiguration) =>
            attributeInfo.formMetaData?.hidden === undefined ||
            (typeof attributeInfo.formMetaData?.hidden === 'boolean' && !attributeInfo.formMetaData?.hidden) ||
            (typeof attributeInfo.formMetaData?.hidden === 'string' && attributeInfo.formMetaData?.hidden !== 'true') ||
            ((attributeInfo.formMetaData?.hidden as unknown) instanceof Function &&
              entityData &&
              !(attributeInfo.formMetaData!.hidden as unknown as Function)(entityData))
        )
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

          const fieldData: DynamicFieldData = {
            inputType,
            fieldName: attributeInfo.name,
            fieldNamePrefix: attributeInfo.namePrefix,
            label: getAttributeTitle(subpage.name, section.name, attributeInfo),
            componentParams,
            config: formMetaData?.config || {},
            options: fieldOptions[attributeInfo.name] || [],
            defaultValue: currentValue,
            externalData: fieldExternalData,
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
    } else if (componentDescriptor.componentName === ComponentTypes.IMAGE_GALLERY) {
      componentFieldData.inputType = 'file';
      addComponentField = true;
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
      .filter((subpageConfig) => subpageConfig.formMetaData?.hidden !== true && !subpageConfig.fullyHidden)
      .map((subpage, subPageIndex) => {
        return {
          name: subpage.title || translateSubpage(subpage.name),
          allowedRoles: subpage.allowedRoles,
          requireSession: subpage.requireSession,
          tabContent: () => {
            //   return <h1>asdasd {subPageIndex}</h1>;

            return (
              <>
                {(subpage.sections || [])
                  .filter((subpage) => subpage.formMetaData?.hidden !== true)
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

                    const filteredSections = (subpage.sections || []).filter(
                      (section) => section.formMetaData?.hidden !== true
                    );

                    return (
                      <SectionsPanel
                        sectionName={translateSection(subpage.name, section?.name)}
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
    formState: { errors },
  } = formMethods;

  // 🔍 Logging de errores para debugging
  const handleFormSubmit = (data: any) => {
    return onSubmit(data);
  };

  const handleFormErrors = (errors: any) => {
    window.scrollTo(0, 0);
    // console.log('❌ Form validation failed. Errors by field:');
    // console.table(
    //   Object.entries(errors).map(([fieldName, error]: [string, any]) => ({
    //     Campo: fieldName,
    //     Mensaje: error?.message || 'Error sin mensaje',
    //     Tipo: error?.type || 'unknown',
    //   }))
    // );
    // console.log('Full errors object:', errors);
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
      <Button type="submit" variant="contained" fullWidth>
        {translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.${submitLabel || 'submit'}`)}
      </Button>
    </form>
  );
};

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
