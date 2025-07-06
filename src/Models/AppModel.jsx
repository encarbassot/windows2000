


import { createRef } from "react";
import defaultIcon from "../assets/ICON/6.ico"
import AppWindow from "../components/AppWindow/AppWindow";


export default class AppModel{
  constructor({
    //props from the app builder
    id,
    zIndex,
    forceUpdate,

    //props from the app model
    title,
    icon,
    component,
    description,
    menus=[],
    ...extra
  }){

    this.id = id;
    this.zIndex = zIndex;
    this.title = title
    this.icon = icon || defaultIcon;
    this.description = description;
    this.innerComponent = component
    this.extra = extra
    this.menus = menus || []
    this.ref = createRef()

    this.isMinimized = false
    this.isMaximized = false

    this.forceUpdate = forceUpdate

  }

  setMinimized(state) {
    this.isMinimized = state
    this.forceUpdate()
  }
  
  setMaximized(state) {
    this.isMaximized = state
    this.forceUpdate()
  }

  render({key,id,...props}) {
    const Inner = this.innerComponent

    const m = typeof this.menus === 'function' ? this.menus(this.ref) : this.menus

    return (
      <AppWindow 
        key={key} 
        ico={this.icon} 
        title={this.title} 
        menus={m} 
        
        isMaximized={this.isMaximized}
        isMinimized={this.isMinimized}
        setMinimized={state => this.setMinimized(state)}
        setMaximized={state => this.setMaximized(state)}

        {...this.extra} 
        {...props}
      >
        <Inner ref={this.ref} id={id} {...props} />
      </AppWindow>
    )
  }

}