
import { useRef, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";


const RotatingPlanet = ({ color, textureUrl }) => {
  const meshRef = useRef();

  
  const texture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.6, 64, 64]} />
      {texture ? (
        <meshStandardMaterial map={texture} roughness={0.7} metalness={0.05} />
      ) : (
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      )}
    </mesh>
  );
};

const PlanetSphere3D = ({ color = "#4C7BE1", textureUrl }) => {
  return (
    <div className="h-72 w-full overflow-hidden rounded-2xl border border-line bg-panel sm:h-96">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
       
        <ambientLight intensity={0.4} />
<pointLight position={[5, 3, 5]} intensity={2} />
<pointLight position={[-5, -3, -5]} intensity={0.5} color="#4488ff" />

        <Suspense fallback={null}>
          <RotatingPlanet color={color} textureUrl={textureUrl} />
        </Suspense>

        <Stars radius={50} depth={30} count={800} factor={2} fade speed={0.5} />
       
        <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default PlanetSphere3D;