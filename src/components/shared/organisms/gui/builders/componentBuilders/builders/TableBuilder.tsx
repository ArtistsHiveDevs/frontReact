import { TableView } from '~/components/shared/atoms/Table/TableView';
import { ComponentBuilderParams } from '../types';
import { getDataSource } from '../utils/dataExtraction';

export const createTableComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData, parentDataSource, section, handlers } = params;

  const dataSourceElement = getDataSource(componentDescriptor, entityData, parentDataSource);

  const tableConfig = componentDescriptor.data?.tableConfig
    ? componentDescriptor.data?.tableConfig(dataSourceElement)
    : undefined;

  const clickHandlerName = section?.clickHandlerName || componentDescriptor.clickHandlerName;
  const onRowClick = clickHandlerName ? (handlers?.[clickHandlerName] as ((row: any) => void) | undefined) : undefined;

  return <>{tableConfig && <TableView config={{ ...tableConfig, onRowClick: onRowClick || tableConfig.onRowClick }} />}</>;
};
