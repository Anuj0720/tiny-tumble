import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { Leva } from "leva";

import { Experience } from "./components/game/Experience.jsx";
import { Interface } from "./components/ui/Interface.jsx";

const keyMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  return (
    <>
      <Leva hidden/>

      <Interface
        started={started}
        gameFinished={gameFinished}
        onPlay={() => {
          setGameFinished(false);
          setStarted(true);
        }}
        onRestart={() => {
          setGameFinished(false);
          setStarted(true);
          setGameKey((k) => k + 1);
        }}
      />

      <KeyboardControls map={keyMap}>
        <Canvas>
          <Suspense fallback={null}>
            {started && (
              <Experience
                key={gameKey}          
                onGameFinished={() => setGameFinished(true)}
              />
            )}
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
}
