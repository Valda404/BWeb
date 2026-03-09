import { Circle, CheckCircle, Clock, Calendar, MoveRight } from "lucide-react";

export interface Task {
  id: string;
  title: string;
  deadline?: string;
  completed: boolean;
  tagColor?: string;
  isPriority?: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string, current: boolean) => void;
}

export function TaskList({ tasks, onToggleComplete }: TaskListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          Dnešní úkoly
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </h2>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
          Zobrazit vše
          <MoveRight className="w-4 h-4" />
        </button>
      </div>

{tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Circle className="w-10 h-10 mx-auto mb-4" />
          Žádné úkoly - čím začneme?
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
            className={`group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
              task.completed
                ? "bg-gray-50 border-gray-100 opacity-60 hover:opacity-80"
                : "bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm"
            }`}
          >

            <button
              onClick={() => onToggleComplete(task.id, task.completed)}
              className={`shrink-0 transition-colors ${
                task.completed ? "text-indigo-600" : "text-gray-300 group-hover:text-indigo-400"}`}
            >
              {task.completed ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
              <span
                className={`text-[15px] truncate font-medium ${
                  task.completed ? "text-gray-500 line-through decoration-gray-300" : "text-gray-800"
                }`}
              >
                {task.title}
              </span>
              
              <div className="flex items-center gap-2 shrink-0">
                {task.isPriority && (
                  <span className="px-2 py-1 text-[11px] font-bold tracking-wider uppercase bg-rose-50 text-rose-600 rounded-md">
                    Priorita
                  </span>
                )}
                 {task.deadline && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${task.tagColor ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {task.deadline.includes(":") ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : (
                        <Calendar className="w-3.5 h-3.5" />
                      )}
                      {task.deadline}
                    </div>
                  )}
                </div>
              </div>
            </div>
        ))}
      </div>
      )}
    </div>
  );
}
