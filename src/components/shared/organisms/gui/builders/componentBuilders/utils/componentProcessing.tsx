import { isDayjs } from 'dayjs';
import { EntityModel, EntityTemplate } from '~/models/base';
import { AttributeConfiguration } from '../../component-types.def';
import { getData, getAttributeTitle } from './dataExtraction';
import { IconDetailedAttribute } from '~/components/shared/molecules/general/AttributesIconField';

/**
 * Procesa un atributo individual para ATTRIBUTES_ICON_FIELDS
 */
export const processAttribute = (
  attribute: AttributeConfiguration,
  componentIndex: number,
  dataSourceElement: EntityModel<EntityTemplate>,
  subpageName: string,
  sectionName: string,
  translationBasePath: string,
  translateText: (path: string) => string,
  buildComponent?: (attribute: any) => JSX.Element
): IconDetailedAttribute => {
  let value = undefined;

  if (attribute.value || attribute.components) {
    if (attribute.value instanceof Function) {
      value = <>{attribute.value(dataSourceElement)}</>;
    } else if (attribute.components && attribute.components.length && buildComponent) {
      // Componentes anidados
      value = (
        <>
          {attribute.components.map((comp, idx) => (
            <div key={`nested-${componentIndex}-${idx}`}>{buildComponent(comp)}</div>
          ))}
        </>
      );
    } else if (isDayjs(attribute.value)) {
      value = attribute.value.format('LLLL');
    } else {
      value = attribute.value;
    }
  } else {
    value = getData(attribute.name, dataSourceElement);
  }

  return {
    name: attribute.name,
    title: getAttributeTitle(subpageName, sectionName, attribute, translationBasePath, translateText),
    customTitle: !!attribute.title || attribute.useTranslation,
    icon: attribute?.icon,
    value,
    requireSession: attribute.requireSession,
  };
};
