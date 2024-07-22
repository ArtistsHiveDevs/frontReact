import React from 'react';

interface DraggableObjectProps {
  position: [number, number, number];
  color: string;
}

const DraggableObject: React.FC<DraggableObjectProps> = ({ position, color }) => {
  return <>Draggable</>;
  // const ref = useRef<THREE.Mesh>(null);
  // const [dragging, setDragging] = useState(false);
  // const [offset, setOffset] = useState(new THREE.Vector3());
  // useFrame(({ raycaster }) => {
  //   if (dragging && ref.current) {
  //     const intersects = raycaster.intersectObject(ref.current);
  //     if (intersects.length > 0) {
  //       const point = intersects[0].point;
  //       ref.current.position.copy(point.sub(offset));
  //     }
  //   }
  // });
  // const handlePointerDown = (e: THREE.PointerEvent) => {
  //   e.stopPropagation();
  //   if (ref.current) {
  //     setDragging(true);
  //     const intersection = new THREE.Vector3();
  //     e.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), intersection);
  //     setOffset(intersection.sub(ref.current.position));
  //     document.body.style.cursor = 'grabbing';
  //   }
  // };
  // const handlePointerUp = () => {
  //   setDragging(false);
  //   document.body.style.cursor = 'auto';
  // };
  // return (
  //   <mesh
  //     ref={ref}
  //     position={position}
  //     onPointerDown={handlePointerDown}
  //     onPointerUp={handlePointerUp}
  //     onPointerLeave={handlePointerUp}
  //   >
  //     <boxGeometry args={[1, 1, 1]} />
  //     <meshStandardMaterial color={color} />
  //   </mesh>
  // );
};

export { DraggableObject };
