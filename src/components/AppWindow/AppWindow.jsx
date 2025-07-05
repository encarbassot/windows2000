


import { useEffect, useRef, useState } from "react"
import "./AppWindow.css"
import { useAppContext } from "../../context/AppContext"

export default function AppWindow({ children, title, menus = [], onMenuAction, initialX = 100, initialY = 100, id, ...props }) {


  const { closeApp } = useAppContext()

  const [activeMenu, setActiveMenu] = useState(null)
  const [position, setPosition] = useState({ x: initialX, y: initialY })
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const windowRef = useRef()

  const toggleMenu = i => {
    setActiveMenu(activeMenu === i ? null : i)
  }


  const onMouseDown = e => {
    
    dragging.current = true
    offset.current = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    }
    e.preventDefault()
  }

  const onMouseMove = e => {
    if (!dragging.current) return
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y
    })
  }

  const onMouseUp = () => {
    dragging.current = false
  }

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])




  function handleClose(){
    closeApp(id)
  }


  return <>
    <div
      ref={windowRef}
      className="AppWindow"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y
      }}
    >
      <header onMouseDown={onMouseDown}>
        ico
        <span className="title">{title || "App Window"}</span>
        <div className="buttons">
          <button className="minimize">-</button>
          <button className="maximize">+</button>
          <button className="close" onClick={handleClose}>x</button>
        </div>
      </header>
      
      {menus.length > 0 && (
        <nav className="menu-bar">
          {menus.map((menu, i) => (
            <div
              key={i}
              className={`menu ${activeMenu === i ? 'active' : ''}`}
              onClick={() => toggleMenu(i)}
              onBlur={() => setActiveMenu(null)}
              tabIndex={0} // para permitir blur
            >
              <span className="menu-title">{menu.title}</span>
              {activeMenu === i && (
                <div className="submenu">
                  {menu.options.map((opt, j) => (
                    <div
                      key={j}
                      className="menu-option"
                      onClick={e => {
                        e.stopPropagation()
                        opt.action && opt.action()
                        setActiveMenu(null)
                      }}
                    >
                      {opt.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}


      <main>{children}</main>

    </div>
  
  </>



}