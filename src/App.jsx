import { OrbitControls } from "@react-three/drei";

export default function App(){
  return <>
    <OrbitControls />
    <mesh>
      <boxGeometry />
      <meshNormalMaterial />
    </mesh>
  </>
}