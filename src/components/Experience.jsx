import { Environment, OrbitControls } from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import { Level1 } from "./Level1";
import { Level2 } from "./Level2";
import { Level3 } from "./Level3";
import { useState } from "react";

const LEVELS = [
  { Component: Level1, spawn: [0, 2, 0] },
  { Component: Level2, spawn: [-12, 2, 0] },
  { Component: Level3, spawn: [0, 2, 0] },
];

export const Experience = () => {
  const [levelIndex, setLevelIndex] = useState(2);
  const [gameFinished, setGameFinished] = useState(false);

  const { Component: Level } = LEVELS[levelIndex];

  const handleLevelEnd = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex((prev) => prev + 1);
    } else {
      setGameFinished(true);
    }
  };

  return (
    <>
      <OrbitControls />
      <Environment preset="sunset" />

      <Physics debug>
        {!gameFinished && (
          <>
            <CharacterController
              spawn={LEVELS[levelIndex].spawn}
              onLevelEnd={handleLevelEnd}
            />

            {/* <RigidBody type="fixed" colliders="trimesh" name="platform"> */}
              <Level position={[0, -0.5, 0]} rotation-y={Math.PI} />
            {/* </RigidBody> */}

            {/* FALL / VOID SENSOR */}
            <RigidBody
              type="fixed"
              colliders={false}
              sensor
              name="space"
              position={[0, -10, 80]}
            >
              <CuboidCollider args={[50, 0.5, 100]} />
            </RigidBody>
          </>
        )}
      </Physics>
    </>
  );
};
