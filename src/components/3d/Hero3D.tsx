'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Torus, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingElements() {
  const group = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
      // Parallax effect based on mouse position
      const targetX = (state.pointer.x * 2);
      const targetY = (state.pointer.y * 2);
      group.current.position.x += (targetX - group.current.position.x) * 0.05;
      group.current.position.y += (targetY - group.current.position.y) * 0.05;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x += 0.002;
      torusRef.current.rotation.y += 0.003;
      torusRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * (Math.PI / 2)) * 0.2; // 4s cycle
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <Torus ref={torusRef} args={[2, 0.4, 16, 64]} position={[-3, 1, -5]} rotation={[Math.PI / 4, 0, 0]}>
          <meshStandardMaterial color="#8b5cf6" roughness={0.2} metalness={0.8} toneMapped={false} emissive="#8b5cf6" emissiveIntensity={0.2} />
        </Torus>
      </Float>
      
      <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
        <Sphere args={[1, 24, 24]} position={[3, -1, -3]}>
          <meshStandardMaterial color="#34d399" roughness={0.1} metalness={0.9} toneMapped={false} emissive="#34d399" emissiveIntensity={0.1} />
        </Sphere>
      </Float>
      
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <Torus args={[1.5, 0.3, 16, 48]} position={[0, -3, -8]} rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
          <meshStandardMaterial color="#f87171" roughness={0.3} metalness={0.7} toneMapped={false} emissive="#f87171" emissiveIntensity={0.1} />
        </Torus>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-finova-navy">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 45 }} performance={{ min: 0.5 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
        <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
        <FloatingElements />
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.2} intensity={1.5} />
        </EffectComposer>
      </Canvas>
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-finova-navy/50 to-finova-navy pointer-events-none" />
    </div>
  );
}
