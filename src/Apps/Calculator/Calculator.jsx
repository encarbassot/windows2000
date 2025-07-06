import AppWindow from '../../components/AppWindow/AppWindow';
import AppModel from '../../Models/AppModel';
import './Calculator.css';

import { useState, useImperativeHandle, forwardRef, useRef } from 'react'



const Calculator = forwardRef(({...props},ref) => {
  const [input, setInput] = useState('')

  const clear = () => {
    setInput('')
  }

  const focus = () => {
    console.log('focus!')
  }

  useImperativeHandle(ref, () => ({
    clear,
    focus
  }))


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

    <div className="Calculator__app">
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

})
  

export default (props)=> new AppModel({
  title: 'Calculator',
  // icon: ,
  component: Calculator,
  description: 'A simple calculator app',
  noWhiteBackground: true,
  menus: (ref)=>[
    {
      title: 'Edit',
      menus: [
        {
          title: 'Clear',
          action: () => ref?.current?.clear()
        }
      ]
    },
    {
      title: 'View',
      menus: [
        {
          title: 'Focus',
          menus:[
            {
              title: 'Focus Calculator',
              action: () => ref?.current?.focus()
            }
          ]
        }
      ]
    }
  ],
  ...props
})




