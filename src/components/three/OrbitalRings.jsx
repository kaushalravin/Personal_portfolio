import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ACCENT   = '#6366f1';
const ACCENT_L = '#818cf8';
const ACCENT_D = '#4f46e5';

/* ─── Single torus ring ──────────────────────────────────────── */
function Ring({ radius, tube, tilt, speed, phase, color, opacity }) {
  const ref = useRef();
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.7,
    transparent: true,
    opacity,
    roughness: 0.2,
    metalness: 0.8,
    side: THREE.DoubleSide,
  }), [color, opacity]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = t * speed + phase;
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]} material={mat}>
      <torusGeometry args={[radius, tube, 2, 128]} />
    </mesh>
  );
}

/* ─── Satellite dots orbiting a ring ─────────────────────────── */
function OrbitDots({ radius, count, speed, phase, color }) {
  const meshRef = useRef();
  const dummy   = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(() =>
    Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2), [count]);

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 1.8,
    roughness: 0, metalness: 0,
  }), [color]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    offsets.forEach((off, i) => {
      const a = t * speed + off + phase;
      dummy.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      dummy.scale.setScalar(0.045);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} material={mat}>
      <sphereGeometry args={[1, 6, 6]} />
    </instancedMesh>
  );
}

/* ─── Centre glow sphere ─────────────────────────────────────── */
function CoreSphere() {
  const ref = useRef();
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: ACCENT, emissive: ACCENT, emissiveIntensity: 1.2,
    transparent: true, opacity: 0.35,
    roughness: 0, metalness: 1,
  }), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.material.emissiveIntensity = 0.9 + Math.sin(t * 1.4) * 0.35;
    const s = 1 + Math.sin(t * 1.0) * 0.06;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref} material={mat}>
      <sphereGeometry args={[0.22, 32, 32]} />
    </mesh>
  );
}

/* ─── Floating particles ─────────────────────────────────────── */
function Particles({ count = 90 }) {
  const meshRef = useRef();
  const dummy   = useMemo(() => new THREE.Object3D(), []);
  const data    = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 20,
    y: (Math.random() - 0.5) * 12,
    z: (Math.random() - 0.5) * 6 - 3,
    s: 0.4 + Math.random() * 0.5,
    p: Math.random() * Math.PI * 2,
  })), [count]);

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: ACCENT_L, emissive: ACCENT_L, emissiveIntensity: 1.5,
    roughness: 0, metalness: 0,
  }), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    data.forEach((d, i) => {
      dummy.position.set(d.x, d.y + Math.sin(t * d.s + d.p) * 0.3, d.z);
      dummy.scale.setScalar(0.022 + Math.sin(t * d.s * 0.7 + d.p) * 0.006);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} material={mat}>
      <sphereGeometry args={[1, 4, 4]} />
    </instancedMesh>
  );
}

/* ─── Scene ──────────────────────────────────────────────────── */
const RINGS = [
  { radius: 1.4, tube: 0.012, tilt: Math.PI * 0.18, speed:  0.28, phase: 0,    color: ACCENT,   opacity: 0.75 },
  { radius: 2.0, tube: 0.010, tilt: Math.PI * 0.40, speed: -0.20, phase: 1.1,  color: ACCENT_L, opacity: 0.55 },
  { radius: 2.7, tube: 0.009, tilt: Math.PI * 0.62, speed:  0.15, phase: 2.3,  color: ACCENT,   opacity: 0.40 },
  { radius: 3.5, tube: 0.007, tilt: Math.PI * 0.08, speed: -0.11, phase: 0.7,  color: ACCENT_D, opacity: 0.28 },
  { radius: 4.2, tube: 0.006, tilt: Math.PI * 0.50, speed:  0.09, phase: 1.8,  color: ACCENT_L, opacity: 0.18 },
];

const DOTS = [
  { radius: 1.4, count: 3, speed:  0.55, phase: 0,   color: '#c7d2fe' },
  { radius: 2.0, count: 4, speed: -0.40, phase: 0.8, color: ACCENT_L  },
  { radius: 2.7, count: 2, speed:  0.30, phase: 1.5, color: ACCENT    },
];

function Scene() {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.04;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 4]}  intensity={5}  color={ACCENT}   distance={10} decay={2} />
      <pointLight position={[6, 4, -2]} intensity={3}  color={ACCENT_L} distance={14} decay={2} />
      <pointLight position={[-6,-4, 2]} intensity={2}  color={ACCENT_D} distance={12} decay={2} />

      <CoreSphere />
      {RINGS.map((r, i) => <Ring key={i} {...r} />)}
      {DOTS.map((d, i) => (
        <group key={i} rotation={[RINGS[i].tilt, 0, 0]}>
          <OrbitDots {...d} />
        </group>
      ))}
      <Particles count={90} />
    </group>
  );
}

export default function OrbitalRings() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 65 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  );
}
