import './Chat.css';

import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react"
import { io } from "socket.io-client"
import AppModel from '../../Models/AppModel';
import { useDebounce } from '../../lib/elio-react-components/hooks';



const Chat = forwardRef(({...props},ref) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [typingUsers, setTypingUsers] = useState([])

  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  const [username, setUsername] = useState(`User${Math.floor(Math.random() * 1000)}`)
  const [isChangingUsername, setIsChangingUsername] = useState(false)


  const debouncedTyping = useDebounce(() => {
    socketRef.current.emit("typing", username)
  }, 2000)

  useEffect(() => {
    socketRef.current = io("https://eloi.fabrega.cat", { path: "/chat/socket.io" })

    socketRef.current.on("chat message", msg => {
      setMessages(prev => [...prev, msg])
    })

    socketRef.current.on("typing", user => {
      setTypingUsers(prev => [...new Set([...prev, user])])
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u !== user))
      }, 2000)
    })

    return () => socketRef.current.disconnect()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])


  useImperativeHandle(ref, () => ({
    changeUsername: () => setIsChangingUsername(true),
  }))

  const handleSubmit = e => {
    e.preventDefault()
    if (!input.trim()) return
    socketRef.current.emit("chat message", { user: username, text: input })
    setInput("")
  }

  if (isChangingUsername) {
    return (
      <div className="win2000-chat">
        <h2>Change Username</h2>
        <form
          onSubmit={e => {
            e.preventDefault()
            setIsChangingUsername(false)
          }}
        >
          <input value={username} onChange={e => setUsername(e.target.value)} autoComplete="off" autoFocus />
          <button>Ok</button>
        </form>
      </div>
    )
  }

  return (
    <div className="win2000-chat">
      <ul className="messages">
        {messages.map((msg, i) => (
          <li key={i} className={i % 2 === 0 ? "odd" : ""}>
            <strong>{msg.user}: </strong>
            {msg.text}
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is typing..." : "are typing..."}
        </div>
      )}
      <form onSubmit={handleSubmit} className="form">
        <input
          value={input}

          onChange={e => {
            setInput(e.target.value)
            debouncedTyping()
          }}

          autoComplete="off"
          autoFocus
        />
        <button>Send</button>
      </form>
    </div>
  )
})




export default (props)=> new AppModel({
  title: 'Chat',
  // icon: ,
  component: Chat,
  description: 'A simple chat',
  noWhiteBackground: true,
  menus: (ref)=>[
    {
      title: 'Settings',
      menus: [
        {title:"Change username", action: () => ref?.current?.changeUsername()},
        
      ]
    }
  ],
  ...props
})
