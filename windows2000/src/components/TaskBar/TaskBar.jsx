import { useWindowManagerContext } from "../../context/WindowManagerContext"
import "./TaskBar.css"


export function TaskBar(){

  const {appList,handleFocusWindow } = useWindowManagerContext()


  return <>
    <div className="TaskBar">
      {
        appList.map((x,i)=>{
          console.log(x)
          if(x===undefined) return

          return <span 
            className={"task" + (x.focus && !x.minimized?" focus":"")} 
            key={i}
            onClick={()=>handleFocusWindow(i)}
          >
            {x.title}
          </span>

        })
      }
    </div>
  </>
}