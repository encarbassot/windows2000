import { useDesktopStore } from './context/desktopStore'
import WindowManager from './components/WindowManager'
import { useEffect, useState } from 'react'

const CounterApp = () => {
  const [count, setCount] = useState(0)
  return (
    <div style={{ padding: 20 }}>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}

function App() {
  const openWindow = useDesktopStore(s => s.openWindow)

  useEffect(() => {
    openWindow({
      title: 'Counter',
      component: CounterApp,
      position: { x: 150, y: 150 },
      size: { width: 300, height: 200 }
    })
  }, [])

  return (
    <>
      <WindowManager />
    </>
  )
}

export default App
