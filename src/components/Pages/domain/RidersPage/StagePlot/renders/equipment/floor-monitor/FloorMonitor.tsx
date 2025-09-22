import React from 'react';
import { Model3DElement } from '~/components/Pages/domain/RidersPage/StagePlot/components/ModelElement';
import { ElementType, StageElement } from '~/components/Pages/domain/RidersPage/StagePlot/types/element.types';

interface ElementRendererProps {
  element: StageElement;
  isSelected: boolean;
  onClick: () => void;
  platforms?: StageElement[];
}

export class FloorMonitor extends Model3DElement {
  protected elementType = ElementType.FLOOR_MONITOR;

  static renderElement(props: ElementRendererProps): JSX.Element {
    return (
      <FloorMonitor
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
    const selectedColor = isSelected ? 'pink' : this.props.color || '#333333';

    return (
      <group>
        {/* Cuerpo principal del monitor */}
        <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.4]} />
          <meshLambertMaterial color={selectedColor} />
        </mesh>

        {/* Rejilla del altavoz principal */}
        <mesh position={[0, 0.25, 0.21]} rotation={[-Math.PI / 6, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
          <meshLambertMaterial color="#222222" />
        </mesh>

        {/* Tweeter */}
        <mesh position={[0, 0.4, 0.15]} rotation={[-Math.PI / 6, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshLambertMaterial color="#888888" />
        </mesh>

        {/* Base de apoyo */}
        <mesh position={[0, 0.05, -0.2]}>
          <boxGeometry args={[0.9, 0.1, 0.3]} />
          <meshLambertMaterial color={selectedColor} />
        </mesh>

        {/* Conector XLR */}
        <mesh position={[-0.35, 0.15, -0.15]}>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
          <meshLambertMaterial color="#000000" />
        </mesh>

        {/* LED de estado */}
        <mesh position={[0.3, 0.4, 0.05]} rotation={[-Math.PI / 6, 0, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshLambertMaterial color="#00FF00" />
        </mesh>

        {/* Logo/marca */}
        <mesh position={[0, 0.45, 0.1]} rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.01]} />
          <meshLambertMaterial color="#FFFFFF" />
        </mesh>
      </group>
    );
  }
}