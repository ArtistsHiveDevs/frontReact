import { AllowedEntityRole } from "~/components/shared/atoms/app/auth/RequiredAuth";

export enum ProfileComponentTypes {
  ATTRIBUTES_ICON_FIELDS,
  CALENDAR_SIMPLE_LAYOUT,
  ARTS_GENRES,
  HTML_CONTENT,
  IMAGE,
  IMAGE_GALLERY,
  MAP,
  SOCIAL_NETWORK_WIDGET,
  TITLE,
  PROFILE_THUMBNAIL_CARD,
}
export interface ProfileDetailsSubpage {
  name: string;
  sections?: ProfileDetailsSubpageSection[];
  allowedRoles?: AllowedEntityRole[];
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
