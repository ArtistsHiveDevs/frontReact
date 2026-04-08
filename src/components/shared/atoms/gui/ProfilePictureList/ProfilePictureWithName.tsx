import { Avatar } from '@mui/material';
import './ProfilePictureWithName.scss';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { useEffect, useState } from 'react';

export interface ProfilePictureWithNameParams {
  element: CurrentProfileInfoModel;
  styles?: { avatarSize?: number; topRightIcon?: string };
  handlers?: { [name: string]: Function };
  showTopRightIcon?: boolean;
  isSelected?: boolean;
  isSelectable?: boolean;
  direction?: ProfilePictureWithNameConstants;
}

export enum ProfilePictureWithNameConstants {
  DISPLAY_HORIZONTAL = 1,
  DISPLAY_VERTICAL = 2,
}

export const ProfilePictureWithName = (params: ProfilePictureWithNameParams) => {
  const { element, styles, handlers, showTopRightIcon, isSelected, isSelectable, direction } = params;

  const avatarSizeREM = `${
    styles?.avatarSize || (direction === ProfilePictureWithNameConstants.DISPLAY_VERTICAL ? 4 : 2)
  }rem`;

  const [selectedState, setSelectedState] = useState(isSelected);

  const selectProfile = (element: CurrentProfileInfoModel) => {
    setSelectedState(!selectedState);
  };

  useEffect(() => {
    setSelectedState(isSelected);
  }, [isSelected]);
  return (
    <>
      <div
        key={element.identifier}
        className={`pbrd-participant-avatar-name ${direction === ProfilePictureWithNameConstants.DISPLAY_HORIZONTAL ? 'pbrd-participant-avatar-name--horizontal' : ''}`}
        onClick={() => selectProfile(element)}
      >
        {showTopRightIcon && (
          <div className="pbrd-delete-icon">
            <DynamicIcons
              iconName={styles?.topRightIcon || 'IoMdRemoveCircleOutline'}
              size={30}
              color="white"
              onClick={() => {
                if (handlers && handlers['onTopRightClick']) {
                  handlers['onTopRightClick'](element);
                }
              }}
            />
          </div>
        )}
        {(!direction || direction === ProfilePictureWithNameConstants.DISPLAY_VERTICAL) && (
          <>
            <Avatar
              src={element.profile_pic}
              alt={element.name}
              sx={{
                width: avatarSizeREM,
                height: avatarSizeREM,
                flexShrink: 0,
                filter: !isSelectable || selectedState ? 'none' : 'grayscale(100%)',
                outline: !isSelectable || !selectedState ? 'none' : '3px solid white',
                boxShadow: !isSelectable || selectedState ? 'none' : '0 0 0 4px rgba(255,255,255,0.15)',
                outlineOffset: '3px',
              }}
              variant={'circular'}
            />
            <span className="pbrd-participant-name">{element.name}</span>
          </>
        )}
        {(!direction || direction === ProfilePictureWithNameConstants.DISPLAY_HORIZONTAL) && (
          <>
            <Avatar
              src={element.profile_pic}
              alt={element.name}
              sx={{
                width: avatarSizeREM,
                height: avatarSizeREM,
                flexShrink: 0,
                filter: !isSelectable || selectedState ? 'none' : 'grayscale(100%)',
                outline: !isSelectable || !selectedState ? 'none' : '3px solid white',
                boxShadow: !isSelectable || selectedState ? 'none' : '0 0 0 4px rgba(255,255,255,0.15)',
                outlineOffset: '3px',
              }}
              variant={'circular'}
            />
            <span className="pbrd-participant-name">{element.name}</span>
          </>
        )}
      </div>
    </>
  );
};
