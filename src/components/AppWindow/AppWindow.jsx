


import { useEffect, useRef, useState } from "react"
import "./AppWindow.css"
import { useAppContext } from "../../context/AppContext"

import btn_close_ico from "../../assets/sprites/window/close.png"
import btn_close_hover_ico from "../../assets/sprites/window/close_hover.png"
import btn_minimize_ico from "../../assets/sprites/window/minimize.png"
import btn_minimize_hover_ico from "../../assets/sprites/window/minimize_hover.png"
import btn_maximize_ico from "../../assets/sprites/window/maximize.png"
import btn_maximize_hover_ico from "../../assets/sprites/window/maximize_hover.png"
import btn_unmaximize_ico from "../../assets/sprites/window/unmaximize.png"
import btn_unmaximize_hover_ico from "../../assets/sprites/window/unmaximize_hover.png"
import ActionButton from "./ActionButton"

import defautIco from "../../assets/ICON/6.ico"

export default function AppWindow({ 
  children,
  title,
  menus = [],
  onMenuAction,
  initialX = 100,
  initialY = 100,
  id,
  allowMinimize=true,
  allowMaximize=true,
  allowClose = true,
  ico,
  noWhiteBackground = false,
  ...props 
}) {


  const { closeApp } = useAppContext()

  const [activeMenu, setActiveMenu] = useState(null)
  const [position, setPosition] = useState({ x: initialX, y: initialY })
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const windowRef = useRef()

  const [isMaximized,setIsMaximized] = useState(false)  

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

  function handleMinimize(){
    
  }

  function handleMaximize(){
    setIsMaximized(!isMaximized)
  }

  return <>
    <div
      ref={windowRef}
      className={"AppWindow" + (isMaximized ? " maximized" : "") + (noWhiteBackground ? " noWhiteBackground" : "")}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div className="AppWindow--inner">

        <header onMouseDown={onMouseDown} className={"focus"}>
          <img src={ico || defautIco} alt="" className="ico" />
          <span className="title pixelatedFont">{title || "App Window"}</span>
          <div className="buttons">

            {
              allowMinimize &&
              <ActionButton 
                alt="minimize"
                onClick={handleMinimize}
                ico={btn_minimize_ico}
                icoHover={btn_minimize_hover_ico}
              />
            }

            {
              allowMaximize &&
              <ActionButton
                alt="maximize"
                onClick={handleMaximize}
                ico={isMaximized ? btn_unmaximize_ico : btn_maximize_ico}
                icoHover={isMaximized ? btn_unmaximize_hover_ico : btn_maximize_hover_ico}
              />
            }

            {
              allowClose &&
              <ActionButton
                alt="close"
                onClick={handleClose}
                ico={btn_close_ico}
                icoHover={btn_close_hover_ico}
              />
            }

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


        <main className="content">
          <div className="content--inner">
            {children}
          </div>
        </main>

      </div>

    </div>
  
  </>



}