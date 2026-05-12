'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { login } from '../../../store/appSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Activity, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading, error } = useAppSelector((state) => state.app.auth);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      toast.success('Welcome back!');
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to sign in';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] py-12 relative overflow-hidden bg-gray-50">
      {/* Background ambient light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-[120px] animate-[spin_30s_linear_infinite]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tl from-pink-400/20 to-indigo-400/20 blur-[120px] animate-[spin_40s_linear_infinite_reverse]"></div>
      </div>

      <div className="flex w-full max-w-5xl bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white/80 relative z-10 transition-transform duration-700 hover:scale-[1.005]">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center w-1/2 p-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-fuchsia-800"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-20"></div>
          <div className="relative z-10">
            <Activity className="w-16 h-16 mb-6 text-indigo-200" />
            <h1 className="text-4xl font-extrabold mb-4 leading-tight">
              Streamline Your <br /> Workflow
            </h1>
            <p className="text-indigo-100 text-lg mb-8">
              Join your team to manage projects, track progress, and achieve your goals together.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-400 border-2 border-indigo-600"></div>
                <div className="w-10 h-10 rounded-full bg-purple-400 border-2 border-indigo-600"></div>
                <div className="w-10 h-10 rounded-full bg-pink-400 border-2 border-indigo-600"></div>
              </div>
              <p className="text-sm font-medium text-indigo-100">Trusted by 10k+ teams</p>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-3xl"></div>
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/40 to-transparent blur-2xl"></div>
          
          {/* Floating elements */}
          <div className="absolute top-1/4 right-10 w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 animate-[bounce_5s_infinite]"></div>
          <div className="absolute bottom-1/4 left-10 w-16 h-16 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 animate-[bounce_6s_infinite_reverse]"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white/50">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 text-lg">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50/50 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)] transition-all text-gray-800"
                  placeholder="Enter your Email Address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3.5 bg-gray-50/50 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white hover:shadow-[0_0_15px_rgba(79,70,229,0.1)] transition-all text-gray-800"
                  placeholder="Enter your Password"
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
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full flex justify-center items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-4 rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:-translate-y-1 shadow-[0_8px_25px_-8px_rgba(79,70,229,0.7)] hover:shadow-[0_20px_40px_-8px_rgba(79,70,229,0.9)] font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden group border border-white/20"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              {loading ? (
                <span className="flex items-center relative z-10">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign In <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
