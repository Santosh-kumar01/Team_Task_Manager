'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { fetchAppData, createTask } from '../../../store/appSlice';
import api from '../../../lib/axios';
import TaskCard from '../../../components/TaskCard';
import Link from 'next/link';
import { ArrowLeft, Users, Plus, FolderKanban, Search, Loader2 } from 'lucide-react';

export default function ProjectDetails({ params }) {
  const [project, setProject] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { list: tasks, loading } = useAppSelector((state) => state.app.tasks);
  const { user } = useAppSelector((state) => state.app.auth);
  const dispatch = useAppDispatch();

  // Calculate Progress
  const projectTasks = tasks.filter(t => t.project?._id === params.id || t.project === params.id);
  const totalTasks = projectTasks.length;
  const doneTasks = projectTasks.filter(t => t.status?.toLowerCase() === 'done').length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${params.id}`);
        setProject(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProject();
    dispatch(fetchAppData(undefined));
  }, [params.id, dispatch]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    setIsCreating(true);
    await dispatch(createTask({ title: newTaskTitle, description: 'New task created from project dashboard.', project: params.id }));
    setNewTaskTitle('');
    setIsCreating(false);
  };

  if (!project) return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden pb-20">
      {/* Stunning Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#f8faff]">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-[140px] animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-pink-400/20 to-cyan-300/20 blur-[140px] animate-blob" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-12 opacity-0 animate-fade-in-up">
        {/* Navigation & Header Panel */}
        <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 mb-8 transition-colors bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white hover:shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        {/* Project Header */}
        <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-white/60 mb-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-1000"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight mb-4">{project.name}</h1>
              <p className="text-xl text-gray-600 font-medium max-w-3xl leading-relaxed">{project.description}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white w-full md:w-80 shrink-0 group-hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] transition-shadow">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                <span>Progress</span>
                <span className="text-indigo-600 text-sm font-black">{progressPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Main Tasks Area */}
          <div className="xl:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 rounded-2xl shadow-sm border border-indigo-50">
                  <FolderKanban className="w-6 h-6 animate-float" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Project Tasks</h2>
              </div>
            </div>
            
            {user?.role === 'Admin' && (
              <form onSubmit={handleCreateTask} className="bg-white/60 backdrop-blur-2xl p-3 rounded-[2rem] shadow-sm border border-white/80 flex items-center gap-3">
                <div className="pl-4 text-gray-400">
                  <Plus className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 font-medium placeholder-gray-400 py-3 text-lg outline-none"
                />
                <button
                  type="submit"
                  disabled={isCreating || !newTaskTitle}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-bold hover:bg-indigo-700 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(79,70,229,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                  {isCreating ? 'Adding...' : 'Add Task'}
                </button>
              </form>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-gray-300 p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300 mb-6">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No tasks yet</h3>
                <p className="text-gray-500 font-medium">Create a task to kickstart this project.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map(task => <TaskCard key={task._id} task={task} />)}
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
             <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
               <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-100 text-pink-700 rounded-2xl shadow-sm">
                   <Users className="w-5 h-5" />
                 </div>
                 <h3 className="text-2xl font-extrabold text-gray-900">Team Members</h3>
               </div>
               
               {project.members.length === 0 ? (
                 <div className="text-center py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No members assigned.</p>
                 </div>
               ) : (
                 <ul className="space-y-4">
                   {project.members.map(member => (
                     <li key={member._id} className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all group">
                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-black text-lg shadow-inner group-hover:scale-110 transition-transform">
                         {member.name.charAt(0).toUpperCase()}
                       </div>
                       <div>
                         <p className="text-base font-bold text-gray-900">{member.name}</p>
                         <p className="text-sm font-medium text-gray-500">{member.email}</p>
                       </div>
                     </li>
                   ))}
                 </ul>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
