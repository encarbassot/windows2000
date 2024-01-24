import { createContext, useContext, useState } from "react";




const WindowManagerContext = createContext({})

export function useWindowManagerContext() {
  return useContext(WindowManagerContext)
}

export function WindowManagerProvider({ children }) {

  const [appList, setAppList] = useState([])

  return <WindowManagerContext.Provider
    value={{}}
  >
    {children}
  </WindowManagerContext.Provider>
}