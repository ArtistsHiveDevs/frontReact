import React, { ReactNode } from 'react';
import { Model3DElement } from '~/components/Pages/domain/RidersPage/StagePlot/components/ModelElement';
import { ElementType, StageElement } from '~/components/Pages/domain/RidersPage/StagePlot/types/element.types';
import { METERS_SCALE } from '~/components/Pages/domain/RidersPage/StagePlot/StagePlotEditor';

interface ElementRendererProps {
  element: StageElement;
  isSelected: boolean;
  onClick: () => void;
  platforms?: StageElement[];
}

export class MusicSheetStand extends Model3DElement {
  protected elementType = ElementType.MUSIC_SHEET_STAND;

  static renderElement(props: ElementRendererProps): JSX.Element {
    return (
      <MusicSheetStand
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
    const selectedColor = this.props.isSelected ? 'pink' : this.props.color || '#8B4513';

    return (
      <group>
        {/* Base tripod del atril */}
        <group>
          {/* Pata 1 */}
          <mesh position={[0.4 * METERS_SCALE, 0.4 * METERS_SCALE, 0]} rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.02 * METERS_SCALE, 0.02 * METERS_SCALE, 0.8 * METERS_SCALE, 8]} />
            <meshLambertMaterial color="#444444" />
          </mesh>

          {/* Pata 2 */}
          <mesh position={[-0.2 * METERS_SCALE, 0.4 * METERS_SCALE, 0.35 * METERS_SCALE]} rotation={[Math.PI / 6, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.02 * METERS_SCALE, 0.02 * METERS_SCALE, 0.8 * METERS_SCALE, 8]} />
            <meshLambertMaterial color="#444444" />
          </mesh>

          {/* Pata 3 */}
          <mesh position={[-0.2 * METERS_SCALE, 0.4 * METERS_SCALE, -0.35 * METERS_SCALE]} rotation={[-Math.PI / 6, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.02 * METERS_SCALE, 0.02 * METERS_SCALE, 0.8 * METERS_SCALE, 8]} />
            <meshLambertMaterial color="#444444" />
          </mesh>
        </group>

        {/* Poste vertical central */}
        <mesh position={[0, 0.9 * METERS_SCALE, 0]}>
          <cylinderGeometry args={[0.025 * METERS_SCALE, 0.025 * METERS_SCALE, 1.0 * METERS_SCALE, 8]} />
          <meshLambertMaterial color="#666666" />
        </mesh>

        {/* Soporte del atril (superficie inclinada) */}
        <mesh position={[0, 1.4 * METERS_SCALE, 0.1 * METERS_SCALE]} rotation={[-Math.PI / 8, 0, 0]}>
          <boxGeometry args={[0.5 * METERS_SCALE, 0.4 * METERS_SCALE, 0.02 * METERS_SCALE]} />
          <meshLambertMaterial color={selectedColor} />
        </mesh>

        {/* Borde inferior para sostener partituras */}
        <mesh position={[0, 1.15 * METERS_SCALE, 0.2 * METERS_SCALE]}>
          <cylinderGeometry args={[0.01 * METERS_SCALE, 0.01 * METERS_SCALE, 0.5 * METERS_SCALE, 8]} />
          <meshLambertMaterial color="#333333" />
        </mesh>

        {/* Partituras simuladas (opcional) */}
        <mesh position={[0, 1.45 * METERS_SCALE, 0.12 * METERS_SCALE]} rotation={[-Math.PI / 8, 0, 0]}>
          <boxGeometry args={[0.35 * METERS_SCALE, 0.25 * METERS_SCALE, 0.005 * METERS_SCALE]} />
          <meshLambertMaterial color="#FFFFFF" />
        </mesh>
      </group>
    );
  }
}