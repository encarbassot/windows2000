import { useWindowManagerContext } from "./context/WindowManagerContext"
import "./App.css"
import { useState } from "react"
import { TaskBar } from "./components/TaskBar/TaskBar"
import Calculator from "./components/apps/Calculator/Calculator"




function App() {

  const { pushApp } = useWindowManagerContext()

  function handleOpen1() {
    pushApp({title:"title", component:<Reactive /> })

  }
  function handleOpen2() {

    pushApp({title:"title2",component:"hello2"})
  }


  function handleOpen3() {

    pushApp({title:"title2",component:<Calculator />})
  }


  return (
    <div className="App">
      <main className="desktop">
        <button onClick={handleOpen1}>1</button>
        <button onClick={handleOpen2}>2</button>
        <button onClick={handleOpen3}>3</button>
      </main>
      <TaskBar />
    </div>
  )
}

export default App



const Reactive = () => {
  const [num, setNum] = useState(0)
  return <button onClick={() => setNum(num + 1)}>{num}</button>
}