export enum ProfileComponentTypes {
  ATTRIBUTES_ICON_FIELDS,
  MAP,
}
export interface ProfileDetailsSubpage {
  name: string;
  sections?: ProfileDetailsSubpageSection[];
}
export interface ProfileDetailsSubpageSection {
  name: string;
  attributes?: ProfileDetailAttributeConfiguration[];
  components?: ProfileComponentDescriptor[];
}

export interface ProfileComponentDescriptor {
  componentName: ProfileComponentTypes;
  data?: any;
}
export interface ProfileDetailAttributeConfiguration {
  name: string;
  icon?: string;
  emptyTitle?: boolean;
  literal?: boolean;
}
