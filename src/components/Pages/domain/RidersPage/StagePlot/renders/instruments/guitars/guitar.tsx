import { ReactNode } from 'react';
import * as THREE from 'three';
import { Model3DElement } from '~/components/Pages/domain/RidersPage/StagePlot/components/ModelElement';
import { ElementType, StageElement } from '~/components/Pages/domain/RidersPage/StagePlot/types/element.types';
import { METERS_SCALE } from '~/components/Pages/domain/RidersPage/StagePlot/StagePlotEditor';

interface ElementRendererProps {
  element: StageElement;
  isSelected: boolean;
  onClick: () => void;
  platforms?: StageElement[];
}

export class Guitar extends Model3DElement {
  protected elementType = ElementType.GUITAR;

  static renderElement(props: ElementRendererProps): JSX.Element {
    return (
      <Guitar
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

  protected renderFallback(): ReactNode {
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
    const selectedColor = this.props.isSelected ? 'pink' : this.props.color || '#333333';

    return (
      <mesh geometry={geometry} onClick={this.props.onClick}>
        <meshStandardMaterial color={selectedColor} />
        <pointLight position={[10, 10, 10]} />
      </mesh>
    );
  }
}
