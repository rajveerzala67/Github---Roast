import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Cosmic particle field with mouse parallax
function ParticleNebula({ mousePosition }) {
  const pointsRef = useRef();
  const count = 750;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#8B5CF6'), // violet
      new THREE.Color('#A855F7'), // electric violet
      new THREE.Color('#38BDF8'), // neon blue
      new THREE.Color('#06B6D4'), // cyan
      new THREE.Color('#DDD6FE')  // soft lavender
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const chosenColor = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    // Slow cosmic rotation
    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x += delta * 0.015;

    // Mouse parallax interpolation
    if (mousePosition.current) {
      const targetX = mousePosition.current.x * 1.5;
      const targetY = mousePosition.current.y * 1.5;
      pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, targetX, 0.05);
      pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, -targetY, 0.05);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Shooting star effect
function ShootingStars() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const top = Math.random() * 50;
      const left = Math.random() * 80;
      const duration = 1.2 + Math.random() * 0.8;

      setStars((prev) => [...prev.slice(-3), { id, top, left, duration }]);

      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== id));
      }, duration * 1000);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <span
          key={s.id}
          className="shooting-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      <style>{`
        .shooting-star {
          position: absolute;
          width: 120px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,0.9), rgba(139,92,246,0.6), transparent);
          transform: rotate(-35deg);
          border-radius: 9999px;
          filter: drop-shadow(0 0 6px #8B5CF6);
          animation: shoot linear forwards;
        }
        @keyframes shoot {
          0% {
            transform: rotate(-35deg) translateX(0);
            opacity: 1;
          }
          100% {
            transform: rotate(-35deg) translateX(300px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default function GalaxyBackground() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebGlSupported(false);
    } catch {
      setWebGlSupported(false);
    }

    const handleMouseMove = (e) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#05050D]">
      {/* Deep space radial glow layers */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-900/15 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/15 blur-[140px]" />
      <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-violet-950/20 blur-[130px]" />

      {/* 3D Canvas Scene */}
      {webGlSupported ? (
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.3} />
          {/* Thousands of tiny stars */}
          <Stars radius={60} depth={50} count={3500} factor={3.5} saturation={0.5} fade speed={1.2} />
          {/* Glowing cosmic sparkles */}
          <Sparkles count={80} scale={18} size={2.5} speed={0.4} color="#C4B5FD" opacity={0.6} />
          <ParticleNebula mousePosition={mousePosition} />
        </Canvas>
      ) : (
        /* Graceful CSS fallback if WebGL is disabled */
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-[#05050D]" />
      )}

      {/* Shooting stars */}
      <ShootingStars />
    </div>
  );
}
