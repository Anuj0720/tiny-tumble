import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { KeyboardControls } from "@react-three/drei";
import { Leva } from "leva";

const keyMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];

export default function App() {
  return (
    <>
      <Leva hidden />
      <KeyboardControls map={keyMap}>
        <Canvas>
          <Experience />
        </Canvas>
      </KeyboardControls>
    </>
  );
}
