

import "./WindowTemplate.css"
import useDrag from "../../hooks/useDragg"
import { useWindowManagerContext } from "../../context/WindowManagerContext"


export default function WindowTemplate({ children, title = "", onClose, onFocus,zindex, minimized,maximized,onMinimize,onMaximize}) {

  // const { pop } = useWindowManagerContext()


  const [x, y, dragRef] = useDrag()

  function handleMinimize(e) {
    e.preventDefault()
    e.stopPropagation()
    onMinimize()
  }

  function handleMaximize(e) {
    e.preventDefault()
    e.stopPropagation()
    onMaximize()
  }

  function handleClose(e) {
    e.preventDefault()
    e.stopPropagation()
    // pop(this)
    onClose()
  }


  function handleFocus(e){
    onFocus()
  }

  return <div
    style={{ top: y, left: x, zIndex:zindex }}
    className={"WindowTemplate" + (minimized?" minimized":"") + (maximized?" maximized":"")}
    onDoubleClick={handleMaximize}
    onMouseDown={handleFocus}
  >
    <header ref={dragRef}>
      <span>{title}</span>
      <nav>
        <button onClick={handleMinimize}>_</button>
        <button onClick={handleMaximize}>{maximized?"□":"[]"}</button>
        <button onClick={handleClose}>X</button>
      </nav>
    </header>
    <main>
      {children}
    </main>
  </div>
}