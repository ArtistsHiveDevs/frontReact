import {
  AttributeConfiguration,
  ComponentDescriptor,
  ComponentTypes,
  PageSection,
} from '~/components/shared/organisms/gui/builders/component-types.def';
import { ApplicationFormConfig } from './open-call.model';

/**
 * Convierte ApplicationFormConfig a PageSection[] para usar con DynamicTabbedForm
 * @param formConfig - Configuración del formulario de aplicación
 * @param translationBasePath - Base path para traducciones (opcional)
 * @returns Array de PageSection compatible con DynamicTabbedForm
 */
export const buildApplicationFormSections = (
  formConfig: ApplicationFormConfig,
  translationBasePath?: string
): PageSection[] => {
  return formConfig.sections
    .sort((a, b) => a.order - b.order)
    .map((section) => {
      const attributes: AttributeConfiguration[] = section.fields
        .sort((a, b) => a.order - b.order)
        .map((field) => ({
          name: field.fieldName,
          title: field.label,
          translationPath: field.translationPath,
          hidden: field.hidden,
          formMetaData: {
            inputType: field.inputType,
            fieldName: field.fieldName,
            componentParams: field.componentParams,
            config: {
              required: field.required,
              ...field.config,
            },
            defaultValue: field.defaultValue,
          },
        }));

      const componentDescriptor: ComponentDescriptor = {
        componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
        data: {
          attributes,
        },
      };

      return {
        name: section.id,
        title: section.name,
        sections: [
          {
            name: section.id,
            components: [componentDescriptor],
          },
        ],
      };
    });
};

/**
 * Crea una configuración de formulario predeterminada para aplicaciones
 * Incluye campos básicos comunes a todas las convocatorias
 * @returns ApplicationFormConfig con campos predeterminados
 */
export const createDefaultApplicationFormConfig = (): ApplicationFormConfig => {
  return {
    sections: [
      {
        id: 'basic_info',
        name: 'Información Básica',
        order: 1,
        fields: [
          {
            id: 'artist_bio',
            inputType: 'textarea',
            fieldName: 'artist_bio',
            translationPath: 'OpenCallPages.application_form.fields.artist_bio',
            required: false,
            order: 1,
            componentParams: {
              multiline: true,
              rows: 5,
            },
            config: {
              maxLength: 1000,
            },
          },
          {
            id: 'portfolio_link',
            inputType: 'url',
            fieldName: 'portfolio_link',
            translationPath: 'OpenCallPages.application_form.fields.portfolio_link',
            required: false,
            order: 2,
          },
        ],
      },
    ],
  };
};

/**
 * Valida que una configuración de formulario sea válida
 * @param formConfig - Configuración a validar
 * @returns true si es válida, false en caso contrario
 */
export const validateApplicationFormConfig = (formConfig: ApplicationFormConfig): boolean => {
  if (!formConfig || !formConfig.sections || formConfig.sections.length === 0) {
    return false;
  }

  for (const section of formConfig.sections) {
    if (!section.id || !section.fields || section.fields.length === 0) {
      return false;
    }

    for (const field of section.fields) {
      if (!field.id || !field.fieldName || !field.inputType) {
        return false;
      }
    }
  }

  return true;
};
