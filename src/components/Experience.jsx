import { Environment } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";

export const Experience = () => {
  return (
    <>
      <Environment preset="sunset" />
     
      <Physics debug>
        <RigidBody type="fixed">
          <mesh position-y={-0.251} rotation-y={Math.PI / 2} receiveShadow>
            <boxGeometry args={[20, 0.5, 20]} />
            <meshStandardMaterial color="skyblue" />
          </mesh>
        </RigidBody>

       <CharacterController />
      </Physics>
    </>
  );
};
