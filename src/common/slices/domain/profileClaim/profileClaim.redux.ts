import { ProfileClaimModel, ProfileClaimTemplate } from '~/models/domain/profileClaim/profileClaim.model';

import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';

const sliceName = 'profileClaims';
const resourceEndpoint = `/claimprofile`;

export const selectorProfileClaims = createEntitySelectors<typeof sliceName, ProfileClaimModel, ProfileClaimTemplate>({
  sliceName,
});

const { slice: profileClaimSlice, saga: sagaProfileClaims } = createEntitySlice({
  name: sliceName,
  Model: ProfileClaimModel,
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
    ...selectorProfileClaims,
  },
  options: {
    disableOperations: {
      update: true,
      delete: true,
      postAction: true,
    },
  },
});

export const reducerProfileClaims = profileClaimSlice.reducer;
export const actionsProfileClaims = profileClaimSlice.actions;
export { sagaProfileClaims };

export const useProfileClaimsSlice = () => {
  useInjectReducer({ key: profileClaimSlice.name, reducer: profileClaimSlice.reducer });
  useInjectSaga({ key: profileClaimSlice.name, saga: sagaProfileClaims });

  return { actions: profileClaimSlice.actions };
};
