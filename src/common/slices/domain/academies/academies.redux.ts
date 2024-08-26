import { AcademyModel, AcademyTemplate } from '~/models/domain/academy/academy.model';

import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

const sliceName = 'academies';
const resourceEndpoint = `/${sliceName}`;

export const selectorAcademies = createEntitySelectors<typeof sliceName, AcademyModel, AcademyTemplate>({ sliceName });

const { slice: academySlice, saga: sagaAcademies } = createEntitySlice({
  name: sliceName,
  Model: AcademyModel,
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
    ...selectorAcademies,
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerAcademies = academySlice.reducer;
export const actionsAcademies = academySlice.actions;
export { sagaAcademies };

export const useAcademiesSlice = () => {
  useInjectReducer({ key: academySlice.name, reducer: academySlice.reducer });
  useInjectSaga({ key: academySlice.name, saga: sagaAcademies });

  return { actions: academySlice.actions };
};
