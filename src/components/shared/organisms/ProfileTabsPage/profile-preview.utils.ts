import {
  AttributeConfiguration,
  ComponentDescriptor,
  ContentSection,
  PageSection,
} from '~/components/shared/organisms/gui/builders/component-types.def';

export type ProfilePreviewSectionConfig = true | string[];

export type ProfilePreviewPageConfig = true | { [sectionName: string]: ProfilePreviewSectionConfig };

export interface ProfilePreviewConfig {
  [pageName: string]: ProfilePreviewPageConfig;
}

const filterComponents = (
  components: ComponentDescriptor[] | undefined,
  attributeNames: string[]
): ComponentDescriptor[] =>
  (components || [])
    .map((component) => {
      const attributes: AttributeConfiguration[] | undefined = component.data?.attributes;
      if (!attributes) {
        return undefined;
      }
      const filteredAttributes = attributes.filter((attribute) => attributeNames.includes(attribute.name));
      return filteredAttributes.length
        ? { ...component, data: { ...component.data, attributes: filteredAttributes } }
        : undefined;
    })
    .filter(Boolean);

const filterSection = (
  section: ContentSection,
  sectionConfig: ProfilePreviewSectionConfig
): ContentSection | undefined => {
  if (sectionConfig === true) {
    return section;
  }

  const components = filterComponents(section.components, sectionConfig);
  const attributes = (section.attributes || []).filter((attribute) => sectionConfig.includes(attribute.name));

  return components.length || attributes.length
    ? { ...section, components, attributes: section.attributes ? attributes : undefined }
    : undefined;
};

export const filterProfileSubpagesConfig = (
  subpagesConfig: PageSection[],
  previewConfig?: ProfilePreviewConfig
): PageSection[] => {
  if (!previewConfig) {
    return subpagesConfig;
  }

  return (subpagesConfig || [])
    .filter((page) => !!previewConfig[page.name])
    .map((page) => {
      const pageConfig = previewConfig[page.name];
      if (pageConfig === true) {
        return page;
      }

      const sections = (page.sections || [])
        .filter((section) => !!pageConfig[section.name])
        .map((section) => filterSection(section, pageConfig[section.name]))
        .filter(Boolean);

      return sections.length ? { ...page, sections } : undefined;
    })
    .filter(Boolean);
};
