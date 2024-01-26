import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { WindowManagerProvider } from './context/WindowManagerContext.jsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WindowManagerProvider>
    <App />
  </WindowManagerProvider>
)
