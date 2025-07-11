import { useState, useEffect } from 'react'
import moment from 'moment'

const Clock = () => {
  const [time, setTime] = useState(moment())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <span className='clock'>{time.format('HH:mm:ss DD/MM/YYYY')}</span>
}

export default Clock
