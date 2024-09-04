import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { AllergyModel, AllergyTemplate } from '~/models/parametrics/demographics/allergy.model';

const sliceName = 'allergies'; // Cambiar el nombre del slice
const resourceEndpoint = `/${sliceName}`;

export const selectorAllergies = createEntitySelectors<typeof sliceName, AllergyModel, AllergyTemplate>({ sliceName }); // Actualizar selector

const { slice: allergySlice, saga: sagaAllergies } = createEntitySlice({
  name: sliceName,
  Model: AllergyModel,
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
    ...selectorAllergies,
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
export const reducerAllergies = allergySlice.reducer; // Cambiar el nombre del reducer
export const actionsAllergies = allergySlice.actions; // Cambiar el nombre de las acciones
export { sagaAllergies };

export const useAllergiesSlice = () => {
  // Cambiar el nombre del hook
  useInjectReducer({ key: allergySlice.name, reducer: allergySlice.reducer });
  useInjectSaga({ key: allergySlice.name, saga: sagaAllergies });

  return { actions: allergySlice.actions };
};
