import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Constants ──────────────────────────────────────────────────────── */
const BODY_COLOR      = '#111118';
const BODY_DARK       = '#0c0c12';
const ACCENT_INDIGO   = '#6366f1';
const ACCENT_LIGHT    = '#818cf8';
const SCREEN_BG       = '#08080f';
const HINGE_COLOR     = '#1e1e2e';

/* ─── Materials (created once) ───────────────────────────────────────── */
function useMaterials() {
  return useMemo(() => ({
    body: new THREE.MeshStandardMaterial({
      color: BODY_COLOR, metalness: 0.75, roughness: 0.22,
    }),
    bodyDark: new THREE.MeshStandardMaterial({
      color: BODY_DARK, metalness: 0.7, roughness: 0.28,
    }),
    screen: new THREE.MeshStandardMaterial({
      color: SCREEN_BG, emissive: ACCENT_INDIGO, emissiveIntensity: 0.55,
      roughness: 0.9, metalness: 0,
    }),
    screenGlow: new THREE.MeshStandardMaterial({
      color: '#0a0a18', emissive: ACCENT_INDIGO, emissiveIntensity: 1.2,
      roughness: 1, metalness: 0,
    }),
    codeGlow: new THREE.MeshStandardMaterial({
      color: '#0d0d22', emissive: ACCENT_LIGHT, emissiveIntensity: 0.7,
      roughness: 1, metalness: 0,
    }),
    trackpad: new THREE.MeshStandardMaterial({
      color: '#0d0d1a', metalness: 0.6, roughness: 0.3,
    }),
    key: new THREE.MeshStandardMaterial({
      color: '#1a1a2a', metalness: 0.4, roughness: 0.6,
    }),
    hinge: new THREE.MeshStandardMaterial({
      color: HINGE_COLOR, metalness: 0.95, roughness: 0.1,
    }),
    ledGreen: new THREE.MeshStandardMaterial({
      color: '#00ff88', emissive: '#00ff88', emissiveIntensity: 2.0,
    }),
    webcam: new THREE.MeshStandardMaterial({
      color: '#050508', metalness: 0.9, roughness: 0.1,
    }),
    accentLine: new THREE.MeshStandardMaterial({
      color: ACCENT_INDIGO, emissive: ACCENT_INDIGO, emissiveIntensity: 0.8,
    }),
  }), []);
}

/* ─── Keyboard Keys (InstancedMesh) ─────────────────────────────────── */
function Keys({ mat }) {
  const meshRef = useRef();
  const dummy   = useMemo(() => new THREE.Object3D(), []);

  const { matrix } = useMemo(() => {
    const cols = 13, rows = 4;
    const kW = 0.175, kH = 0.14, kGap = 0.04;
    const totalW = cols * (kW + kGap) - kGap;
    const totalD = rows * (kH + kGap) - kGap;
    const startX = -totalW / 2 + kW / 2;
    const startZ = -totalD / 2 + kH / 2;
    const matrix = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        matrix.push({
          x: startX + c * (kW + kGap),
          z: startZ + r * (kH + kGap),
        });
      }
    }
    return { matrix };
  }, []);

  useMemo(() => {
    if (!meshRef.current) return;
    matrix.forEach(({ x, z }, i) => {
      dummy.position.set(x, 0, z);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, matrix.length]}
      position={[0, 0.065, -0.08]}
      material={mat.key}
    >
      <boxGeometry args={[0.175, 0.025, 0.14]} />
    </instancedMesh>
  );
}

/* ─── Laptop Model ───────────────────────────────────────────────────── */
function Laptop({ mat }) {
  const groupRef  = useRef();
  const glowRef   = useRef();

  // Floating + slow yaw
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = -0.4 + Math.sin(t * 0.6) * 0.08;
      groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.12 - 0.15;
    }
    // Pulse screen glow
    if (glowRef.current) {
      glowRef.current.emissiveIntensity = 1.1 + Math.sin(t * 1.2) * 0.3;
    }
  });

  /* Base: 3.0w × 0.12h × 2.0d */
  const bW = 3.0, bH = 0.12, bD = 2.0;
  /* Screen: 3.0w × 0.1d × 2.0h */
  const sW = 3.0, sD = 0.1, sH = 2.05;

  return (
    <group ref={groupRef}>

      {/* ── Base body ───────────────────────────────────────────────── */}
      <mesh castShadow material={mat.body}>
        <boxGeometry args={[bW, bH, bD]} />
      </mesh>

      {/* Chamfered edge illusion – thin dark strip around rim */}
      <mesh position={[0, bH / 2 + 0.005, 0]} material={mat.bodyDark}>
        <boxGeometry args={[bW + 0.01, 0.01, bD + 0.01]} />
      </mesh>

      {/* Bottom feet (4 corners) */}
      {[[-1.3, -0.07, 0.85], [1.3, -0.07, 0.85], [-1.3, -0.07, -0.85], [1.3, -0.07, -0.85]].map(
        ([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} material={mat.bodyDark}>
            <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
          </mesh>
        )
      )}

      {/* Keyboard surround / palm rest */}
      <mesh position={[0, 0.065, 0.08]} material={mat.bodyDark}>
        <boxGeometry args={[2.7, 0.005, 1.65]} />
      </mesh>

      {/* Keys */}
      <Keys mat={mat} />

      {/* Space bar */}
      <mesh position={[0, 0.065, 0.56]} material={mat.key}>
        <boxGeometry args={[0.95, 0.025, 0.14]} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.063, 0.71]} material={mat.trackpad}>
        <boxGeometry args={[0.95, 0.005, 0.62]} />
      </mesh>

      {/* Accent LED strip on front edge of base */}
      <mesh position={[0, -bH / 2 + 0.001, bD / 2 - 0.04]} material={mat.accentLine}>
        <boxGeometry args={[bW * 0.3, 0.003, 0.006]} />
      </mesh>

      {/* Status LED (green, tiny) */}
      <mesh position={[1.1, bH / 2 + 0.006, 0.85]} material={mat.ledGreen}>
        <sphereGeometry args={[0.018, 8, 8]} />
      </mesh>

      {/* ── Screen lid, pivots from hinge ───────────────────────────── */}
      {/*  rotation.x < 0 → tips away (opens). -0.32 rad ≈ 108° open   */}
      <group position={[0, bH / 2 + 0.035, -bD / 2 + 0.07]} rotation={[-0.32, 0, 0]}>

        {/* Lid outer body */}
        <mesh castShadow position={[0, sH / 2, 0]} material={mat.body}>
          <boxGeometry args={[sW, sH, sD]} />
        </mesh>

        {/* Back logo area (subtle branded indent) */}
        <mesh position={[0, sH / 2, -sD / 2 - 0.001]} material={mat.bodyDark}>
          <boxGeometry args={[0.5, 0.5, 0.005]} />
        </mesh>

        {/* Inner bezel frame */}
        <mesh position={[0, sH / 2, sD / 2 + 0.001]} material={mat.bodyDark}>
          <boxGeometry args={[sW - 0.02, sH - 0.02, 0.004]} />
        </mesh>

        {/* Display panel – base dark */}
        <mesh position={[0, sH / 2, sD / 2 + 0.006]} material={mat.screen}>
          <boxGeometry args={[sW - 0.18, sH - 0.22, 0.003]} />
        </mesh>

        {/* Screen glow layer (pulsed by ref) */}
        <mesh position={[0, sH / 2 - 0.04, sD / 2 + 0.01]}>
          <boxGeometry args={[sW - 0.42, sH - 0.5, 0.002]} />
          <meshStandardMaterial ref={glowRef} color="#06060f" emissive={ACCENT_INDIGO} emissiveIntensity={0.55} roughness={1} />
        </mesh>

        {/* "Code lines" illusion – stacked accent strips */}
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[0.05 - i * 0.12, sH / 2 - 0.06 - i * 0.2, sD / 2 + 0.013]} material={mat.codeGlow}>
            <boxGeometry args={[0.55 + (i % 3) * 0.22, 0.025, 0.001]} />
          </mesh>
        ))}

        {/* Webcam */}
        <mesh position={[0, sH - 0.12, sD / 2 + 0.006]} material={mat.webcam}>
          <cylinderGeometry args={[0.028, 0.028, 0.008, 20]} />
        </mesh>
        {/* Webcam lens */}
        <mesh position={[0, sH - 0.12, sD / 2 + 0.011]} material={mat.ledGreen}>
          <cylinderGeometry args={[0.01, 0.01, 0.003, 20]} />
        </mesh>

        {/* Bottom hinge notch */}
        <mesh position={[0, 0.04, 0]} material={mat.hinge}>
          <boxGeometry args={[sW * 0.82, 0.04, sD + 0.01]} />
        </mesh>
      </group>

    </group>
  );
}

/* ─── Particle Field ─────────────────────────────────────────────────── */
function Particles({ count = 180 }) {
  const meshRef = useRef();
  const dummy   = useMemo(() => new THREE.Object3D(), []);

  const { positions, speeds } = useMemo(() => {
    const positions = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 10 - 2,
    }));
    const speeds = Array.from({ length: count }, () => ({
      y:     0.004 + Math.random() * 0.008,
      phase: Math.random() * Math.PI * 2,
    }));
    return { positions, speeds };
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    positions.forEach((p, i) => {
      const s = speeds[i];
      const py = p.y + Math.sin(t * s.y + s.phase) * 0.4;
      dummy.position.set(p.x, py, p.z);
      const scale = 0.012 + Math.sin(t * 0.5 + s.phase) * 0.004;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const particleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color:            ACCENT_INDIGO,
        emissive:         ACCENT_INDIGO,
        emissiveIntensity: 1.4,
        roughness: 0,
        metalness: 0,
      }),
    []
  );

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} material={particleMat}>
      <sphereGeometry args={[1, 6, 6]} />
    </instancedMesh>
  );
}

/* ─── Grid / Ground reflection ───────────────────────────────────────── */
function GridFloor() {
  return (
    <gridHelper
      args={[20, 30, '#1e1e3a', '#16163a']}
      position={[0, -2.1, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

/* ─── Scene Root ─────────────────────────────────────────────────────── */
function Scene() {
  const mat = useMaterials();

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={1.4} />
      <directionalLight position={[4,  8, 4]} intensity={3.5} color="#e0e0ff" castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={1.2} color="#818cf8" />

      {/* Key accent light — tracks laptop */}
      <pointLight position={[3.8, 2.2, 3.2]} intensity={28}  color={ACCENT_INDIGO} distance={12} decay={2} />
      {/* Rim light — left edge */}
      <pointLight position={[0.8, 2.2, -1]}  intensity={14}  color="#4f46e5"      distance={14} decay={2} />
      {/* Cool fill from right */}
      <pointLight position={[7.0, 0.8, 3.5]} intensity={10}  color="#c7d2fe"      distance={12} decay={2} />
      {/* Under-glow for keyboard */}
      <pointLight position={[3.8, -1.0, 1.2]} intensity={8}  color={ACCENT_INDIGO} distance={7}  decay={2} />
      {/* Top fill — brightens lid and screen */}
      <pointLight position={[3.8,  5.0, 2.0]} intensity={12} color="#e0e0ff"      distance={14} decay={2} />

      {/* Laptop: moderate x so camera-left setup makes it land on right side of screen */}
      <group position={[3.8, 0, 0]} scale={1.4}>
        <Laptop mat={mat} />
      </group>
      <Particles count={160} />
      <GridFloor />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.35}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.2}
        target={[-1.6, 1.0, +2.5]}
      />
    </>
  );
}

/* ─── Exported Canvas Wrapper ────────────────────────────────────────── */
export default function LaptopScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0.4, 1.2, 5.2], fov: 75 }}
      gl={{
        alpha:      true,
        antialias:  true,
        powerPreference: 'high-performance',
      }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  );
}
