

import "./WindowTemplate.css"
import useDrag from "../../hooks/useDragg"

export default function WindowTemplate() {

  const [x, y, handleMouseDown] = useDrag()

  return <div
    style={{ top: y, left: x }}
    className="WindowTemplate"
    onMouseDown={handleMouseDown}
  >


  </div>
}