import { Environment, OrbitControls } from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import { Level1 } from "./Level1";
import { Level2 } from "./Level2";
import { Level3 } from "./Level3";

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Environment preset="sunset" />

      <Physics debug>
        <CharacterController />
        <RigidBody type="fixed" colliders="trimesh" name="platform">
          <Level1 position={[0, -0.5, 0]} rotation-y={Math.PI} />
        </RigidBody>

        <RigidBody type="fixed" colliders={false} sensor name="space" position={[0,-10,80]}>
          <CuboidCollider args={[50, 0.5, 100]} />
        </RigidBody>

      </Physics>
    </>
  );
};
