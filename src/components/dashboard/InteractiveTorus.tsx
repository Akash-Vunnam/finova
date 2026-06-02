'use client';

import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useInView } from 'framer-motion';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { RippleEffect } from './RippleEffect';

interface SegmentData {
  name: string;
  value: number;
  color: string;
  size?: number;
}

const defaultSegments: SegmentData[] = [
  { name: 'US Equities', value: 4500, color: '#8b5cf6' }, // purple
  { name: 'Tech Growth', value: 3200, color: '#34d399' }, // emerald
  { name: 'Crypto', value: 2800, color: '#f87171' }, // red
  { name: 'Cash', value: 1500, color: '#60a5fa' }, // blue
];

function DonutSegment({ 
  seg, 
  startAngle, 
  isHovered, 
  onHover 
}: { 
  seg: SegmentData & { size: number }; 
  startAngle: number; 
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  const arc = Math.PI * 2 * seg.size;
  const centerAngle = startAngle + arc / 2;
  
  // Normal vector pointing outward from center
  const normalX = Math.cos(centerAngle);
  const normalY = Math.sin(centerAngle);

  // Target extrusion distance
  const targetDistance = isHovered ? 0.3 : 0;
  // Target emissive intensity
  const targetEmissive = isHovered ? 0.4 : 0.0;

  useFrame((state, delta) => {
    // Disable motion for accessibility
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (meshRef.current) {
      // Lerp position outward along normal
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, normalX * targetDistance, delta * 5);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, normalY * targetDistance, delta * 5);
    }
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, targetEmissive, delta * 5);
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    onHover(false);
    document.body.style.cursor = 'default';
  };

  return (
    <mesh 
      ref={meshRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <torusGeometry args={[2, 0.5, 32, 100, arc]} />
      <meshStandardMaterial 
        ref={materialRef}
        color={seg.color} 
        emissive={seg.color}
        emissiveIntensity={0}
        roughness={0.2} 
        metalness={0.6} 
      />
      {/* Rotate the mesh itself so it starts at startAngle */}
      <group rotation={[0, 0, startAngle]} />
    </mesh>
  );
}

// Fixed orientation wrapper
function DonutSegmentWrapper({ seg, startAngle, isHovered, onHover }: any) {
  return (
    <group rotation={[0, 0, startAngle]}>
      <DonutSegment seg={seg} startAngle={startAngle} isHovered={isHovered} onHover={onHover} />
    </group>
  );
}
// Actually, it's easier to create the geometry at angle 0 and rotate the mesh, but torus geometry starts at 0.
// Let's rewrite DonutSegment correctly to handle rotation.

function CorrectDonutSegment({ 
  seg, 
  startAngle, 
  isHovered, 
  onHover 
}: { 
  seg: SegmentData & { size: number }; 
  startAngle: number; 
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  const arc = Math.PI * 2 * seg.size;
  // Center angle in local space is arc / 2.
  const centerAngle = arc / 2;
  
  const normalX = Math.cos(centerAngle);
  const normalY = Math.sin(centerAngle);

  const targetDistance = isHovered ? 0.3 : 0;
  const targetEmissive = isHovered ? 0.4 : 0.0;

  useFrame((state, delta) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (meshRef.current) {
        meshRef.current.position.z = targetDistance;
      }
      return;
    }

    if (meshRef.current) {
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetDistance, delta * 8);
    }
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, targetEmissive, delta * 8);
    }
  });

  return (
    <group rotation={[0, 0, startAngle]}>
      <mesh 
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { onHover(false); document.body.style.cursor = 'default'; }}
      >
        <torusGeometry args={[2, 0.5, 32, 100, arc]} />
        <meshPhysicalMaterial 
          ref={materialRef}
          color={seg.color} 
          emissive={seg.color}
          emissiveIntensity={0}
          roughness={0.1} 
          metalness={0.1} 
          transmission={0.9}
          ior={1.5}
          thickness={0.5}
          clearcoat={1}
        />
      </mesh>
    </group>
  );
}

function DonutGroup({ segments, hoveredIndex, setHoveredIndex }: { segments: any[], hoveredIndex: number | null, setHoveredIndex: (idx: number | null) => void }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (group.current) {
        group.current.rotation.x = Math.PI / 4;
      }
      return;
    }
    
    if (group.current) {
      // Idle rotation (very slow)
      group.current.rotation.x = Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      group.current.rotation.y += delta * 0.1; // 0.2 RPM approx
    }
  });

  let currentAngle = 0;
  return (
    <group ref={group}>
      <Float speed={window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1.5} rotationIntensity={0.5} floatIntensity={1}>
        {segments.map((seg, i) => {
          const start = currentAngle;
          currentAngle += Math.PI * 2 * seg.size;
          return (
            <CorrectDonutSegment 
              key={i} 
              seg={seg} 
              startAngle={start} 
              isHovered={hoveredIndex === i}
              onHover={(isHovering) => setHoveredIndex(isHovering ? i : null)}
            />
          );
        })}
        {hoveredIndex !== null && (
          <Html position={[0, 0, 1.5]} center style={{ pointerEvents: 'none' }}>
            <div className="text-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 animate-in fade-in zoom-in duration-200 whitespace-nowrap shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div className="text-white font-bold">{segments[hoveredIndex].name}</div>
              <div className="text-sm font-medium" style={{ color: segments[hoveredIndex].color }}>
                ${segments[hoveredIndex].value.toLocaleString()} ({(segments[hoveredIndex].size * 100).toFixed(1)}%)
              </div>
            </div>
          </Html>
        )}
      </Float>
    </group>
  );
}

export const InteractiveTorus = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = defaultSegments.reduce((sum, seg) => sum + seg.value, 0);
  const segments = useMemo(() => defaultSegments.map(seg => ({ ...seg, size: seg.value / total })), [total]);

  if (!mounted) return <div className="w-full h-full min-h-[300px]" />;

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col relative">
      <div className="flex-1 w-full relative min-h-[300px]">
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 45 }} 
          dpr={[1, 2]} 
          frameloop={isInView ? "always" : "demand"}
          style={{ touchAction: 'none' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
          <DonutGroup segments={segments} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />
        </Canvas>

        {/* Non-hovered Fallback Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {hoveredIndex === null && (
            <div className="text-center transition-opacity duration-300">
              <div className="text-white/60 text-sm">Total Assets</div>
              <div className="text-2xl font-bold text-white">₹{total.toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4 z-10 px-4 pb-4">
        {segments.map((seg, i) => (
          <RippleEffect 
            key={i} 
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${hoveredIndex === i ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'}`}
          >
            <div 
              className="w-full flex items-center gap-2"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
              <div className="flex-1 text-sm font-medium text-white/80">{seg.name}</div>
              <div className="text-sm font-bold text-white">
                <CountUpNumber value={seg.size * 100} decimals={1} duration={1} suffix="%" />
              </div>
            </div>
          </RippleEffect>
        ))}
      </div>
    </div>
  );
};
