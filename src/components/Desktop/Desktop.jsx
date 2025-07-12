import { useEffect, useState } from 'react';
import Calculator from '../../Apps/Calculator/Calculator';
import Greeting from '../../Apps/Greeting/Greeting';
import { useAppContext } from '../../context/AppContext';
import './Desktop.css';
import Minesweeper from '../../Apps/Minesweeper/Minesweeper';
import Pipes from '../../Screensavers/Pipes/Pipes';
  
export default function Desktop() {

  const [isScreenSaverActive, setIsScreenSaverActive] = useState(false)

  
  const { addApp } = useAppContext()

  useEffect(()=>{
    addApp(Greeting)
    // addApp(({ id }) => <Minesweeper id={id} />)
  } ,[])

  return (
    <div className='Desktop'>
      <button onClick={() => addApp(Calculator)}> Calc</button>
      <button onClick={() => addApp(Minesweeper)}> Busca Minas</button>
      <button onClick={()=>setIsScreenSaverActive(true)}>ScreenSaver</button>
      {isScreenSaverActive && <Pipes onActive={()=>setIsScreenSaverActive(false)}/>}
    </div>
  )


}
  