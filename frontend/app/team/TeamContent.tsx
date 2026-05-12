'use client';
import { useAppSelector } from '../../store/store';
import { Users, ShieldCheck, User as UserIcon, Loader2 } from 'lucide-react';

export default function TeamPageContent() {
  const { list: teamMembers, loading } = useAppSelector((state) => state.app.users);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading && teamMembers.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Team Hub</h2>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-white/80 overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Member</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Email</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Role</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 text-right">Workload</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member: any) => (
                <tr key={member._id} className="hover:bg-indigo-50/30 transition-colors group relative cursor-pointer">
                  <td className="px-8 py-6 border-b border-gray-50 relative">
                    <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-inner group-hover:scale-110 transition-transform ${member.role === 'Admin' ? 'bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-700' : 'bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700'}`}>
                        {getInitials(member.name)}
                      </div>
                      <span className="font-bold text-gray-900 text-base group-hover:text-indigo-700 transition-colors">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 border-b border-gray-50 font-medium text-gray-500">
                    {member.email}
                  </td>
                  <td className="px-8 py-6 border-b border-gray-50">
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
                  <td className="px-8 py-6 border-b border-gray-50 text-right">
                    <div className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 bg-gray-100 text-gray-700 font-black rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {member.taskCount || 0}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
