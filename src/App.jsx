import { useState, useEffect } from 'react'
import { onAuthChange, logout } from './firebase/auth.js'
import { listenToTasks, addTask, updateTask, deleteTask } from './firebase/database.js'
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

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId)
  }

  const handleMoveToToday = async (taskId) => {
    await updateTask(taskId, { category: 'today' })
  }

  const handleMoveToNextActions = async (taskId) => {
    await updateTask(taskId, { category: 'next' })
  }

  const handleEditTask = async (taskId, newTitle) => {
    if (!newTitle.trim()) return
    await updateTask(taskId, { title: newTitle })
  }

  // Filtrování úkolů podle aktuálně zvolené kategorie
  const filteredTasks = currentView === 'dash'
    ? tasks // Zobrazit všechny úkoly v dashboardu
    : tasks.filter(task => (task.category) === currentView)

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

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
            <GoalCard 
            goalTitle="Dokončit bakalářku"
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            progressPercentage={progressPercentage}
            />
            <QuickAdd onAdd={handleAddTask} />
          </div>

          {/* TaskList pod nimi */}
          <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          onMoveToToday={handleMoveToToday}
          onMoveToNextActions={handleMoveToNextActions}
          onEditTask={handleEditTask}
          currentView={currentView}
          />
        </main>
      </div>
    </div>
  )
}

export default App
