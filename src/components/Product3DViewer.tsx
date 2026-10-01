import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface Product3DViewerProps {
  url: string;
  interactive?: boolean;
}

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={0.009} position={[0, -0.2, 0]} />;
};

const Product3DViewer: React.FC<Product3DViewerProps> = ({ url, interactive = false }) => {
  return (
    <div className={`w-full h-full ${interactive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}>
      <Canvas
        camera={{ position: [0, 1, 4], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={0.9} />
        <Environment preset="city" />
        <Model url={url} />
        {interactive && <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 1.5} />}
      </Canvas>
    </div>
  );
};

export default Product3DViewer;
