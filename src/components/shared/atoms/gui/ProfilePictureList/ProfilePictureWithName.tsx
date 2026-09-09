import { Avatar } from '@mui/material';
import { KeyboardEventHandler, useEffect, useState } from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './ProfilePictureWithName.scss';

export interface ProfilePictureWithNameElement {
  identifier?: string;
  id?: string;
  entity?: string;
  name?: string;
  nameKnownAs?: string;
  subtitle?: string;
  profile_pic?: string;
  avatarURL?: () => string | Promise<string>;
}

export interface ProfilePictureWithNameParams<T extends ProfilePictureWithNameElement = ProfilePictureWithNameElement> {
  element: T;
  styles?: { avatarSize?: number; topRightIcon?: string };
  handlers?: { [name: string]: Function };
  showTopRightIcon?: boolean;
  showSubtitle?: boolean;
  isSelected?: boolean;
  isSelectable?: boolean;
  direction?: ProfilePictureWithNameConstants;
  onToggleSelect?: (element: T) => void;
  onProfileClick?: (element: T) => void;
  /**
   * Tratamiento visual de "fila con acción": fondo + chevron, además del cursor pointer.
   * Solo aplica cuando hay onProfileClick (no afecta el modo de selección). Úsalo cuando
   * el click abre un detalle/diálogo y quieras insinuárselo al usuario más allá del hover.
   */
  actionable?: boolean;
}

export enum ProfilePictureWithNameConstants {
  DISPLAY_HORIZONTAL = 1,
  DISPLAY_VERTICAL = 2,
}

export function ProfilePictureWithName<T extends ProfilePictureWithNameElement>(
  params: ProfilePictureWithNameParams<T>
) {
  const {
    element,
    styles,
    handlers,
    showTopRightIcon,
    showSubtitle,
    isSelected,
    isSelectable,
    direction,
    onToggleSelect,
    onProfileClick,
    actionable,
  } = params;

  const isActionableRow = actionable && !!onProfileClick && !isSelectable;

  const avatarSizeREM = `${
    styles?.avatarSize || (direction === ProfilePictureWithNameConstants.DISPLAY_VERTICAL ? 4 : 2)
  }rem`;

  // `profile_pic` puede venir como ruta de S3, que sólo se resuelve a URL firmada de forma asíncrona.
  const [imageURL, setImageURL] = useState<string>(undefined);

  const displayName = element?.nameKnownAs || element?.name || `@${element.identifier}`;

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

  const onRowKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClickProfile();
    }
  };

  return (
    <div
      key={element?.identifier || element?.id}
      className={`ppl-participant-avatar-name ${
        direction === ProfilePictureWithNameConstants.DISPLAY_HORIZONTAL
          ? 'ppl-participant-avatar-name--horizontal'
          : ''
      } ${!!onProfileClick && !isSelectable ? 'ppl-participant-avatar-name--clickable' : ''} ${
        isActionableRow ? 'ppl-participant-avatar-name--actionable' : ''
      }`}
      onClick={onClickProfile}
      {...(isActionableRow ? { role: 'button', tabIndex: 0, onKeyDown: onRowKeyDown } : {})}
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
        alt={displayName}
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
      <div className="ppl-participant-name-box">
        <span className="ppl-participant-name">{displayName}</span>
        {showSubtitle && !!element?.subtitle && <span className="ppl-participant-subtitle">{element.subtitle}</span>}
      </div>
      {isActionableRow && <DynamicIcons iconName="io5 IoChevronForward" color="white" size={18} />}
    </div>
  );
}
