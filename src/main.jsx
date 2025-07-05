import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/os.css'


import { AppProvider, useAppContext } from './context/AppContext'
import Calculator from './Apps/Calculator/Calculator'

function AppLauncher() {
  const { addApp } = useAppContext()

  return (
    <>
      <button onClick={() => addApp(({ id }) => <Calculator id={id} />)}>
      ➕ Open Calculator
    </button>
      
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <AppLauncher />
  </AppProvider>
)
