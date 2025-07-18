

import imgReverse from "./assets/reverse.png"
import imgDeck1 from "./assets/deck1.png"
import imgDeck2 from "./assets/deck2.png"
import imgDeck3 from "./assets/deck3.png"
import imgDeck4 from "./assets/deck4.png"
import { useEffect, useRef, useState } from "react"

const decks = [imgDeck1, imgDeck2, imgDeck3, imgDeck4]
const cardLabels = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']


export default function Solitario_Card({ card, onDrop , positionOnBoard }) {
  const {id, deck, value, x, y ,width, height, hidden} = card

  const [position, setPosition] = useState({...positionOnBoard})
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  
  const handleMouseDown = e => {
    dragging.current = true
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
    e.stopPropagation()
  }

  const handleMouseMove = e => {
    if (!dragging.current) return

    console.log("Dragging", id, e.clientX, e.clientY)
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y
    })
  }

  const handleMouseUp = () => {
    if (dragging.current && onDrop) {
      onDrop(id, position)
    }
    dragging.current = false
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const deckImg = decks[deck % decks.length]
  const label = cardLabels[value % cardLabels.length]

  return (
    <div
      className={"Card " + (hidden? "reverse" : "deck" + deck) }
      style={{
        left: position.x,
        top: position.y,
        width,
        height
      }}
      onMouseDown={handleMouseDown}
    >
      {hidden ? (
        <img src={imgReverse} alt="Reverse" className="reverse" />
      ) : (
        <>
          <img src={deckImg} alt={`${label} of deck ${deck + 1}`} />
          <span className="CardLabel">{label}</span>
        </>
      )}

      {/* <div className="info">
        <span>x:{position.x} Y:{position.y}</span>
      </div> */}

    </div>
  )

}



