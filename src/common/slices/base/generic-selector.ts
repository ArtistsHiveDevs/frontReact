import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '~/common/utils/redux-injectors/types';

export function createEntitySelectors<K extends keyof RootState>({ sliceName }: { sliceName: K }) {
  const selectDomain = (state: RootState): NonNullable<RootState[K]> => {
    return state[sliceName]!;
  };

  return {
    selectLoading: createSelector([selectDomain], (state) => state?.loading),
    selectError: createSelector([selectDomain], (state) => state?.error),
    selectItems: createSelector([selectDomain], (state) => state?.items),
    makeSelectItemById: () =>
      createSelector(
        [selectDomain, (_: RootState, itemId: string) => itemId],
        (state, itemId) => state?.detailedItems[itemId]
      ),
    selectCreatedItem: createSelector([selectDomain], (state) => state?.createdItem),
  };
}
