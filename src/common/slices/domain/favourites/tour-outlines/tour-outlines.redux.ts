import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { TourOutlineModel } from '~/models/domain/favourites/tourOutline';

const sliceName = 'tourOutlines';
const resourceEndpoint = `/tours_outlines`;

export const selectorTourOutlines = createEntitySelectors({ sliceName });

const { slice: tourOutlineSlice, saga: sagaTourOutlines } = createEntitySlice({
  name: sliceName,
  Model: TourOutlineModel,
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
    ...selectorTourOutlines,
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerTourOutlines = tourOutlineSlice.reducer;
export const actionsTourOutlines = tourOutlineSlice.actions;
export { sagaTourOutlines };

export const useTourOutlinesSlice = () => {
  useInjectReducer({ key: tourOutlineSlice.name, reducer: tourOutlineSlice.reducer });
  useInjectSaga({ key: tourOutlineSlice.name, saga: sagaTourOutlines });

  return { actions: tourOutlineSlice.actions };
};
