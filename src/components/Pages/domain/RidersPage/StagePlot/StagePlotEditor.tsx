import { Box, IconButton, Slider, Typography } from '@mui/material';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { renderElement } from './components/element-registry';
import { Model3DElement } from './components/ModelElement';
import { Vector3Input } from './components/Vector3Input';
import { useModelPreloader } from './hooks/useModelPreloader';
import { Platform } from './renders/furniture/platform/platform';
import PositionVector from './renders/utils/position-vector';
import { ElementType, StageElement } from './types/element.types';

export const METERS_SCALE = 1;

const StagePlotEditor: React.FC = () => {
  // Hook para precargar modelos progresivamente
  useModelPreloader();

  const [stageWidth, setStageWidth] = useState(20);
  const [stageDepth, setStageDepth] = useState(20);
  const controlsRef = useRef(null);

  const [selectedElement, setSelectedElement] = useState<StageElement | null>(null);

  const [color, setColor] = useState<string>('blue');
  const [camaraHabilitada, setCamaraHabilitada] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dragging, setDragging] = useState<boolean>(false); // Estado para arrastre
  const [elements, setElements] = useState<StageElement[]>([]); // Estado para arrastre

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<THREE.Mesh>(null);
  const selectedElementRef = useRef<{ position: [number, number, number] } | null>(null);

  const rotacionTeclado = [0, -25, 0] as [number, number, number];

  // Limpiar cache cuando cambien las plataformas
  useEffect(() => {
    const platforms = elements.filter((el) => el.type === ElementType.PLATFORM);
    Model3DElement.clearPlatformCache();
  }, [
    elements
      .filter((el) => el.type === ElementType.PLATFORM)
      .map((p) => `${p.position.join(',')}-${p.width}-${p.depth}-${p.height}`)
      .join('|'),
  ]);

  useEffect(() => {
    const posPianista = [-6, 0, 2];
    const posBajista = [6, 0, 2];
    const posCantante = [0, 0, 4];

    setElements([
      // Músicos
      {
        type: ElementType.MANNEQUIN,
        position: posPianista as [number, number, number],
        rotation: rotacionTeclado,
        name: 'Pianista',
        // showAxes: true,
      },
      { type: ElementType.MANNEQUIN, position: posBajista as [number, number, number], name: 'Bajista' },
      { type: ElementType.MANNEQUIN, position: posCantante as [number, number, number], name: 'Cantante' },
      {
        type: ElementType.MANNEQUIN,
        position: [0, 0.4, -8.5] as [number, number, number],
        name: 'Baterista',
        // showAxes: true,
      },

      // // Instrumentos
      {
        type: ElementType.KEYBOARD,
        position: posPianista as [number, number, number],
        rotation: rotacionTeclado,
        name: 'Teclado',
        color: '#000000',
        hideText: true,
        // showAxes: true,
      },
      {
        type: ElementType.GUITAR,
        position: posCantante as [number, number, number],
        // rotation: rotacionTeclado,
        name: 'Teclado',
        color: '#000000',
        hideText: true,
        // showAxes: true,
      },
      {
        type: ElementType.BASS_GUITAR,
        position: posBajista as [number, number, number],
        name: 'Bajo Eléctrico',
        color: '#8B4513',
        hideText: true,
        // showAxes: true,
      },
      {
        type: ElementType.DRUMS,
        position: [0, 0, -8.5] as [number, number, number],
        name: 'Batería',
        color: '#FF4500',
        hideText: true,
        // showAxes: true,
      },

      // // Plataforma para batería
      {
        type: ElementType.PLATFORM,
        color: 'black',
        position: [0, -1, -7] as [number, number, number],
        name: 'Tarima Batería',
        width: 8,
        depth: 6,
        // height: 1,
        hideText: true,
      },

      // // Micrófonos y monitores
      {
        type: ElementType.VOCAL_MICROPHONE,
        position: posCantante as [number, number, number],
        name: 'Micrófono Principal',
        color: 'silver',
        hideText: true,
        // showAxes: true,
      },
      {
        type: ElementType.VOCAL_MICROPHONE,
        position: posPianista as [number, number, number],
        rotation: rotacionTeclado,
        name: 'Mic Teclado',
        color: 'silver',
        hideText: true,
      },
      {
        type: ElementType.VOCAL_MICROPHONE,
        position: posBajista as [number, number, number],
        name: 'Mic Bajo',
        color: 'silver',
        hideText: true,
      },

      // Monitores de piso
      {
        type: ElementType.FLOOR_MONITOR,
        position: [-5, 0, 8] as [number, number, number],
        name: 'Monitor Izq',
        hideText: true,
        color: '#333333',
      },
      {
        type: ElementType.FLOOR_MONITOR,
        position: [5, 0, 8] as [number, number, number],
        name: 'Monitor Der',
        hideText: true,
        color: '#333333',
      },
      {
        type: ElementType.FLOOR_MONITOR,
        position: [0, 0, 8] as [number, number, number],
        name: 'Monitor Centro',
        hideText: true,
        color: '#333333',
      },

      // Stands
      {
        type: ElementType.MUSIC_SHEET_STAND,
        position: posPianista as [number, number, number],
        name: 'Monitor Centro',
        hideText: true,
        color: '#333333',
      },
    ]);

    // Los controles de cámara se configuran directamente en OrbitControls
    // No necesitamos manipulación manual aquí
  }, []);

  const handlePositionChange = (axis: number, value: number) => {
    if (!selectedElement) return;

    const newPosition = [...selectedElement.position] as [number, number, number];
    newPosition[axis] = isNaN(value) ? 0 : value;

    // Limpiar cache cuando se mueve un elemento
    if (axis === 0 || axis === 2) {
      // Solo si es X o Z (puede afectar colisiones con plataformas)
      Model3DElement.clearPlatformCache();
    }
    // Si cambia Y, también limpiar cache para recalcular física con nueva altura base
    if (axis === 1) {
      Model3DElement.clearPlatformCache();
    }

    // Actualizar en el array de elementos
    const elementToUpdate = elements.find((element) => element.name === selectedElement.name);
    if (elementToUpdate) {
      elementToUpdate.position = newPosition;
      setElements([...elements]); // Forzar re-render con nueva física
    }

    // Actualizar elemento seleccionado
    setSelectedElement({
      ...selectedElement,
      position: newPosition,
    });
  };

  const handleRotationChange = (axis: number, value: number) => {
    if (!selectedElement) return;

    const currentRotation = selectedElement.rotation || [0, 0, 0];
    const newRotation = [...currentRotation] as [number, number, number];
    newRotation[axis] = isNaN(value) ? 0 : value;

    // Obtener posición actual para preservarla después de la rotación
    const currentPosition = selectedElement.position;

    // Actualizar en el array de elementos
    const elementToUpdate = elements.find((element) => element.name === selectedElement.name);
    if (elementToUpdate) {
      elementToUpdate.rotation = newRotation;
      // Asegurar que la posición se mantenga después de la rotación
      elementToUpdate.position = currentPosition;
      setElements([...elements]); // Forzar re-render
    }

    // Actualizar elemento seleccionado
    setSelectedElement({
      ...selectedElement,
      rotation: newRotation,
      position: currentPosition, // Preservar posición
    });
  };

  const handleScaleChange = (axis: number, value: number) => {
    if (!selectedElement) return;

    const currentScale = selectedElement.scale || [1, 1, 1];
    const newScale = [...currentScale] as [number, number, number];
    newScale[axis] = isNaN(value) ? 1 : Math.max(0.01, value); // Evitar escalas negativas o cero

    // Actualizar en el array de elementos
    const elementToUpdate = elements.find((element) => element.name === selectedElement.name);
    if (elementToUpdate) {
      elementToUpdate.scale = newScale;
      setElements([...elements]); // Forzar re-render
    }

    // Actualizar elemento seleccionado
    setSelectedElement({
      ...selectedElement,
      scale: newScale,
    });
  };

  const toggleFullscreen = () => {
    if (!canvasContainerRef.current) return;

    if (!isFullscreen) {
      // Entrar en pantalla completa del Canvas
      const element = canvasContainerRef.current as any;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      // Salir de pantalla completa
      const doc = document as any;
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  };

  // Detectar cambios de estado de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      setIsFullscreen(
        doc.fullscreenElement !== null ||
          doc.mozFullScreenElement !== null ||
          doc.webkitFullscreenElement !== null ||
          doc.msFullscreenElement !== null
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
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

  const handleClickOnElement = (element: StageElement) => {
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

      // Limpiar cache al arrastrar (la posición XZ cambió)
      Model3DElement.clearPlatformCache();

      console.log(selectedElement, newPosition, delta, axis);
      const elementToUpdate = elements.find((element) => element.name === selectedElement.name);
      if (elementToUpdate) {
        elementToUpdate.position = newPosition;
        setElements([...elements]); // Forzar re-render para recalcular física
      }

      setSelectedElement({
        ...selectedElement,
        position: newPosition,
      });
    }
  };

  // Renderizar ejes globales del escenario
  const renderGlobalAxes = () => {
    const axisLength = 5 * METERS_SCALE;
    const halfLength = axisLength / 2;
    const lineWidth = 0.08 * METERS_SCALE;

    return (
      <group position={[0, 0, 0]}>
        {/* Eje X global - Rojo sólido */}
        <mesh position={[-halfLength / 2, 0, 0]}>
          <boxGeometry args={[halfLength, lineWidth, lineWidth]} />
          <meshBasicMaterial color="#CC0000" />
        </mesh>
        <mesh position={[halfLength / 2, 0, 0]}>
          <boxGeometry args={[halfLength, lineWidth, lineWidth]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>

        {/* Eje Y global - Verde sólido */}
        <mesh position={[0, -halfLength / 2, 0]}>
          <boxGeometry args={[lineWidth, halfLength, lineWidth]} />
          <meshBasicMaterial color="#00CC00" />
        </mesh>
        <mesh position={[0, halfLength / 2, 0]}>
          <boxGeometry args={[lineWidth, halfLength, lineWidth]} />
          <meshBasicMaterial color="#00FF00" />
        </mesh>

        {/* Eje Z global - Azul sólido */}
        <mesh position={[0, 0, -halfLength / 2]}>
          <boxGeometry args={[lineWidth, lineWidth, halfLength]} />
          <meshBasicMaterial color="#0000CC" />
        </mesh>
        <mesh position={[0, 0, halfLength / 2]}>
          <boxGeometry args={[lineWidth, lineWidth, halfLength]} />
          <meshBasicMaterial color="#0000FF" />
        </mesh>

        {/* Origen global - Amarillo */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[lineWidth * 4, 8, 8]} />
          <meshBasicMaterial color="#FFFF00" />
        </mesh>
      </group>
    );
  };

  const renderElements = () => {
    // Separar elementos por tipo - ORDEN IMPORTANTE para física
    const platforms = elements.filter((el) => el.type === ElementType.PLATFORM);
    const nonPlatforms = elements.filter((el) => el.type !== ElementType.PLATFORM);

    // Renderizar plataformas PRIMERO (para que estén disponibles para física)
    const platformsRendered = platforms.map((element, index) => {
      const isSelected = selectedElement?.name === element.name;
      return (
        <React.Fragment key={`platform-${element.name}-${index}`}>
          {renderElement(element, isSelected, () => handleClickOnElement(element), platforms)}
        </React.Fragment>
      );
    });

    // Luego renderizar otros elementos con plataformas ya disponibles
    const othersRendered = nonPlatforms.map((element, index) => {
      const isSelected = selectedElement?.name === element.name;
      return (
        <React.Fragment key={`${element.type}-${element.name}-${index}`}>
          {renderElement(element, isSelected, () => handleClickOnElement(element), platforms)}
        </React.Fragment>
      );
    });

    return (
      <>
        {/* Ejes globales del escenario */}
        {/* {renderGlobalAxes()} */}

        <Platform ref={platformRef} width={stageWidth} depth={stageDepth} position={[0, -0.5, 0]} />
        {/* Renderizar plataformas primero, luego otros elementos */}
        {platformsRendered}
        {othersRendered}
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
      <div
        ref={canvasContainerRef}
        style={{ gridColumn: '1 / 4', gridRow: '1 / 2', position: 'relative', overflow: 'hidden' }}
      >
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
            ref={controlsRef}
            enablePan={!dragging}
            enableRotate={!dragging}
            enableZoom={true}
            zoomSpeed={1.5}
            autoRotate={autoRotate && !dragging}
            autoRotateSpeed={autoRotateSpeed}
            maxPolarAngle={Math.PI / 2}
            minDistance={2}
            maxDistance={100}
            enableDamping={true}
            dampingFactor={0.05}
          />
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

        {/* Botón de pantalla completa */}
        <IconButton
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#333',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
          size="small"
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          <DynamicIcons iconName={isFullscreen ? 'md MdFullscreenExit' : 'md MdFullscreen'} />
        </IconButton>
      </div>
      <div>
        <div onClick={() => setAutoRotate(!autoRotate)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
          <p>{autoRotate ? 'Detener' : 'Rotar'}</p>
        </div>
        <Box sx={{ width: 200, padding: '0 10px' }}>
          <Typography variant="body2" gutterBottom>
            Velocidad: {autoRotateSpeed.toFixed(1)}
          </Typography>
          <Slider
            value={autoRotateSpeed}
            onChange={(_: Event, newValue: number | number[]) => setAutoRotateSpeed(newValue as number)}
            min={0.1}
            max={10}
            step={0.2}
            size="small"
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number) => `${value.toFixed(1)} rpm`}
          />
        </Box>
      </div>
      <div style={{ gridColumn: '1 / 4', gridRow: '2 / 3', textAlign: 'center', padding: '10px' }}>
        <p>Elemento Seleccionado: {selectedElement ? selectedElement.name : ''}</p>
        {selectedElement && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', marginTop: '10px' }}
          >
            {/* Inputs de Posición */}
            <Vector3Input
              label="Posición"
              value={selectedElement.position}
              onChange={handlePositionChange}
              step={0.1}
              precision={1}
            />

            {/* Inputs de Escala */}
            <Vector3Input
              label="Escala"
              value={selectedElement.scale || [1, 1, 1]}
              onChange={handleScaleChange}
              step={0.1}
              min={0.01}
              precision={2}
              showLock={true}
            />

            {/* Inputs de Rotación */}
            <Vector3Input
              label="Rotación (grados)"
              value={selectedElement.rotation || [0, 0, 0]}
              onChange={handleRotationChange}
              step={5}
              precision={0}
              scale={180 / Math.PI} // Convertir radianes a grados para mostrar
              inverseScale={Math.PI / 180} // Convertir grados a radianes para almacenar
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StagePlotEditor;
