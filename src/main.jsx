import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/os.css'


import { AppProvider } from './context/AppContext'
import Desktop from './components/Desktop/Desktop'
import TaskBar from './components/TaskBar/TaskBar'



createRoot(document.getElementById('root')).render(
  <AppProvider>
    <Desktop />
    <TaskBar />
  </AppProvider>
)
