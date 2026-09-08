import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectorArtists, useArtistsSlice } from '~/common/slices/domain/artists/artist.redux';
import { selectorPlaces, usePlacesSlice } from '~/common/slices/domain/places/places.redux';
import { RootState } from '~/common/utils/redux-injectors/types';
import { ARTIST_ENTITY_NAME, getProfilePreviewEntityConfig, PLACE_ENTITY_NAME } from './profile-preview.registry';
import { ProfilePreviewDialog } from '~/components/shared/organisms/ProfilePreviewDialog/ProfilePreviewDialog';
import { ProfilePreviewConfig } from '~/components/shared/organisms/ProfileTabsPage/profile-preview.utils';
import { EntityModel, EntityTemplate } from '~/models/base';

export interface ProfileSummaryDialogParams {
  isOpen: boolean;
  onClose: () => void;
  entityType: string;
  entityId?: string;
  entityData?: EntityModel<EntityTemplate>;
  previewConfig?: ProfilePreviewConfig;
  title?: string;
  handlers?: any;
}

export const ProfileSummaryDialog = (params: ProfileSummaryDialogParams) => {
  const { isOpen, onClose, entityType, entityId, entityData, previewConfig, title, handlers } = params;

  const dispatch = useDispatch();
  const { actions: artistsActions } = useArtistsSlice();
  const { actions: placesActions } = usePlacesSlice();

  const entityConfig = getProfilePreviewEntityConfig(entityType);
  const entityName = entityConfig?.entityName;

  const isArtist = entityName === ARTIST_ENTITY_NAME;
  const isPlace = entityName === PLACE_ENTITY_NAME;
  const shouldLoadEntity = isOpen && !entityData && !!entityId && (isArtist || isPlace);

  const selectArtistById = useMemo(() => selectorArtists.makeSelectItemById(), []);
  const selectPlaceById = useMemo(() => selectorPlaces.makeSelectItemById(), []);

  const storedArtist = useSelector((state: RootState) =>
    isArtist && entityId ? selectArtistById(state, entityId) : undefined
  );
  const storedPlace = useSelector((state: RootState) =>
    isPlace && entityId ? selectPlaceById(state, entityId) : undefined
  );

  useEffect(() => {
    if (!shouldLoadEntity) {
      return;
    }
    if (isArtist) {
      dispatch(artistsActions.getItemById({ id: entityId }));
    } else {
      dispatch(placesActions.getItemById({ id: entityId }));
    }
  }, [shouldLoadEntity, entityId, isArtist]);

  const resolvedEntity = entityData || (isArtist ? storedArtist : storedPlace);

  if (!entityConfig) {
    return null;
  }

  return (
    <ProfilePreviewDialog
      isOpen={isOpen && !!resolvedEntity}
      onClose={onClose}
      entityName={entityConfig.entityName}
      entityData={resolvedEntity}
      translationBasePath={entityConfig.translationBasePath}
      subpagesConfig={entityConfig.subpagesConfig}
      previewConfig={previewConfig || entityConfig.previewConfig}
      title={title}
      handlers={handlers}
    />
  );
};
