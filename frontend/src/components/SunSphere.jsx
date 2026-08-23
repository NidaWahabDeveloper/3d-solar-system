// Hero section ke liye rotating 3D Sun -- asal texture image ke sath, sirf flat color nahi.

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei"; // ye hook image ko 3D texture ki tarah load karta hai
import { useRef } from "react";

// RotatingSun: asal mesh jo texture ke sath spin karega
const RotatingSun = () => {
  const meshRef = useRef();

  // Texture image ko load karo (public folder se, isliye path "/textures/sun.jpg" se shuru hota hai)
  const texture = useTexture("/textures/sun.jpg");

  // Har frame pe thoda rotate karo -- Sun ko planets se thoda slower rakha (0.15 vs 0.25)
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.8, 64, 64]} />
      {/* emissive banaya taake Sun khud "chamakta" hua dikhe, sirf light se roshan nahi */}
      <meshStandardMaterial
        map={texture}
        emissive="#E8A33D"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
};

const SunSphere = () => {
  return (
    <div className="h-64 w-64 sm:h-80 sm:w-80">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 3, 5]} intensity={1.5} />
        {/* Suspense zaroori hai kyunki texture load hone me thoda time lagta hai */}
        <Suspense fallback={null}>
          <RotatingSun />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SunSphere;