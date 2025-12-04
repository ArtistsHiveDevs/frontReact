import { GenresListView } from '~/components/shared//molecules/domain/genres/GenresListView';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';

export const createArtsGenresComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData } = params;

  const content = getData(componentDescriptor.data?.genres, entityData) || {};

  return <GenresListView genres={content} />;
};
