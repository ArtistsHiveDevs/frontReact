import { forwardRef } from 'react';
import { Mesh } from 'three';

interface PlatformProps {
  width: number;
  depth: number;
  height?: number;
  color?: string;
  position?: [number, number, number];
  isSelected?: boolean;
  onClick?: () => void;
}

const Platform = forwardRef<Mesh, PlatformProps>(
  ({ width, depth, height, position = [0, 0, 0], color, isSelected, onClick }, ref) => {
    return (
      <mesh ref={ref} position={position} onClick={onClick}>
        <boxGeometry args={[width, 1, depth, height]} />
        <meshStandardMaterial color={isSelected ? 'pink' : color || 'grey'} />
      </mesh>
    );
  }
);

Platform.displayName = 'Platform'; // Es útil para depuración

export { Platform };
