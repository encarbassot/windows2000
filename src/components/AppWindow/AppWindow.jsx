


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
import WindowMenus from "./WindowMenus"

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

  isMinimized = false,
  isMaximized = false,
  setMinimized,
  setMaximized,
  ...props 
}) {

  const { closeApp } = useAppContext()

  const [position, setPosition] = useState({ x: initialX, y: initialY })
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const windowRef = useRef()
  
  
  const onDragStart = e => {
    dragging.current = true
    const point = e.touches ? e.touches[0] : e
    const rect = windowRef.current.getBoundingClientRect()
    // offset.current = {
    //   x: e.nativeEvent.offsetX,
    //   y: e.nativeEvent.offsetY
    // }
    offset.current = {
      x: point.clientX - rect.left,
      y: point.clientY - rect.top
    }
  }

  
  useEffect(() => {

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


    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])


  useEffect(() => {
    const handleMove = e => {
      if (!dragging.current) return
      const point = e.touches ? e.touches[0] : e
      setPosition({
        x: point.clientX - offset.current.x,
        y: point.clientY - offset.current.y
      })
    }
    
    const handleEnd = () => {
      dragging.current = false
    }
  
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleMove)
    window.addEventListener('touchend', handleEnd)
  
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [])



  function handleFocus(e) {
    e.stopPropagation()
    console.log("FOCUS")
  }

  function handleClose(){
    closeApp(id)
  }

  function handleMinimize(){
    setMinimized(true)
  }

  function handleMaximize(){
    setMaximized(!isMaximized)
  }

  return <>
    <div
      ref={windowRef}
      className={"AppWindow" + (isMaximized ? " maximized" : "") + (noWhiteBackground ? " noWhiteBackground" : "")}
      style={{
        left: position.x,
        top: position.y
      }}
      onMouseDown={handleFocus}
    >
      <div className="AppWindow--inner">

        <header 
          onMouseDown={onDragStart} 
          onTouchStart={onDragStart}
          className={"focus"}
        >
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
        

        {menus.length > 0 && <WindowMenus menus={menus} />}


        <main className="content">
          <div className="content--inner">
            {children}
          </div>
        </main>

      </div>

    </div>
  
  </>



}