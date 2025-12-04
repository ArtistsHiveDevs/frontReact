import { TracksListView } from '~/components/shared/domain/organisms/TracksListView/TracksListView';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';

export const createTopTracksListViewComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData } = params;

  const tracks = getData(componentDescriptor.data_source, entityData);

  return <TracksListView tracks={tracks} />;
};
