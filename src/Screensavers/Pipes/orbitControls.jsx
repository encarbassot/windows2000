import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useThree, extend, useFrame } from "@react-three/fiber"
import { useRef } from "react"

extend({ OrbitControls })

export function CameraControls() {
  const { camera, gl } = useThree()
  const controls = useRef()
  
  useFrame(() => controls.current.update())

  return <orbitControls ref={controls} args={[camera, gl.domElement]} />
}