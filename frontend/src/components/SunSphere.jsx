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
  emissive="#C97A1F"
  emissiveIntensity={0.15}
  color="#DDA24A"
/>
    </mesh>
  );
};

// const RotatingSun = () => {
//   const meshRef = useRef();
//   const texture = useTexture("/textures/sun.jpg");

//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += delta * 0.15;
//     }
//   });

//   return (
//     <>
//       {/* Core Sun sphere -- emissive high so it looks like it's producing its own light */}
//       <mesh ref={meshRef}>
//         <sphereGeometry args={[1.8, 64, 64]} />
//         <meshStandardMaterial
//           map={texture}
//           emissive="#FF8C00"
//           emissiveIntensity={1.1}
//           toneMapped={false}
//         />
//       </mesh>

//       {/* A slightly bigger, transparent, glowing shell around the Sun -- creates the "light pouring out" halo */}
//       <mesh>
//         <sphereGeometry args={[2.05, 32, 32]} />
//         <meshBasicMaterial
//           color="#FFB347"
//           transparent
//           opacity={0.25}
//         />
//       </mesh>
//     </>
//   );
// };

const SunSphere = () => {
  return (
    // <div className="h-64 w-64 sm:h-80 sm:w-80">
    //   <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>

    <div
  className="h-64 w-64 rounded-full sm:h-80 sm:w-80"
  // style={{ boxShadow: "0 0 60px 20px rgba(232,163,61,0.5)" }}
  style={{
  boxShadow: "0 0 100px 40px rgba(232,163,61,0.6), 0 0 40px 10px rgba(255,183,71,0.4)",
  
  overflow: "hidden",
}}
  >
  <Canvas camera={{ position: [0, 0, 4.2], fov: 42 }} gl={{ alpha: true }}>
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

// const SunSphere = () => {
//   return (
//     <div className="h-64 w-64 sm:h-80 sm:w-80">
//       <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
//         <ambientLight intensity={0.3} />
//         <Suspense fallback={null}>
//           <RotatingSun />
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// };

export default SunSphere;