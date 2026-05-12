'use client';
import { Clock, CheckCircle2, CircleDashed, FolderKanban, Calendar, MoreHorizontal, Edit2, Trash2, X, AlertCircle, PlayCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { deleteTask, updateTask } from '../store/appSlice';
import toast from 'react-hot-toast';

const statusConfig = {
  'To Do': { icon: CircleDashed, color: 'text-gray-600', bg: 'bg-gray-100/80', border: 'border-gray-200/60', glow: 'shadow-gray-500/20' },
  'In Progress': { icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-100/80', border: 'border-indigo-200/60', glow: 'shadow-indigo-500/30' },
  'Done': { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100/80', border: 'border-emerald-200/60', glow: 'shadow-emerald-500/30' }
};

const priorityConfig = {
  'High': 'bg-red-500',
  'high': 'bg-red-500',
  'Medium': 'bg-amber-500',
  'medium': 'bg-amber-500',
  'Low': 'bg-green-500',
  'low': 'bg-green-500'
};

export default function TaskCard({ task }: { task: any }) {
  const { icon: Icon, color, bg, border, glow } = statusConfig[task.status] || statusConfig['To Do'];
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.app.auth);
  const isAdmin = user?.role === 'Admin';

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const confirmDelete = () => {
    dispatch(deleteTask(task._id)).unwrap().then(() => {
      toast.success('Task deleted');
      setShowDeleteModal(false);
    }).catch(err => {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to delete task';
      toast.error(errorMessage);
    });
  };

  const confirmEdit = () => {
    if (editTitle && editTitle !== task.title) {
      dispatch(updateTask({ id: task._id, data: { title: editTitle } })).unwrap().then(() => {
        toast.success('Task updated');
        setShowEditModal(false);
      }).catch(err => {
        const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to update task';
        toast.error(errorMessage);
      });
    } else {
      setShowEditModal(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    dispatch(updateTask({ id: task._id, data: { status: newStatus } })).unwrap().then(() => {
      toast.success(`Task marked as ${newStatus}`);
    }).catch(err => {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to update task status';
      toast.error(errorMessage);
    });
  };

  const priorityColor = priorityConfig[task.priority] || 'bg-amber-500';

  return (
    <div className="group h-full bg-white/70 backdrop-blur-2xl p-7 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:bg-white/90 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] transition-all duration-500 transform hover:-translate-y-2 flex flex-col justify-between relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 ${bg} opacity-50 group-hover:opacity-100 transition-all duration-500`}></div>
      <div className={`absolute -top-10 -right-10 w-40 h-40 ${bg} rounded-full blur-[50px] opacity-20 group-hover:opacity-80 group-hover:scale-125 transition-all duration-700 pointer-events-none`}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>

      <div className="pl-4 relative z-10">
        <div className="flex justify-between items-start mb-5">
          <span className={`shrink-0 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 border ${color} ${bg} ${border} shadow-sm ${glow} group-hover:scale-105 transition-transform duration-300`}>
            <Icon className="w-4 h-4" />
            {task.status}
          </span>
          {isAdmin && (
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="text-gray-400 hover:text-indigo-600 transition-all p-2 rounded-full hover:bg-indigo-50/80 group-hover:rotate-90 group-hover:shadow-sm duration-300 border border-transparent hover:border-indigo-100 z-20">
                <MoreHorizontal className="w-6 h-6" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-30 overflow-hidden">
                  <button onClick={() => { setShowMenu(false); setShowEditModal(true); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 font-medium">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => { setShowMenu(false); setShowDeleteModal(true); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-start justify-between mb-3 pr-2">
          <h3 className="text-xl font-extrabold text-gray-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">{task.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
              <span className={`w-2 h-2 rounded-full ${priorityColor}`}></span>
              {task.priority || 'Medium'}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed font-medium">{task.description}</p>
        
        {/* Quick Action Buttons for Status */}
        <div className="flex gap-2 mb-6">
          {task.status !== 'In Progress' && task.status !== 'in_progress' && task.status !== 'Done' && task.status !== 'done' && (
            <button onClick={() => handleStatusChange('In Progress')} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-colors text-xs border border-indigo-100">
              <PlayCircle className="w-4 h-4" /> Start Work
            </button>
          )}
          {task.status !== 'Done' && task.status !== 'done' && (
            <button onClick={() => handleStatusChange('Done')} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition-colors text-xs border border-emerald-100">
              <CheckCircle className="w-4 h-4" /> Mark Done
            </button>
          )}
        </div>
      </div>

      <div className="pl-3 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center text-xs text-gray-500 mt-auto pt-5 border-t border-gray-200/60">
        <div className="flex items-center font-bold text-gray-700 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
          <FolderKanban className="w-4 h-4 mr-2 text-indigo-400" />
          <span className="truncate max-w-[130px]">{task.project?.name || 'Unknown'}</span>
        </div>
        <div className="flex items-center font-bold text-gray-500 bg-gray-50/50 px-3 py-1.5 rounded-xl border border-transparent">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          {mounted ? (task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Due') : '...'}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteModal(false); }}>
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-white/50 text-center animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-2">Delete Task?</h3>
            <p className="text-gray-500 font-medium mb-8 text-lg">This action cannot be undone. This task will be permanently removed.</p>
            <div className="flex gap-4">
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteModal(false); }} className="flex-1 py-4 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors">Cancel</button>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); confirmDelete(); }} className="flex-1 py-4 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-red-500/30">Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Modal */}
      {showEditModal && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEditModal(false); }}>
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-white/50 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-gray-900">Edit Task</h3>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEditModal(false); }} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-500"><X className="w-5 h-5"/></button>
            </div>
            <input 
              type="text" 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none transition-all mb-8 shadow-sm hover:shadow-[0_0_15px_rgba(79,70,229,0.1)]"
              placeholder="Task Title"
              autoFocus
            />
            <div className="flex gap-4">
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEditModal(false); }} className="flex-1 py-4 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors">Cancel</button>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); confirmEdit(); }} className="flex-1 py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-indigo-500/30">Save</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
