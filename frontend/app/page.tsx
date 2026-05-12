'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, LayoutDashboard, Users, Zap, Shield, BarChart3, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8faff] text-gray-900 overflow-x-hidden">
      {/* Navbar space is already handled by global Navbar component */}
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/10 blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-pink-400/10 to-rose-300/10 blur-[120px] -z-10" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-6 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-indigo-100 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
                <span className="text-sm font-bold text-indigo-700 tracking-wide uppercase">New Version 2.0 is Live</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                Manage team tasks <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
                  with pure flow.
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 font-medium max-w-2xl leading-relaxed">
                TaskFlow is the ultimate command center for modern teams. Streamline projects, automate assignments, and track progress with breathtaking clarity.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                <Link 
                  href="/register" 
                  className="group relative px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.5)] hover:-translate-y-1 transition-all overflow-hidden w-full sm:w-auto text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link 
                  href="/login" 
                  className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-bold text-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all w-full sm:w-auto text-center"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-8 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                      <Image 
                        src={`https://i.pravatar.cc/100?img=${i+10}`} 
                        alt="User" 
                        width={40} 
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-gray-900">500+ Teams</p>
                  <p className="text-xs text-gray-500 font-bold">Trust TaskFlow daily</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative animate-float">
              <div className="relative z-10 bg-white/40 backdrop-blur-3xl rounded-[3rem] p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60">
                <div className="rounded-[2.5rem] overflow-hidden shadow-inner border border-white/20">
                   {/* This would ideally be a screenshot of your dashboard */}
                   <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 min-h-[400px] flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-white/20 rounded-full"></div>
                          <div className="h-8 w-48 bg-white rounded-xl"></div>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                          <div className="h-2 w-12 bg-white/40 rounded-full mb-3"></div>
                          <div className="h-6 w-20 bg-white rounded-lg"></div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                          <div className="h-2 w-12 bg-white/40 rounded-full mb-3"></div>
                          <div className="h-6 w-20 bg-white rounded-lg"></div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-8 top-1/4 p-6 bg-white rounded-[2rem] shadow-xl border border-gray-100 animate-bounce-slow">
                 <Zap className="w-8 h-8 text-amber-500" />
              </div>
              <div className="absolute -left-8 bottom-1/4 p-6 bg-white rounded-[2rem] shadow-xl border border-gray-100 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                 <Users className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-indigo-600 font-black tracking-widest uppercase text-sm">Powerful Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Everything you need to <br /> ship faster.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: LayoutDashboard, title: 'Intelligent Overview', desc: 'Real-time dashboard showing exactly where every project stands.', color: 'indigo' },
              { icon: Zap, title: 'Instant Assignment', desc: 'Assign tasks to team members with a single click and automatic alerts.', color: 'amber' },
              { icon: BarChart3, title: 'Deep Analytics', desc: 'Understand team velocity and bottleneck with advanced reporting.', color: 'emerald' },
              { icon: Shield, title: 'Enterprise Security', desc: 'Your data is encrypted and protected with industry-leading standards.', color: 'rose' },
              { icon: Clock, title: 'Time Tracking', desc: 'Monitor how much time is spent on each task to optimize performance.', color: 'blue' },
              { icon: Users, title: 'Team Sync', desc: 'Keep everyone on the same page with centralized communication.', color: 'purple' },
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 group">
                <div className={`p-4 rounded-2xl mb-6 inline-block bg-white shadow-sm group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-gray-600 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 bg-indigo-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Tasks Completed', val: '1.2M+' },
              { label: 'Happy Teams', val: '5k+' },
              { label: 'Uptime', val: '99.9%' },
              { label: 'Growth', val: '200%' },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl md:text-5xl font-black text-white">{stat.val}</p>
                <p className="text-indigo-100 font-bold uppercase tracking-wider text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-[4rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                Ready to transform <br className="hidden md:block" /> your team&apos;s workflow?
              </h2>
              <p className="text-xl text-indigo-100/70 font-medium max-w-2xl mx-auto leading-relaxed">
                Join thousands of high-performing teams who use TaskFlow to turn chaos into clarity.
              </p>
              <div className="pt-6">
                <Link 
                  href="/register" 
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-900 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl"
                >
                  Start Your Flow Now <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">TaskFlow</span>
          </div>
          <div className="flex items-center gap-8">
             <Link href="#" className="text-gray-500 hover:text-indigo-600 font-bold transition-colors">Privacy</Link>
             <Link href="#" className="text-gray-500 hover:text-indigo-600 font-bold transition-colors">Terms</Link>
             <Link href="#" className="text-gray-500 hover:text-indigo-600 font-bold transition-colors">Support</Link>
          </div>
          <p className="text-gray-400 font-bold">© 2026 TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

