import { useState, useEffect } from 'react'
import { onAuthChange, logout } from './firebase/auth.js'
import { listenToTasks, addTask, updateTask } from './firebase/database.js'
import Login from './components/Login.jsx'
import { TaskList } from './components/TaskList'
import { Sidebar } from './components/Sidebar'
import { QuickAdd } from './components/QuickAdd'
import { GoalCard } from './components/GoalCard'

function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [currentView, setCurrentView] = useState('inbox') 

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
      if (!data) {
        setTasks([])
      } else if (Array.isArray(data)) {
        //saveTasks() ukládá array - zachovat
        setTasks(data.map((task, index) => ({ id: String(index), ...task })))
      } else {
        //addTask() používá push - Firebase vrací objekt s klíčem
        setTasks(Object.entries(data).map(([id, task]) => ({ id, ...task })))
      }
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [user])

  const handleAddTask = async (title) => {
    await addTask({ title, completed: false, category: currentView })
  }

  const handleToggleComplete = async (taskId, currentStatus) => {
    await updateTask(taskId, { completed: !currentStatus })
  }

  const filteredTasks = tasks.filter((task) => {
    if (currentView === 'inbox') {
      //zobrazí inbox úúkoly + stará data bez kategorie
      return task.category === 'inbox' || task.category === undefined
    }
    return task.category === currentView
  })

  if (!user) {
    return <Login />
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9fafb', overflow: 'hidden' }}>
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          padding: '0.875rem 2rem', borderBottom: '1px solid #f3f4f6', background: '#fff'
        }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280', marginRight: '1rem' }}>
            {user.email}
          </span>
          <button
            onClick={logout}
            style={{
              fontSize: '0.875rem', color: '#6366f1', background: 'none',
              border: '1px solid #e0e7ff', borderRadius: '8px', padding: '0.4em 1em', cursor: 'pointer'
            }}
          >
            Odhlásit se
          </button>
        </header>

        {/* Hlavní obsah */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* GoalCard + QuickAdd vedle sebe */}
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <GoalCard />
            <QuickAdd onAdd={handleAddTask} />
          </div>

          {/* TaskList pod nimi */}
          <TaskList tasks={filteredTasks} onToggleComplete={handleToggleComplete} />
        </main>
      </div>
    </div>
  )
}

export default App
