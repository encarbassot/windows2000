
import { useState, useRef } from 'react'
import "./WindowMenus.css"

export default function WindowMenus({menus = [], innerRef}){

  const [activeMenu, setActiveMenu] = useState(null)
  const menuRefs = useRef([])

  const toggleMenu = index => {
    setActiveMenu(prev => (prev === index ? null : index))
  }

  const handleAction = (actionFn, event) => {
    event.stopPropagation()
    actionFn && actionFn()
    setActiveMenu(null)
  }


  const renderMenu = (items, depth = 0) => (
    <div className={`submenu depth-${depth}`}> {/* position relative */}
      {items.map((item, i) => (
        <div
          key={i}
          className="menu-option"
          onClick={e => {
            if (item.action) handleAction(() => item.action(innerRef), e)
          }}
        >
          <div className="menu-label-with-arrow">
            {item.title}
            {item.menus && <span className="submenu-arrow">▶</span>}
          </div>
          {item.menus && (
            <div className="submenu-wrapper">
              {renderMenu(item.menus, depth + 1)}
            </div>
          )}
        </div>
      ))}
    </div>
  )



  return (
    <nav className="WindowMenus">
      {menus.map((menu, i) => (
        <div
          key={i}
          className={`menu ${activeMenu === i ? 'active' : ''}`}
          onClick={() => toggleMenu(i)}
          onBlur={() => setActiveMenu(null)}
          tabIndex={0}
          ref={el => (menuRefs.current[i] = el)}
        >
          <span className="menu-title">{menu.title}</span>
          {activeMenu === i && renderMenu(menu.menus || [])}
        </div>
      ))}
    </nav>
  )

}