
import * as THREE from "three";
import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

const MODEL_URL =
  "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb";

const BAND_URL =
  "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg";

useGLTF.preload(MODEL_URL);
useTexture.preload(BAND_URL);


function createOrynTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 720;

  const ctx = canvas.getContext("2d");
  const teal = "#0D9488";

  // Background
  ctx.fillStyle = "#101C18";
  ctx.fillRect(0, 0, 512, 720);

  // ORYN text (separate block, just below the logo on screen)
  ctx.save();
  ctx.translate(120, 420);   // smaller y = lower on the card; logo is at 410
  ctx.scale(1, -1);          // cancels the card's vertical flip

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 64px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ORYN", 0, 0);
  ctx.restore();

  // Orbit logo
  ctx.save();
  ctx.translate(120, 510);
  ctx.rotate(+0.35);

  ctx.strokeStyle = teal;
  ctx.fillStyle = teal;
  ctx.lineWidth = 9;

  ctx.beginPath();
  ctx.ellipse(0, 0, 72, 23, 0, 0, Math.PI * 2);
  ctx.stroke();

  function drawStar(x, y, outer, inner) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? outer : inner;
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  drawStar(-82, -12, 12, 5);
  drawStar(-44, -32, 10, 4);
  drawStar(0, -36, 9, 4);
  drawStar(44, -29, 10, 4);
  drawStar(80, -5, 11, 5);
  drawStar(-50, 28, 10, 4);
  drawStar(8, 34, 11, 5);
  drawStar(54, 24, 9, 4);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
}


function Band() {
  const lineGeometry = useRef(null);
  const fixed = useRef(null);
  const j1 = useRef(null);
  const j2 = useRef(null);
  const j3 = useRef(null);
  const card = useRef(null);

  const [dragged, setDragged] = useState(false);
  const [hovered, setHovered] = useState(false);

  const vec = useRef(new THREE.Vector3()).current;
  const dir = useRef(new THREE.Vector3()).current;
  const ang = useRef(new THREE.Vector3()).current;
  const rot = useRef(new THREE.Vector3()).current;

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );

  const { nodes, materials } = useGLTF(MODEL_URL);
  const orynTexture = useMemo(() => createOrynTexture(), []);
  const bandTexture = useTexture(BAND_URL);

  useEffect(() => {
    bandTexture.wrapS = THREE.RepeatWrapping;
    bandTexture.wrapT = THREE.RepeatWrapping;
  }, [bandTexture]);

  useEffect(() => {
    document.body.style.cursor = hovered
      ? dragged
        ? "grabbing"
        : "grab"
      : "auto";

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useFrame((state, delta) => {
    if (!fixed.current || !card.current) return;

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5);
      vec.unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) =>
        ref.current?.wakeUp(),
      );

      card.current.setNextKinematicTranslation({
        x: vec.x,
        y: vec.y,
        z: vec.z,
      });
    }

    [j1, j2].forEach((ref) => {
      if (!ref.current) return;

      if (!ref.current.lerped) {
        ref.current.lerped = new THREE.Vector3().copy(
          ref.current.translation(),
        );
      }

      const target = ref.current.translation();
      const distance = Math.max(
        0.1,
        Math.min(1, ref.current.lerped.distanceTo(target)),
      );

      ref.current.lerped.lerp(
        target,
        delta * (10 + distance * 40),
      );
    });

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(j2.current.lerped);
    curve.points[2].copy(j1.current.lerped);
    curve.points[3].copy(fixed.current.translation());

    if (lineGeometry.current) {
      lineGeometry.current.setPoints(curve.getPoints(32));
    }

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());

    card.current.setAngvel({
      x: ang.x,
      y: ang.y - rot.y * 0.25,
      z: ang.z,
    });
  });

  const segmentProps = {
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2,
  };

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} type="fixed" />

        <RigidBody
          ref={j1}
          position={[0.5, 0, 0]}
          type="dynamic"
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={j2}
          position={[1, 0, 0]}
          type="dynamic"
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={j3}
          position={[1.5, 0, 0]}
          type="dynamic"
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={card}
          position={[2, 0, 0]}
          type={dragged ? "kinematicPosition" : "dynamic"}
          {...segmentProps}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={(event) => {
              event.stopPropagation();
              event.target.setPointerCapture(event.pointerId);
              setDragged(true);
            }}
            onPointerUp={(event) => {
              event.stopPropagation();

              if (event.target.hasPointerCapture(event.pointerId)) {
                event.target.releasePointerCapture(event.pointerId);
              }

              setDragged(false);
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={orynTexture}
                map-anisotropy={8}
                clearcoat={0}
                roughness={0.85}
                metalness={0}
              />
            </mesh>

            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />

            <mesh
              geometry={nodes.clamp.geometry}
              material={materials.metal}
            />
          </group>
        </RigidBody>
      </group>

      <mesh>
        <meshLineGeometry ref={lineGeometry} />
        <meshLineMaterial
          map={bandTexture}
          color="#D4FFF0"
          lineWidth={0.65}
          transparent
          depthTest={false}
        />
      </mesh>
    </>
  );
}

function CardScene() {
  return (
    <>
      <ambientLight intensity={1.5} />

      <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band />
      </Physics>

      <Environment blur={0.8}>
        <Lightformer
          intensity={2}
          color="#D9FFF1"
          position={[0, -1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[-1, -1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="#B9F5DE"
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
      </Environment>
    </>
  );
}

export default function EventIdcard() {
  return (
    <div className="h-[360px] w-full sm:h-[460px] lg:h-[560px]">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 25 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <CardScene />
        </Suspense>
      </Canvas>
    </div>
  );
}