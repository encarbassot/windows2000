import './StartMenu.css';
  

import sideBar from '../../../assets/sprites/startMenu/sideBar.png'

/*

151,"Apagar ..."
135,"Ejecutar ..."
129,"Ayuda"
123,"Buscar"
115,"Configuración"
109,"Documentos"
104,"Programas"
104,"Accesorios"
104,"Inicio"
104,"Internet Explorer"
104,"Outlook Express"
228,"Windows Update"

 */

import ico_Apagar from '../../../assets/ICON/151.ico'
import ico_Ejecutar from '../../../assets/ICON/135.ico'
import ico_Ayuda from '../../../assets/ICON/129.ico'
import ico_Buscar from '../../../assets/ICON/123.ico'
import ico_Configuracion from '../../../assets/ICON/115.ico'
import ico_Documentos from '../../../assets/ICON/109.ico'
import ico_Programas from '../../../assets/ICON/104.ico'
import ico_Accesorios from '../../../assets/ICON/102.ico'
// import ico_Inicio from '../../../assets/ICON/102.ico'
// import ico_Internet from '../../../assets/ICON/104.ico'
// import ico_Outlook from '../../../assets/ICON/104.ico'
import ico_Update from '../../../assets/ICON/228.ico'
import { useEffect, useRef, useState } from 'react'



import {Ico_Arrow} from '../../../assets/sprites/sprites.tsx'

import Calculator from '../../../Apps/Calculator/Calculator.jsx';

import AppModel from '../../../Models/AppModel.jsx';
import Minesweeper from '../../../Apps/Minesweeper/Minesweeper.jsx';
import Solitario from '../../../Apps/Solitario/Solitario.jsx';
import { useAppContext } from '../../../context/AppContext.jsx';
console.log(Calculator)

const startMenuConfig = [
  {ico: ico_Update, name: 'Windows Update', spacerAfter:true},
  {ico: ico_Programas, name: 'Programas', children: [
    {ico: ico_Accesorios, name: 'Accesorios'
    , children: [
      Calculator,
      {ico: ico_Accesorios, name: 'Bloc de notas'},
      {ico: ico_Accesorios, name: 'Paint'},
      {ico: ico_Accesorios, name: 'Grabadora de sonidos'},
      {ico: ico_Accesorios, name: 'Terminal de comandos'},
    ]
    },
    {ico: ico_Accesorios, name: 'Juegos'
    , children: [
      Minesweeper,
      Solitario
    ]
    },
    {ico: ico_Accesorios, name: 'Inicio'},
  ]},
  {ico: ico_Documentos, name: 'Documentos'},
  {ico: ico_Configuracion, name: 'Configuración'},
  {ico: ico_Buscar, name: 'Buscar'},
  {ico: ico_Ayuda, name: 'Ayuda'},
  {ico: ico_Ejecutar, name: 'Ejecutar...'},
  {ico: ico_Apagar, name: 'Apagar...', spacerBefore:true},

]








export function StartMenu({ onClickOutside }){

  const menuRef = useRef()

  useEffect(() => {
    const handleClick = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClickOutside?.()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])




  return(
    <>
      <div className='StartMenu' ref={menuRef}>
        <div className='StartMenu--inner'>

          <img src={sideBar} alt="" className='banner'/>
          <div className='content'>

            {startMenuConfig.map((item,i)=>{

              return (
                <>
                  {(item.spacerBefore) && <Spacer key={`sb-${i}`} />}
                  <RowRecursive item={item} key={i}/>
                  {(item.spacerAfter) && <Spacer key={`sa-${i}`} />}
                </>
              )
            })}

            
          </div>

        </div>
      </div>
    </>
  )
}


function RowRecursive({ item }) {
  const appContext = useAppContext()


  const app = typeof item === 'function' ? item() : item

  const isApp = app instanceof AppModel
  
  if (isApp){

    return (
      <div className='rowContainer'>
        <div className='row' onClick={() => appContext.addApp(item) } >
          <img src={app.icon} alt="" />
          <span className='main'>{app.title}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='rowContainer'>
      <div className='row'>
        <img src={item.ico} alt="" />
        <span className='main'>{item.name}</span>
        {item.children && <Ico_Arrow />}
        {item.children && (
          <ContextBox>
            {item.children.map((child, j) => (
              <RowRecursive key={j} item={child} />
            ))}
          </ContextBox>
        )}
      </div>

    </div>
  )
}






function Spacer(){
  return (<span className='spacer' />)
}

function ContextBox({children}){
  return (
    <div className='contextBox'>
      <div className='contentBox--inner'>
        <div className='content'>
          {children}

        </div>
      </div>
    </div>
  )
}