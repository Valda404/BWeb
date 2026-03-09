import { useState, useEffect } from 'react'
import { onAuthChange, logout } from './firebase/auth.js'
import { listenToTasks } from './firebase/database.js'
import Login from './components/Login.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])

  //Sledování stavu přihlášení
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  //Načtní úkolů při přihlášení
  useEffect(() => {
    if (!user) return

    const unsubscribe = listenToTasks((data) => {
      setTasks(data)
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [user])

  if (!user) {
    return <Login />
  }

  return (
    <div>
      <p>Vítej, {user.displayName}!</p>
      <button onClick={logout}>Odhlásit se</button>
    </div>
  )
}

export default App
