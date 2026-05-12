'use client';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { setActiveTab, fetchAppData } from '../../store/appSlice';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, CheckSquare, Users,
  Clock, AlertTriangle, CheckCircle2, ListTodo,
  Plus, Loader2
} from 'lucide-react';

import ProjectCard from '../../components/ProjectCard';
import TasksPageContent from '../tasks/TasksContent';
import TeamPageContent from '../team/TeamContent';

export default function Dashboard() {
  const { user, isInitialized: authReady } = useAppSelector((state) => state.app.auth);
  const { activeTab } = useAppSelector((state) => state.app.ui);
  const { list: projects, loading: pLoading } = useAppSelector((state) => state.app.projects);
  const { list: tasks, loading: tLoading } = useAppSelector((state) => state.app.tasks);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Auto-refresh logic: Fetch data every 30 seconds
  useEffect(() => {
    let interval: any;
    if (user) {
      interval = setInterval(() => {
        dispatch(fetchAppData(undefined));
      }, 30000); // 30 seconds
    }
    return () => clearInterval(interval);
  }, [user, dispatch]);

  useEffect(() => {
    setMounted(true);
    if (authReady && !user) {
      router.push('/login');
    }
  }, [user, authReady, router]);

  if (!mounted || !user) return null;

  // Compute Metrics
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(t => t.status.toLowerCase().includes('progress')).length;
  const doneTasks = tasks.filter(t => t.status.toLowerCase() === 'done').length;
  const completedPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="relative min-h-[calc(100vh-140px)]">

      {/* Sub-Navigation (Tabs) */}
      <div className="flex items-center gap-2 mb-10 bg-white/50 backdrop-blur-xl p-1.5 rounded-2xl border border-white/60 w-fit shadow-sm">
        <button
          onClick={() => dispatch(setActiveTab('overview'))}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'overview' ? 'bg-white text-indigo-700 shadow-md scale-105' : 'text-gray-500 hover:bg-white/50'}`}
        >
          <LayoutDashboard className="w-4 h-4" /> Overview
        </button>
        <button
          onClick={() => dispatch(setActiveTab('tasks'))}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'tasks' ? 'bg-white text-indigo-700 shadow-md scale-105' : 'text-gray-500 hover:bg-white/50'}`}
        >
          <CheckSquare className="w-4 h-4" /> My Tasks
        </button>
        {user.role === 'Admin' && (
          <button
            onClick={() => dispatch(setActiveTab('team'))}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'team' ? 'bg-white text-purple-700 shadow-md scale-105' : 'text-gray-500 hover:bg-white/50'}`}
          >
            <Users className="w-4 h-4" /> Team
          </button>
        )}
      </div>

      <div className="animate-fade-in transition-all duration-300">
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard icon={ListTodo} label="Total Tasks" value={totalTasks} color="indigo" />
              <MetricCard icon={Clock} label="In Progress" value={inProgressTasks} color="blue" />
              <MetricCard icon={CheckCircle2} label="Completed" value={doneTasks} subValue={`${completedPercentage}%`} color="emerald" />
              <MetricCard icon={AlertTriangle} label="Overdue" value={tasks.filter(t => t.status === 'Overdue').length} color="red" />
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-white/80 overflow-hidden">
              <div className="p-6 border-b border-white/50 flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-black">Recent Activity</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-bold">
                    <tr>
                      <th className="px-8 py-4">Title</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Project</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTasks.map(task => (
                      <tr key={task._id} className="border-b border-gray-50 hover:bg-white/40 transition-colors">
                        <td className="px-8 py-4 font-bold text-gray-900">{task.title}</td>
                        <td className="px-8 py-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-xs font-bold uppercase">{task.status}</span></td>
                        <td className="px-8 py-4 text-gray-500 font-medium">{task.project?.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black mb-6">Active Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map(p => <ProjectCard key={p._id} project={p} />)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && <TasksPageContent />}
        {activeTab === 'team' && <TeamPageContent />}
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, subValue, color }: any) {
  const colors: any = {
    indigo: 'text-indigo-600 bg-indigo-50',
    blue: 'text-blue-600 bg-blue-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    red: 'text-red-600 bg-red-50'
  };
  return (
    <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}><Icon className="w-6 h-6" /></div>
        <div className="text-right">
          <span className="text-3xl font-black text-gray-900">{value}</span>
          {subValue && <p className="text-xs font-bold text-emerald-500">{subValue}</p>}
        </div>
      </div>
      <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">{label}</p>
    </div>
  );
}
