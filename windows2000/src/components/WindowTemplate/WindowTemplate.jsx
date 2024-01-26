

import "./WindowTemplate.css"
import useDrag from "../../hooks/useDragg"
import { useWindowManagerContext } from "../../context/WindowManagerContext"


export default function WindowTemplate({ children, title = "", onClose, onFocus,zindex }) {

  // const { pop } = useWindowManagerContext()


  const [x, y, dragRef] = useDrag()

  function handleMinimize(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleMaximize(e) {
    e.preventDefault()
    e.stopPropagation()
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
    className="WindowTemplate"
    onDoubleClick={handleMaximize}
    onMouseDown={handleFocus}
  >
    <header ref={dragRef}>
      <span>{title}</span>
      <nav>
        <button onClick={handleMinimize}>_</button>
        <button onClick={handleMaximize}>[]</button>
        <button onClick={handleClose}>X</button>
      </nav>
    </header>
    <main>
      {children}
    </main>
  </div>
}