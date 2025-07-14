import { useState } from "react";



export default function Calculator_basic(){

  const [input, setInput] = useState('')


  const handleClick = val => setInput(input + val)

  const handleClear = () => setInput('')

  const handleEval = () => {
    try {
      setInput(eval(input).toString())
    } catch {
      setInput('Error')
    }
  }

  const buttons = [
    '7','8','9','/',
    '4','5','6','*',
    '1','2','3','-',
    '0','.','=','+'
  ]

  return (

    <div className="Calculator__app basic">
      <input className="display" value={input} readOnly />
      <div className="keys">
        {buttons.map((b, i) => (
          <button
            key={i}
            onClick={() => b === '=' ? handleEval() : handleClick(b)}
            className={"button "+(b === '=' ? 'equals' : '')}
          >
            {b}
          </button>
        ))}
        <button className="clear" onClick={handleClear}>C</button>
      </div>
    </div>
  )
}