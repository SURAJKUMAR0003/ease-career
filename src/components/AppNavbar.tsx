import React from 'react';
import {
  Code2,
  Compass,
  Swords,
  HelpCircle,
  BrainCircuit,
  Trophy,
  Flame,
  Zap,
  Target,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import { UserCareerProfile } from '../types.js';

interface AppNavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserCareerProfile;
  onRetakeOnboarding: () => void;
  onLogout: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onRetakeOnboarding,
  onLogout,
}) => {
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Code2 },
    { id: 'roadmap', label: 'Exploration Graph', icon: Compass, badge: 'Interactive' },
    { id: 'arena', label: 'Debug Arena', icon: Swords, badge: 'vs Gemini' },
    { id: 'interview', label: 'AI Mock Interview', icon: HelpCircle },
    { id: 'coach', label: 'AI Coach', icon: BrainCircuit },
    { id: 'analytics', label: 'Analytics', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070b16]/95 backdrop-blur-xl border-b border-cyan-950/40 text-slate-100 font-sans shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-sm tracking-wider">EC</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Ease Career
                </span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {user.company}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block truncate max-w-[150px]">
                {user.role}
              </p>
            </div>
          </div>

          {/* Search bar matching Screenshot 2/3 */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search skills, roles..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectTab('roadmap');
                }}
                className="w-full bg-[#0d1424] border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all"
              />
              <span className="absolute right-2.5 top-1.5 text-[10px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60 font-mono">
                ⌘K
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold uppercase tracking-wider">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badges & Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                <span>{user.streak}d</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{user.xp} XP</span>
              </div>
            </div>

            {/* Profile Avatar & Re-target */}
            <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800">
              <button
                onClick={onRetakeOnboarding}
                title="Change target role or company"
                className="px-2.5 py-1 rounded-lg bg-[#0d1424] hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors hidden sm:flex items-center gap-1 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="text-[11px]">Re-target</span>
              </button>

              <button
                onClick={onLogout}
                title="Exit to Lamp Login screen"
                className="p-1.5 rounded-lg bg-[#0d1424] hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-800 text-xs overflow-x-auto gap-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg whitespace-nowrap ${
                  isActive ? 'text-cyan-300 font-bold bg-cyan-950/40' : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
