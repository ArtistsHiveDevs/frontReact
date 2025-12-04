import { TableView } from '~/components/shared/atoms/Table/TableView';
import { ComponentBuilderParams } from '../types';
import { getDataSource } from '../utils/dataExtraction';

export const createTableComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData, parentDataSource } = params;

  const dataSourceElement = getDataSource(componentDescriptor, entityData, parentDataSource);

  const tableConfig = componentDescriptor.data?.tableConfig
    ? componentDescriptor.data?.tableConfig(dataSourceElement)
    : undefined;

  return <>{tableConfig && <TableView config={tableConfig} />}</>;
};
