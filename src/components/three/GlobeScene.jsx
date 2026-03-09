import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ACCENT   = '#6366f1';
const ACCENT_L = '#818cf8';
const RADIUS   = 2.2;

/* ─── Globe wireframe sphere ─────────────────────────────────── */
function GlobeWire() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: ACCENT, emissive: ACCENT, emissiveIntensity: 0.3,
    wireframe: true, transparent: true, opacity: 0.18,
  }), []);
  return (
    <mesh material={mat}>
      <sphereGeometry args={[RADIUS, 36, 36]} />
    </mesh>
  );
}

/* ─── Faint solid globe (depth) ──────────────────────────────── */
function GlobeSolid() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#08081a', transparent: true, opacity: 0.85,
    roughness: 1, metalness: 0,
  }), []);
  return (
    <mesh material={mat}>
      <sphereGeometry args={[RADIUS - 0.02, 48, 48]} />
    </mesh>
  );
}

/* ─── Atmosphere glow shell ──────────────────────────────────── */
function Atmosphere() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: ACCENT, emissive: ACCENT, emissiveIntensity: 0.4,
    transparent: true, opacity: 0.07,
    side: THREE.BackSide,
  }), []);
  return (
    <mesh material={mat}>
      <sphereGeometry args={[RADIUS + 0.22, 32, 32]} />
    </mesh>
  );
}

/* ─── Dot on globe surface from lat/lon ─────────────────────── */
function latLonToVec3(lat, lon, r) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

const LOCATIONS = [
  { lat:  13.0, lon:  80.2,  label: 'Chennai'    },
  { lat:  51.5, lon:  -0.1,  label: 'London'     },
  { lat:  40.7, lon: -74.0,  label: 'New York'   },
  { lat:  35.7, lon: 139.7,  label: 'Tokyo'      },
  { lat: -33.9, lon:  18.4,  label: 'Cape Town'  },
  { lat:  48.9, lon:   2.3,  label: 'Paris'      },
  { lat:  37.8, lon: 144.9,  label: 'Melbourne'  },
  { lat:  25.2, lon:  55.3,  label: 'Dubai'      },
];

/* ─── Glowing location dots ──────────────────────────────────── */
function LocationDots() {
  const meshRef = useRef();
  const dummy   = useMemo(() => new THREE.Object3D(), []);
  const points  = useMemo(() => LOCATIONS.map(({ lat, lon }) => latLonToVec3(lat, lon, RADIUS)), []);

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c7d2fe', emissive: '#818cf8', emissiveIntensity: 2.5,
  }), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    points.forEach((p, i) => {
      dummy.position.copy(p);
      const s = 0.028 + Math.sin(t * 1.2 + i * 0.9) * 0.008;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, points.length]} material={mat}>
      <sphereGeometry args={[1, 8, 8]} />
    </instancedMesh>
  );
}

/* ─── Arc between two points on sphere surface ───────────────── */
function Arc({ from, to, color = ACCENT_L, opacity = 0.55, speed = 1, phase = 0 }) {
  const ref = useRef();

  const { points } = useMemo(() => {
    const mid = from.clone().add(to).normalize().multiplyScalar(RADIUS * 1.38);
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    return { points: curve.getPoints(48) };
  }, [from, to]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  const mat = useMemo(() => new THREE.LineBasicMaterial({
    color, transparent: true, opacity,
  }), [color, opacity]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t   = clock.getElapsedTime();
    const progress = ((Math.sin(t * speed + phase) + 1) / 2);
    const drawCount = Math.floor(progress * points.length);
    ref.current.geometry.setDrawRange(0, Math.max(2, drawCount));
  });

  return <line ref={ref} geometry={geometry} material={mat} />;
}

/* ─── Arcs setup ─────────────────────────────────────────────── */
function Arcs() {
  const pts = useMemo(() => LOCATIONS.map(({ lat, lon }) => latLonToVec3(lat, lon, RADIUS)), []);
  const pairs = useMemo(() => [
    [0, 1], [0, 2], [0, 3], [1, 3], [2, 4], [3, 5], [1, 7], [5, 6], [4, 7],
  ], []);

  return (
    <>
      {pairs.map(([a, b], i) => (
        <Arc
          key={i}
          from={pts[a]}
          to={pts[b]}
          color={i % 2 === 0 ? ACCENT : ACCENT_L}
          opacity={0.45 + (i % 3) * 0.1}
          speed={0.6 + i * 0.07}
          phase={i * 0.7}
        />
      ))}
    </>
  );
}

/* ─── Ambient particles ──────────────────────────────────────── */
function Particles({ count = 80 }) {
  const meshRef = useRef();
  const dummy   = useMemo(() => new THREE.Object3D(), []);
  const data    = useMemo(() => Array.from({ length: count }, () => ({
    pos: new THREE.Vector3(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
    ),
    speed: 0.3 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
  })), [count]);

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: ACCENT_L, emissive: ACCENT_L, emissiveIntensity: 1.8,
    roughness: 0, metalness: 0,
  }), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    data.forEach((d, i) => {
      dummy.position.set(
        d.pos.x,
        d.pos.y + Math.sin(t * d.speed + d.phase) * 0.25,
        d.pos.z,
      );
      dummy.scale.setScalar(0.018 + Math.sin(t * d.speed * 0.6 + d.phase) * 0.005);
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

/* ─── Scene root (slow globe rotation) ──────────────────────── */
function Scene() {
  const globeRef = useRef();

  useFrame(({ clock }) => {
    if (!globeRef.current) return;
    globeRef.current.rotation.y = clock.getElapsedTime() * 0.12;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 4, 4]}   intensity={4} color={ACCENT}   distance={14} decay={2} />
      <pointLight position={[-5, -3, 2]} intensity={2} color={ACCENT_L} distance={12} decay={2} />

      <group ref={globeRef}>
        <GlobeSolid />
        <GlobeWire />
        <LocationDots />
        <Arcs />
      </group>

      <Atmosphere />
      <Particles count={80} />
    </>
  );
}

export default function GlobeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  );
}
