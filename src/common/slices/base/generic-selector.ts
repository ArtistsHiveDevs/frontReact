import { createSelector } from '@reduxjs/toolkit';
import { EntityStateTemplate, RootState } from '~/common/utils/redux-injectors/types';
import { EntityModel, EntityTemplate } from '~/models/base';

export function createEntitySelectors<K extends keyof RootState, M extends EntityModel<T>, T extends EntityTemplate>({
  sliceName,
}: {
  sliceName: K;
}) {
  const selectDomain = (state: RootState): NonNullable<RootState[K]> => {
    return state[sliceName]!;
  };

  return {
    selectLoading: createSelector([selectDomain], (state: EntityStateTemplate<T, M>) => state?.loading),
    selectError: createSelector([selectDomain], (state: EntityStateTemplate<T, M>) => state?.error),
    selectItems: createSelector(
      [selectDomain],
      (state: EntityStateTemplate<T, M>) => state?.items.map((id: string) => state.detailedItems[id]) || []
    ),
    makeSelectItemById: () =>
      createSelector(
        [selectDomain, (_: RootState, itemId: string) => itemId],
        (state, itemId) => state?.detailedItems && state?.detailedItems[itemId]
      ),
    selectCreatedItem: createSelector([selectDomain], (state: EntityStateTemplate<T, M>) => state?.createdItem),
  };
}
