import { Instances, Instance, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { MathUtils } from "three";

export const Clouds = ({
  count = 50,

  
  worldX = 80,
  worldZStart = 10,
  worldZEnd = 170,

  heightMin = 14,
  heightMax = 24,
}) => {
  const { nodes, materials } = useGLTF("/models/Cloud.glb");
  const refs = useRef([]);

  
  const clouds = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: MathUtils.randFloat(-worldX / 2, worldX / 2),
      y: MathUtils.randFloat(heightMin, heightMax),
      z: MathUtils.randFloat(worldZEnd, worldZStart),
      speed: MathUtils.randFloat(0.3, 1.1),
      scale: MathUtils.randFloat(1.0, 2.8),
    }));
  }, [count, worldX, worldZStart, worldZEnd, heightMin, heightMax]);

  useFrame((_, delta) => {
    refs.current.forEach((cloud, i) => {
      if (!cloud) return;

      cloud.position.x += clouds[i].speed * delta;
      cloud.position.y += Math.sin(performance.now() * 0.001 + i) * 0.001;


    
      if (cloud.position.x > worldX / 2) {
        cloud.position.x = -worldX / 2;
      }
    });
  });

  return (
    <Instances
      geometry={nodes.Node.geometry}
      material={materials.lambert2SG}
      frustumCulled={false}
    >
      {clouds.map((c, i) => (
        <Instance
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={[c.x, c.y, c.z]}
          scale={c.scale}
          
        />
      ))}
    </Instances>
  );
};

useGLTF.preload("/models/Cloud.glb");
