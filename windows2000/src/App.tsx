import { WindowManagerProvider } from "./context/WindowManagerContext"
import "./App.css"
import WindowTemplate from "./components/WindowTemplate/WindowTemplate"
function App() {




  return (
    <WindowManagerProvider>
      <div className="App">

        <WindowTemplate></WindowTemplate>


      </div>
    </WindowManagerProvider>
  )
}

export default App
