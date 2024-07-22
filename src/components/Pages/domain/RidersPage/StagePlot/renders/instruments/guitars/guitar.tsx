import { Text } from '@react-three/drei';
import React from 'react';
import * as THREE from 'three';
import { METERS_SCALE } from '../../../StagePlotEditor';

export const Guitar: React.FC<{
  color: string;
  position?: [number, number, number];
  name?: string;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ color, position = [0, 0, 0], name = '', isSelected, onClick }) => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(2 * METERS_SCALE, 0);
  shape.lineTo(2 * METERS_SCALE, 1 * METERS_SCALE);
  shape.lineTo(1.5 * METERS_SCALE, 1.5 * METERS_SCALE);
  shape.lineTo(1.5 * METERS_SCALE, 2.5 * METERS_SCALE);
  shape.lineTo(1 * METERS_SCALE, 3 * METERS_SCALE);
  shape.lineTo(0.5 * METERS_SCALE, 2.5 * METERS_SCALE);
  shape.lineTo(0.5 * METERS_SCALE, 1.5 * METERS_SCALE);
  shape.lineTo(0, 1 * METERS_SCALE);
  shape.closePath();

  const extrudeSettings = {
    depth: 0.5 * METERS_SCALE,
    bevelEnabled: true,
    bevelThickness: 0.1 * METERS_SCALE,
    bevelSize: 0.1 * METERS_SCALE,
    bevelSegments: 1,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshStandardMaterial({ color: isSelected ? 'pink' : color || 'blue' });

  return (
    <mesh geometry={geometry} material={material} position={position} onClick={onClick}>
      <pointLight position={[10, 10, 10]} />
      {/* Text for the Guitar */}
      <Text
        position={[0, 3, 0.6]} // Adjust position as needed
        color="black"
        fontSize={0}
        maxWidth={2}
        lineHeight={1}
        textAlign="center"
      >
        {name}
      </Text>
    </mesh>
  );
};
