'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchAppData } from '../../store/appSlice';
import { useRouter } from 'next/navigation';
import { Users, Loader2, ShieldCheck, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeamPage() {
  const { user } = useAppSelector((state) => state.app.auth);
  const { list: teamMembers, loading } = useAppSelector((state) => state.app.users);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (user) dispatch(fetchAppData(undefined));
  }, [user, dispatch]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'Admin') {
      router.push('/dashboard');
      toast.error('Unauthorized. Admins only.');
      return;
    }
  }, [user, router]);

  if (!mounted || !user || user.role !== 'Admin') return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f8faff]">
        <div className="absolute top-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-indigo-400/20 to-purple-400/20 blur-[140px] animate-blob mix-blend-multiply"></div>
      </div>

      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10 opacity-0 animate-fade-in-up">
        <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-white/60 mb-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-gradient-to-tr from-teal-400/20 to-emerald-400/20 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-1000"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-600 rounded-2xl shadow-sm border border-teal-100/50 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">Team Management</h1>
              </div>
              <p className="text-lg text-gray-600 font-medium max-w-2xl group-hover:text-gray-800 transition-colors">
                Overview of all registered users, their roles, and current task workload.
              </p>
            </div>
          </div>
        </div>

        {loading && teamMembers.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 overflow-hidden group/table transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(20,184,166,0.15)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 opacity-50 group-hover/table:opacity-100 transition-opacity animate-gradient-x z-20"></div>
            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-white/80 via-white/40 to-white/80">
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/50">Member</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/50">Email</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/50">Role</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/50 text-right">Assigned Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member: any) => (
                    <tr key={member._id} className="hover:bg-indigo-50/30 transition-colors group relative cursor-pointer">
                      <td className="px-8 py-5 border-b border-gray-50 relative">
                        <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-inner group-hover:scale-110 transition-transform ${member.role === 'Admin' ? 'bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-700' : 'bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700'}`}>
                            {getInitials(member.name)}
                          </div>
                          <span className="font-bold text-gray-900 text-base group-hover:text-indigo-700 transition-colors">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 border-b border-gray-50 font-medium text-gray-500">
                        {member.email}
                      </td>
                      <td className="px-8 py-5 border-b border-gray-50">
                        {member.role === 'Admin' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-3.5 h-3.5" /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            <UserIcon className="w-3.5 h-3.5" /> Member
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5 border-b border-gray-50 text-right">
                        <div className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 bg-gray-100 text-gray-700 font-black rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          {member.taskCount}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
