import { RegisterOptions } from 'react-hook-form';
import { AllowedEntityRole } from '~/components/shared/atoms/app/auth/RequiredAuth';
import { ControlType } from '~/components/shared/organisms/gui/dynamicForms';

export enum ComponentTypes {
  ATTRIBUTES_ICON_FIELDS,
  CALENDAR_SIMPLE_LAYOUT,
  ARTS_GENRES,
  CREW_LIST_RIDER_VIEW,
  DISCOGRAPHY_LIST_VIEW,
  TOP_TRACKS_LIST_VIEW,
  HTML_CONTENT,
  IMAGE,
  IMAGE_GALLERY,
  HORIZONTAL_IMAGE_GALLERY,
  PROFILE_FOLLOWERS_COMPONENT,
  MAP,
  SOCIAL_NETWORK_WIDGET,
  SOCIAL_NETWORK_CHARTMETRIC_ANALYTICS_WIDGET,
  TABLE,
  TITLE,
  PROFILE_THUMBNAIL_CARD,
  EVENT_THUMBNAIL_CARD,
  VISITED_COUNTRIES_CITIES_LIST_VIEW,
}
export interface PageSection {
  name: string;
  title?: string;
  sections?: ContentSection[];
  allowedRoles?: AllowedEntityRole[];
  requireSession?: boolean;
  clickHandlerName?: string;
  formMetaData?: FormMetadata;
  hideMainMenu?: boolean;
}
export interface ContentSection {
  id?: string;
  name?: string;
  emptyTitle?: boolean;
  attributes?: AttributeConfiguration[];
  components?: ComponentDescriptor[];
  hidden?: boolean | Function;
  requireSession?: boolean;
  allowedRoles?: AllowedEntityRole[];
  clickHandlerName?: string;
  formMetaData?: FormMetadata;
}

export interface ComponentDescriptor {
  componentName: ComponentTypes;
  data?: any;
  data_source?: any;
  clickHandlerName?: string;
  requireSession?: boolean;
  formMetaData?: FormMetadata;
}
export interface AttributeConfiguration {
  name: string;
  namePrefix?: string;
  labelChild?: string;

  valueFieldName?: string;

  hidden?: boolean | Function;

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

  /**
   * Componentes anidados (para atributos con componentes complejos)
   */
  components?: ComponentDescriptor[];

  formMetaData?: FormMetadata;
}

export interface FormMetadata {
  inputType?: ControlType;
  fieldName?: string;
  namePrefix?: string;
  componentParams?: any;
  config?: RegisterOptions;
  defaultValue?: any;
  createForm?: FormMetadata;
  editForm?: FormMetadata;
  hidden?: boolean;
  externalData?: any;
}
