import { Environment } from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { useState } from "react";

import { CharacterController } from "./CharacterController";
import { Level1 } from "./Level1";
import { Level2 } from "./Level2";
import { Level3 } from "./Level3";
import { Level4 } from "./Level4";

import { Clouds } from "./Cloud";
import { SkyGradient } from "./SkyGradient";

const LEVELS = [
  { Component: Level1, spawn: [0, 2, 0] },
  { Component: Level2, spawn: [-12, 2, 0] },
  { Component: Level3, spawn: [0, 2, 0] },
  { Component: Level4, spawn: [0, 2, 0] },
];

export const Experience = ({ onGameFinished }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const { Component: Level } = LEVELS[levelIndex];

  const handleLevelEnd = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex((prev) => prev + 1);
    } else {
      setGameFinished(true);
      onGameFinished?.();
    }
  };

  return (
    <>
      <SkyGradient />

      <Environment preset="sunset" />

      <Clouds />

      {/*  ATMOSPHERIC FOG */}
      <fog attach="fog" args={["#7d9ac9", 0.1, 50]} />

      <Physics>
        {!gameFinished && (
          <>
            {/* PLAYER */}
            <CharacterController
              spawn={LEVELS[levelIndex].spawn}
              onLevelEnd={handleLevelEnd}
            />

            {/*  LEVEL */}
            <Level position={[0, -0.5, 0]} rotation-y={Math.PI} />

            {/*  VOID / FALL SENSOR */}
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
