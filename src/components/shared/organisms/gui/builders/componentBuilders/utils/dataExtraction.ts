import { isDayjs } from 'dayjs';
import { EntityModel, EntityTemplate } from '~/models/base';
import { ComponentDescriptor, AttributeConfiguration } from '../../component-types.def';

/**
 * Extrae datos de una entidad usando un path tipo "user.country.name"
 */
export const getData = (attribute: string, dataSource: EntityModel<EntityTemplate>): any => {
  if (!attribute) return undefined;

  const propertyPath = attribute.split('.') || [];
  const data =
    propertyPath.reduce((previous, current) => {
      return previous ? previous[current as keyof typeof previous] : '';
    }, dataSource) || '';

  // Formatear arrays simples
  if (Array.isArray(data) && data.length && (typeof data[0] === 'string' || typeof data[0] === 'number')) {
    return data.join(', ');
  }

  // Formatear fechas Dayjs
  if (isDayjs(data)) {
    return data.format('LL');
  }

  return data;
};

/**
 * Obtiene el título traducido de un atributo
 */
export const getAttributeTitle = (
  subpageName: string,
  sectionName: string,
  attribute: AttributeConfiguration,
  translationBasePath: string,
  translateText: (path: string) => string
): string => {
  if (attribute.translationPath) {
    return translateText(`${attribute.translationPath}.${attribute.name}`);
  }

  if (attribute.title) {
    return attribute.title;
  }

  if (attribute.useTranslation || attribute.emptyTitle === undefined) {
    return translateText(
      `${translationBasePath}.subpages.${subpageName}.sections.${sectionName}.attributes.${attribute.name}`
    );
  }

  return '';
};

/**
 * Obtiene el data source de un descriptor
 */
export const getDataSource = (
  componentDescriptor: ComponentDescriptor,
  entityData: EntityModel<EntityTemplate>,
  parentDataSource?: EntityModel<EntityTemplate>
): EntityModel<EntityTemplate> => {
  const source = parentDataSource || entityData;

  if (!componentDescriptor.data?.data_source) {
    return source;
  }

  const dsPath = componentDescriptor.data.data_source.split('.') || [];
  return (
    dsPath.reduce((previous: any, current: any) => {
      return previous ? previous[current as keyof typeof previous] : {};
    }, source) || {}
  );
};

/**
 * Helper para determinar si un atributo está oculto
 */
export const isAttributeHidden = (attribute: any, dataSource: any): boolean => {
  if (attribute.hidden === undefined) return false;
  if (typeof attribute.hidden === 'boolean') return attribute.hidden;
  if (typeof attribute.hidden === 'string') return attribute.hidden === 'true';
  if (attribute.hidden instanceof Function) return attribute.hidden(dataSource);
  return false;
};
