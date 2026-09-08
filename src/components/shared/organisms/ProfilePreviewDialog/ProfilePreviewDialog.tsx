import { useMemo } from 'react';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';
import {
  filterProfileSubpagesConfig,
  ProfilePreviewConfig,
} from '~/components/shared/organisms/ProfileTabsPage/profile-preview.utils';
import { ProfileTabsPage } from '~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage';
import { EntityModel, EntityTemplate } from '~/models/base';
import { getClassFromModelName } from '~/models/base/modelHelpers';
import './ProfilePreviewDialog.scss';

export const TRANSLATION_BASE_PROFILE_PREVIEW = 'app.general.profile_preview';

export interface ProfilePreviewDialogParams {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  entityData: EntityModel<EntityTemplate>;
  translationBasePath: string;
  subpagesConfig: PageSection[];
  previewConfig?: ProfilePreviewConfig;
  title?: string;
  handlers?: any;
  fullScreen?: boolean;
  onSeeFullProfile?: () => void;
}

export const ProfilePreviewDialog = (params: ProfilePreviewDialogParams) => {
  const {
    isOpen,
    onClose,
    entityName,
    entityData,
    translationBasePath,
    subpagesConfig,
    previewConfig,
    title,
    handlers,
    fullScreen,
    onSeeFullProfile,
  } = params;

  const { translateText } = useI18n();
  const { navigateToEntity } = useNavigation();

  const previewSubpages = useMemo(
    () => filterProfileSubpagesConfig(subpagesConfig, previewConfig),
    [subpagesConfig, previewConfig]
  );

  if (!isOpen || !entityData) {
    return null;
  }

  const goToFullProfile = () => {
    onClose();
    if (onSeeFullProfile) {
      onSeeFullProfile();
      return;
    }
    const modelClassName = getClassFromModelName(entityName)?.name || entityData?.constructor?.name;
    navigateToEntity({ entityType: modelClassName, id: entityData.identifier });
  };

  return (
    <AppDialog
      isOpenDialog={isOpen}
      onClose={onClose}
      className="profile-preview-dialog"
      // fullScreen={fullScreen ?? true}
      title={title ?? entityData.name}
      content={
        <div className="profile-preview-dialog-content">
          <ProfileTabsPage
            entityName={entityName}
            entityData={entityData}
            translation_base_path={translationBasePath}
            subpagesConfig={previewSubpages}
            handlers={handlers || {}}
          />
        </div>
      }
      actions={[
        {
          label: translateText(`${TRANSLATION_BASE_PROFILE_PREVIEW}.view_full_profile`),
          handler: goToFullProfile,
        },
      ]}
    />
  );
};
