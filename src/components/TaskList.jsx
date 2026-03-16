import { TaskItem } from "./TaskItem";
import { Circle, CalendarDays, ListTodo, Inbox, Archive, CheckSquare } from "lucide-react";

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
  next: {
    label: 'Další kroky',
    Icon: ListTodo,
    color: 'text-indigo-600',
    badge: 'bg-indigo-50 text-indigo-700',
    emptyText: 'Žádné další akce. Skvěle!',
  },
  dash : {
    label: 'Přehled',
    Icon: Circle,
    color: 'text-gray-500',
    badge: 'bg-gray-100 text-gray-600',
    emptyText: 'Žádné úkoly — čím začneme?',
  },
  someday: {
  label: 'Někdy / Možná',
  Icon: Archive,
  color: 'text-teal-500',
  badge: 'bg-teal-50 text-teal-700',
  emptyText: 'Žádné odložené nápady.',
  },
  completed: {
    label: 'Dokončené',
    Icon: CheckSquare,
    color: 'text-green-500',
    badge: 'bg-green-50 text-green-700',
    emptyText: 'Zatím nic dokončeno.',
  },
}
const DEFAULT_VIEW = VIEW_CONFIG['dash']


export function TaskList({ tasks, onToggleComplete, onDelete, onMoveToToday, onMoveToNextActions, onEditTask, currentView, onMoveToInbox, goals }) {
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
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Icon className={`w-10 h-10 mx-auto mb-4 ${color} opacity-30`} />
          {emptyText}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onMoveToToday={onMoveToToday}
              onMoveToNextActions={onMoveToNextActions}
              onEditTask={onEditTask}
              showCategory={currentView === 'dash'}
              onMoveToInbox={onMoveToInbox}
              goals={goals}
            />
        ))}
      </div>
      )}
    </div>
  );
}
