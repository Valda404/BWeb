import { useState } from "react";
import { Circle, CheckCircle, Clock, Calendar, MoveRight, Trash, Sun, ListTodo, Pencil, Inbox, CalendarDays } from "lucide-react";

const VIEW_CONFIG = {
  inbox: {
    label: "Inbox",
    Icon: Inbox,
    color: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-700',
    emptyText: 'Sběrná schránka je prázdná.',
  },
  today: {
    label: 'Dnešní úkoly',
    Icon: CalendarDays,
    color: 'text-amber-500',
    badge: 'bg-amber-50 text-amber-700',
    emptyText: 'Máš hotovo! Užij si volný čas.',
  },
  next_action: {
    label: 'Další kroky',
    Icon: ListTodo,
    color: 'text-indigo-600',
    badge: 'bg-indigo-50 text-indigo-700',
    emptyText: 'Žádné další akce. Skvěle!',
  },
  goals : {
    label: 'Cíle',
    Icon: Circle,
    color: 'text-green-600',
    badge: 'bg-green-50 text-green-700',
    emptyText: 'Žádné cíle. Skvěle!',
  }
}
const DEFAULT_VIEW = {
  label: 'Úkoly',
  Icon: Circle,
  color: 'text-gray-500',
  badge: 'bg-gray-100 text-gray-600',
  emptyText: 'Žádné úkoly — čím začneme?',
}


export function TaskList({ tasks, onToggleComplete, onDelete, onMoveToToday, onMoveToNextActions, onEditTask, currentView }) {
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  
    const isInbox = (task) => task.category === 'inbox' || !task.category

    const startEditing = (task) => {
      setEditingTaskId(task.id)
      setEditTitle(task.title)
    }

    const saveEdit = (taskId) => {
      onEditTask(taskId, editTitle)
      setEditingTaskId(null)
    }

  const config = VIEW_CONFIG[currentView] ?? DEFAULT_VIEW
  const { label, Icon, color, badge, emptyText } = config


  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          {label}
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
          {tasks.length}
        </span>
        </h2>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
          Zobrazit vše
          <MoveRight className="w-4 h-4" />
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Icon className={`w-10 h-10 mx-auto mb-4 ${color} opacity-30`} />
          {emptyText}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
            className={`group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
              task.completed
                ? "bg-gray-50 border-gray-100 opacity-60 hover:opacity-80"
                : "bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm"
            }`}
          >

            <button //Zaškrtnutí dokončení
              onClick={() => onToggleComplete(task.id, task.completed)}
              className={`shrink-0 transition-colors ${
                task.completed ? "text-indigo-600" : "text-gray-300 group-hover:text-indigo-400"}`}
            >
              {task.completed ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveEdit(task.id)
                    }
                    if (e.key === "Escape") {
                      setEditingTaskId(null)
                    }
                  }}
                  onBlur={() => saveEdit(task.id)}
                  autoFocus
                  className="w-full text-[15px] font-medium border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                  />
              ) : (
              <span
                className={`text-[15px] truncate font-medium ${
                  task.completed ? "text-gray-500 line-through decoration-gray-300" : "text-gray-800"
                }`}
              >
                {task.title}
              </span>
              )}

              <div className="flex items-center gap-2 shrink-0">
                {task.isPriority && (
                  <span className="px-2 py-1 text-[11px] font-bold tracking-wider uppercase bg-rose-50 text-rose-600 rounded-md">
                    Priorita
                  </span>
                )}
                 {task.deadline && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${task.tagColor ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {task.deadline.includes(":") ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : (
                        <Calendar className="w-3.5 h-3.5" />
                      )}
                      {task.deadline}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {/* Přesun do Today z Inbox/Next Actions */}
                {(isInbox(task) || task.category === 'next_action') && (
                  <button
                    onClick={() => onMoveToToday(task.id)}
                    title="Přesunout do Today"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                )}
                
                {/* Přesun do Next Actions z Inbox */}
                {isInbox(task) && (
                  <button
                    onClick={() => onMoveToNextActions(task.id)}
                    title="Přesunout do Next Actions"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
                  >
                    <ListTodo className="w-4 h-4" />
                  </button>
                )}

                {/* Editace úkolu */}
                <button
                  onClick={() => startEditing(task)}
                  title="Upravit úkol"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                {/* Smazání úkolu */}
                <button
                  onClick={() => onDelete(task.id)}
                  title="Smazat úkol"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
        ))}
      </div>
      )}
    </div>
  );
}
