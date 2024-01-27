import { createContext, useContext, useState } from "react";
import WindowTemplate from "../components/WindowTemplate/WindowTemplate";




const WindowManagerContext = createContext({})

export function useWindowManagerContext() {
  return useContext(WindowManagerContext)
}

export function WindowManagerProvider({ children }) {

  const [appList, setAppList] = useState([])
  const [z,setZ] = useState(0)


  //add new app
  function pushApp(app) {
    if(typeof app === "string"){
      app = {component:app}
    }
    const newApp = {...app, zindex:z,minimized:false,maximized:false}
    setZ(prev=>prev+1)

    
    setAppList(prev =>{
      const i = prev.findIndex(x=>x===undefined)
      if (i<0) return [...prev, newApp]
      const updated = [...prev]
      updated[i]= newApp
      return updated
    })

  }


  function handleCloseWindow(i){
    setAppList(prev=>{
      const updated = [...prev]
      updated[i] = undefined
      return updated
    })
  }


  function handleFocusWindow(i){
    

    setAppList(prev=>{
      const updated = [...prev.map(x=>({...x,focus:false}))]

      updated[i].zindex = z
      updated[i].focus = true
      updated[i].minimized = false
      setZ(prevZ=>prevZ+1)
      return updated
    })
  }


  function handleMinimize(i){
    setAppList(prev=>{
      const updated = [...prev]
      updated[i].minimized = !updated[i].minimized
      console.log(updated)
      return updated
    })
  }


  function handleMaximize(i){
    setAppList(prev=>{
      const updated = [...prev]
      updated[i].maximized = !updated[i].maximized
      return updated
    })
  }


  return(
    <WindowManagerContext.Provider
      value={{ appList, pushApp,handleFocusWindow }}
    >
      {appList.map((x,i)=>{
        if(!x || x.hide) return null
        const {component,zindex,...props} = x

        return<WindowTemplate 
          {...props} 
          zindex={zindex+100}
          key={i} 
          onClose={()=>handleCloseWindow(i)}
          onFocus={()=>handleFocusWindow(i)}
          onMinimize={()=>handleMinimize(i)}
          onMaximize={()=>handleMaximize(i)}
        >
          {component}
        </WindowTemplate>
      })}


      {children}
    </WindowManagerContext.Provider>
  )
}