import { useEffect, useState } from 'react';
import Calculator from '../../Apps/Calculator/Calculator';
import Greeting from '../../Apps/Greeting/Greeting';
import { useAppContext } from '../../context/AppContext';
import './Desktop.css';
import Minesweeper from '../../Apps/Minesweeper/Minesweeper';
import Pipes from '../../Screensavers/Pipes/Pipes';
import Solitario from '../../Apps/Solitario/Solitario';
  
export default function Desktop() {

  const [isScreenSaverActive, setIsScreenSaverActive] = useState(false)
  const [fistRun, setFirstRun] = useState(true)
  
  const appContext = useAppContext()

  useEffect(() => {
    if (!appContext) return

    if(fistRun) {
      // appContext.addApp(Greeting)
      appContext.addApp(Solitario)
      setFirstRun(false)
    }
  }, [appContext])


  return (
    <div className='Desktop'>
      <button onClick={() => appContext.addApp(Calculator)}> Calc</button>
      <button onClick={() => appContext.addApp(Minesweeper)}> Busca Minas</button>
      <button onClick={()=>setIsScreenSaverActive(true)}>ScreenSaver</button>
      {isScreenSaverActive && <Pipes onActive={()=>setIsScreenSaverActive(false)}/>}
    </div>
  )


}
  