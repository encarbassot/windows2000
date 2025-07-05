import { createContext, useContext, useState } from 'react'

const AppContext = createContext()
export const useAppContext = () => useContext(AppContext)

let appId = 0

export function AppProvider({ children }) {
  const [apps, setApps] = useState([])

  const addApp = Component => {
    const id = appId++
    const zIndex = id

    const newApp = { id, zIndex, component: Component }
    setApps(prev => [...prev, newApp])

  }

  const closeApp = id => {
    setApps(prev => prev.filter(app => app.id !== id))
  }

  return (
    <AppContext.Provider value={{ apps, addApp, closeApp }}>
      {apps.map(app => {
        const Component = app.component
        return <Component key={app.id} id={app.id} />
      })}
      {children}
    </AppContext.Provider>
  )

}