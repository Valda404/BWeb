import { Inbox, Calendar, ListTodo, Target, Settings, Archive, CheckSquare } from "lucide-react";

export function Sidebar( { currentView, onViewChange }) {
  const navItems = [
    { name: "Dashboard", icon: Target, view: "dash" },
    { name: "Inbox", icon: Inbox, view : "inbox" },
    { name: "Today", icon: Calendar, view: "today" },
    { name: "Next Actions", icon: ListTodo, view: "next" },
    { name: "Goals & OKRs", icon: Target, view: "goals" },
    { name: "Někdy/Možná", icon: Archive, view: "someday" },
    { name: "Dokončené", icon: CheckSquare, view: "completed" },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col justify-between md:flex">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-10 text-indigo-600 font-semibold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
             <Target className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
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
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                  {item.name}
                </div>
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
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Settings className={`w-4 h-4 shrink-0 ${currentView === 'settings' ? "text-indigo-600" : "text-gray-400"}`} />
          Nastavení
        </button>
      </div>
    </aside>
  );
}
