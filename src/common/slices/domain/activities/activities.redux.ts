import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { ActivityModel, ActivityTemplate } from '~/models/domain/activity/activity.model';

const sliceName = 'activities';
const resourceEndpoint = `/${sliceName}`;

export const selectorActivities = createEntitySelectors<typeof sliceName, ActivityModel, ActivityTemplate>({
  sliceName,
});

const { slice: activitiesSlice, saga: sagaActivities } = createEntitySlice({
  name: sliceName,
  Model: ActivityModel,
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
    ...selectorActivities,
  },
  options: {
    disableOperations: {
      postAction: true,
    },
  },
});

export const reducerActivities = activitiesSlice.reducer;
export const actionsActivities = activitiesSlice.actions;
export { sagaActivities };

export const useActivitiesSlice = () => {
  useInjectReducer({ key: activitiesSlice.name, reducer: activitiesSlice.reducer });
  useInjectSaga({ key: activitiesSlice.name, saga: sagaActivities });

  return { actions: activitiesSlice.actions };
};
