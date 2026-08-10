import './ProfilePictureWithName.scss';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { getModelInfoFromClassName } from '~/models/base/modelHelpers';
import { FormLabel } from '@mui/material';
import { useI18n } from '~/common/utils';
import { ProfilePictureWithName, ProfilePictureWithNameConstants } from './ProfilePictureWithName';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useState } from 'react';

export interface ProfilePictureListParams {
  isEditable?: boolean;
  mainRecipient?: CurrentProfileInfoModel;
  entities: string[];
  elements: CurrentProfileInfoModel[];
  styles?: { avatarSize?: number; topRightIcon?: string };
  handlers?: { [name: string]: Function };
  showTopRightIcon?: boolean;
  /** Permite resaltar perfiles individualmente. */
  isSelectable?: boolean;
  /** Muestra el botón de seleccionar/limpiar toda la lista. Requiere `isSelectable`. */
  isToggleable?: boolean;
  /** Identifiers seleccionados. Si se envía, la selección la controla el padre. */
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Se dispara al hacer click en un perfil cuando la lista no es seleccionable. */
  onProfileClick?: (element: CurrentProfileInfoModel) => void;
  displayDirection?: number;
}

const isMissingParticipantForEntity = (entityName: string, participants: CurrentProfileInfoModel[]): boolean => {
  return !Array.isArray(participants) || !participants.some((p) => p.entity === entityName);
};

export enum ProfilePictureListConstants {
  DISPLAY_HORIZONTAL = 1,
  DISPLAY_VERTICAL = 2,
}

export const ProfilePictureList = (params: ProfilePictureListParams) => {
  const {
    entities,
    elements,
    styles,
    mainRecipient,
    handlers,
    isEditable,
    isSelectable,
    isToggleable,
    selectedIds,
    onSelectionChange,
    onProfileClick,
    displayDirection = ProfilePictureListConstants.DISPLAY_HORIZONTAL,
  } = params;

  const { translateGlobalDict } = useI18n();
  const loggedUser = useSelector(selectCurrentUser);

  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(selectedIds || []);

  const isControlled = selectedIds !== undefined;
  const currentSelectedIds = isControlled ? selectedIds : internalSelectedIds;

  const updateSelection = (newSelectedIds: string[]) => {
    if (!isControlled) {
      setInternalSelectedIds(newSelectedIds);
    }
    onSelectionChange?.(newSelectedIds);
  };

  const toggleProfile = (element: CurrentProfileInfoModel) => {
    updateSelection(
      currentSelectedIds.includes(element.identifier)
        ? currentSelectedIds.filter((identifier) => identifier !== element.identifier)
        : [...currentSelectedIds, element.identifier]
    );
  };

  const allIdentifiers = (elements || []).map((element) => element.identifier);
  const areAllSelected = !!allIdentifiers.length && allIdentifiers.every((id) => currentSelectedIds.includes(id));

  const profileDirection =
    !displayDirection || displayDirection === ProfilePictureListConstants.DISPLAY_HORIZONTAL
      ? ProfilePictureWithNameConstants.DISPLAY_VERTICAL
      : ProfilePictureWithNameConstants.DISPLAY_HORIZONTAL;

  return (
    <div>
      {isSelectable && isToggleable && (
        <button type="button" onClick={() => updateSelection(areAllSelected ? [] : allIdentifiers)}>
          {translateGlobalDict(`actions.${areAllSelected ? 'clear_selection' : 'select_all'}`)}
        </button>
      )}
      {entities.map((entityName: string) => {
        const entityElements = (elements || []).filter((p: CurrentProfileInfoModel) => p.entity === entityName);

        // Fuera del modo edición un grupo vacío sólo aportaría un encabezado suelto.
        if (!isEditable && !entityElements.length) {
          return null;
        }

        const missingParticipant = isMissingParticipantForEntity(entityName, elements);
        return (
          <div key={entityName}>
            <div className="pbrd-entity-type-participants">
              {isEditable ? (
                <>
                  <FormLabel required={true} error={missingParticipant} className="pbrd-entity-type-participants">
                    {getModelInfoFromClassName(entityName).plural &&
                      translateGlobalDict(`entities.${getModelInfoFromClassName(entityName).plural}.plural`)}
                  </FormLabel>
                  <DynamicIcons
                    iconName="fa6 FaCirclePlus"
                    size={20}
                    color="white"
                    // onClick={() => setSearchEntity(entityName)}
                  />
                </>
              ) : (
                <h2>
                  {getModelInfoFromClassName(entityName).plural &&
                    translateGlobalDict(`entities.${getModelInfoFromClassName(entityName).plural}.plural`)}
                </h2>
              )}
            </div>
            <div
              className={`pbrd-participants-box ${
                displayDirection === ProfilePictureListConstants.DISPLAY_VERTICAL
                  ? 'pbrd-participants-box--vertical'
                  : ''
              }`}
            >
              {entityElements.map((participant: CurrentProfileInfoModel) => (
                <div key={participant.identifier}>
                  <ProfilePictureWithName
                    element={participant}
                    styles={styles}
                    showTopRightIcon={
                      isEditable &&
                      ![mainRecipient?.identifier || '', loggedUser?.currentProfileInfo?.identifier || ''].includes(
                        participant.identifier
                      )
                    }
                    isSelected={currentSelectedIds.includes(participant.identifier)}
                    isSelectable={isSelectable}
                    handlers={handlers || {}}
                    direction={profileDirection}
                    onToggleSelect={toggleProfile}
                    onProfileClick={onProfileClick}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
