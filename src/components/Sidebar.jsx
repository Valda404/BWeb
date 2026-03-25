import { Inbox, Calendar, ListTodo, Target, Settings, Archive, CheckSquare, Brain } from "lucide-react";

export function Sidebar( { currentView, onViewChange, tasks =[] }) {
  // === VÝPOČET POČTU ÚKOLŮ ===
  // Dynamické generování čísel pro odznaky. Zahrnuje pouze aktivní položky, aby menu odráželo aktuální kognitivní zátěž (GTD princip)
  const inboxCount   = tasks.filter(t => (t.category === 'inbox' || !t.category) && !t.completed).length
  const todayCount   = tasks.filter(t => t.category === 'today'   && !t.completed).length
  const nextCount    = tasks.filter(t => t.category === 'next'    && !t.completed).length
  const somedayCount = tasks.filter(t => t.category === 'someday' && !t.completed).length
  

  // === KONFIGURACE HLAVNÍ NAVIGACE ===
  // Centrální pole definující strukturu menu pro snadnou údržbu a budoucí přidávání nových pohledů (škálovatelnost)
  const navItems = [
    { name: "Přehled",       icon: Target,      view: "dash",      color: { bg: 'bg-gray-100',    text: 'text-gray-700',    icon: 'text-gray-500',    badge: 'bg-gray-200 text-gray-600'    } },
    { name: "Inbox",         icon: Inbox,       view: "inbox",     color: { bg: 'bg-blue-50',     text: 'text-blue-700',    icon: 'text-blue-600',    badge: 'bg-blue-100 text-blue-700'    }, count: inboxCount },
    { name: "Dnes",          icon: Calendar,    view: "today",     color: { bg: 'bg-amber-50',    text: 'text-amber-700',   icon: 'text-amber-600',   badge: 'bg-amber-100 text-amber-700'   }, count: todayCount },
    { name: "Další kroky",   icon: ListTodo,    view: "next",      color: { bg: 'bg-purple-50',   text: 'text-purple-700',  icon: 'text-purple-600',  badge: 'bg-purple-100 text-purple-700' }, count: nextCount },
    { name: "Cíle",           icon: Target,      view: "goals",     color: { bg: 'bg-rose-50',     text: 'text-rose-700',    icon: 'text-rose-600',    badge: 'bg-rose-100 text-rose-700'    } },
    { name: "Někdy/Možná",   icon: Archive,     view: "someday",   color: { bg: 'bg-orange-50',   text: 'text-orange-700',  icon: 'text-orange-600',  badge: 'bg-orange-100 text-orange-700'  }, count: somedayCount },
    { name: "Dokončené",     icon: CheckSquare, view: "completed", color: { bg: 'bg-emerald-50',  text: 'text-emerald-700', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700'} },
  ];


  // === VYKRESLENÍ BOČNÍHO ROZHRANÍ ===
  // Rozvržení využívá flexbox pro udržení hlavních kategorií nahoře a pevné ukotvení Nastavení na spodní hraně obrazovky
  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col justify-between md:flex">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-10 text-indigo-600 font-semibold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
             <Brain className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
          </div>
          Soustředění
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.name}
                onClick={() => onViewChange(item.view)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? `${item.color.bg} ${item.color.text}`
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? item.color.icon : "text-gray-400"}`} />
                  {item.name}
                </div>
                {item.count > 0 && (
                  <div className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none rounded-full ${
                    isActive ? item.color.badge : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.count}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/*Nastavení dole*/}
      <div className="p-6 border-t border-gray-100">
        <button
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'settings'
              ? "bg-gray-100 text-gray-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Settings className={`w-4 h-4 shrink-0 ${currentView === 'settings' ? "text-gray-500" : "text-gray-400"}`} />
          Nastavení
        </button>
      </div>
    </aside>
  );
}
