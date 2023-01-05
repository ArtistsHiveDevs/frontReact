export enum ProfileComponentTypes {
  ATTRIBUTES_ICON_FIELDS,
  MAP,
}
export interface ProfileDetailsSubpage {
  name: string;
  sections?: ProfileDetailsSubpageSection[];
  requireSession?: boolean;
}
export interface ProfileDetailsSubpageSection {
  name: string;
  attributes?: ProfileDetailAttributeConfiguration[];
  components?: ProfileComponentDescriptor[];
  requireSession?: boolean;
}

export interface ProfileComponentDescriptor {
  componentName: ProfileComponentTypes;
  data?: any;
}
export interface ProfileDetailAttributeConfiguration {
  name: string;

  /**
   *
   */
  icon?: string;

  /**
   *
   */
  emptyTitle?: boolean;

  /**
   * If true the name will be used literally as the Label
   */
  literal?: boolean;

  /**
   *
   */
  requireSession?: boolean;
}
