import { useState, useEffect } from 'react'
import { onAuthChange, logout } from './firebase/auth.js'
import { listenToTasks, addTask, updateTask, deleteTask, normalizeData, listenToGoals, addGoal, updateGoal, deleteGoal } from './firebase/database.js'
import Login from './components/Login.jsx'
import { TaskList } from './components/TaskList'
import { Sidebar } from './components/Sidebar'
import { QuickAdd } from './components/QuickAdd'
import { GoalCard } from './components/GoalCard'

function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [currentView, setCurrentView] = useState('inbox')
  const [goals, setGoals] = useState([])

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
      setTasks(normalizeData(data))
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [user])

  //Načítání cílů při přihlášení
  useEffect(() => {
    if (!user) return

    const unsubscribe = listenToGoals((data) => {
      setGoals(normalizeData(data))
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [user])


  const handleAddTask = async (title) => {
    const category = currentView === 'dash' ? 'inbox' : currentView
    await addTask({ title, completed: false, category })
  }

  const handleToggleComplete = async (taskId, currentStatus) => {
    await updateTask(taskId, { completed: !currentStatus })
  }

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId)
  }

  const handleMoveToInbox = async (taskId) => {
    await updateTask(taskId, { category: 'inbox' })
  }

  const handleMoveToToday = async (taskId) => {
    await updateTask(taskId, { category: 'today' })
  }

  const handleMoveToNextActions = async (taskId) => {
    await updateTask(taskId, { category: 'next' })
  }

  const handleEditTask = async (taskId, newTitle, newDeadline, newGoalId) => {
    if (!newTitle.trim()) return
    await updateTask(taskId, { 
      title: newTitle.trim(),
      deadline: newDeadline || null,
      goalId: newGoalId || null,
    })
  }

  const handleAddGoal = async (title) => {
    await addGoal({ title })
  }

  const handleEditGoal = async (goalId, newTitle) => {
    if (!newTitle.trim()) return
    await updateGoal(goalId, { title: newTitle.trim() })
  }

  const handleDeleteGoal = async (goalId) => {
    await deleteGoal(goalId)
  }

  // Filtrování úkolů podle aktuálně zvolené kategorie a stavu dokončení
  const filtered = (() => {
  if (currentView === 'completed') return tasks.filter(t => t.completed)
  if (currentView === 'dash') return tasks.filter(t => !t.completed)
  return tasks.filter(t => t.category === currentView && !t.completed)
})()

  const filteredTasks = [...filtered].sort((a, b) => {
    const aHas = !!a.deadline
    const bHas = !!b.deadline
    
    if (aHas && !bHas) return -1
    if (!aHas && bHas) return 1
    if (aHas && bHas) return new Date(a.deadline) - new Date(b.deadline)
    return 0
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

        {/* Hlavní obsah - TADY JE OPRAVA SCROLLOVÁNÍ (overflowY: 'auto') */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          
          {currentView === 'goals' ? (
            // ===== GOALS VIEW =====
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <QuickAdd onAdd={handleAddGoal} placeholder="Přidej nový cíl" />
              {goals.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm text-center text-gray-400">
                  Žádné cíle. Přidej první cíl!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {goals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} tasks={tasks} onDelete={handleDeleteGoal} onEdit={handleEditGoal} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // ===== NORMÁLNÍ VIEW =====
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {goals.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center text-gray-400 text-sm">
                      Žádné cíle
                    </div>
                  ) : (
                    // Ukáže se prostě jen první cíl, aby to nerozbíjelo grafiku
                    <GoalCard goal={goals[0]} tasks={tasks} readOnly />
                  )}
                </div>
                <QuickAdd onAdd={handleAddTask} />
              </div>
              
              <TaskList
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onMoveToToday={handleMoveToToday}
                onMoveToNextActions={handleMoveToNextActions}
                onMoveToInbox={handleMoveToInbox}
                onEditTask={handleEditTask}
                currentView={currentView}
                goals={goals}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App