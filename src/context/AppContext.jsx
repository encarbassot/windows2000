import { createContext, useContext, useReducer, useState } from 'react'
import AppModel from '../Models/AppModel'

const AppContext = createContext()
export const useAppContext = () => useContext(AppContext)

let appId = 0

export function AppProvider({ children }) {
  const [apps, setApps] = useState([])
  const [zIndex, setZIndex] = useState(0)
  const [_, forceUpdate] = useReducer(x => x + 1, 0)

  function addApp (modelMaker) {

    const id = appId++
    const zIndex = id
    const newApp = modelMaker({
      id, zIndex,forceUpdate
    })
    if(newApp instanceof AppModel){
      setApps(prev => [...prev, newApp])
      return
    }
    console.error('each App must return an instance of AppModel')

  }




  
  const closeApp = id => {
    setApps(prev => prev.filter(app => app.id !== id))
  }

  return (
    <AppContext.Provider value={{ apps, addApp, closeApp }}>
      {apps.map(app => {
        if(app instanceof AppModel && !app.isMinimized){
          return app.render({ key: app.id, id: app.id })
        }
        return null
      })}
      {children}
    </AppContext.Provider>
  )

}