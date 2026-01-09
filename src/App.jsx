import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

export default function App(){
  return <>
    <Canvas>
      <Experience />
    </Canvas>
  </>
}