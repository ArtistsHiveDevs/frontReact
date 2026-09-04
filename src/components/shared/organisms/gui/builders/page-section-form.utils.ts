import { DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms/dynamic-control-types';
import { AttributeConfiguration, PageSection } from './component-types.def';

/**
 * Extracts all field names from a PageSection by traversing its sections → components → attributes.
 * Used to validate a specific step/section in a multi-step form.
 */
export const getFieldNamesFromPageSection = (pageSection: PageSection): string[] => {
  const fieldNames: string[] = [];
  for (const section of pageSection.sections || []) {
    for (const component of section.components || []) {
      for (const attr of component.data?.attributes || []) {
        fieldNames.push(attr.name);
      }
    }
  }
  return fieldNames;
};

/**
 * Converts an AttributeConfiguration (from a PageSection config) into a DynamicFieldData
 * suitable for rendering with DynamicControl in form mode.
 */
export const attributeToDynamicField = (attr: AttributeConfiguration): DynamicFieldData => {
  const meta = attr.formMetaData;
  return {
    fieldName: attr.name,
    inputType: meta?.inputType || 'text',
    config: meta?.config,
    defaultValue: meta?.defaultValue,
    componentParams: meta?.componentParams,
    placeholder: meta?.componentParams?.placeholder,
    options: meta?.componentParams?.options,
    label: attr.title,
  };
};

/**
 * Extracts all AttributeConfiguration entries from a PageSection,
 * flattened across all sections and components.
 */
export const getAttributesFromPageSection = (pageSection: PageSection): AttributeConfiguration[] => {
  const attrs: AttributeConfiguration[] = [];
  for (const section of pageSection.sections || []) {
    for (const component of section.components || []) {
      for (const attr of component.data?.attributes || []) {
        attrs.push(attr);
      }
    }
  }
  return attrs;
};

/**
 * Converts a PageSection into an array of DynamicFieldData for use with DynamicForm.
 * Extracts all attributes from ATTRIBUTES_ICON_FIELDS components and converts them.
 */
export const pageSectionToDynamicFields = (pageSection: PageSection): DynamicFieldData[] => {
  const attrs = getAttributesFromPageSection(pageSection);
  return attrs.map(attributeToDynamicField);
};
