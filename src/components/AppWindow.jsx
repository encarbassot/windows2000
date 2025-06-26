// src/components/AppWindow.jsx
import { useRef, useState, useEffect } from 'react'
import { useDesktopStore } from '../context/desktopStore'

const AppWindow = ({ config }) => {
  const {
    id,
    title,
    component: Component,
    position = { x: 100, y: 100 },
    size = { width: 400, height: 300 },
    zIndex,
    minimized,
    maximized
  } = config

  const focusWindow = useDesktopStore(s => s.focusWindow)
  const closeWindow = useDesktopStore(s => s.closeWindow)
  const toggleMaximizeWindow = useDesktopStore(s => s.toggleMaximizeWindow)
  const minimizeWindow = useDesktopStore(s => s.minimizeWindow)

  const [pos, setPos] = useState(position)
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const startDrag = e => {
    e.preventDefault()
    focusWindow(id)
    setDragging(true)
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y })
  }

  const onDrag = e => {
    if (!dragging) return
    setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const stopDrag = () => setDragging(false)

  useEffect(() => {
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', stopDrag)
    return () => {
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('mouseup', stopDrag)
    }
  })

  if (minimized) return null

  const style = maximized
    ? { top: 0, left: 0, width: '100vw', height: '100vh', zIndex, position: 'absolute', border: '1px solid #aaa', background: '#fff' }
    : { top: pos.y, left: pos.x, width: size.width, height: size.height, zIndex, position: 'absolute', border: '1px solid #aaa', background: '#fff' }

  return (
    <div style={style} onMouseDown={() => focusWindow(id)}>
      <div
        onMouseDown={startDrag}
        style={{ height: 24, background: '#eee', cursor: 'move', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}
      >
        <span>{title}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => minimizeWindow(id)}>🗕</button>
          <button onClick={() => toggleMaximizeWindow(id)}>🗖</button>
          <button onClick={() => closeWindow(id)}>✕</button>
        </div>
      </div>
      <div style={{ width: '100%', height: 'calc(100% - 24px)', overflow: 'hidden' }}>
        {Component && <Component />}
      </div>
    </div>
  )
}

export default AppWindow
