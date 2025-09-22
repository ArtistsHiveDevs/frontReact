import { ReactNode, forwardRef } from 'react';
import { Mesh } from 'three';
import { Model3DElement } from '~/components/Pages/domain/RidersPage/StagePlot/components/ModelElement';
import { ElementType, StageElement } from '~/components/Pages/domain/RidersPage/StagePlot/types/element.types';
import { METERS_SCALE } from '~/components/Pages/domain/RidersPage/StagePlot/StagePlotEditor';

interface ElementRendererProps {
  element: StageElement;
  isSelected: boolean;
  onClick: () => void;
  platforms?: StageElement[];
}

// Componente funcional para uso directo en StagePlotEditor
interface SimplePlatformProps {
  width: number;
  depth: number;
  height?: number;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  isSelected?: boolean;
  onClick?: () => void;
}

const SimplePlatform = forwardRef<Mesh, SimplePlatformProps>(
  ({ width, depth, height = 1, position = [0, 0, 0], rotation = [0, 0, 0], color, isSelected, onClick }, ref) => {
    return (
      <mesh ref={ref} position={position} rotation={rotation} onClick={onClick}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={isSelected ? 'pink' : color || 'grey'} />
      </mesh>
    );
  }
);

SimplePlatform.displayName = 'SimplePlatform';

// Exportar ambos componentes
export { SimplePlatform as Platform };

export class PlatformElement extends Model3DElement {
  protected elementType = ElementType.PLATFORM;

  static renderElement(props: ElementRendererProps): JSX.Element {
    return (
      <PlatformElement
        color={props.element.color}
        position={props.element.position}
        rotation={props.element.rotation}
        name={props.element.name}
        isSelected={props.isSelected}
        onClick={props.onClick}
        platforms={props.platforms}
        hideText={props.element.hideText}
        showAxes={props.element.showAxes}
        width={props.element.width}
        depth={props.element.depth}
        height={props.element.height}
      />
    );
  }

  protected renderFallback(): ReactNode {
    const selectedColor = this.props.isSelected ? 'pink' : this.props.color || 'grey';
    const width = (this.props as any).width || 1;
    const depth = (this.props as any).depth || 1;
    const height = (this.props as any).height || 0.3;

    return (
      <mesh onClick={this.props.onClick}>
        <boxGeometry args={[width * METERS_SCALE, height * METERS_SCALE, depth * METERS_SCALE]} />
        <meshStandardMaterial color={selectedColor} />
      </mesh>
    );
  }
}
