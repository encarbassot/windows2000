import { useEffect, useState } from 'react';
import './TaskBar.css';


import startBtnIco from "../../assets/start.png"
import startBtnOpenIco from "../../assets/start_down.png"
import { useAppContext } from '../../context/AppContext';
import Clock from './Clock';
import { StartMenu } from './StartMenu/StartMenu';
  
export default function TaskBar() {

  const appContext = useAppContext()

  useEffect(() => {
    if (!appContext.apps) return
    console.log(appContext.apps)
  }, [appContext?.apps])

  const [menuIsOpen,setMenuOpen] = useState(false)


  return (
    <div className="TaskBar">
      <button className='startbtn' onClick={()=>setMenuOpen(!menuIsOpen)}>
        <img src={menuIsOpen ? startBtnOpenIco : startBtnIco } alt="Start" />
      </button>
      {menuIsOpen && <StartMenu onClickOutside={()=>setMenuOpen(false)} />}

      {/* <StartMenu /> */}

      <span className='spacer' />

      <div className='activeWindows'>
        {
          appContext.apps && appContext.apps.map((app,i)=>{


            function handleMinimize(){
              if(app.setMinimized) {
                app.setMinimized(!app.isMinimized)
              
              }
            }

            return (
              <div className='thumbnail'
                onClick = {handleMinimize}
                key={app.id}
              >
                <div className='inner'>
                  <img src={app.icon} alt={app.title} />
                  <span>
                    {app.title || ""}
                  </span>

                </div>
              </div>
            )
          })
        }  
      </div>  

      <span className='spacer' />


      <div className='notifications'>
        <Clock/>
      </div>
      


    </div>
  );
}
  