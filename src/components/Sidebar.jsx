import { Inbox, Calendar, ListTodo, Target, MoreVertical, LogOut, Settings } from "lucide-react";

export function Sidebar() {
  const navItems = [
    { name: "Inbox", icon: Inbox, count: 4, active: false },
    { name: "Today", icon: Calendar, count: 2, active: true },
    { name: "Next Actions", icon: ListTodo, count: 12, active: false },
    { name: "Goals & OKRs", icon: Target, active: false },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-10 text-indigo-600 font-semibold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
             <Target className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
          </div>
          FocusFlow
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href="#"
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${item.active ? "text-indigo-600" : "text-gray-400"}`} />
                  {item.name}
                </div>
                {item.count && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.active ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"}`}>
                    {item.count}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1655249481446-25d575f1c054?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwd29tYW58ZW58MXx8fHwxNzcyNzMzNzUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
              alt="User Avatar" 
              className="w-9 h-9 rounded-full object-cover shadow-sm border border-gray-200"
            />
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
