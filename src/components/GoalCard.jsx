import { Target, TrendingUp, Trophy } from "lucide-react";

export function GoalCard({ goalTitle, totalTasks, completedTasks, progressPercentage }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Trophy className="w-32 h-32 text-indigo-600" />
      </div>

      <div className="flex items-center gap-3 mb-6 relative">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Target className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">Aktivní cíl</h3>
          <h2 className="text-xl font-bold text-gray-900 mt-0.5 leading-tight">{goalTitle}</h2>
        </div>
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
