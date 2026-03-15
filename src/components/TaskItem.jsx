import { useState } from "react";
import { Circle, CheckCircle, Clock, Calendar, Trash, Sun, ListTodo, Pencil } from "lucide-react";

const CATEGORY_BADGE = {
  inbox:       { label: 'Inbox',        style: 'bg-blue-50 text-blue-600 border-blue-200' },
  today:       { label: 'Dnes',         style: 'bg-amber-50 text-amber-600 border-amber-200' },
  next: { label: 'Další kroky',  style: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  goals:       { label: 'Cíle',         style: 'bg-green-50 text-green-600 border-green-200' },
}

export function TaskItem({ task, onToggleComplete, onDelete, onMoveToToday, onMoveToNextActions, onEditTask, showCategory }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const isInbox = task.category === 'inbox' || !task.category

    const startEditing = () => {
        setIsEditing(true)
        setEditTitle(task.title)
    }

    const saveEdit = () => {
        onEditTask(task.id, editTitle)
        setIsEditing(false)
    }

    const categoryInfo = CATEGORY_BADGE[task.category] ?? CATEGORY_BADGE['inbox']

    return (
        <div
      className={`group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
        task.completed
          ? "bg-gray-50 border-gray-100 opacity-60 hover:opacity-80"
          : "bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm"
      }`}
    >
        {/*Zaškrtnutí dokončení*/}
        <button
          onClick={() => onToggleComplete(task.id, task.completed)}
          className={`shrink-0 transition-colors ${
            task.completed ? "text-indigo-600" : "text-gray-300 group-hover:text-indigo-400"
          }`}
        >
            {task.completed ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        {/*Název úkolu*/}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit()
              if (e.key === "Escape") setIsEditing(false)
            }}
            onBlur={saveEdit}
            autoFocus
            className="w-full text-[15px] font-medium border-b border-gray-300 focus:outline-none focus:border-indigo-500 bg-transparent"
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

        {/*Akce pro úkol*/}
        <div className="flex items-center gap-2 shrink-0">
            {categoryInfo && showCategory && (
              <span className={`px-2 py-1 text-[11px] font-bold tracking-wider uppercase rounded-md ${categoryInfo.style}`}>
                {categoryInfo.label}
              </span>
            )}
          {task.isPriority && (
            <span className="px-2 py-1 text-[11px] font-bold tracking-wider uppercase bg-rose-50 text-rose-600 rounded-md">
              Priorita
            </span>
          )}
          {task.deadline && (
            <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold tracking-wider uppercase bg-yellow-50 text-yellow-600 rounded-md">
              {task.deadline.includes(":") ? (
                <Clock className="w-3 h-3" />
              ) : (
                <Calendar className="w-3 h-3" />
              )}
              {task.deadline}
            </div>
          )}
        </div>
    </div>

    {/* Akční tlačítka */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {(isInbox || task.category === 'next') && (
          <button
            onClick={() => onMoveToToday(task.id)}
            title="Přesunout do Today"
            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
          >
            <Sun className="w-4 h-4" />
          </button>
        )}
        {isInbox && (
          <button
            onClick={() => onMoveToNextActions(task.id)}
            title="Přesunout do Next Actions"
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <ListTodo className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={startEditing}
          title="Upravit úkol"
          className="p-1.5 rounded-lg text-gray-400 hover:text-sky-500 hover:bg-sky-50 transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          title="Smazat úkol"
          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}