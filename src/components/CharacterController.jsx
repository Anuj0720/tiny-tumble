import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
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
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
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

  const { rapier, world } = useRapier();

  const isOnGround = useRef(true);

  const [animation, setAnimation] = useState("idle");


  /*------------------------LEVA CONTROLS------------------------------*/
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
  },
  {collapsed: true}
);

  const { cameraY, cameraZ } = useControls("Camera Position", {
    cameraY: { value: 4, min: 0, max: 10 },
    cameraZ: { value: -4, min: -10, max: 10 },
  },
  {collapsed: true}
);
  const { cameraTargetZ } = useControls("Camera Target", {
    cameraTargetZ: { value: 1.5, min: -10, max: 10 },
  },
  {collapsed: true}
);
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, JUMP_FORCE } = useControls(
    "Character Controls",
    {
      WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(0.5),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
      JUMP_FORCE: { value: 6, min: 2, max: 12 },
    }
  );

  // KeyBoard Controls
  const [, get] = useKeyboardControls();

  /*--------------------GROUND CHECK-----------------------*/
  useFrame(() => {
    if (!rb.current) return;

    const pos = rb.current.translation();

    // Capsule bottom = center - (halfHeight + radius)
    const feetY = pos.y - (height + width);

    const ray = new rapier.Ray(
      { x: pos.x, y: feetY - 0.01, z: pos.z },
      { x: 0, y: -1, z: 0 }
    );

    const hit = world.castRay(ray, 10, true);
    isOnGround.current =
      hit !== null && hit.timeOfImpact < 0.15 && rb.current.linvel().y <= 0.05;
  });

  /*---------------------MOVEMNT--------------------------*/

  useFrame(() => {
    if (rb.current) {
      const vel = rb.current.linvel();
      const movement = {
        x: 0,
        z: 0,
      };

      if (get().forward) {
        movement.z = 1;
      }
      if (get().backward) {
        movement.z = -1;
      }

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (get().left) {
        movement.x = 1;
      }
      if (get().right) {
        movement.x = -1;
      }

      // Rotation
      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;

        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;

        if (speed === RUN_SPEED) {
          setAnimation("run");
        } else {
          setAnimation("walk");
        }
      } else {
        setAnimation("idle");
      }

      /* -------- JUMP -------- */
      if (get().jump && isOnGround.current) {
        vel.y = JUMP_FORCE;
        setAnimation("jump_up");
      }
      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      );
      rb.current.setLinvel(vel, true);
    }
  });

  /*----------------3rd Person Camera---------------------*/
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());

  useFrame(({ camera }) => {
    if (!cameraTarget.current || !cameraPosition.current) return;

    // Container
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );

    // Get world positions
    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);

    // Smooth follow
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    // Smooth look-at
    cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
    camera.lookAt(cameraLookAt.current);
  });

  return (
    <>
      <RigidBody colliders={false} lockRotations ref={rb}>
        <group ref={container}>
          <group ref={cameraTarget} position-z={cameraTargetZ} />
          <group
            ref={cameraPosition}
            position-y={cameraY}
            position-z={cameraZ}
          />
          <group ref={character}>
            <Character
              scale={0.5}
              position-y={positionY}
              animation={animation}
            />
          </group>
        </group>
        <CapsuleCollider args={[width, height]} />
      </RigidBody>
    </>
  );
};
