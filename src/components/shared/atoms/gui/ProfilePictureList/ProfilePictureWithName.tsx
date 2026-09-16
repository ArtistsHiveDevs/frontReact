import { Avatar } from '@mui/material';
import { KeyboardEventHandler, MouseEvent, useEffect, useState } from 'react';
import { ProfileSummaryDialog } from '~/components/Pages/domain/ProfilePreview/ProfileSummaryDialog';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { EntityModel, EntityTemplate } from '~/models/base';
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
  /**
   * Si es true, un click en la foto (no en la fila entera) la amplía en un diálogo,
   * sin disparar onProfileClick/onToggleSelect ni el click del contenedor padre.
   */
  zoomable?: boolean;
  /**
   * Si es true, un click en la fila abre un ProfileSummaryDialog con el resumen del perfil
   * (usa `element.entity` y `element.identifier`/`id`), sin que el caller tenga que manejar el
   * estado ni renderizar el diálogo por su cuenta.
   */
  showProfileSummary?: boolean;
  /**
   * Datos completos de la entidad para el ProfileSummaryDialog. Pásalo cuando ya tengas el objeto
   * completo a mano (ej. un artista poblado dentro de otra entidad): evita un fetch extra y, sobre
   * todo, evita depender de que `element.identifier` matchee el id bajo el que Redux guardó la
   * entidad (puede no coincidir si el sub-documento poblado no pasó por el mismo masking sID/_id).
   * Si no se pasa, el diálogo la busca por `element.entity` + `element.identifier`/`id`.
   */
  profileSummaryData?: EntityModel<EntityTemplate>;
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
    zoomable,
    showProfileSummary,
    profileSummaryData,
  } = params;

  const isActionableRow = actionable && (!!onProfileClick || showProfileSummary) && !isSelectable;
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const avatarSizeREM = `${
    styles?.avatarSize || (direction === ProfilePictureWithNameConstants.DISPLAY_VERTICAL ? 4 : 2)
  }rem`;

  // `profile_pic` puede venir como ruta de S3, que sólo se resuelve a URL firmada de forma asíncrona.
  const [imageURL, setImageURL] = useState<string>(undefined);

  const displayName = element?.nameKnownAs || element?.name || `@${element?.identifier}`;

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
    if (showProfileSummary) {
      setIsSummaryOpen(true);
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
      } ${(!!onProfileClick || showProfileSummary) && !isSelectable ? 'ppl-participant-avatar-name--clickable' : ''} ${
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
        onClick={
          zoomable && imageURL
            ? (event: MouseEvent) => {
                event.stopPropagation();
                setIsZoomOpen(true);
              }
            : undefined
        }
        sx={{
          width: avatarSizeREM,
          height: avatarSizeREM,
          flexShrink: 0,
          filter: !isSelectable || isSelected ? 'none' : 'grayscale(100%)',
          outline: !isSelectable || !isSelected ? 'none' : '3px solid white',
          boxShadow: !isSelectable || isSelected ? 'none' : '0 0 0 4px rgba(255,255,255,0.15)',
          outlineOffset: '3px',
          cursor: zoomable && imageURL ? 'zoom-in' : undefined,
        }}
        variant={'circular'}
      />
      <div className="ppl-participant-name-box">
        <span className="ppl-participant-name">{displayName}</span>
        {showSubtitle && !!element?.subtitle && <span className="ppl-participant-subtitle">{element.subtitle}</span>}
      </div>
      {isActionableRow && <DynamicIcons iconName="io5 IoChevronForward" color="white" size={18} />}

      {(zoomable || showProfileSummary) && (
        <div onClick={(event: MouseEvent) => event.stopPropagation()}>
          {zoomable && (
            <AppDialog
              isOpenDialog={isZoomOpen}
              onClose={() => setIsZoomOpen(false)}
              title={displayName}
              content={<img src={imageURL} alt={displayName} style={{ maxWidth: '100%' }} />}
            />
          )}
          {showProfileSummary && (
            <ProfileSummaryDialog
              isOpen={isSummaryOpen}
              onClose={() => setIsSummaryOpen(false)}
              entityType={element?.entity}
              entityId={element?.identifier || element?.id}
              entityData={profileSummaryData}
            />
          )}
        </div>
      )}
    </div>
  );
}
