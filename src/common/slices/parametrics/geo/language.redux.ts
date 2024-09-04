import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { LanguageModel, LanguageTemplate } from '~/models/parametrics/geo/language.model';

const sliceName = 'languages'; // Cambiar el nombre del slice
const resourceEndpoint = `/langs`;

export const selectorLanguages = createEntitySelectors<typeof sliceName, LanguageModel, LanguageTemplate>({
  sliceName,
}); // Actualizar selector

const { slice: languageSlice, saga: sagaLanguages } = createEntitySlice({
  name: sliceName,
  Model: LanguageModel,
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
    ...selectorLanguages,
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
export const reducerLanguages = languageSlice.reducer; // Cambiar el nombre del reducer
export const actionsLanguages = languageSlice.actions; // Cambiar el nombre de las acciones
export { sagaLanguages };

export const useLanguagesSlice = () => {
  // Cambiar el nombre del hook
  useInjectReducer({ key: languageSlice.name, reducer: languageSlice.reducer });
  useInjectSaga({ key: languageSlice.name, saga: sagaLanguages });

  return { actions: languageSlice.actions };
};
