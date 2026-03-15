import { Inbox, Calendar, ListTodo, Target, MoreVertical, LogOut, Settings } from "lucide-react";

export function Sidebar( { currentView, onViewChange }) {
  const navItems = [
    { name: "Dashboard", icon: Target, view: "dash" },
    { name: "Inbox", icon: Inbox, view : "inbox" },
    { name: "Today", icon: Calendar, view: "today" },
    { name: "Next Actions", icon: ListTodo, view: "next" },
    { name: "Goals & OKRs", icon: Target, view: "goals" },
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

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
              U
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">Sarah Chen</span>
              <span className="text-xs text-gray-500">Free Plan</span>
            </div>
          </div>
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </aside>
  );
}
