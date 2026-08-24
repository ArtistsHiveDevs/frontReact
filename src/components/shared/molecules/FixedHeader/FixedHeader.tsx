import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import './FixedHeader.scss';

interface FixedHeaderProps {
  children: React.ReactNode;
  mainHeaderRef: React.RefObject<HTMLDivElement>;
  className?: string;
  onScrollPositionChange?: (position: { headerBottom: number; fixedHeaderHeight: number; isHeaderHidden: boolean }) => void;
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
  ({ children, mainHeaderRef, className = '', onScrollPositionChange }, ref) => {
    const [showFixedHeader, setShowFixedHeader] = useState(false);
    const internalRef = useRef<HTMLDivElement>(null);

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

    return (
      <div ref={internalRef} className={`fixed-header ${showFixedHeader ? 'visible' : ''} ${className}`}>
        <div className="fixed-header-content">{children}</div>
      </div>
    );
  }
);

FixedHeader.displayName = 'FixedHeader';
