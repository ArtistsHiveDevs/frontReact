import { CountriesCitiesListView } from '~/components/shared/domain/organisms/CountriesCitiesListView/CountriesCitiesListView';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';

export const createVisitedCountriesCitiesComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData } = params;

  const cities = getData(componentDescriptor.data?.cities, entityData) || [];

  return <CountriesCitiesListView cities={cities} />;
};
