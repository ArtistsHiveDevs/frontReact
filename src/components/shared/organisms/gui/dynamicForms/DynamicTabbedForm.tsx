import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { I18nPaths, useI18n } from '~/common/utils';
import { SectionsPanel } from '~/components/shared/layout/SectionPanel';
import { TabbedPanel } from '~/components/shared/layout/TabbedPanel';
import { ProfileHeader } from '~/components/shared/molecules/Profile/ProfileHeader';
import { SocialNetworks } from '~/constants/social-networks.const';
import { AppUserModel } from '~/models/app/user/user.model';
import { EntityModel, EntityTemplate } from '~/models/base';
import {
  ProfileComponentDescriptor,
  ProfileComponentTypes,
  ProfileDetailAttributeConfiguration,
  ProfileDetailsSubpage,
  ProfileDetailsSubpageSection,
} from '../../ProfileTabsPage/profile-details.def';
import { DynamicControl } from './DynamicControl';
import { ControlType, DynamicFieldData, SelectOption } from './dynamic-control-types';

export interface DynamicTabbedFormParams {
  tabsInfo: ProfileDetailsSubpage[];
  handlers: { onSubmit: Function; [handlerName: string]: Function };
  translationBasePath: string;
  entityType?: string;
  profileHeaderComponent?: any;
  elementData?: EntityModel<EntityTemplate>;
  fieldOptions?: { [fieldName: string]: any };
  externalData?: { [fieldName: string]: any };
  customHeaderConfig?: any;
  submitLabel?: string;
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
  } = params;

  const [relationshipsValues, setRelationshipsValues] = useState<{ [relationship: string]: any[] }>({});
  const [timeValues, setTimeValues] = useState<{ [relationship: string]: any }>({});

  const { translateText } = useI18n();
  const formMethods = useForm();

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
  const translateAttribute = (subpage: string, section: string, attribute: string) => {
    return translateText(`${translationBasePath}.subpages.${subpage}.sections.${section}.attributes.${attribute}`);
  };
  const getAttributeTitle = (
    subpageName: string,
    sectionName: string,
    attribute: ProfileDetailAttributeConfiguration
  ) => {
    let title: string = '';
    if (attribute.translationPath) {
      title = translateText(`${attribute.translationPath}.${attribute.name}`);
    } else if (attribute.title) {
      title = attribute.title;
    } else {
      // if (attribute.useTranslation || attribute.emptyTitle === undefined || attribute.emptyTitle === false) {
      title = translateAttribute(subpageName, sectionName, attribute.name);
    }

    return title;
  };

  const generateSectionFormFields = (
    subpage: ProfileDetailsSubpage,
    section: ProfileDetailsSubpageSection,
    componentDescriptor: ProfileComponentDescriptor,
    componentIndex: number,
    handlers: any,
    formMethods: any
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

    if (componentDescriptor.componentName === ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS) {
      (componentDescriptor.data?.attributes || [])
        .filter((attributeInfo: ProfileDetailAttributeConfiguration) => attributeInfo.formMetaData?.hidden !== true)
        .forEach((attributeInfo: ProfileDetailAttributeConfiguration, index: number) => {
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
              currentValue = elementData[fieldName as keyof typeof elementData];
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
    } else if (componentDescriptor.componentName === ProfileComponentTypes.ARTS_GENRES) {
      componentFieldData.inputType = 'chipPicker';
      addComponentField = true;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.IMAGE_GALLERY) {
      componentFieldData.inputType = 'file';
      addComponentField = true;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.PROFILE_THUMBNAIL_CARD) {
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
    } else if (componentDescriptor.componentName === ProfileComponentTypes.HTML_CONTENT) {
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

  const transformedConfig = (subpagesConfig: ProfileDetailsSubpage[], elementData?: EntityModel<EntityTemplate>) => {
    return (subpagesConfig || [])
      .filter((subpageConfig) => subpageConfig.formMetaData?.hidden !== true)
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
                        (componentDescriptor: ProfileComponentDescriptor, componentIndex: number) => (
                          <div key={`content-comp-${subPageIndex}-${sectionIndex || ''}-${componentIndex}`}>
                            {generateSectionFormFields(
                              subpage,
                              section,
                              componentDescriptor,
                              componentIndex,
                              handlers,
                              formMethods
                            )}
                          </div>
                        )
                      );
                    }

                    const sectionContent = () => contentComponents;

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
    // console.log('✅ Form submitted successfully with data:', data);
    return onSubmit(data);
  };

  const handleFormErrors = (errors: any) => {
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
        config: { required: true, minLength: 3 },
      },
    ];
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, handleFormErrors)} noValidate className="fullwidth">
      <FormProvider {...formMethods}>
        <div className="place-container">
          {/* {profileHeaderComponent || <ProfileHeader element={entityData} />} */}
          {entityType && (
            <ProfileHeader element={elementData} formMethods={formMethods} customHeaderConfig={customHeaderConfig} />
          )}
          <TabbedPanel tabs={transformedConfig(tabsInfo, elementData)} />
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
