import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import './ProfilePictureWithName.scss';

export interface ProfilePictureWithNameParams {
  element: CurrentProfileInfoModel;
  styles?: { avatarSize?: number; topRightIcon?: string };
  handlers?: { [name: string]: Function };
  showTopRightIcon?: boolean;
  isSelected?: boolean;
  isSelectable?: boolean;
  direction?: ProfilePictureWithNameConstants;
  onToggleSelect?: (element: CurrentProfileInfoModel) => void;
  onProfileClick?: (element: CurrentProfileInfoModel) => void;
}

export enum ProfilePictureWithNameConstants {
  DISPLAY_HORIZONTAL = 1,
  DISPLAY_VERTICAL = 2,
}

export const ProfilePictureWithName = (params: ProfilePictureWithNameParams) => {
  const {
    element,
    styles,
    handlers,
    showTopRightIcon,
    isSelected,
    isSelectable,
    direction,
    onToggleSelect,
    onProfileClick,
  } = params;

  const avatarSizeREM = `${
    styles?.avatarSize || (direction === ProfilePictureWithNameConstants.DISPLAY_VERTICAL ? 4 : 2)
  }rem`;

  // `profile_pic` puede venir como ruta de S3, que sólo se resuelve a URL firmada de forma asíncrona.
  const [imageURL, setImageURL] = useState<string>(undefined);

  useEffect(() => {
    let cancelled = false;

    const resolveProfilePicURL = async () => {
      const photoURL = !!element?.avatarURL ? await element.avatarURL() : element?.profile_pic;
      if (!cancelled) {
        setImageURL(photoURL);
      }
    };

    if (!!element) {
      resolveProfilePicURL();
    }

    return () => {
      cancelled = true;
    };
  }, [element]);

  // Cuando la lista permite selección el click resalta el perfil; si no, navega hacia él.
  const onClickProfile = () => {
    if (isSelectable) {
      onToggleSelect?.(element);
      return;
    }
    onProfileClick?.(element);
  };

  return (
    <div
      key={element.identifier}
      className={`ppl-participant-avatar-name ${
        direction === ProfilePictureWithNameConstants.DISPLAY_HORIZONTAL
          ? 'ppl-participant-avatar-name--horizontal'
          : ''
      }`}
      onClick={onClickProfile}
    >
      {showTopRightIcon && (
        <div className="ppl-delete-icon">
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
      <Avatar
        src={imageURL}
        alt={element.name}
        sx={{
          width: avatarSizeREM,
          height: avatarSizeREM,
          flexShrink: 0,
          filter: !isSelectable || isSelected ? 'none' : 'grayscale(100%)',
          outline: !isSelectable || !isSelected ? 'none' : '3px solid white',
          boxShadow: !isSelectable || isSelected ? 'none' : '0 0 0 4px rgba(255,255,255,0.15)',
          outlineOffset: '3px',
        }}
        variant={'circular'}
      />
      <span className="ppl-participant-name">{element.nameKnownAs}</span>
    </div>
  );
};
