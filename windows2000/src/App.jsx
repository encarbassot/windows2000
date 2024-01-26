import { useWindowManagerContext } from "./context/WindowManagerContext"
import "./App.css"
import WindowTemplate from "./components/WindowTemplate/WindowTemplate"
import { useEffect, useState } from "react"
function App() {

  const { pushApp } = useWindowManagerContext()

  function handleOpen1() {
    pushApp({title:"title", component:<Reactive /> })

  }
  function handleOpen2() {

    pushApp({title:"title2",component:"hello2"})
  }


  return (
    <div className="App">
      <button onClick={handleOpen1}>1</button>
      <button onClick={handleOpen2}>2</button>

      {/* <WindowTemplate title="title2">hello</WindowTemplate> */}
    </div>
  )
}

export default App



const Reactive = () => {
  const [num, setNum] = useState(0)
  return <button onClick={() => setNum(num + 1)}>{num}</button>
}