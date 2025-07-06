import { useEffect, useState } from 'react';
import './TaskBar.css';


import startBtnIco from "../../assets/start.png"
import startBtnOpenIco from "../../assets/start_down.png"
import { useAppContext } from '../../context/AppContext';
import Clock from './Clock';
  
export default function TaskBar() {

  const {apps} = useAppContext()

  const [menuIsOpen,setMenuOpen] = useState(false)

  useEffect(()=>{
    console.log(apps)
  },[apps])
  
  return (
    <div className="TaskBar">
      <button className='startbtn' onClick={()=>setMenuOpen(!menuIsOpen)}>
        <img src={menuIsOpen ? startBtnOpenIco : startBtnIco } alt="Start" />
      </button>
      
      <span className='spacer' />

      <div className='activeWindows'>
        {
          apps && apps.map((app,i)=>{


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
                    {app.title.length>10 
                      ? app.title.slice(0,7)+"..." 
                      : app.title
                    }
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
  