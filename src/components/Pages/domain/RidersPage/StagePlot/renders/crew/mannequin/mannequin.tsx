import React, { ReactNode } from 'react';
import { METERS_SCALE } from '~/components/Pages/domain/RidersPage/StagePlot/StagePlotEditor';
import { ElementType, StageElement } from '~/components/Pages/domain/RidersPage/StagePlot/types/element.types';
import { Model3DElement } from '~/components/Pages/domain/RidersPage/StagePlot/components/ModelElement';

interface ElementRendererProps {
  element: StageElement;
  isSelected: boolean;
  onClick: () => void;
  platforms?: StageElement[];
}

export class Mannequin extends Model3DElement {
  protected elementType = ElementType.MANNEQUIN;

  static renderElement(props: ElementRendererProps): JSX.Element {
    return (
      <Mannequin
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

  protected renderFallback(): ReactNode {
    const selectedColor = this.props.isSelected ? 'pink' : this.props.color || '#eed09d';

    const createCylinder = (height: number, radius: number, position: [number, number, number]) => (
      <mesh position={position}>
        <cylinderGeometry args={[radius * METERS_SCALE, radius * METERS_SCALE, height * METERS_SCALE, 12]} />
        <meshStandardMaterial color={selectedColor} />
      </mesh>
    );

    const createSphere = (radius: number, position: [number, number, number]) => (
      <mesh position={position}>
        <sphereGeometry args={[radius * METERS_SCALE, 12, 12]} />
        <meshStandardMaterial color={selectedColor} />
      </mesh>
    );

    const createBox = (width: number, height: number, depth: number, position: [number, number, number]) => (
      <mesh position={position}>
        <boxGeometry args={[width * METERS_SCALE, height * METERS_SCALE, depth * METERS_SCALE]} />
        <meshStandardMaterial color={selectedColor} />
      </mesh>
    );

    return (
      <>
        {/* Cabeza */}
        {createSphere(0.5, [0, 3.5, 0])}
        {/* Torso */}
        {createSphere(0.5, [0, 2.6, 0])}
        {createCylinder(1.1, 0.5, [0, 2.15, 0])}
        {createSphere(0.47, [0, 1.5, 0])}

        {/* Hombro izquierdo */}
        {createSphere(0.23, [-0.756, 2.6, 0])}
        {/* Brazo izquierdo */}
        {createCylinder(0.55, 0.15, [-0.756, 2.2, 0])}
        {createSphere(0.19, [-0.756, 1.95, 0])}
        {createCylinder(0.55, 0.15, [-0.756, 1.6, 0])}
        {/* Mano izquierda */}
        {createSphere(0.25, [-0.756, 1.2, 0])}

        {/* Hombro derecho */}
        {createSphere(0.23, [0.756, 2.6, 0])}
        {/* Brazo derecho */}
        {createCylinder(0.55, 0.15, [0.756, 2.2, 0])}
        {createSphere(0.19, [0.756, 1.95, 0])}
        {createCylinder(0.55, 0.15, [0.756, 1.6, 0])}
        {/* Mano derecha */}
        {createSphere(0.25, [0.756, 1.2, 0])}

        {/* Pierna izquierda */}
        {createCylinder(2.5, 0.15, [-0.25, 0, 0])}
        {createSphere(0.19, [-0.25, 0.4, 0])}
        {createSphere(0.3, [-0.25, -1, 0])}

        {/* Pierna derecha */}
        {createCylinder(2.5, 0.15, [0.25, 0, 0])}
        {createSphere(0.19, [0.25, 0.4, 0])}
        {createSphere(0.3, [0.25, -1, 0])}
      </>
    );
  }
}
