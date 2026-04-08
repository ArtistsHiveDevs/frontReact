import './ProfilePictureWithName.scss';
import { AppUserModel, CurrentProfileInfoModel } from '~/models/app/user/user.model';
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
  isSelectable?: boolean;
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
    displayDirection = ProfilePictureListConstants.DISPLAY_HORIZONTAL,
  } = params;
  const avatarSizeREM = `${styles?.avatarSize || 4}rem`;

  const { translateGlobalDict } = useI18n();
  const loggedUser = useSelector(selectCurrentUser);

  const [isSelected, setIsSelected] = useState(false);

  const profileDirection =
    !displayDirection || displayDirection === ProfilePictureListConstants.DISPLAY_HORIZONTAL
      ? ProfilePictureWithNameConstants.DISPLAY_VERTICAL
      : ProfilePictureWithNameConstants.DISPLAY_HORIZONTAL;

  return (
    <>
      <div>
        {isSelectable && (
          <button onClick={() => setIsSelected(!isSelected)}>{isSelected ? 'Borrar' : 'Seleccionar todos'}</button>
        )}
        {entities.map((entityName: string) => {
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
                {(elements || [])
                  .filter((p: CurrentProfileInfoModel) => p.entity === entityName)
                  .map((participant: CurrentProfileInfoModel) => (
                    <div key={participant.identifier}>
                      <ProfilePictureWithName
                        element={participant}
                        showTopRightIcon={
                          isEditable &&
                          ![mainRecipient?.identifier || '', loggedUser?.currentProfileInfo?.identifier || ''].includes(
                            participant.identifier
                          )
                        }
                        isSelected={isSelected}
                        isSelectable={isSelectable}
                        handlers={handlers || {}}
                        direction={profileDirection}
                      />
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
