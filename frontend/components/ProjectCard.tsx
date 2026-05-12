'use client';
import Link from 'next/link';
import { Folder, Users, Calendar, ArrowUpRight, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { deleteProject, updateProject } from '../store/appSlice';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ProjectCard({ project }: { project: any }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.app.auth);

  const isAdmin = user?.role === 'Admin';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const confirmDelete = () => {
    dispatch(deleteProject(project._id)).unwrap().then(() => {
      toast.success('Project deleted');
      setShowDeleteModal(false);
    }).catch(err => {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to delete project';
      toast.error(errorMessage);
    });
  };

  const confirmEdit = (e) => {
    e.preventDefault();
    if (editName && editName !== project.name) {
      dispatch(updateProject({ id: project._id, data: { name: editName } })).unwrap().then(() => {
        toast.success('Project updated');
        setShowEditModal(false);
      }).catch(err => {
        const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to update project';
        toast.error(errorMessage);
      });
    } else {
      setShowEditModal(false);
      
    }
  };

  const totalTasks = project.totalTasks || 0;
  const doneTasks = project.doneTasks || 0;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <>
      <Link href={`/projects/${project._id}`} className="group block h-full bg-white/70 backdrop-blur-2xl p-7 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:bg-white/90 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.25)] hover:border-indigo-300/50 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-gradient-x"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl group-hover:from-indigo-400/50 group-hover:to-purple-400/50 group-hover:scale-125 transition-all duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-float">
              <Folder className="w-7 h-7" />
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEditModal(true); }} className="w-10 h-10 rounded-full bg-white/80 border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all z-20 hover:scale-110">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteModal(true); }} className="w-10 h-10 rounded-full bg-white/80 border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all z-20 hover:scale-110">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
              <div className="w-10 h-10 rounded-full bg-white/80 border border-indigo-50 shadow-sm flex items-center justify-center text-gray-400 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-500 group-hover:rotate-45 group-hover:shadow-indigo-500/30 group-hover:shadow-lg">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all truncate pr-2">{project.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6 font-medium">{project.description}</p>
          </div>

          <div className="mb-5">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-2">
              <span>Project Progress</span>
              <span className="text-indigo-600">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-auto pt-5 border-t border-gray-200/60 flex justify-between items-center">
            <div className="flex items-center text-xs text-gray-700 font-bold bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm group-hover:border-indigo-100 transition-colors">
              <Users className="w-4 h-4 mr-2 text-indigo-500" />
              {project.members.length} Members
            </div>
            <div className="flex items-center text-xs text-gray-500 font-bold">
              <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
              {mounted ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '...'}
            </div>
          </div>
        </div>
      </Link>

      {/* Delete Modal */}
      {showDeleteModal && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteModal(false); }}>
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-white/50 text-center animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-2">Delete Project?</h3>
            <p className="text-gray-500 font-medium mb-8 text-lg">This action cannot be undone. All tasks inside this project will be orphaned.</p>
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
              <h3 className="text-3xl font-black text-gray-900">Edit Project</h3>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEditModal(false); }} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none transition-all mb-8 shadow-sm hover:shadow-[0_0_15px_rgba(79,70,229,0.1)]"
              placeholder="Project Name"
              autoFocus
            />
            <div className="flex gap-4">
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEditModal(false); }} className="flex-1 py-4 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors">Cancel</button>
              <button onClick={confirmEdit} className="flex-1 py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-indigo-500/30">Save</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
