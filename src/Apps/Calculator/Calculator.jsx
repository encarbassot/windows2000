import AppWindow from '../../components/AppWindow/AppWindow';
import './Calculator.css';

import { useState } from 'react'


  
export default function Calculator({...props}) {
  const [input, setInput] = useState('')


  const menus = [
    {
      title: 'File',
      options: [
        { title: 'test', action: ()=>setInput(101010) }
      ]
    }
  ]


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
    <AppWindow
      title="Calculator"
      menus={menus}
      {...props}
    >
      <div className="Calculator">
        <input className="display" value={input} readOnly />
        <div className="keys">
          {buttons.map((b, i) => (
            <button
              key={i}
              onClick={() => b === '=' ? handleEval() : handleClick(b)}
              className={b === '=' ? 'equals' : ''}
            >
              {b}
            </button>
          ))}
          <button className="clear" onClick={handleClear}>C</button>
        </div>
      </div>
    </AppWindow>
  )

}
  




