import { createContext, useContext, useState } from "react";
import WindowTemplate from "../components/WindowTemplate/WindowTemplate";




const WindowManagerContext = createContext({})

export function useWindowManagerContext() {
  return useContext(WindowManagerContext)
}

export function WindowManagerProvider({ children }) {

  const [appList, setAppList] = useState([])
  const [z,setZ] = useState(0)

  function pushApp(app) {
    if(typeof app === "string"){
      app = {component:app}
    }
    const newApp = {...app, zindex:z}
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
      // updated.splice(i,1)
      updated[i] = undefined
      return updated
    })
  }


  function handleFocusWindow(i){
    if(appList[i].zindex===z-1) return

    setAppList(prev=>{
      const updated = [...prev]
      updated[i].zindex = z
      setZ(prevZ=>prevZ+1)
      console.log(z)
      return updated
    })
  }




  return(
    <WindowManagerContext.Provider
      value={{ appList, pushApp }}
    >
      {appList.map((x,i)=>{
        if(!x || x.hide) return null
        const {component,zindex,...props} = x

        return<WindowTemplate 
          {...props} 
          title={i+" "+props.title}
          zindex={zindex+100}
          key={i} 
          onClose={()=>handleCloseWindow(i)}
          onFocus={()=>handleFocusWindow(i)}
        >
          {component}
        </WindowTemplate>
      })}


      {children}
    </WindowManagerContext.Provider>
  )
}