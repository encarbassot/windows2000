import './Pipes.css';
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { CameraControls } from './orbitControls';


const LENGTH = 100
const TIMEOUT = 50
const COUNT = 10
const BOX_SIZE = 10

const COLORS = [
  "cyan",
  "orange",
  "yellow",
  "magenta",
  "lime",
  "pink",
  "purple",
  "blue",
  "red",
  "green",
  "brown",
  "gray",
  "lightblue",
  "lightgreen",
  "lightgray",
  "lightpink",
  "lightyellow",
  "lightpurple",
]

function randomStartPosition() {
  const x = Math.floor(Math.random() * BOX_SIZE) - BOX_SIZE / 2
  const y = Math.floor(Math.random() * BOX_SIZE) - BOX_SIZE / 2
  const z = Math.floor(Math.random() * BOX_SIZE) - BOX_SIZE / 2
  return new THREE.Vector3(x, y, z)
}

function isCorner(a, b, c) {
  // Check if vectors (b - a) and (c - b) are not colinear (not inline)
  const v1 = b.clone().sub(a).normalize()
  const v2 = c.clone().sub(b).normalize()
  return !v1.equals(v2) && !v1.equals(v2.clone().multiplyScalar(-1))
}

function randomDirection(prevDir, lastPos, gravityCenter, gravityStrength = 0) {
  const dirs = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
  ]
  
  const options = dirs.filter(d => !prevDir?.clone().multiplyScalar(-1).equals(d))

  const scores = options.map(dir => {
    if (gravityStrength === 0) return 1 // default uniform weight

    const targetVector = gravityCenter.clone().sub(lastPos).normalize()
    const alignment = dir.clone().normalize().dot(targetVector) // cosine similarity
    return 1 + alignment * gravityStrength
  })

  const totalScore = scores.reduce((a, b) => a + b, 0)
  const rand = Math.random() * totalScore
  let acc = 0
  for (let i = 0; i < options.length; i++) {
    acc += scores[i]
    if (rand <= acc) return options[i].clone()
  }

  return options[0].clone() // fallback
}


function Segment({ start, end, color = "cyan"}) {
  const ref = useRef()
  const dirVec = end.clone().sub(start)
  const fullLength = dirVec.length()
  const dirNorm = dirVec.clone().normalize()
  const rotation = new THREE.Euler().setFromQuaternion(
    new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dirNorm
    )
  )

  const [progress, setProgress] = useState(0) // 0 to 1

  useEffect(() => {
    setProgress(0)
    let startTime = performance.now()

    function animate() {
      const elapsed = performance.now() - startTime
      const newProgress = Math.min(elapsed / TIMEOUT, 1)
      setProgress(newProgress)
      if (newProgress < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [start, end])

  // Position the segment so it grows from start point forward
  // Position = start + dirNorm * (fullLength * progress) / 2
  // Length = fullLength * progress
  const currentLength = fullLength * progress
  const currentPos = start.clone().add(dirNorm.multiplyScalar(currentLength / 2))

  return (
    <mesh position={currentPos} rotation={rotation} ref={ref} castShadow>
      <cylinderGeometry args={[0.1, 0.1, currentLength, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}




function Pipe({ worldCells, onComplete, color = "cyan" , onNewPath = () => {}, gravityCenter}) {
  const [prevDir, setPrevDir] = useState(randomDirection(null))



  const [path, setPath] = useState(() => {
    const start = randomStartPosition()
    const dir = randomDirection(null)
    const end = start.clone().add(dir)
    worldCells.current[`${start.x},${start.y},${start.z}`] = true
    worldCells.current[`${end.x},${end.y},${end.z}`] = true
    return [start, end]
  })

  useEffect(() => {
    if (path.length >= LENGTH) {
      if (onComplete) onComplete()
      return
    }
  
    let attempts = 0
    let newDir
    let newPos
    const maxAttempts = 10
  
    do {
      newDir = randomDirection(prevDir, path[path.length - 1], gravityCenter, 0.3) // example strength = 2
            newPos = path[path.length - 1].clone().add(newDir)
      attempts++
    } while (
      worldCells.current[`${newPos.x},${newPos.y},${newPos.z}`] &&
      attempts < maxAttempts
    )
  
    if (attempts >= maxAttempts) {
      if (onComplete) onComplete()
      return
    }
  
    const timer = setTimeout(() => {
      worldCells.current[`${newPos.x},${newPos.y},${newPos.z}`] = true
      setPath([...path, newPos])
      setPrevDir(newDir)
      onNewPath(newPos, [...path, newPos])
    }, TIMEOUT)
  
    return () => clearTimeout(timer)
  }, [path, prevDir, worldCells])

  return (
    <group>
      {path.slice(1).map((end, i) => (
        <Segment key={i} start={path[i]} end={end} color={color} />
      ))}

      {/* Draw elbows (spheres) at corners */}
      {path.map((point, i) => {
        // Ignore first and last points for elbows
        if (i === 0 || i === path.length - 1) return null

        const prev = path[i - 1]
        const curr = point
        const next = path[i + 1]

        if (isCorner(prev, curr, next)) {
          return (
            <mesh key={'elbow-' + i} position={curr}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
          )
        }
        return null
      })}

      {/* Sphere at the head */}
      {/* <mesh position={path[path.length - 1]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="red" />
      </mesh> */}
    </group>
  )

}


export default function Pipes({onActive}) {
  const worldCells = useRef({})
  const [pipes, setPipes] = useState([{ id: 0 }])
  const [resetCounter, setResetCounter] = useState(0)
  const [gravityCenter, setGravityCenter] = useState(new THREE.Vector3(0, 0, 0))
  const [gravityWeight, setGravityWeight] = useState(0)

  const colors = useMemo(() => [...COLORS].sort(() => Math.random() - 0.5), [])

  useEffect(() => {
    if (!onActive) return

    const handleActivity = () => onActive()

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('mousedown', handleActivity)

    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('mousedown', handleActivity)
    }
  }, [onActive])

  const addPipe = (status) => {
    if (status === 'stuck') {
      worldCells.current = {}
      setPipes([{ id: 0 }])
      setResetCounter(c => c + 1)
      return
    }
    if (pipes.length >= COUNT) return
    setPipes(prev => [...prev, { id: prev.length }])
  }

  function handleNewPath(pos, path, index) {
    // Calculate the center of gravity for the new path
    setGravityWeight(prevW => {
      const newWeight = prevW + 1
      setGravityCenter(prev => {
        const newCenter = prev.clone()
        .multiplyScalar(prevW)
        .add(path[path.length - 1])
        .multiplyScalar(1 / newWeight)
        return newCenter
      })
      return newWeight
    })
    
  }

  return (
    <div className="Pipes" key={resetCounter}>
      <Canvas camera={{ position: [10, 10, 10] }}>
        <ambientLight intensity={0.3} />
        <directionalLight
          castShadow
          position={[5, 10, 5]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        {pipes.map((pipe, i) => (
          <Pipe
            key={pipe.id}
            worldCells={worldCells}
            onComplete={addPipe}
            color={colors[i % colors.length]}
            onNewPath={handleNewPath}
            gravityCenter={gravityCenter}
          />
        ))}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[50, 50]} />
          <shadowMaterial opacity={0.3} />
        </mesh>

        {/* Sphere at the head */}
        {/* <mesh position={gravityCenter} castShadow>
          <sphereGeometry args={[0.015 * gravityWeight, 16, 16]} />
          <meshStandardMaterial color="red" />
        </mesh> */}

        <CameraControls />
      </Canvas>
    </div>
  )
}
