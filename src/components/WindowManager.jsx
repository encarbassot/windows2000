import { useDesktopStore } from '../context/desktopStore'
import AppWindow from './AppWindow'

const WindowManager = () => {
  const windows = useDesktopStore(s => s.windows)

  return (
    <>
      {windows
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(w => (
          <AppWindow key={w.id} config={w} />
        ))}
    </>
  )
}

export default WindowManager