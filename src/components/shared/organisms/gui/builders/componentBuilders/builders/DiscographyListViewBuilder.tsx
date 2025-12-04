import { AlbumsShortListView } from '~/components/shared/domain/organisms/AlbumsShortListView/AlbumsShortListView';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';

export const createDiscographyListViewComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData } = params;

  const discography = getData(componentDescriptor.data_source, entityData);

  return <AlbumsShortListView discography={discography} />;
};
