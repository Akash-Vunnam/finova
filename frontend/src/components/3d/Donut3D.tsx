'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Torus } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface SegmentData {
  name?: string;
  value?: number;
  color: string;
  size?: number; // size in percentage (0 to 1)
}

interface Donut3DProps {
  data?: SegmentData[];
}

const defaultSegments: SegmentData[] = [
  { color: '#8b5cf6', size: 0.4 },
  { color: '#34d399', size: 0.3 },
  { color: '#f87171', size: 0.2 },
  { color: '#60a5fa', size: 0.1 },
];

function DonutSegment({ color, size, startAngle }: { color: string, size: number, startAngle: number }) {
  const arc = Math.PI * 2 * size;
  
  return (
    <Torus args={[2, 0.5, 32, 100, arc]} rotation={[0, 0, startAngle]}>
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
    </Torus>
  );
}

function DonutGroup({ segments }: { segments: SegmentData[] }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      group.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  // Calculate actual sizes if values are provided instead of sizes
  let processedSegments = segments;
  if (segments.length > 0 && segments[0].value !== undefined && segments[0].size === undefined) {
    const total = segments.reduce((sum, seg) => sum + (seg.value || 0), 0);
    processedSegments = segments.map(seg => ({ ...seg, size: (seg.value || 0) / total }));
  }

  let currentAngle = 0;
  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        {processedSegments.map((seg, i) => {
          const segSize = seg.size || 0.1;
          const segElement = <DonutSegment key={i} color={seg.color} size={segSize} startAngle={currentAngle} />;
          currentAngle += Math.PI * 2 * segSize;
          return segElement;
        })}
      </Float>
    </group>
  );
}

export default function Donut3D({ data }: Donut3DProps) {
  const segments = data || defaultSegments;
  
  return (
    <div className="w-full h-[300px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
        <DonutGroup segments={segments} />
      </Canvas>
    </div>
  );
}
