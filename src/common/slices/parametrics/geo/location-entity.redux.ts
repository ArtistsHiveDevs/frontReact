import { current } from '@reduxjs/toolkit';
import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { LocationEntityModel, LocationEntityTemplate } from '~/models/parametrics/geo/location-entity.model';

const sliceName = 'locationEntities';
const resourceEndpoint = `/${sliceName}`;

export const selectorLocationEntities = createEntitySelectors<
  typeof sliceName,
  LocationEntityModel,
  LocationEntityTemplate
>({ sliceName });

const { slice: locationEntitySlice, saga: sagaLocationEntities } = createEntitySlice({
  name: sliceName,
  Model: LocationEntityModel,
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
    ...selectorLocationEntities,
  },
  options: {
    disableOperations: {
      create: false,
      update: false,
      delete: false,
    },
    customOperations: {
      reducers: {
        // Override itemsLoaded to accumulate rather than replace
        itemsLoaded(state, action) {
          const { countryId, level, parentId } = current(state.queryParams);
          const newItems = (action.payload || []).map(
            (template: LocationEntityTemplate) => new LocationEntityModel({ ...template, countryId, level, parentId })
          );

          // Create a Map to track existing items by ID to avoid duplicates
          const existingItemsMap = new Map();

          // Add existing items to the map
          state.items.forEach((itemId: any) => {
            const item = state.detailedItems[itemId];
            if (item) {
              existingItemsMap.set(itemId, item);
            }
          });

          // Add or update items from the new response
          newItems.forEach((item: any) => {
            existingItemsMap.set(item.idRedux, item);
          });

          // Convert back to arrays
          const allItems = Array.from(existingItemsMap.values());
          state.items = allItems.map((item) => item.idRedux);
          const detailed = allItems.reduce((dict, item) => {
            dict[item.idRedux] = item;
            return dict;
          }, {});

          state.detailedItems = detailed;

          state.loading = false;
          state.queryParams = undefined;
        },
        // Override itemsAccumulated to also add metadata (countryId, level, parentId)
        // Metadata comes from the action payload (passed by the saga)
        itemsAccumulated(state, action) {
          // Support both old format (array) and new format ({ items, metadata })
          const isNewFormat = action.payload && !Array.isArray(action.payload) && 'items' in action.payload;
          const items = isNewFormat ? action.payload.items : action.payload;
          const metadata = isNewFormat ? action.payload.metadata : {};

          const newItems = (items || []).map((template: LocationEntityTemplate) => {
            // Use metadata from the payload (which comes from the request queryParams)
            const countryId = template.countryId || metadata?.countryId;
            const level = template.level || metadata?.level;
            const parentId = template.parentId || metadata?.parentId;
            return new LocationEntityModel({ ...template, countryId, level, parentId });
          });

          // Create a Map to track existing items by ID to avoid duplicates
          const existingItemsMap = new Map();

          // Add existing items to the map
          state.items.forEach((itemId: any) => {
            const item = state.detailedItems[itemId];
            if (item) {
              existingItemsMap.set(itemId, item);
            }
          });

          // Add or update items from the new response
          newItems.forEach((item: any) => {
            existingItemsMap.set(item.idRedux, item);
          });

          // Convert back to arrays
          const allItems = Array.from(existingItemsMap.values());
          state.items = allItems.map((item) => item.idRedux);
          const detailed = allItems.reduce((dict, item) => {
            dict[item.idRedux] = item;
            return dict;
          }, {});

          state.detailedItems = detailed;

          state.loading = false;
          state.queryParams = undefined;
        },
      },
    },
  },
});

// Export reducer and saga
export const reducerLocationEntities = locationEntitySlice.reducer;
export const actionsLocationEntities = locationEntitySlice.actions;
export { sagaLocationEntities };

export const useLocationEntitiesSlice = () => {
  useInjectReducer({ key: locationEntitySlice.name, reducer: locationEntitySlice.reducer });
  useInjectSaga({ key: locationEntitySlice.name, saga: sagaLocationEntities });

  return { actions: locationEntitySlice.actions };
};

// Custom selectors for location hierarchy
export const selectLocationEntitiesByCountryAndLevel = (state: any, countryId: string, level: number) => {
  const allEntities = selectorLocationEntities.selectItems(state);
  return allEntities.filter((entity) => entity.countryId === countryId && entity.level === level);
};

export const selectLocationEntitiesByParentAndLevel = (state: any, parentId: string, level: number) => {
  const allEntities = selectorLocationEntities.selectItems(state);
  return allEntities.filter((entity) => entity.parentId === parentId && entity.level === level);
};

export const selectLocationEntitiesByCountry = (state: any, countryId: string) => {
  const allEntities = selectorLocationEntities.selectItems(state);
  return allEntities.filter((entity) => entity.countryId === countryId);
};

export const selectLocationEntitiesByLevel = (state: any, level: number) => {
  const allEntities = selectorLocationEntities.selectItems(state);
  return allEntities.filter((entity) => entity.level === level);
};
