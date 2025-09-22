import React from 'react';
import { Model3DElement } from '~/components/Pages/domain/RidersPage/StagePlot/components/ModelElement';
import { ElementType, StageElement } from '~/components/Pages/domain/RidersPage/StagePlot/types/element.types';

interface ElementRendererProps {
  element: StageElement;
  isSelected: boolean;
  onClick: () => void;
  platforms?: StageElement[];
}

export class Keyboard extends Model3DElement {
  protected elementType = ElementType.KEYBOARD;

  static renderElement(props: ElementRendererProps): JSX.Element {
    return (
      <Keyboard
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
    const selectedColor = isSelected ? 'pink' : this.props.color || '#000000';

    return (
      <group>
        {/* Base del teclado */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[2, 0.2, 0.6]} />
          <meshLambertMaterial color={selectedColor} />
        </mesh>

        {/* Teclas blancas */}
        {Array.from({ length: 14 }, (_, i) => (
          <mesh key={`white-${i}`} position={[-1.3 + i * 0.18, 0.25, 0.1]}>
            <boxGeometry args={[0.15, 0.1, 0.4]} />
            <meshLambertMaterial color="#FFFFFF" />
          </mesh>
        ))}

        {/* Teclas negras */}
        {[0, 1, 3, 4, 5, 7, 8, 10, 11, 12].map((i) => (
          <mesh key={`black-${i}`} position={[-1.21 + i * 0.18, 0.3, 0.25]}>
            <boxGeometry args={[0.1, 0.15, 0.25]} />
            <meshLambertMaterial color="#000000" />
          </mesh>
        ))}

        {/* Panel de controles */}
        <mesh position={[0, 0.25, -0.2]}>
          <boxGeometry args={[1.8, 0.1, 0.2]} />
          <meshLambertMaterial color="#333333" />
        </mesh>

        {/* Botones de control */}
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={`button-${i}`} position={[-0.7 + i * 0.2, 0.32, -0.2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
            <meshLambertMaterial color="#FF0000" />
          </mesh>
        ))}

        {/* Display */}
        <mesh position={[0.6, 0.32, -0.2]}>
          <boxGeometry args={[0.4, 0.05, 0.15]} />
          <meshLambertMaterial color="#001100" />
        </mesh>
      </group>
    );
  }
}