import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ACCENT   = '#6366f1';
const SPINE_COLORS = ['#6366f1', '#818cf8', '#4f46e5', '#a5b4fc', '#312e81', '#7c3aed'];

/* ─── Single Book ────────────────────────────────────────────────── */
function Book({ position, rotation, color, thickness, height, tilt, speed, phase }) {
  const groupRef = useRef();

  const coverMat = useMemo(() => new THREE.MeshStandardMaterial({
    color, metalness: 0.1, roughness: 0.55,
  }), [color]);
  const pageMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e8e8f0', metalness: 0, roughness: 0.9,
  }), []);
  const spineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 0.25, metalness: 0.2, roughness: 0.5,
  }), [color]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.18;
      groupRef.current.rotation.y = rotation[1] + Math.sin(t * speed * 0.4 + phase) * 0.08;
      groupRef.current.rotation.z = tilt + Math.sin(t * speed * 0.3 + phase + 1) * 0.03;
    }
  });

  const w = 0.7, d = thickness, h = height;

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation[1], tilt]}>
      {/* Back cover */}
      <mesh position={[0, 0, -d / 2 + 0.025]} material={coverMat} castShadow>
        <boxGeometry args={[w, h, 0.045]} />
      </mesh>
      {/* Front cover */}
      <mesh position={[0, 0, d / 2 - 0.025]} material={coverMat} castShadow>
        <boxGeometry args={[w, h, 0.045]} />
      </mesh>
      {/* Pages block */}
      <mesh position={[0.02, 0, 0]} material={pageMat}>
        <boxGeometry args={[w - 0.06, h - 0.04, d - 0.09]} />
      </mesh>
      {/* Spine */}
      <mesh position={[-w / 2 + 0.025, 0, 0]} material={spineMat} castShadow>
        <boxGeometry args={[0.05, h, d]} />
      </mesh>
      {/* Accent line on spine */}
      <mesh position={[-w / 2 + 0.052, 0, 0]}>
        <boxGeometry args={[0.006, h * 0.6, d * 0.9]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

/* ─── Book shelf setup ───────────────────────────────────────────── */
const BOOKS = [
  { position: [-7,  1.2, -5], rotation: [0, 0.3, 0],  color: SPINE_COLORS[0], thickness: 0.35, height: 1.4, tilt:  0.08, speed: 0.4, phase: 0    },
  { position: [-5.5,-0.5,-6], rotation: [0,-0.2, 0],  color: SPINE_COLORS[2], thickness: 0.28, height: 1.1, tilt: -0.12, speed: 0.55, phase: 1.2  },
  { position: [-4,  1.8,-4.5],rotation: [0, 0.5, 0],  color: SPINE_COLORS[4], thickness: 0.45, height: 1.6, tilt:  0.05, speed: 0.35, phase: 2.4  },
  { position: [-2, -1.0,-6],  rotation: [0,-0.1, 0],  color: SPINE_COLORS[1], thickness: 0.30, height: 1.2, tilt: -0.07, speed: 0.6,  phase: 0.8  },
  { position: [ 0,  2.0,-7],  rotation: [0, 0.0, 0],  color: SPINE_COLORS[5], thickness: 0.50, height: 1.8, tilt:  0.0,  speed: 0.3,  phase: 3.1  },
  { position: [ 2, -0.8,-5],  rotation: [0, 0.2, 0],  color: SPINE_COLORS[3], thickness: 0.32, height: 1.3, tilt:  0.1,  speed: 0.5,  phase: 1.7  },
  { position: [ 4,  1.4,-6],  rotation: [0,-0.4, 0],  color: SPINE_COLORS[0], thickness: 0.40, height: 1.5, tilt: -0.06, speed: 0.45, phase: 4.0  },
  { position: [ 6, -0.3,-4.5],rotation: [0, 0.1, 0],  color: SPINE_COLORS[2], thickness: 0.26, height: 1.0, tilt:  0.15, speed: 0.65, phase: 2.0  },
  { position: [ 8,  1.6,-5.5],rotation: [0,-0.3, 0],  color: SPINE_COLORS[4], thickness: 0.38, height: 1.4, tilt: -0.09, speed: 0.38, phase: 0.5  },
];

/* ─── Particles ──────────────────────────────────────────────────── */
function Particles({ count = 80 }) {
  const meshRef = useRef();
  const dummy   = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 22, y: (Math.random() - 0.5) * 10,
    z: (Math.random() - 0.5) * 6 - 4,
    sp: 0.3 + Math.random() * 0.5, ph: Math.random() * Math.PI * 2,
  })), [count]);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#818cf8', emissive: '#818cf8', emissiveIntensity: 1.8,
  }), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    data.forEach((p, i) => {
      dummy.position.set(p.x, p.y + Math.sin(t * p.sp + p.ph) * 0.25, p.z);
      dummy.scale.setScalar(0.018 + Math.sin(t * p.sp + p.ph) * 0.005);
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

function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={2.5} color="#c7d2fe" />
      <pointLight position={[-4, 3, 2]} intensity={5} color={ACCENT} distance={16} decay={2} />
      <pointLight position={[6, -2, 1]} intensity={4} color="#4f46e5" distance={14} decay={2} />
      {BOOKS.map((b, i) => <Book key={i} {...b} />)}
      <Particles count={80} />
    </>
  );
}

export default function EducationBG() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 72 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  );
}

