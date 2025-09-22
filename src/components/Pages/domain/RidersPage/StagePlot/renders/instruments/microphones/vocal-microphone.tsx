import { ReactNode } from 'react';
import { Model3DElement } from '~/components/Pages/domain/RidersPage/StagePlot/components/ModelElement';
import { ElementType, StageElement } from '~/components/Pages/domain/RidersPage/StagePlot/types/element.types';
import { METERS_SCALE } from '~/components/Pages/domain/RidersPage/StagePlot/StagePlotEditor';

interface ElementRendererProps {
  element: StageElement;
  isSelected: boolean;
  onClick: () => void;
  platforms?: StageElement[];
}

export class VocalMicrophone extends Model3DElement {
  protected elementType = ElementType.VOCAL_MICROPHONE;

  static renderElement(props: ElementRendererProps): JSX.Element {
    return (
      <VocalMicrophone
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
    const selectedColor = this.props.isSelected ? 'pink' : this.props.color || '#333333';

    return (
      <>
        {/* Base del micrófono */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3 * METERS_SCALE, 0.3 * METERS_SCALE, 1.5 * METERS_SCALE, 8]} />
          <meshStandardMaterial color={selectedColor} />
        </mesh>
        {/* Cabeza del micrófono */}
        <mesh position={[0, 0.9 * METERS_SCALE, 0]}>
          <sphereGeometry args={[0.2 * METERS_SCALE, 8, 8]} />
          <meshStandardMaterial color={selectedColor} />
        </mesh>
        {/* Soporte */}
        <mesh position={[0, -0.8 * METERS_SCALE, 0]}>
          <cylinderGeometry args={[0.05 * METERS_SCALE, 0.05 * METERS_SCALE, 0.3 * METERS_SCALE, 6]} />
          <meshStandardMaterial color={selectedColor} />
        </mesh>
      </>
    );
  }
}