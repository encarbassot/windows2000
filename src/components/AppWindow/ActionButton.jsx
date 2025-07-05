import { useState } from "react"



export default function ActionButton({
  alt,
  onClick,
  ico,
  icoHover
}){

  const [isPressed, setIsPressed] = useState(false)

  function handleClick(e) {
    if (onClick){
      onClick(e)
    }
  }

  return  <button className={"ActionButton " + alt}
  onMouseDown={()=>setIsPressed(true)}
  onMouseUp={handleClick}
  onMouseLeave={()=>setIsPressed(false)}
  >
    <img 
    src={
      isPressed
      ?icoHover
      :ico
    } alt />
  </button>


}