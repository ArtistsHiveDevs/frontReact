import { EntityModel, EntityTemplate } from '~/models/base';
import {
  ComponentDescriptor,
  ComponentTypes,
  PageSection,
  ContentSection,
} from '../component-types.def';

/**
 * Parámetros base que reciben todos los builders
 */
export interface ComponentBuilderParams {
  /** Descriptor del componente a construir */
  componentDescriptor: ComponentDescriptor;

  /** Configuración de la subpage actual */
  subpage: PageSection;

  /** Configuración de la sección actual */
  section: ContentSection;

  /** Índice del componente en la sección */
  componentIndex: number;

  /** Entidad principal del perfil */
  entityData: EntityModel<EntityTemplate>;

  /** Data source opcional (para componentes anidados) */
  parentDataSource?: EntityModel<EntityTemplate>;

  /** Handlers de eventos del contexto */
  handlers?: { [handlerName: string]: Function };

  /** Path base para traducciones */
  translationBasePath: string;
}

/**
 * Función que construye un componente React
 */
export type ComponentBuilderFunction = (params: ComponentBuilderParams) => JSX.Element;

/**
 * Registro de builders por tipo de componente
 */
export type BuilderRegistry = {
  [key in ComponentTypes]?: ComponentBuilderFunction;
};
