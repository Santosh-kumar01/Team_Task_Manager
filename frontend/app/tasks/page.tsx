'use client';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { fetchAppData, createTask } from '../../store/appSlice';
import { useRouter } from 'next/navigation';
import TaskCard from '../../components/TaskCard';
import { CheckSquare, Plus, Filter, Loader2, X, Search, ChevronDown, CircleDashed, Flag, Folder } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TasksPage() {
  const { user } = useAppSelector((state) => state.app.auth);
  const { list: tasks, loading: tLoading } = useAppSelector((state) => state.app.tasks);
  const { list: projects } = useAppSelector((state) => state.app.projects);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (user) dispatch(fetchAppData(undefined));
  }, [user, dispatch]);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!mounted || !user) return null;

  // Filter Logic (AND logic)
  const filteredTasks = tasks.filter(task => {
    // Status
    let sMatch = true;
    if (statusFilter !== 'All') {
      const ts = task.status.toLowerCase();
      if (statusFilter === 'To do') sMatch = (ts === 'to do' || ts === 'todo');
      if (statusFilter === 'In progress') sMatch = (ts === 'in progress' || ts === 'in_progress');
      if (statusFilter === 'Done') sMatch = (ts === 'done');
    }

    // Priority
    let pMatch = true;
    if (priorityFilter !== 'All') {
      pMatch = task.priority?.toLowerCase() === priorityFilter.toLowerCase();
    }

    // Project
    let prjMatch = true;
    if (projectFilter !== 'All') {
      prjMatch = task.project?._id === projectFilter;
    }

    return sMatch && pMatch && prjMatch;
  });

  // Modal handlers
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, project: e.target.value, assignedTo: '' });
  };

  const selectedProjectObj = projects.find((p: any) => p._id === formData.project);
  const availableMembers = (selectedProjectObj as any)?.members || [];

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.project) {
      toast.error('A project must be selected');
      return;
    }
    if (!formData.assignedTo) {
      toast.error('An assignee must be selected');
      return;
    }
    if (formData.dueDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.dueDate)) {
        toast.error('Use YYYY-MM-DD format');
        return;
      }
    }

    setIsCreating(true);
    try {
      await dispatch(createTask(formData)).unwrap();
      toast.success('Task created successfully');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        project: '',
        assignedTo: '',
        priority: 'Medium',
        dueDate: ''
      });
    } catch (err) {
      toast.error(err || 'Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f8faff]">
        <div className="absolute top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 blur-[140px] animate-blob mix-blend-multiply"></div>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 relative z-10 opacity-0 animate-fade-in-up">
        {/* Header Section */}
        <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-white/60 mb-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-1000 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 text-indigo-600 rounded-2xl shadow-sm border border-indigo-100/50 group-hover:scale-110 transition-transform duration-500">
                  <CheckSquare className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">My Tasks</h1>
              </div>
              <p className="text-lg text-gray-600 font-medium max-w-2xl group-hover:text-gray-800 transition-colors">
                Manage and filter your entire workload. Keep track of progress and deadlines.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="shrink-0 relative overflow-hidden group/btn inline-flex items-center justify-center bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold shadow-sm border border-indigo-100 hover:border-indigo-300 hover:shadow-[0_8px_30px_-6px_rgba(79,70,229,0.3)] transition-all transform hover:-translate-y-1 z-20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity -z-10"></div>
              <Plus className="w-5 h-5 mr-2 group-hover/btn:text-white transition-colors" />
              <span className="group-hover/btn:text-white transition-colors">New Task</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white/80 mb-10 flex flex-col md:flex-row gap-6">
          <div className="flex items-center gap-2 text-gray-700 font-bold mb-2 md:mb-0 shrink-0">
            <Filter className="w-5 h-5 text-indigo-500" /> Filters:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                  <CircleDashed className="w-4 h-4" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-gray-700 font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none hover:shadow-[0_0_15px_rgba(79,70,229,0.1)] cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="To do">To do</option>
                  <option value="In progress">In progress</option>
                  <option value="Done">Done</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Priority</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-amber-500 transition-colors">
                  <Flag className="w-4 h-4" />
                </div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-gray-700 font-medium focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all appearance-none hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] cursor-pointer"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Project</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-hover:text-purple-500 transition-colors">
                  <Folder className="w-4 h-4" />
                </div>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-gray-700 font-medium focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all appearance-none hover:shadow-[0_0_15px_rgba(168,85,247,0.1)] cursor-pointer"
                >
                  <option value="All">All Projects</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Grid */}
        {tLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white p-20 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>

            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-center text-indigo-300 mb-8 relative z-10 group-hover:-translate-y-2 transition-transform duration-500">
              <Search className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3 relative z-10 tracking-tight">No tasks found</h3>
            <p className="text-lg text-gray-500 font-medium relative z-10">Adjust your filters or create a new task to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTasks.map(task => <TaskCard key={task._id} task={task} />)}
          </div>
        )}
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-white/50 my-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900">Create New Task</h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-500"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-50/50 border border-gray-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none transition-all hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)]"
                  placeholder="e.g. Design homepage mockup"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50/50 border border-gray-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none transition-all resize-none h-24 hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)]"
                  placeholder="Add details about this task..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Project <span className="text-red-500">*</span></label>
                  <select
                    value={formData.project}
                    onChange={handleProjectChange}
                    className="w-full bg-gray-50/50 border border-gray-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none transition-all appearance-none hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)]"
                  >
                    <option value="" disabled>Select a project</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Assignee <span className="text-red-500">*</span></label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full bg-gray-50/50 border border-gray-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none transition-all appearance-none disabled:opacity-50 hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)]"
                    disabled={!formData.project}
                  >
                    <option value="" disabled>Select assignee</option>
                    {availableMembers.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Priority <span className="text-red-500">*</span></label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-gray-50/50 border border-gray-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none transition-all appearance-none hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Due Date (YYYY-MM-DD)</label>
                  <input
                    type="text"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-gray-50/50 border border-gray-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-gray-900 font-medium outline-none transition-all hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)]"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isCreating} className="relative flex-1 py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.6)] disabled:opacity-50 overflow-hidden group">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <span className="relative z-10">{isCreating ? 'Creating...' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
