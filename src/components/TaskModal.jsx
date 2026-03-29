import { useState } from 'react';
import { X, Calendar, ListTodo, Target, AlignLeft, CalendarPlus } from "lucide-react";

export function TaskModal({ task, onClose, onSave, goals=[] }) {
    // === LOKÁLNÍ STAVY FORMULÁŘE ===
    // Inicializace stavů existujícími daty úkolu. Zahrnuje formátování času pro specifický případ kategorie 'Dnes' (GTD pravidlo)
    const [title, setTitle] = useState( task.title || '')
    const [description, setDescription] = useState( task.description || '')
    const [category, setCategory] = useState( task.category || 'inbox')
    const [goalId, setGoalId] = useState( task.goalId || '')
    const [deadline, setDeadline] = useState(() => {
        if (!task.deadline) return ''
        // Pokud jde o Today a Deadline je v DateTime, extrahuj pouze časovou část
        if (task.category === 'today' && task.deadline.includes('T')) {
            return task.deadline.split('T')[1].slice(0,5)
        }
        return task.deadline
    })


    // === ULOŽENÍ ZMĚN ===
    // Pokud uživatel vybral kategorii 'Dnes' a zadal čas, programově k němu přilepíme dnešní datum, aby byl zápis konzistentní pro databázi a řazení
    const handleSave = () => {
        if (!title.trim()) return

        let finalDeadline = deadline || null
        if (category === 'today' && deadline) {
            const todayDate = new Date().toISOString().split('T')[0]
            finalDeadline = `${todayDate}T${deadline}`
        }

        onSave(task.id, {
            title: title.trim(),
            description: description || null,
            category,
            goalId: goalId || null,
            deadline: finalDeadline,
        })
    }


    // === EXPORT DO KALENDÁŘE ===
    // Vygenerování předvyplněné URL pro Google Calendar. Šetří čas uživatele a nevyžaduje složité napojování přes API
    const handleExportToCalendar = () => {
        const baseURL = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
        const text = encodeURIComponent(title)
        const details = encodeURIComponent(description || '')
        window.open(`${baseURL}&text=${text}&details=${details}`, '_blank')
    }


    // === VYKRESLENÍ MODÁLU (JSX) ===
    // Obal s backdrop-blur efektem a flexibilní kartou, která se přizpůsobí množství textu (overflow-y-auto)
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col min-h-[70vh] max-h-[90vh] overflow-hidden">
        
        {/* Hlavička */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-700">Detail úkolu</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tělo */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">

            {/* Název */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Název úkolu"
                className="w-full text-xl font-semibold text-gray-900 border-b-2 border-transparent focus:border-indigo-400 focus:outline-none pb-1 bg-transparent placeholder:text-gray-300 transition-colors"
            />

            {/* Popis */}
            <div className="flex gap-3">
                <AlignLeft className="w-5 h-5 text-gray-400" />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Popis úkolu"
                    rows={10}
                    className="w-full text-gray-700 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none p-3 bg-transparent placeholder:text-gray-300 transition-colors resize-none"
                />
            </div>

            {/* Grid: Kategorie + Cíl */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <ListTodo className="w-3.5 h-3.5" />
                  Kategorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                >
                  <option value="inbox">Inbox</option>
                  <option value="today">Dnes</option>
                  <option value="next">Další akce</option>
                  <option value="someday">Někdy / Možná</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <Target className="w-3.5 h-3.5" />
                  Cíl
                </label>
                <select
                  value={goalId}
                  onChange={(e) => setGoalId(e.target.value)}
                  className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                >
                  <option value="">Vyberte cíl</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            

            {/* === VÝBĚR TERMÍNU (DYNAMICKÝ INPUT) ===
             Změna typu inputu (pouze čas vs. datum a čas) na základě zvolené kategorie pro snížení tření při zadávání */}
            {/* Deadline */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                Termín
              </label>
              {category === 'today' ? (
                <input
                  type="time"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  max="9999-12-31T23:59"
                  className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                />
              ) : (
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                />
              )}
            </div>

          </div>

            {/* Patička */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              {/*<button
                onClick={handleExportToCalendar}
                className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <CalendarPlus className="w-4 h-4" />
                Přidat do Google kalendáře
              </button>*/}

              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Uložit
              </button>
            </div>

        </div>
    </div>
    )
}