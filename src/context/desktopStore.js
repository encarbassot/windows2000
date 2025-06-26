import { create } from 'zustand'

export const useDesktopStore = create(set => ({
  windows: [],
  zCounter: 1,

  openWindow: config =>
    set(state => ({
      windows: [
        ...state.windows,
        {
          ...config,
          id: crypto.randomUUID(),
          zIndex: state.zCounter + 1,
          minimized: false,
          maximized: false,
          focused: true
        }
      ],
      zCounter: state.zCounter + 1
    })),

  closeWindow: id =>
    set(state => ({
      windows: state.windows.filter(w => w.id !== id)
    })),

  focusWindow: id =>
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, zIndex: state.zCounter + 1, focused: true } : { ...w, focused: false }
      ),
      zCounter: state.zCounter + 1
    })),

  minimizeWindow: id =>
    set(state => ({
      windows: state.windows.map(w => (w.id === id ? { ...w, minimized: true } : w))
    })),

  toggleMaximizeWindow: id =>
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, maximized: !w.maximized, minimized: false } : w
      )
    }))
}))
