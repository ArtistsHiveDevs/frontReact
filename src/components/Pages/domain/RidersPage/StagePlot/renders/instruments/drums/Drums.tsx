import React from 'react';
import { Model3DElement } from '~/components/Pages/domain/RidersPage/StagePlot/components/ModelElement';
import { ElementType, StageElement } from '~/components/Pages/domain/RidersPage/StagePlot/types/element.types';

interface ElementRendererProps {
  element: StageElement;
  isSelected: boolean;
  onClick: () => void;
  platforms?: StageElement[];
}

export class Drums extends Model3DElement {
  protected elementType = ElementType.DRUMS;

  static renderElement(props: ElementRendererProps): JSX.Element {
    return (
      <Drums
        color={props.element.color}
        position={props.element.position}
        rotation={props.element.rotation}
        name={props.element.name}
        isSelected={props.isSelected}
        onClick={props.onClick}
        platforms={props.platforms}
        hideText={props.element.hideText}
        showAxes={props.element.showAxes}
      />
    );
  }

  protected renderFallback() {
    const { isSelected } = this.props;
    const selectedColor = isSelected ? 'pink' : this.props.color || '#FF4500';

    return (
      <group>
        {/* Bombo */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.6, 16]} />
          <meshLambertMaterial color={selectedColor} />
        </mesh>

        {/* Tom de suelo izquierdo */}
        <mesh position={[-0.7, 0.3, 0.3]}>
          <cylinderGeometry args={[0.25, 0.25, 0.4, 16]} />
          <meshLambertMaterial color={selectedColor} />
        </mesh>

        {/* Tom de suelo derecho */}
        <mesh position={[0.7, 0.3, 0.3]}>
          <cylinderGeometry args={[0.25, 0.25, 0.4, 16]} />
          <meshLambertMaterial color={selectedColor} />
        </mesh>

        {/* Tom de rack */}
        <mesh position={[0, 1.2, 0.5]}>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
          <meshLambertMaterial color={selectedColor} />
        </mesh>

        {/* Caja */}
        <mesh position={[-0.5, 0.8, 0.8]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshLambertMaterial color="#F5F5DC" />
        </mesh>

        {/* Hi-hat */}
        <mesh position={[-1, 1, 0.8]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>

        {/* Crash izquierdo */}
        <mesh position={[-0.8, 1.5, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>

        {/* Ride derecho */}
        <mesh position={[0.8, 1.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 16]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
      </group>
    );
  }
}