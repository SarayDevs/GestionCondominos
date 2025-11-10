import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function BuildingModel() {
  const { scene } = useGLTF("assets/LargeBuilding.glb");
  return <primitive object={scene} scale={1.8} position={[0, -1.3, 0]} />;
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
      {/* Círculo que simula el pasto */}
      <circleGeometry args={[3, 9]} />
      <meshStandardMaterial
        color="#2e8b57" // verde tipo pasto
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [3, 3, 5], fov: 45 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />

      {/* Piso verde */}
      <Ground />

      {/* Edificio */}
      <BuildingModel />
    </Canvas>
  );
}