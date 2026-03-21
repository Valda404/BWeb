import { TaskItem } from "./TaskItem";
import { Circle, CalendarDays, ListTodo, Inbox, Archive, CheckSquare, HelpCircle } from "lucide-react";

const VIEW_CONFIG = {
  inbox: {
    label: "Inbox",
    Icon: Inbox,
    color: 'text-gray-900',
    badge: 'bg-gray-100 text-gray-700',
    emptyText: 'Sběrná schránka je prázdná.',
    helpText: 'Sem přidávej všechny nové úkoly, nápady a připomínky. Odtud je pak můžeš snadno roztřídit do dalších kategorií.',
  },
  today: {
    label: 'Dnešní úkoly',
    Icon: CalendarDays,
    color: 'text-gray-900',
    badge: 'bg-gray-100 text-gray-700',
    emptyText: 'Máš hotovo! Užij si volný čas.',
    helpText: 'Zde se zobrazí všechny úkoly, které jsi si z inboxu přesunul na dnešek.',
  },
  next: {
    label: 'Další kroky',
    Icon: ListTodo,
    color: 'text-gray-900',
    badge: 'bg-gray-100 text-gray-700',
    emptyText: 'Žádné další akce. Skvěle!',
    helpText: 'Tato kategorie slouží pro úkoly, které nejsou urgentní, ale chceš je mít na paměti jako další kroky k dosažení svých cílů. Jde hlavně o krátké úkoly do dvou minut.',
  },
  dash : {
    label: 'Přehled',
    Icon: Circle,
    color: 'text-gray-500',
    badge: 'bg-gray-100 text-gray-600',
    emptyText: 'Žádné úkoly — čím začneme?',
    helpText: 'Toto je přehled všech tvých úkolů. Zde můžeš rychle vidět, co je potřeba udělat a co je již hotovo spolu s tvými cíli a jejich postupem.',
  },
  someday: {
  label: 'Někdy / Možná',
  Icon: Archive,
  color: 'text-gray-900',
  badge: 'bg-gray-100 text-gray-700',
  emptyText: 'Žádné odložené nápady.',
  helpText: 'Tato kategorie slouží pro úkoly, které nechceš řešit, ale nechceš je ztratit.',
  },
  completed: {
    label: 'Dokončené',
    Icon: CheckSquare,
    color: 'text-gray-900',
    badge: 'bg-gray-100 text-gray-700',
    emptyText: 'Zatím nic dokončeno.',
    helpText: 'Zde se zobrazí všechny úkoly, které jsi dokončil. Můžeš si zde prohlédnout svůj pokrok a úspěchy.',
  },
}
const DEFAULT_VIEW = VIEW_CONFIG['dash']


export function TaskList({ tasks, onToggleComplete, onDelete, 
  onMoveToToday, onMoveToNextActions, onMoveToSomeday, onEditTask,
  currentView, onMoveToInbox, goals, onOpenEditModal }) {
  const config = VIEW_CONFIG[currentView] ?? DEFAULT_VIEW
  const { label, Icon, color, badge, emptyText, helpText } = config


  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          {label}
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
          {tasks.length}
        </span>
        <div className="relative group flex items-center">
          <HelpCircle
            className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 cursor-help transition-colors"
          />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 sm:w-64 p-2.5 bg-gray-900 text-white text-[11px] sm:text-xs leading-relaxed rounded-lg shadow-xl z-50 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {helpText}
            <div className="absolute left-1/2 -translate-x-1/2 top-full border-[5px] border-transparent border-t-gray-900"></div>
          </div>
        </div>
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
              onMoveToSomeday={onMoveToSomeday}
              onOpenEditModal={onOpenEditModal}
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
