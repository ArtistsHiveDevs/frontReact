import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { ResourceMoreMenu } from '~/components/shared/molecules/general/ResourceMoreMenu/ResourceMoreMenu';
import './FixedHeader.scss';

interface FixedHeaderProps {
  children: React.ReactNode;
  mainHeaderRef: React.RefObject<HTMLDivElement>;
  className?: string;
  onScrollPositionChange?: (position: { headerBottom: number; fixedHeaderHeight: number; isHeaderHidden: boolean }) => void;
  /** Slot opcional a la izquierda del contenido, ej. un avatar. */
  avatar?: React.ReactNode;
  /**
   * Slot de acciones (tres puntos) a la derecha del contenido.
   * Si se omite, por defecto renderiza ResourceMoreMenu usando loggedUser/isOwner/shareUrl.
   * Pasa `false` para ocultarlo, o un nodo propio para reemplazarlo por completo.
   */
  actionsButton?: React.ReactNode | false;
  isOwner?: boolean;
  shareUrl?: string;
  /** Muestra el borde/sombra inferior del header fijo. Default: true. */
  bordered?: boolean;
}

export interface FixedHeaderRef {
  getHeight: () => number;
  isVisible: () => boolean;
}

/**
 * Header fijo que aparece cuando el header principal sale de la vista al hacer scroll
 * Replica el comportamiento de ProfileHeader
 *
 * Expone callbacks para que componentes externos puedan sincronizar contenido flotante
 */
export const FixedHeader = forwardRef<FixedHeaderRef, FixedHeaderProps>(
  (
    {
      children,
      mainHeaderRef,
      className = '',
      onScrollPositionChange,
      avatar,
      actionsButton,
      isOwner,
      shareUrl,
      bordered = true,
    },
    ref
  ) => {
    const [showFixedHeader, setShowFixedHeader] = useState(false);
    const internalRef = useRef<HTMLDivElement>(null);
    const loggedUser = useSelector(selectCurrentUser);

    // Expone métodos útiles para componentes externos
    useImperativeHandle(ref, () => ({
      getHeight: () => internalRef.current?.getBoundingClientRect().height || 0,
      isVisible: () => showFixedHeader,
    }));

    // Efecto para manejar el scroll y mostrar/ocultar el header fijo
    useEffect(() => {
      const handleScroll = () => {
        if (mainHeaderRef.current) {
          const headerRect = mainHeaderRef.current.getBoundingClientRect();
          const isHeaderHidden = headerRect.bottom < 0;
          setShowFixedHeader(isHeaderHidden);

          // Notifica cambios de posición si hay callback
          if (onScrollPositionChange) {
            const fixedHeaderHeight = internalRef.current?.getBoundingClientRect().height || 0;
            const headerBottom = Math.max(headerRect.bottom, 0);

            onScrollPositionChange({
              headerBottom,
              fixedHeaderHeight,
              isHeaderHidden,
            });
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      // Ejecuta una vez al montar para establecer estado inicial
      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
    }, [mainHeaderRef, onScrollPositionChange]);

    const resolvedActions =
      actionsButton === false ? null : (actionsButton ?? (
        <ResourceMoreMenu loggedUser={loggedUser} isOwner={isOwner} shareUrl={shareUrl} />
      ));

    return (
      <div
        ref={internalRef}
        className={[
          'fixed-header',
          showFixedHeader ? 'visible' : '',
          bordered ? '' : 'fixed-header--no-border',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="fixed-header-content">
          {avatar && <div className="fixed-header-avatar">{avatar}</div>}
          <div className="fixed-header-main">{children}</div>
          {resolvedActions && <div className="fixed-header-actions">{resolvedActions}</div>}
        </div>
      </div>
    );
  }
);

FixedHeader.displayName = 'FixedHeader';
