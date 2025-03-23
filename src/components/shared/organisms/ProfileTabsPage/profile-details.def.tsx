import { RegisterOptions } from 'react-hook-form';
import { AllowedEntityRole } from '~/components/shared/atoms/app/auth/RequiredAuth';
import { ControlType } from '../gui/dynamicForms';

export enum ProfileComponentTypes {
  ATTRIBUTES_ICON_FIELDS,
  CALENDAR_SIMPLE_LAYOUT,
  ARTS_GENRES,
  CREW_LIST_VIEW,
  DISCOGRAPHY_LIST_VIEW,
  TOP_TRACKS_LIST_VIEW,
  HTML_CONTENT,
  IMAGE,
  IMAGE_GALLERY,
  HORIZONTAL_IMAGE_GALLERY,
  PROFILE_FOLLOWERS_COMPONENT,
  MAP,
  SOCIAL_NETWORK_WIDGET,
  TABLE,
  TITLE,
  PROFILE_THUMBNAIL_CARD,
  EVENT_THUMBNAIL_CARD,
  VISITED_COUNTRIES_CITIES_LIST_VIEW,
}
export interface ProfileDetailsSubpage {
  name: string;
  title?: string;
  sections?: ProfileDetailsSubpageSection[];
  allowedRoles?: AllowedEntityRole[];
  requireSession?: boolean;
  clickHandlerName?: string;
  formMetaData?: FormMetadata;
  hideMainMenu?: boolean;
}
export interface ProfileDetailsSubpageSection {
  id?: string;
  name?: string;
  attributes?: ProfileDetailAttributeConfiguration[];
  components?: ProfileComponentDescriptor[];
  hidden?: boolean | Function;
  requireSession?: boolean;
  allowedRoles?: AllowedEntityRole[];
  clickHandlerName?: string;
  formMetaData?: FormMetadata;
}

export interface ProfileComponentDescriptor {
  componentName: ProfileComponentTypes;
  data?: any;
  data_source?: any;
  clickHandlerName?: string;
  requireSession?: boolean;
  formMetaData?: FormMetadata;
}
export interface ProfileDetailAttributeConfiguration {
  name: string;

  hidden?: boolean;

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

  translationPath?: string;

  value?: Function | string | number;

  formMetaData?: FormMetadata;
}

export interface FormMetadata {
  inputType?: ControlType;
  fieldName?: string;
  componentParams?: any;
  config?: RegisterOptions;
  defaultValue?: any;
  createForm?: FormMetadata;
  editForm?: FormMetadata;
  hidden?: boolean;
  externalData?: any;
}
