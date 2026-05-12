'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { register } from '../../../store/appSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Shield, ArrowRight, Rocket, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading, error } = useAppSelector((state) => state.app.auth);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    try {
      await dispatch(register(formData)).unwrap();
      toast.success('Account created! Please login.');
      router.push('/login');
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to create account';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] py-12 relative overflow-hidden bg-gray-50">
      {/* Background ambient light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-bl from-purple-400/20 to-indigo-400/20 blur-[120px] animate-[spin_30s_linear_infinite]"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 blur-[120px] animate-[spin_40s_linear_infinite_reverse]"></div>
      </div>

      <div className="flex w-full max-w-5xl bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white/80 relative z-10 transition-transform duration-700 hover:scale-[1.005]">


        {/* Left Side - Register Form */}
        <div className="w-full md:w-1/2 p-10 md:p-16 order-2 md:order-1 flex flex-col justify-center bg-white/50">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Create Account</h2>
            <p className="text-gray-500 text-lg">Get started with your free account today.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50/50 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)] transition-all text-gray-800"
                  placeholder="Enter your Full Name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50/50 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)] transition-all text-gray-800"
                  placeholder="Enter your Email Address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3.5 bg-gray-50/50 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)] transition-all text-gray-800"
                  placeholder="Create a Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-gray-50 transition-all text-gray-800 appearance-none"
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full flex justify-center items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-4 rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:-translate-y-1 shadow-[0_8px_25px_-8px_rgba(79,70,229,0.7)] hover:shadow-[0_20px_40px_-8px_rgba(79,70,229,0.9)] font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden group border border-white/20 mt-4"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              {loading ? (
                <span className="flex items-center relative z-10">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Account <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Right Side - Branding */}
        <div className="hidden md:flex flex-col justify-center w-1/2 p-16 text-white relative overflow-hidden order-1 md:order-2">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-800 via-purple-700 to-indigo-800"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-20"></div>
          <div className="relative z-10">
            <Rocket className="w-16 h-16 mb-6 text-purple-300" />
            <h1 className="text-4xl font-extrabold mb-4 leading-tight">
              Supercharge <br /> Your Team
            </h1>
            <p className="text-purple-100 text-lg mb-8">
              Sign up today and experience the ultimate platform for team collaboration and task management.
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-purple-100">
                <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Organize projects easily
              </div>
              <div className="flex items-center text-purple-100">
                <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Track team progress
              </div>
              <div className="flex items-center text-purple-100">
                <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Secure role-based access
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-bl from-white/20 to-transparent blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-400/40 to-transparent blur-2xl"></div>
          
          {/* Floating elements */}
          <div className="absolute top-1/3 left-10 w-24 h-24 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 animate-[bounce_6s_infinite]"></div>
          <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 animate-[bounce_5s_infinite_reverse]"></div>
        </div>

      </div>
    </div>
  );
}
