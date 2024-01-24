import { useState } from "react"


export default function useDrag() {


  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  //actualizar la posicion del elemento mientras se está arrastrando
  function handleMouseDown(event) {
    const { top, left } = event.target.getBoundingClientRect();

    //diferencia entre el raton y esquina superior izquierda
    const deltaX = event.clientX - left
    const deltaY = event.clientY - top


    function handleMouseMove(moveEvent) {
      //asignar al elemento la nueva posicion del mouse, substrayendo la distancia relativa elemento vs mouse
      const elementX = moveEvent.clientX - deltaX
      const elementY = moveEvent.clientY - deltaY

      setX(elementX)
      setY(elementY)
    }


    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

  }


  return [x, y, handleMouseDown]
}