import { useState } from "react";
import { Target, Pencil, Trophy, Trash } from "lucide-react";

export function GoalCard({ goal, tasks, onDelete, onEdit, readOnly=false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  
  if (!goal) return null;
  
  const goalTasks = tasks.filter(task => task.goalId === goal.id);
  const completedTasks = goalTasks.filter(task => task.completed).length;
  const totalTasks = goalTasks.length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
const saveEdit = () => {
  if (editTitle.trim()) {
    onEdit(goal.id, editTitle)
    }
    setIsEditing(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Trophy className="w-32 h-32 text-indigo-600" />
      </div>

      <div className="flex items-center gap-3 mb-6 relative">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Target className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">Aktivní cíl</h3>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit()
                if (e.key === 'Escape') setIsEditing(false)
              }}
              autoFocus
              className="w-full text-xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-indigo-500 bg-transparent mt-0.5"
            />
          ) : (
            <h2 className="text-xl font-bold text-gray-900 mt-0.5 leading-tight truncate">{goal.title}</h2>
          )}
        </div>

      {/* Akční tlačítka */}
      {!readOnly && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {isEditing ? (
            <button
              onClick={saveEdit}
              className="text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Uložit
            </button>
          ) : (
            <button
              onClick={() => { setEditTitle(goal.title); setIsEditing(true) }}
              title="Upravit cíl"
              className="p-1.5 rounded-lg text-gray-400 hover:text-sky-500 hover:bg-sky-50 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(goal.id)}
            title="Smazat cíl"
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      )}
      </div>

      <div className="space-y-4 flex-grow flex flex-col justify-end relative">
        <div className="flex justify-between items-end mb-2">
          <span className="text-4xl font-extrabold text-gray-900 tracking-tighter">
            {progressPercentage}<span className="text-2xl text-gray-400 font-bold">%</span>
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3 mb-1 overflow-hidden">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 font-medium text-center mt-3">
          {completedTasks} z {totalTasks} úkolů dokončeno
        </p>
      </div>
    </div>
  );
}