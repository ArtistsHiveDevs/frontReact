import { CrewListRiderView } from '~/components/shared//molecules/domain/crewListView/CrewListView';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';

export const createCrewListRiderViewComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData } = params;

  const crewList = getData(componentDescriptor.data?.crewList, entityData) || {};

  return <CrewListRiderView crewList={crewList} />;
};
