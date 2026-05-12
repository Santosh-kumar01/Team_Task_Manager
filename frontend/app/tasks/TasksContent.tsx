'use client';
import { useAppSelector } from '../../store/store';
import TaskCard from '../../components/TaskCard';
import { CheckSquare, Loader2 } from 'lucide-react';

export default function TasksPageContent() {
  const { list: tasks, loading } = useAppSelector((state) => state.app.tasks);

  if (loading && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">My Workload</h2>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-16 text-center border border-white">
          <p className="text-gray-500 font-bold">No tasks assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
