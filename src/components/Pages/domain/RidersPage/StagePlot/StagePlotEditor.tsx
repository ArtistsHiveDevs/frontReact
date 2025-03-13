import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Mannequin } from './renders/crew/mannequin/mannequin';
import { Platform } from './renders/furniture/platform/platform';
import { Guitar } from './renders/instruments/guitars/guitar';
import PositionVector from './renders/utils/position-vector';

export const METERS_SCALE = 1;

const StagePlotEditor: React.FC = () => {
  const [stageWidth, setStageWidth] = useState(20);
  const [stageDepth, setStageDepth] = useState(20);
  const controlsRef = useRef(null);

  const [selectedElement, setSelectedElement] = useState<{
    type: 'guitar' | 'mannequin';
    color: string;
    name: string;
    position: [number, number, number];
  } | null>(null);

  const [color, setColor] = useState<string>('blue');
  const [camaraHabilitada, setCamaraHabilitada] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [dragging, setDragging] = useState<boolean>(false); // Estado para arrastre
  const [elements, setElements] = useState([]); // Estado para arrastre

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const platformRef = useRef<THREE.Mesh>(null);
  const selectedElementRef = useRef<{ position: [number, number, number] } | null>(null);

  useEffect(() => {
    setElements([
      { type: 'mannequin', position: [-4, 1.3, 0] as [number, number, number], name: 'Teclados' },
      { type: 'mannequin', position: [5, 1.3, 0] as [number, number, number], name: 'Bajista' },
      { type: 'mannequin', position: [0, 1.3, 3.5] as [number, number, number], name: 'Cantante' },
      { type: 'mannequin', position: [2, 2.3, -6] as [number, number, number], name: 'Baterista' },
      { type: 'platform', color: 'black', position: [0, 0.7, -7] as [number, number, number], name: 'TarimaBaterista' },
    ]);

    const controls = controlsRef.current;
    if (controls) {
      // Limitar el ángulo de rotación en el eje Z
      const maxAzimuthAngle = Math.PI / 2; // Ajusta el límite según tus necesidades
      controls.addEventListener('change', () => {
        // Obtener el ángulo actual de la rotación en el eje Z
        const currentRotation = controls.object.rotation.z;

        // Limitar la rotación a un rango específico
        if (currentRotation < -maxAzimuthAngle) {
          controls.object.rotation.z = -maxAzimuthAngle;
        } else if (currentRotation > maxAzimuthAngle) {
          controls.object.rotation.z = maxAzimuthAngle;
        }
      });
    }
  }, []);

  const handleExport = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'scene.png';
      link.click();
    }
  };

  const handleClickOnElement = (element: any) => {
    if (selectedElement?.name !== element?.name) {
      setSelectedElement(element);
      setDragging(true);
    } else {
      setSelectedElement(null);
      setDragging(false);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setSelectedElement(null);
    }
  };
  const handleElementDrag = (delta: number, axis: 'x' | 'z') => {
    if (selectedElement) {
      const newPosition = [...selectedElement.position] as [number, number, number];
      if (axis === 'x') {
        let possibleNewPosition = newPosition[0] + delta; // Ajustar la posición en el eje X
        if (possibleNewPosition > stageDepth / 2) {
          possibleNewPosition = stageDepth / 2;
        } else if (possibleNewPosition < -stageDepth / 2) {
          possibleNewPosition = -stageDepth / 2;
        }
        newPosition[0] = possibleNewPosition;
      } else if (axis === 'z') {
        let possibleNewPosition = newPosition[2] + delta; // Ajustar la posición en el eje X
        if (possibleNewPosition > stageWidth / 2) {
          possibleNewPosition = stageWidth / 2;
        } else if (possibleNewPosition < -stageWidth / 2) {
          possibleNewPosition = -stageWidth / 2;
        }
        newPosition[2] = possibleNewPosition;
      }

      console.log(selectedElement, newPosition, delta, axis);
      elements.find((element) => element.name === selectedElement.name).position = newPosition;

      setSelectedElement({
        ...selectedElement,
        position: newPosition,
      });
    }
  };

  const renderGuitar = (params: {
    type?: string;
    color?: string;
    position?: [number, number, number];
    name?: string;
    isSelected?: boolean;
  }) => (
    <Guitar
      color={params.color}
      position={params.position || [0, 0, 0]}
      name={params.name || ''}
      isSelected={params.isSelected}
      onClick={() => handleClickOnElement(params)}
    />
  );

  const renderMannequin = (params: {
    color?: string;
    position?: [number, number, number];
    name?: string;
    isSelected?: boolean;
  }) => (
    <Mannequin
      color={params.color}
      position={params.position || [0, 0, 0]}
      name={params.name || ''}
      isSelected={params.isSelected}
      onClick={() => handleClickOnElement(params)}
    />
  );

  const renderElements = () => {
    const rendered = elements.map((elementInfo) => {
      const cloneInfo = { ...elementInfo };
      delete cloneInfo.type;
      const result = (function () {
        switch (elementInfo.type) {
          case 'guitar':
            return renderGuitar({ ...elementInfo, isSelected: selectedElement?.name === elementInfo.name });
          case 'mannequin':
            return renderMannequin({ ...elementInfo, isSelected: selectedElement?.name === elementInfo.name });
          case 'platform':
            return (
              <Platform
                ref={platformRef}
                width={8}
                depth={6}
                position={elementInfo.position}
                color={elementInfo.color}
                height={10}
                isSelected={selectedElement?.name === elementInfo.name}
                onClick={() => handleClickOnElement(elementInfo)}
              />
            );
        }
      })();
      return result;
    });

    return (
      <>
        <Platform ref={platformRef} width={stageWidth} depth={stageDepth} position={[0, -0.3, 0]} />
        {rendered}
        {selectedElement && (
          <PositionVector
            x={selectedElement.position[0]}
            y={selectedElement.position[1]}
            z={selectedElement.position[2]}
            setDragging={(value) => {
              console.log('DRAGGIN!!!!! ', value);
              setDragging(value);
            }}
            onDragX={(delta: number) => handleElementDrag(delta, 'x')}
            onDragZ={(delta: number) => handleElementDrag(delta, 'z')}
          />
        )}
      </>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '90vh',
        width: '80vw',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gridTemplateRows: '2fr 1fr',
        gap: '10px',
        maxWidth: '80vw',
        maxHeight: '90vh',
      }}
    >
      <div style={{ gridColumn: '1 / 4', gridRow: '1 / 2', position: 'relative', overflow: 'hidden' }}>
        <Canvas
          style={{ height: '100%', width: '100%' }}
          onCreated={({ gl }) => {
            if (canvasRef.current) {
              canvasRef.current = gl.domElement;
            }
          }}
          onClick={handleCanvasClick}
        >
          <color attach="background" args={['white']} />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {renderElements()}
          <PerspectiveCamera
            makeDefault
            position={[5, 10, 20]} // Posición inicial de la cámara
            fov={75} // Campo de visión
            near={0.1} // Cota cercana del plano de recorte
            far={1000} // Cota lejana del plano de recorte
          />
          <OrbitControls
            // enablePan={camaraHabilitada}
            // enableRotate={!dragging}
            ref={controlsRef}
            // enableZoom={!dragging}
            // enabled={camaraHabilitada}
            autoRotate={autoRotate}
            autoRotateSpeed={8}
            // maxPolarAngle={}
          />{' '}
          {/* Inhabilitar el movimiento de la cámara mientras se arrastra */}
        </Canvas>
        <div
          style={{
            position: 'absolute',
            bottom: '5px',
            left: '5px',
            color: 'black',
            backgroundColor: 'white',
            padding: '2px 5px',
            fontSize: '12px',
          }}
        >
          Vista Principal
        </div>
      </div>
      <div onClick={() => setAutoRotate(!autoRotate)}>
        <p>{autoRotate ? 'Detener' : 'Rotar'}</p>
      </div>
      <div style={{ gridColumn: '1 / 4', gridRow: '2 / 3', textAlign: 'center' }}>
        <p>Elemento Seleccionado: {selectedElement ? selectedElement.name : ''}</p>
      </div>
    </div>
  );
};

export default StagePlotEditor;
