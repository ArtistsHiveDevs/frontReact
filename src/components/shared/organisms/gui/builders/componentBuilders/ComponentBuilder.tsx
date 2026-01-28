import { ComponentTypes } from '../component-types.def';
import { ComponentBuilderParams, ComponentBuilderFunction, BuilderRegistry } from './types';

/**
 * Registro global de builders
 */
const builderRegistry: BuilderRegistry = {};

/**
 * Registra un builder para un tipo de componente
 */
export const registerBuilder = (
  componentType: ComponentTypes,
  builder: ComponentBuilderFunction
): void => {
  builderRegistry[componentType] = builder;
};

/**
 * Construye un componente usando el builder registrado
 */
export const buildComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor } = params;

  const builder = builderRegistry[componentDescriptor.componentName];

  if (!builder) {
    console.warn(
      `No builder registered for component type: ${ComponentTypes[componentDescriptor.componentName]}`
    );
    return <></>;
  }

  return builder(params);
};

/**
 * Obtiene todos los builders registrados (útil para debugging)
 */
export const getRegisteredBuilders = (): BuilderRegistry => {
  return { ...builderRegistry };
};
