import React from 'react';

interface PositionVectorProps {
  x: number;
  y: number;
  z: number;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  onDragX: (delta: number) => void;
  onDragZ: (delta: number) => void;
}

const LONGITUD_VECTOR = 3;
const DESPLAZAMIENTO = 2;

const Vector: React.FC<{
  color: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  onClick: () => void;
  onDrag: (delta: number) => void; // Agregar manejo de arrastre
  setDragging: (state: boolean) => void;
}> = ({ color, position, rotation, onClick, onDrag, setDragging }) => {
  // Implementar el manejo del drag en el componente Vector
  // ...

  //   const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
  //     event.stopPropagation();
  //     if (setDragging) {
  //       setDragging(true);
  //     }
  //     //   onDrag(.offset[0]);
  //     console.log(event);
  //     // onDrag(1); // Esto es solo un ejemplo, deberás implementar la lógica para actualizar la posición
  //   };

  //   const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
  //     event.stopPropagation();
  //     if (setDragging) {
  //       setDragging(false);
  //     }
  //   };

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      {/* Cilindro representando el eje del vector */}
      <mesh>
        {/* <mesh onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}> */}
        <cylinderGeometry args={[0.1, 0.1, LONGITUD_VECTOR * 2, 32]} /> {/* Ajustar la altura del cilindro */}
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Cono en la punta del vector */}
      <mesh position={[0, LONGITUD_VECTOR, 0]}>
        {/* <mesh
        position={[0, LONGITUD_VECTOR, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={(event) => console.log('jksajld', event)}
      > */}{' '}
        {/* Ajustar la posición del cono */}
        <coneGeometry args={[0.3, 0.4, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

const PositionVector: React.FC<PositionVectorProps> = ({ x, y, z, setDragging, onDragX, onDragZ }) => {
  const handleVectorClick = (color: string) => {
    console.log(`Vector ${color} clicked!`);

    switch (color) {
      case 'lime':
        onDragZ(1 * DESPLAZAMIENTO);
        break;
      case 'green':
        onDragZ(-1 * DESPLAZAMIENTO);
        break;
      case 'red':
        onDragX(1 * DESPLAZAMIENTO);
        break;
      case 'maroon':
        onDragX(-1 * DESPLAZAMIENTO);
        break;
    }
  };

  return (
    <group>
      <Vector
        color="lime"
        position={[x, y, z + LONGITUD_VECTOR]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={() => handleVectorClick('lime')}
        onDrag={(delta) => onDragZ(delta)}
        setDragging={setDragging}
      />
      <Vector
        color="red"
        position={[x + LONGITUD_VECTOR, y, z]} // Ajustar la posición para los vectores en el plano horizontal
        rotation={[0, 0, -Math.PI / 2]} // Rotar 90° en el plano Z
        onClick={() => handleVectorClick('red')}
        onDrag={(delta) => onDragX(delta)}
        setDragging={setDragging}
      />
      <Vector
        color="green"
        position={[x, y, z - LONGITUD_VECTOR]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => handleVectorClick('green')}
        onDrag={(delta) => onDragZ(delta)}
        setDragging={setDragging}
      />
      <Vector
        color="maroon"
        position={[x - LONGITUD_VECTOR, y, z]} // Ajustar la posición para los vectores en el plano horizontal
        rotation={[0, 0, Math.PI / 2]} // Rotar 90° en el plano Z
        onClick={() => handleVectorClick('maroon')}
        onDrag={(delta) => onDragX(delta)}
        setDragging={setDragging}
      />
    </group>
  );
};

export default PositionVector;
