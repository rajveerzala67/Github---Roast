import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function CelestialPlanet() {
  const planetRef = useRef();
  const innerRingRef = useRef();

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.25;
      planetRef.current.rotation.x += delta * 0.05;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group position={[0, 0, 0]}>
        {/* Core celestial planet */}
        <mesh ref={planetRef}>
          <sphereGeometry args={[1.6, 64, 64]} />
          <meshStandardMaterial
            color="#2E1065"
            roughness={0.4}
            metalness={0.6}
            emissive="#581C87"
            emissiveIntensity={0.35}
            wireframe={false}
          />
        </mesh>

        {/* Wireframe holographic shell */}
        <mesh>
          <sphereGeometry args={[1.72, 24, 24]} />
          <meshStandardMaterial
            color="#8B5CF6"
            wireframe
            transparent
            opacity={0.35}
            emissive="#A855F7"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Tilted Purple Orbital Ring */}
        <mesh ref={innerRingRef} rotation={[0.6, 1.2, 0.4]}>
          <ringGeometry args={[2.0, 2.15, 64]} />
          <meshStandardMaterial
            color="#A855F7"
            side={THREE.DoubleSide}
            transparent
            opacity={0.55}
            emissive="#C084FC"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function PlanetScene() {
  return (
    <div className="w-52 h-52 sm:w-64 sm:h-64 mx-auto relative select-none">
      {/* Planetary ambient glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/30 via-cyan-500/20 to-transparent blur-2xl pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 5], fov: 48 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[6, 6, 6]} intensity={1.5} color="#38BDF8" />
        <pointLight position={[-6, -4, -4]} intensity={1.2} color="#A855F7" />
        <CelestialPlanet />
      </Canvas>
    </div>
  );
}
