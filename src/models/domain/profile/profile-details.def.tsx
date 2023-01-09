export enum ProfileComponentTypes {
  ATTRIBUTES_ICON_FIELDS,
  IMAGE_GALLERY,
  MAP,
}
export interface ProfileDetailsSubpage {
  name: string;
  sections?: ProfileDetailsSubpageSection[];
  requireSession?: boolean;
  clickHandlerName?: string;
}
export interface ProfileDetailsSubpageSection {
  name: string;
  attributes?: ProfileDetailAttributeConfiguration[];
  components?: ProfileComponentDescriptor[];
  requireSession?: boolean;
  clickHandlerName?: string;
}

export interface ProfileComponentDescriptor {
  componentName: ProfileComponentTypes;
  data?: any;
  clickHandlerName?: string;
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
