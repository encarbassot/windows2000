import AppWindow from '../../components/AppWindow/AppWindow';
import AppModel from '../../Models/AppModel';
import './Calculator.css';

import { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import Calculator_basic from './extra/Calculator_basic';
import { Calculator_time_intervals } from './extra/Calculator_time';
import Calculator_binary from './extra/Calculator_binary';


const TYPES = {
  BASIC: 'basic',
  DATE_INTERVALS: 'date_intervals',
  BINARY: 'binary',
}


const Calculator = forwardRef(({...props},ref) => {

  const [type, setType] = useState(TYPES.BASIC)

  const changeType = (x) => {
    setType(x)
  }

  useImperativeHandle(ref, () => ({
    changeType
  }))

  if(type === TYPES. BASIC) return <Calculator_basic />
  if(type === TYPES.DATE_INTERVALS) return <Calculator_time_intervals />
  if(type === TYPES.BINARY) return <Calculator_binary />

})
  

export default (props)=> new AppModel({
  title: 'Calculator',
  // icon: ,
  component: Calculator,
  description: 'A simple calculator app',
  noWhiteBackground: true,
  menus: (ref)=>[
    {
      title: 'View',
      menus: [
        {title:"Basic", action: () => ref?.current?.changeType(TYPES.BASIC)},
        {title:"Binary", action: () => ref?.current?.changeType(TYPES.BINARY)},
        {
          title: 'Date',
          menus:[
            {
              title: 'Intervals',
              action: () => ref?.current?.changeType(TYPES.DATE_INTERVALS),
            }
          ]
        }
      ]
    },
    {
      title: "Test",
      menus: [
        {
          title: "Test Action",
          action: () => console.log("Test action triggered")
        },
        {
          title: "Another Menu",
          menus: [
            { title: "Submenu Item 1", 
              menus:[
                {title:"A"},
                {title:"B"},
              ]
            },
            { title: "Submenu Item 2", 
              menus:[
                {title:"A"},
                {title:"B"}
              ]
            }
          ]
        }
      ]
    }
  ],
  ...props
})




