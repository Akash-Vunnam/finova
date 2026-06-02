'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls, Environment } from '@react-three/drei';
import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useInView } from 'framer-motion';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { RippleEffect } from './RippleEffect';
import { formatINRCompact } from '@/lib/formatters';

interface SegmentData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  arc?: number;
  thetaStart?: number;
}

const defaultSegments: SegmentData[] = [
  { name: 'Indian Equities', value: 169628, color: '#8B5CF6', percentage: 37.5 }, // 135 deg
  { name: 'IT & Tech', value: 120775, color: '#10B981', percentage: 26.7 }, // 96.12 deg
  { name: 'Digital Assets', value: 105395, color: '#EF4444', percentage: 23.3 }, // 83.88 deg
  { name: 'Cash/Liquid Funds', value: 56542, color: '#3B82F6', percentage: 12.5 }, // 45 deg
];

// Single Donut Segment Component
function DonutSegment({
  seg,
  index,
  isHovered,
  onHover,
  geometry,
}: {
  seg: SegmentData & { arc: number; thetaStart: number };
  index: number;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  geometry: THREE.TorusGeometry;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const centerAngle = seg.thetaStart + seg.arc / 2;

  // Ref-based hover values to avoid re-renders during useFrame
  const targetScale = isHovered ? 1.05 : 1.0;
  const targetOffset = isHovered ? 0.08 : 0.0;
  const targetEmissive = isHovered ? 0.4 : 0.15;

  useFrame((state, delta) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (meshRef.current) {
        meshRef.current.scale.setScalar(targetScale);
        const normalX = Math.cos(centerAngle);
        const normalY = Math.sin(centerAngle);
        meshRef.current.position.x = normalX * targetOffset;
        meshRef.current.position.y = normalY * targetOffset;
      }
      if (materialRef.current) {
        materialRef.current.emissiveIntensity = targetEmissive;
      }
      return;
    }

    if (meshRef.current) {
      // Lerp scale
      const currentScale = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 12);
      meshRef.current.scale.setScalar(currentScale);

      // Lerp radial offset along the segment's exact normal
      const currentOffset = THREE.MathUtils.lerp(
        meshRef.current.userData.offset || 0,
        targetOffset,
        delta * 12
      );
      meshRef.current.userData.offset = currentOffset;

      const normalX = Math.cos(centerAngle);
      const normalY = Math.sin(centerAngle);
      meshRef.current.position.x = normalX * currentOffset;
      meshRef.current.position.y = normalY * currentOffset;
    }

    if (materialRef.current) {
      // Lerp emissive intensity
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        targetEmissive,
        delta * 12
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[0, 0, seg.thetaStart]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => {
        onHover(false);
      }}
    >
      <meshPhysicalMaterial
        ref={materialRef}
        color={seg.color}
        emissive={seg.color}
        emissiveIntensity={0.15}
        transmission={0.2}
        opacity={0.95}
        transparent
        roughness={0.15}
        metalness={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

// Parent controller to manage unified group, auto-spin, and drag pause logic
function DonutController({
  segments,
  hoveredIndex,
  setHoveredIndex,
  tooltipRef,
  containerRef,
  geometries,
  isMobile,
}: {
  segments: any[];
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  geometries: THREE.TorusGeometry[];
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isDraggingRef = useRef(false);
  const lastInteractionTimeRef = useRef(0);
  const currentSpeedRef = useRef(0.003);

  useFrame((state, delta) => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      if (groupRef.current) {
        groupRef.current.rotation.x = Math.PI / 4;
        groupRef.current.rotation.y = 0;
      }
      return;
    }

    const now = Date.now();
    const timeSinceLastInteraction = (now - lastInteractionTimeRef.current) / 1000;

    // Pause auto-spin during active interaction and resume smoothly 2s later
    let targetSpeed = 0.003;
    if (isDraggingRef.current || hoveredIndex !== null) {
      targetSpeed = 0;
    } else if (timeSinceLastInteraction < 2) {
      targetSpeed = 0;
    }

    currentSpeedRef.current = THREE.MathUtils.lerp(
      currentSpeedRef.current,
      targetSpeed,
      delta * 3
    );

    if (groupRef.current) {
      // 1. Slow, elegant auto-rotation
      groupRef.current.rotation.y += currentSpeedRef.current;

      // 2. High-performance Screen Projection Tooltip positioning
      if (hoveredIndex !== null && tooltipRef.current && containerRef.current) {
        const seg = segments[hoveredIndex];
        const centerAngle = seg.thetaStart + seg.arc / 2;

        // Calculate segment normal center in local space (radius = 1.0)
        const localCenter = new THREE.Vector3(
          Math.cos(centerAngle) * 1.0,
          Math.sin(centerAngle) * 1.0,
          0
        );

        // Convert center point to world coordinates matching parent group matrix
        localCenter.applyMatrix4(groupRef.current.matrixWorld);

        // Project world position to NDC screen coordinates
        localCenter.project(state.camera);

        const rect = containerRef.current.getBoundingClientRect();
        const x = (localCenter.x * 0.5 + 0.5) * rect.width;
        const y = (-(localCenter.y * 0.5) + 0.5) * rect.height;

        tooltipRef.current.style.transform = `translate3d(₹{x}px, ${y}px, 0) translate(-50%, -130%)`;
      }
    }
  });

  return (
    <>
      <group ref={groupRef} rotation={[Math.PI / 4, 0, 0]} scale={isMobile ? 0.68 : 0.82}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          {segments.map((seg, i) => (
            <DonutSegment
              key={i}
              seg={seg}
              index={i}
              isHovered={hoveredIndex === i}
              onHover={(isHovering) => setHoveredIndex(isHovering ? i : null)}
              geometry={geometries[i]}
            />
          ))}
        </Float>
      </group>
 
       <OrbitControls
         enableZoom={false}
         enablePan={false}
         rotateSpeed={0.4}
         minPolarAngle={Math.PI / 2 - 0.3}
         maxPolarAngle={Math.PI / 2 + 0.3}
         enableDamping
         dampingFactor={0.05}
         onChange={() => {
           lastInteractionTimeRef.current = Date.now();
         }}
         onStart={() => {
           isDraggingRef.current = true;
           lastInteractionTimeRef.current = Date.now();
         }}
         onEnd={() => {
           isDraggingRef.current = false;
           lastInteractionTimeRef.current = Date.now();
         }}
       />
     </>
   );
 }
 
 export const AssetAllocationChart = () => {
   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
   const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);
   
   const containerRef = useRef<HTMLDivElement>(null);
   const tooltipRef = useRef<HTMLDivElement>(null);
   const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const [isMobile, setIsMobile] = useState(false);
   const [mounted, setMounted] = useState(false);
 
   // Exact math parameters to guarantee 100% seamless slices
   const GAP = 0.003; // Tiny persistent separation gap
 
   const segments = useMemo(() => {
     let currentTheta = 0;
     return defaultSegments.map((seg) => {
       const rawArc = (seg.percentage / 100) * Math.PI * 2;
       const arc = rawArc - GAP;
       const thetaStart = currentTheta;
       currentTheta += rawArc;
       return {
         ...seg,
         arc,
         thetaStart,
       };
     });
   }, []);
 
   // Shared optimized geometries memoized to prevent lag/rebuilds
   const geometries = useMemo(() => {
     return segments.map((seg) => {
       const tubularSegments = Math.max(32, Math.floor(seg.arc * 64));
       return new THREE.TorusGeometry(1.0, 0.30, 16, tubularSegments, seg.arc);
     });
   }, [segments]);
 
   // Clean up WebGL resources
   useEffect(() => {
     setMounted(true);
     const checkMobile = () => setIsMobile(window.innerWidth < 768);
     checkMobile();
     window.addEventListener('resize', checkMobile);
     
     return () => {
       window.removeEventListener('resize', checkMobile);
       geometries.forEach((g) => g.dispose());
     };
   }, [geometries]);
 
   // Anti-flicker debouncer
   const handleHoverChange = (index: number | null) => {
     setHoveredIndex(index);
     if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
 
     if (index === null) {
       hoverTimeoutRef.current = setTimeout(() => {
         setActiveTooltipIndex(null);
       }, 50);
     } else {
       setActiveTooltipIndex(index);
     }
   };
 
   const total = defaultSegments.reduce((sum, seg) => sum + seg.value, 0);
 
   if (!mounted) return <div className="w-full h-full min-h-[300px]" />;
 
   return (
     <div
       ref={containerRef}
       className="w-full h-full flex flex-col relative"
     >
       <div className="flex-1 w-full h-[240px] md:h-[320px] relative">
         <Canvas
           camera={{ position: [0, 0, isMobile ? 4.8 : 4.0], fov: isMobile ? 50 : 45 }}
           dpr={[1, 2]}
           frameloop="always"
           performance={{ min: 0.5 }}
           gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
           style={{ touchAction: 'none' }}
         >
           <ambientLight intensity={0.4} />
           <directionalLight position={[5, 5, 5]} intensity={0.8} />
           <pointLight position={[-5, -5, -5]} intensity={0.3} color="#8B5CF6" />
           <Environment preset="city" />
           
           <DonutController
             segments={segments}
             hoveredIndex={hoveredIndex}
             setHoveredIndex={handleHoverChange}
             tooltipRef={tooltipRef}
             containerRef={containerRef}
             geometries={geometries}
             isMobile={isMobile}
           />
         </Canvas>
 
         {/* DOM Tooltip positioned with high-performance NDC screen projection */}
         <div
           ref={tooltipRef}
           className="absolute left-0 top-0 pointer-events-none z-30 transition-all duration-150 ease-out"
           style={{
             opacity: activeTooltipIndex !== null ? 1 : 0,
             transform: activeTooltipIndex !== null ? 'translateY(0px)' : 'translateY(4px)',
             willChange: 'transform, opacity',
           }}
         >
           {activeTooltipIndex !== null && (
             <div className="bg-[#0c0f1d]/95 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-center min-w-[140px]">
               <div className="text-white font-bold text-xs">
                 {segments[activeTooltipIndex].name}
               </div>
               <div
                 className="text-[11px] font-semibold mt-0.5"
                 style={{ color: segments[activeTooltipIndex].color }}
               >
                 {formatINRCompact(segments[activeTooltipIndex].value)} (
                 {segments[activeTooltipIndex].percentage.toFixed(1)}%)
               </div>
             </div>
           )}
         </div>
 
         {/* DOM Center assets label with smooth pulse indicator */}
         <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
           <div 
             className="text-center transition-transform duration-200"
             style={{
               transform: hoveredIndex !== null ? 'scale(1.02)' : 'scale(1)'
             }}
           >
             <div className="text-white/50 text-[10px] tracking-widest uppercase font-semibold">Total Assets</div>
             <div className="text-2xl font-black text-white mt-0.5 tracking-tight">
               {formatINRCompact(total)}
             </div>
           </div>
         </div>
       </div>
 
       {/* Responsive interactive legend grid */}
       <div className="grid grid-cols-2 gap-2 mt-5 z-10 px-4 pb-4">
        {segments.map((seg, i) => (
          <RippleEffect
            key={i}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
              hoveredIndex === i ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'
            }`}
          >
            <div
              className="w-full flex items-center gap-2"
              onMouseEnter={() => handleHoverChange(i)}
              onMouseLeave={() => handleHoverChange(null)}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <div className="flex-1 text-[11px] font-semibold text-white/80">{seg.name}</div>
              <div className="text-[11px] font-bold text-white">
                <CountUpNumber value={seg.percentage} decimals={1} duration={1} suffix="%" />
              </div>
            </div>
          </RippleEffect>
        ))}
      </div>
    </div>
  );
};
