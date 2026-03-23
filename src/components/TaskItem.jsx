import { Circle, CheckCircle, Clock, Calendar, Trash, Sun, ListTodo, Pencil, Inbox, Archive } from "lucide-react";


// === VIZUÁLNÍ KONFIGURACE KATEGORIÍ ===
// Mapování barev pro GTD složky. Objekt je definován úmyslně mimo komponentu, aby nedocházelo k jeho zbytečnému znovuvytváření při každém renderu
const CATEGORY_BADGE = {
  inbox:       { label: 'Inbox',        style: 'bg-blue-50/50 text-blue-600 border-blue-100' },
  today:       { label: 'Dnes',         style: 'bg-amber-50/50 text-amber-600 border-amber-100' },
  next:        { label: 'Další kroky',  style: 'bg-indigo-50/50 text-indigo-600 border-indigo-100' },
  someday:     { label: 'Někdy/Možná', style: 'bg-teal-50/50 text-teal-600 border-teal-100' },
  completed:   { label: 'Dokončené',    style: 'bg-emerald-50/50 text-emerald-600 border-emerald-100' },
}

export function TaskItem({ task, onToggleComplete, onDelete,
  onMoveToToday, onMoveToNextActions, onMoveToSomeday,
  showCategory, onMoveToInbox, goals = [], onOpenEditModal }) {


  // === PŘÍPRAVA DAT ===
  // Zjištění kontextu úkolu a spárování s nadřazeným cílem pro dynamické řízení viditelnosti štítků a akčních tlačítek
  const isInbox = task.category === 'inbox' || !task.category
  const categoryInfo = CATEGORY_BADGE[task.category] ?? CATEGORY_BADGE['inbox']
  const linkedGoal = goals.find(g => g.id === task.goalId)


    // === VYKRESLENÍ HLAVNÍHO ROZVRŽENÍ ===
    // Řádek dynamicky mění styly a průhlednost podle stavu dokončení, čímž vizuálně odsouvá vyřešené úkoly do pozadí
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

        {/* Název úkolu + štítky */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
        <span
          className={`text-[15px] truncate font-medium ${
            task.completed ? "text-gray-500 line-through decoration-gray-300" : "text-gray-800"
          }`}
        >
          {task.title}
        </span>
        

        {/* === INFORMAČNÍ ŠTÍTKY ÚKOLU ===
         Zobrazení metadat (kategorie, cíl, termín) s podmíněným vykreslením a formátováním data do lokálního českého tvaru */}
        <div className="flex items-center gap-2 shrink-0">
          {showCategory && categoryInfo && (
            <span className={`px-2 py-1 text-[11px] font-bold tracking-wider uppercase rounded-md border ${categoryInfo.style}`}>
              {categoryInfo.label}
            </span>
          )}
          {linkedGoal && (
            <span className="px-2 py-1 text-[11px] font-bold tracking-wider uppercase bg-gray-50 text-gray-700 border-gray-200 rounded-md border">
              Cíl: {linkedGoal.title}
            </span>
          )}
          {task.deadline && (
            <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md">
              {task.deadline.includes("T") ? (
                <>
                  <Clock className="w-3 h-3" />
                  {new Date(task.deadline).toLocaleString('cs-CZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </>
              ) : (
                <>
                  <Calendar className="w-3 h-3" />
                  {task.deadline}
                </>
              )}
            </div>
          )}
        </div>
      </div>


      {/* === RYCHLÉ AKCE A GTD WORKFLOW ===
          Tlačítka se zobrazují kontextuálně podle toho, ve které kategorii se úkol právě nachází, u dokončených úkolů jsou zcela skryta */}

      {/* Akční tlačítka */}
      {!task.completed && (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!isInbox && (
          <button
            onClick={() => onMoveToInbox(task.id)}
            title="Přesunout do Inboxu"
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Inbox className="w-4 h-4" />
          </button>
        )}
        {(isInbox || task.category === 'next') && (
          <button
            onClick={() => onMoveToToday(task.id)}
            title="Přesunout do Today"
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Sun className="w-4 h-4" />
          </button>
        )}
        {isInbox && (
          <button
            onClick={() => onMoveToNextActions(task.id)}
            title="Přesunout do Next Actions"
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <ListTodo className="w-4 h-4" />
          </button>
        )}
        {isInbox && (
          <button
            onClick={() => onMoveToSomeday(task.id)}
            title="Přesunout do Někdy / Možná"
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Archive className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onOpenEditModal(task)}
          title="Upravit úkol"
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
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
      )}
    </div>
  )
}