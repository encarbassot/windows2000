import React, { useEffect, useRef, useState } from "react"

export default function useDrag(startX = 0, startY = 0): [number, number, React.MutableRefObject<null>] {
  const dragRef = useRef(null);
  const [x, setX] = useState(startX);
  const [y, setY] = useState(startY);

  function handleDragStart(clientX, clientY) {
    const deltaX = clientX - x;
    const deltaY = clientY - y;

    function handleDragMove(moveEvent) {
      const { clientX, clientY } = moveEvent.touches ? moveEvent.touches[0] : moveEvent;
      const elementX = clientX - deltaX;
      const elementY = clientY - deltaY;
      setX(elementX);
      setY(elementY);
    }

    function handleDragEnd() {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchend", handleDragEnd);
    }

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("touchmove", handleDragMove, { passive: false });
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);
  }

  useEffect(() => {
    if (dragRef.current) {
      const handleMouseDown = (event) => {
        if (event.target.tagName === "BUTTON") {
          return;
        }
        const { clientX, clientY } = event;
        handleDragStart(clientX, clientY);
      };

      dragRef.current.addEventListener("mousedown", handleMouseDown);
      dragRef.current.addEventListener("touchstart", (touchEvent) => {
        const { clientX, clientY } = touchEvent.touches[0];
        handleDragStart(clientX, clientY);
      });

      return () => {
        dragRef.current?.removeEventListener("mousedown", handleMouseDown);
        dragRef.current?.removeEventListener("touchstart", handleMouseDown);
      };
    }
  }, [dragRef.current, x, y]);

  return [x, y, dragRef];
}
