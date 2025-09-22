import React from 'react';
import { BaseElementProps, ElementType, StageElement } from '~/components/Pages/domain/RidersPage/StagePlot/types/element.types';
import { Model3DElement } from '~/components/Pages/domain/RidersPage/StagePlot/components/ModelElement';

interface ElementRendererProps {
  element: StageElement;
  isSelected: boolean;
  onClick: () => void;
  platforms?: StageElement[];
}

export class BassGuitar extends Model3DElement {
  protected elementType = ElementType.BASS_GUITAR;

  static renderElement(props: ElementRendererProps): JSX.Element {
    return (
      <BassGuitar
        color={props.element.color}
        position={props.element.position}
        rotation={props.element.rotation}
        name={props.element.name}
        isSelected={props.isSelected}
        onClick={props.onClick}
        scale={props.element.scale}
        platforms={props.platforms}
        hideText={props.element.hideText}
        showAxes={props.element.showAxes}
      />
    );
  }

  protected renderFallback() {
    const { isSelected } = this.props;
    const selectedColor = isSelected ? 'pink' : this.props.color || '#8B4513';

    return (
      <group>
        {/* Cuerpo del bajo */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.4, 1.2, 0.1]} />
          <meshLambertMaterial color={selectedColor} />
        </mesh>

        {/* Mástil */}
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[0.1, 1.2, 0.05]} />
          <meshLambertMaterial color="#654321" />
        </mesh>

        {/* Clavijero */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[0.15, 0.3, 0.05]} />
          <meshLambertMaterial color="#333" />
        </mesh>

        {/* Cuerdas */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-0.03 + i * 0.02, 1.5, 0.01]}>
            <boxGeometry args={[0.005, 2, 0.005]} />
            <meshLambertMaterial color="#C0C0C0" />
          </mesh>
        ))}
      </group>
    );
  }
}