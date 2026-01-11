import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Character } from "./Character";
import { useControls } from "leva";
import { useRef, useState } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad, MathUtils } from "three/src/math/MathUtils.js";

const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};
const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) start += 2 * Math.PI;
    else end += 2 * Math.PI;
  }

  return start + (end - start) * t;
};

export const CharacterController = () => {
  const container = useRef();
  const cameraTarget = useRef();
  const cameraPosition = useRef();

  const character = useRef();
  const rb = useRef();
  const rotationTarget = useRef(0);
  const characterRotationTarget = useRef(0);

  const canJump = useRef(false);
  const prevJump = useRef(false);

  const [animation, setAnimation] = useState("idle");

  /*------------------------LEVA CONTROLS------------------------------*/
  const { radius, halfHeight, positionY } = useControls(
    "Character Collider Size",
    {
      radius: { value: 0.78, min: 0.05, max: 1 },
      halfHeight: { value: 0.29, min: 0.1, max: 1 },
      positionY: { value: -1, min: -10, max: 10 },
    },
    { collapsed: true }
  );

  const { cameraY, cameraZ } = useControls(
    "Camera Position",
    {
      cameraY: { value: 4, min: 0, max: 10 },
      cameraZ: { value: -4, min: -10, max: 10 },
    },
    { collapsed: true }
  );
  const { cameraTargetZ } = useControls(
    "Camera Target",
    {
      cameraTargetZ: { value: 1.5, min: -10, max: 10 },
    },
    { collapsed: true }
  );
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, JUMP_FORCE } = useControls(
    "Character Controls",
    {
      WALK_SPEED: { value: 2, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 2.6, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(0.5),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
      JUMP_FORCE: { value: 6, min: 2, max: 12 },
    }
  );

  const [, get] = useKeyboardControls();

  /*---------------------MOVEMNT--------------------------*/
  useFrame(() => {
    if (!rb.current) return;

    const vel = rb.current.linvel();
    const movement = { x: 0, z: 0 };

    if (get().forward) movement.z = 1;
    if (get().backward) movement.z = -1;
    if (get().left) movement.x = 1;
    if (get().right) movement.x = -1;

    const speed = get().run ? RUN_SPEED : WALK_SPEED;

    if (movement.x !== 0) {
      rotationTarget.current += ROTATION_SPEED * movement.x;
    }

    if (movement.x || movement.z) {
      characterRotationTarget.current = Math.atan2(movement.x, movement.z);
      vel.x =
        Math.sin(rotationTarget.current + characterRotationTarget.current) *
        speed;
      vel.z =
        Math.cos(rotationTarget.current + characterRotationTarget.current) *
        speed;
      setAnimation(speed === RUN_SPEED ? "run" : "walk");
    } else {
      setAnimation("idle");
    }

    /* -------- JUMP (COLLISION BASED) -------- */
    const jump = get().jump;
    const jumpPressed = jump && !prevJump.current;

    if (jumpPressed && canJump.current) {
      vel.y = JUMP_FORCE;
      canJump.current = false;
      setAnimation("jump_up");
    }

    prevJump.current = jump;

    character.current.rotation.y = lerpAngle(
      character.current.rotation.y,
      characterRotationTarget.current,
      0.1
    );

    rb.current.setLinvel(vel, true);
  });

  /*----------------3rd Person Camera---------------------*/
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());

  useFrame(({ camera }) => {
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);

    camera.position.lerp(cameraWorldPosition.current, 0.1);
    cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
    camera.lookAt(cameraLookAt.current);
  });

  const respawn = () => {
    rb.current.setTranslation({
      x: 0,
      y: 2,
      z: 0,
    });
  };

  return (
    <RigidBody
      ref={rb}
      colliders={false}
      lockRotations
      friction={1}
      position={[0, 2, 0]}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === "platform") {
          canJump.current = true;
        }
      }}
      onIntersectionEnter={({ other }) => {
        if (other.rigidBodyObject.name === "space") {
          respawn();
        }
      }}
      onCollisionExit={({ other }) => {
        if (other.rigidBodyObject?.name === "platform") {
          canJump.current = false;
        }
      }}
    >
      <group ref={container} position-y={positionY}>
        <group ref={cameraTarget} position-z={cameraTargetZ} />
        <group ref={cameraPosition} position-y={cameraY} position-z={cameraZ} />
        <group ref={character}>
          <Character animation={animation} scale={0.7} />
        </group>
      </group>

      <CapsuleCollider args={[halfHeight, radius]} />
    </RigidBody>
  );
};
