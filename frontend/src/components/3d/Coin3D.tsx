'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Cylinder } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Coin({ symbol, color = "#8b5cf6" }: { symbol: string, color?: string }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Cylinder args={[2, 2, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
        </Cylinder>
        
        {/* Inner face */}
        <Cylinder args={[1.8, 1.8, 0.22, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.2} />
        </Cylinder>
        
        {/* Front text */}
        <Text
          position={[0, 0, 0.12]}
          fontSize={0.8}
          color={color}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {symbol}
        </Text>
        
        {/* Back text */}
        <Text
          position={[0, 0, -0.12]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.8}
          color={color}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {symbol}
        </Text>
      </Float>
    </group>
  );
}

export default function Coin3D({ symbol, color }: { symbol: string, color?: string }) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-5, -5, 5]} intensity={1} color={color || "#8b5cf6"} />
        <Coin symbol={symbol} color={color} />
      </Canvas>
    </div>
  );
}
