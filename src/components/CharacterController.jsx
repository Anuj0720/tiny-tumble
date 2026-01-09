import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Character } from "./Character";
import { useControls } from "leva";
import { useRef } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export const CharacterController = () => {
  const { width, height, positionY } = useControls("Character Collider Size", {
    width: {
      value: 0.2,
      min: 0,
      max: 1,
    },
    height: {
      value: 0.4,
      min: 0,
      max: 1,
    },
    positionY: {
      value: -0.6,
      min: -10,
      max: 0,
    },
  });
  const container = useRef()
  const cameraTarget = useRef()
  const cameraPosition = useRef()
  const character = useRef()

  const cameraWorldPosition = useRef(new Vector3())
  const cameraLookAtWorldPosition = useRef(new Vector3())
  const cameraLookAt = useRef(new Vector3())

 useFrame(({ camera }) => {
  if (!cameraTarget.current || !cameraPosition.current) return

  // Get world positions
  cameraPosition.current.getWorldPosition(cameraWorldPosition.current)
  cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current)

  // Smooth follow
  camera.position.lerp(cameraWorldPosition.current, 0.1)

  // Smooth look-at
  cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1)
  camera.lookAt(cameraLookAt.current)
})

  return (

    <>
      <RigidBody colliders={false} lockRotations>
        <group ref={container}>
          <group ref={cameraTarget} position-z={1.5} />
          <group ref={cameraPosition} position-y={4} position-z={-4} />
          <group ref={character}>
            <Character scale={0.5} position-y={positionY} animation={"idle"} />
          </group>
        </group>
        <CapsuleCollider args={[width, height]} />
      </RigidBody>
    </>
  );
};
