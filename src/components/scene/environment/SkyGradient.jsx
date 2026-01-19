import { Sphere } from "@react-three/drei";
import { BackSide } from "three";

export const SkyGradient = () => {
  return (
    <Sphere args={[500, 32, 32]}>
      <meshBasicMaterial
        side={BackSide}
        color="#688bc5"
      />
    </Sphere>
  );
};
