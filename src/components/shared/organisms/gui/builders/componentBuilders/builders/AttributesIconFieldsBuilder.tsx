import { useI18n } from '~/common/utils';
import { AttributesIconFieldReadOnly } from '~/components/shared/molecules/general/AttributesIconField';
import { ComponentBuilderParams } from '../types';
import { getDataSource, isAttributeHidden } from '../utils/dataExtraction';
import { processAttribute } from '../utils/componentProcessing';

export const createAttributesIconFieldsComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData, parentDataSource, subpage, section, translationBasePath } = params;
  const { translateText } = useI18n();

  const dataSourceElement = getDataSource(componentDescriptor, entityData, parentDataSource);

  let sectionsAttributes: any[] = [];

  // Caso 1: Data source es array
  if (componentDescriptor.data?.data_source) {
    const dsPath = componentDescriptor.data.data_source.split('.') || [];
    const dsElement =
      dsPath.reduce((previous: any, current: any) => {
        return previous ? previous[current as keyof typeof previous] : {};
      }, entityData) || {};

    const dsAsArray = Array.isArray(dsElement) ? dsElement : [dsElement];

    sectionsAttributes = dsAsArray.map((dataSource: any, elementIndex: number) => {
      let title = componentDescriptor.data?.data_element_title?.prefix;
      if (componentDescriptor.data?.data_element_title?.isConsecutive) {
        title += ` ${elementIndex + componentDescriptor.data.data_element_title.consecutiveBase}`;
      }

      return {
        title,
        attributes: (componentDescriptor.data?.attributes || componentDescriptor.data?.fields || [])
          .filter((attr: any) => !isAttributeHidden(attr, dataSource))
          .map((attr: any, idx: number) =>
            processAttribute(attr, idx, dataSource, subpage.name, section.name || '', translationBasePath, translateText)
          ),
      };
    });
  }
  // Caso 2: Atributos simples
  else if (componentDescriptor.data?.attributes) {
    sectionsAttributes = [
      {
        title: componentDescriptor.data?.title,
        attributes: componentDescriptor.data.attributes
          .filter((attr: any) => !isAttributeHidden(attr, dataSourceElement))
          .map((attr: any, idx: number) =>
            processAttribute(
              attr,
              idx,
              dataSourceElement,
              subpage.name,
              section.name || '',
              translationBasePath,
              translateText
            )
          ),
      },
    ];
  }

  const useColon = componentDescriptor.data?.useColon;
  const useDivInValue = componentDescriptor.data?.useDivInValue;
  const direction = componentDescriptor.data?.iconDirection;

  return (
    <>
      {sectionsAttributes.map((sectionAttrs: any, idx: number) => (
        <AttributesIconFieldReadOnly
          key={`attributes-${idx}`}
          attributes={sectionAttrs.attributes}
          title={sectionAttrs?.title}
          useDivInValue={useDivInValue}
          useColon={useColon}
          direction={direction}
        />
      ))}
    </>
  );
};
