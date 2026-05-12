'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../store/store';
import { logoutUser, setActiveTab } from '../store/appSlice';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut, User as UserIcon, Users, CheckSquare, FolderKanban } from 'lucide-react';
export default function Navbar() {
  const { user } = useAppSelector((state) => state.app.auth);
  const { activeTab } = useAppSelector((state) => state.app.ui);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (tab: 'overview' | 'tasks' | 'team') => {
    dispatch(setActiveTab(tab));
    if (pathname !== '/dashboard') {
      router.push('/dashboard');
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-2.5 rounded-xl group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 transform group-hover:-rotate-3">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight bg-[length:200%_auto] animate-gradient-x">
              TaskFlow
            </span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {user ? (
              <div className="flex items-center gap-4">

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-2 mr-6 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/50">
                  <button 
                    onClick={() => handleTabChange('overview')} 
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${activeTab === 'overview' && pathname === '/dashboard' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    <span className="relative z-10 flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Overview</span>
                  </button>
                  <button 
                    onClick={() => handleTabChange('tasks')} 
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${activeTab === 'tasks' && pathname === '/dashboard' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    <span className="relative z-10 flex items-center gap-2"><CheckSquare className="w-4 h-4" /> My Tasks</span>
                  </button>
                  {user.role === 'Admin' && (
                    <button 
                      onClick={() => handleTabChange('team')} 
                      className={`relative px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${activeTab === 'team' && pathname === '/dashboard' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      <span className="relative z-10 flex items-center gap-2"><Users className="w-4 h-4" /> Team</span>
                    </button>
                  )}
                </div>

                {/* User Profile Pill */}
                <div className="hidden sm:flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-default group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/50 to-indigo-50/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-inner group-hover:scale-110 transition-transform">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col relative z-10">
                    <span className="text-sm font-bold text-gray-800 leading-none mb-1 group-hover:text-indigo-700 transition-colors">{user.name}</span>
                    <span className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase">{user.role}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="relative flex items-center justify-center pl-3 pr-3 py-2 text-gray-500 bg-white border border-gray-200 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300 group overflow-hidden"
                  title="Logout"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  <LogOut className="w-4 h-4 group-hover:-translate-x-1 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                  <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 group-hover:pr-1 text-sm font-bold transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative z-10">
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  href="/login"
                  className="text-gray-600 bg-white/50 backdrop-blur-md border border-gray-200/50 hover:border-indigo-300 hover:text-indigo-600 font-semibold px-6 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 active:bg-gray-50 shadow-sm transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-2.5 rounded-full hover:from-indigo-500 hover:to-purple-500 font-semibold shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:scale-95 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
