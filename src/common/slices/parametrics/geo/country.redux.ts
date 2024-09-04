import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { CountryModel, CountryTemplate } from '~/models/parametrics/geo/country.model';

const sliceName = 'countries';
const resourceEndpoint = `/${sliceName}`;

export const selectorCountries = createEntitySelectors<typeof sliceName, CountryModel, CountryTemplate>({ sliceName });

const { slice: countrySlice, saga: sagaCountries } = createEntitySlice({
  name: sliceName,
  Model: CountryModel,
  initialState: {
    items: [],
    loading: false,
    error: null,
    detailedItems: {},
    newItemRQ: null,
    createdItem: null,
  },
  resourceEndpoint,
  selectors: {
    ...selectorCountries,
  },
  options: {
    disableOperations: {
      create: false,
      update: false,
      delete: false,
    },
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerCountries = countrySlice.reducer;
export const actionsCountries = countrySlice.actions;
export { sagaCountries };

export const useCountriesSlice = () => {
  useInjectReducer({ key: countrySlice.name, reducer: countrySlice.reducer });
  useInjectSaga({ key: countrySlice.name, saga: sagaCountries });

  return { actions: countrySlice.actions };
};
