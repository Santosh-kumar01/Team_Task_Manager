'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../../../store/projectSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Rocket, FolderPlus, AlignLeft, ArrowUpRight } from 'lucide-react';

export default function NewProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.projects);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(createProject({ name, description, members: [] }));
    if (createProject.fulfilled.match(resultAction)) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Stunning Ambient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[#f8faff]">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-[120px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-gradient-to-tl from-pink-400/20 to-rose-300/20 blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-2xl w-full z-10 opacity-0 animate-fade-in-up">
        {/* Navigation */}
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-8 group">
          <div className="p-2 rounded-full bg-white/50 border border-gray-200 group-hover:bg-indigo-50 group-hover:border-indigo-200 mr-3 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          Back to Dashboard
        </Link>

        {/* Header Content */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl mb-6 shadow-inner animate-float">
            <FolderPlus className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight mb-4">
            Create New Project
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            Set up a new workspace for your team to collaborate and conquer tasks.
          </p>
        </div>
        
        {/* Main Form Card */}
        <div className="bg-white/60 backdrop-blur-3xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-sm font-medium flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Name Field */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 ml-1">Project Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Rocket className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)] transition-all text-gray-800 font-bold placeholder-gray-400"
                  placeholder="e.g. Website Redesign Q3"
                  required
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 ml-1">Description</label>
              <div className="relative group">
                <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                  <AlignLeft className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)] transition-all text-gray-800 font-bold resize-none placeholder-gray-400"
                  placeholder="What is this project about?"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all font-black text-lg shadow-[0_8px_25px_-8px_rgba(79,70,229,0.7)] hover:shadow-[0_20px_40px_-8px_rgba(79,70,229,0.9)] disabled:opacity-70 disabled:cursor-not-allowed group transform hover:-translate-y-1 mt-4 border border-white/20"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              {loading ? (
                <span className="flex items-center justify-center relative z-10">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center tracking-wide">
                  Launch Project
                  <ArrowUpRight className="w-6 h-6 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}