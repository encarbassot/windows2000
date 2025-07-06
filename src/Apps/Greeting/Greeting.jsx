
import './Greeting.css'

import ico from '../../assets/ICON/104.ico'
import { useState } from "react"
import AppWindow from '../../components/AppWindow/AppWindow'
import AppModel from '../../Models/AppModel'

function Greeting  ({...props }) {
    const [n,setN] = useState(0)


  return(

    <div>
      <h1>Welcome to my website</h1>
      <button
      onClick={()=>setN(prev=>prev+1)}
      >{n==0?"TEST":n}</button>

      <p>This is my portfolio, but also is a useful tool</p>
      <p>Feel free to play and investigate every single folder ;)</p>

      <p className='red'>ATENTION: this page is still in development, some functionalities may not work properly</p>

      <p>Meanwhile you can visit <a href="https://fabrega.cat">fabrega.cat</a></p>

      <p>you can follow the development on <a href="https://github.com/encarbassot/windows2000/tree/2025">Github</a></p>
    </div>
  )
}

export default (props)=> new AppModel({
  title: "Greeting",
  icon: ico,
  allowMinimize:false,
  allowMaximize:false,
  component: Greeting,
  description: "A simple greeting app to welcome users to the website.",
  ...props
}) 