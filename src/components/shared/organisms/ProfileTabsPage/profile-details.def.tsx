export enum ProfileComponentTypes {
  ATTRIBUTES_ICON_FIELDS,
  CALENDAR_SIMPLE_LAYOUT,
  HTML_CONTENT,
  IMAGE_GALLERY,
  MAP,
  PROFILE_THUMBNAIL_CARD,
}
export interface ProfileDetailsSubpage {
  name: string;
  sections?: ProfileDetailsSubpageSection[];
  requireSession?: boolean;
  clickHandlerName?: string;
}
export interface ProfileDetailsSubpageSection {
  id?: string;
  name?: string;
  attributes?: ProfileDetailAttributeConfiguration[];
  components?: ProfileComponentDescriptor[];
  requireSession?: boolean;
  clickHandlerName?: string;
}

export interface ProfileComponentDescriptor {
  componentName: ProfileComponentTypes;
  data?: any;
  clickHandlerName?: string;
  requireSession?: boolean;
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

  title?: string;

  useTranslation?: boolean;
}
