import React, { useState, useEffect } from 'react';
import {
  Compass,
  Swords,
  BrainCircuit,
  HelpCircle,
  Trophy,
  Flame,
  Zap,
  Target,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  AlertTriangle,
  Play,
  RotateCcw,
  History,
  Database,
  FileText,
  Activity,
} from 'lucide-react';
import { UserCareerProfile, RoadmapSkill } from '../types.js';
import { api } from '../services/api.js';

interface MainDashboardProps {
  user: UserCareerProfile;
  skills: RoadmapSkill[];
  onNavigate: (tab: string) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  user,
  skills,
  onNavigate,
}) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState<boolean>(true);

  useEffect(() => {
    api.getActivities()
      .then((data) => {
        if (data.activities) {
          setActivities(data.activities);
        }
      })
      .catch((err) => {
        console.warn('Failed to load activities:', err);
      })
      .finally(() => {
        setLoadingActivities(false);
      });
  }, []);

  const completedCount = skills.filter((s) => s.completed || s.status === 'demonstrated').length;
  const overallProgress = user.assessmentCompleted
    ? Math.round((completedCount / (skills.length || 1)) * 100)
    : 0;
  const nextRecommendedTask = skills.find((s) => !s.completed) || skills[0];

  return (
    <div className="space-y-8 pb-12 font-sans text-slate-100">
      {/* Top Welcome & Target Role Hero in Dark Navy + Cyan/Purple */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0b1021]/90 border border-cyan-950/50 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Targeting {user.company} • {user.role} ({user.field})
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Welcome to your preparation command center,{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                {user.name.split(' ')[0]}
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Your curriculum is calibrated for {user.company}’s engineering standards. Navigate your interactive exploration mindmap, battle Gemini in time-pressured debugging duels, and practice in the live AI video interview studio.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('roadmap')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Compass className="w-4 h-4 text-slate-950" />
                <span>Exploration Graph &amp; Roadmap</span>
              </button>

              <button
                onClick={() => onNavigate('arena')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d1629] hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-semibold text-xs sm:text-sm transition-colors"
              >
                <Swords className="w-4 h-4 text-cyan-400" />
                <span>Launch Debug Arena</span>
              </button>

              <button
                onClick={() => onNavigate('interview')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d1629] hover:bg-slate-800 text-purple-300 border border-purple-500/30 font-semibold text-xs sm:text-sm transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>AI Mock Interview</span>
              </button>
            </div>
          </div>

          {/* Overall Readiness Gauge (Honest State) */}
          <div className="bg-[#080d1a]/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                Verified Readiness
              </span>
              <span className="text-base font-black text-cyan-400">
                {user.assessmentCompleted ? `${overallProgress}%` : '0% (Diagnostic Needed)'}
              </span>
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                style={{ width: `${Math.max(5, overallProgress)}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>
                {completedCount} of {skills.length} milestones certified
              </span>
              <span className="text-purple-300 font-semibold">
                Level {user.level} Engineer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Honest Empty State Banner if Assessment not yet done */}
      {!user.assessmentCompleted && (
        <div className="p-5 rounded-3xl bg-[#0d1424] border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                No simulated guesswork: Calibrate your true skill gaps
              </h3>
              <p className="text-xs text-slate-400">
                Take the calibrated diagnostic assessment for {user.company} to compute real strengths and target gaps.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('roadmap')}
            className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shrink-0 shadow-md transition-all flex items-center gap-1.5"
          >
            <span>View Learning Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Core Preparedness Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0b1021]/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Diagnostic Score</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {user.assessmentScore ? `${user.assessmentScore.percentage}%` : 'Pending'}
          </div>
          <p className="text-[11px] text-slate-500">
            {user.assessmentScore
              ? `${user.assessmentScore.correct}/${user.assessmentScore.total} questions verified`
              : 'Complete assessment to score'}
          </p>
        </div>

        <div className="bg-[#0b1021]/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Practice Streak</span>
            <Flame className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">
            {user.streak} <span className="text-xs text-slate-400">Days Active</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Consecutive daily coding &amp; mock review
          </p>
        </div>

        <div className="bg-[#0b1021]/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Experience XP</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300">
            {user.xp} <span className="text-xs text-slate-400">XP</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {350 * user.level - user.xp} XP to next level tier
          </p>
        </div>

        <div className="bg-[#0b1021]/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Badges Earned</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {user.badges.length} <span className="text-xs text-slate-400">Unlocked</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {user.badges[user.badges.length - 1] || 'Orientation Pioneer'}
          </p>
        </div>
      </div>

      {/* Recommended Next Task & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Next Recommended Task (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Recommended Next Milestone
            </span>
            <span className="text-[11px] text-cyan-400 font-semibold">Priority 1</span>
          </div>

          {nextRecommendedTask && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#080d1a] border border-cyan-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300">
                  {nextRecommendedTask.category} • {nextRecommendedTask.difficulty}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  ~{nextRecommendedTask.estimatedHours}h
                </span>
              </div>

              <h3 className="text-base font-bold text-white">
                {nextRecommendedTask.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {nextRecommendedTask.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Inspect in Mindmap</span>
                </button>

                <button
                  onClick={() => onNavigate('arena')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Practice Bug Hunt</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skill Gap Analysis Quick Summary (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Skill Diagnostic Breakdown
            </span>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold"
            >
              Full Analytics →
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 block mb-1.5">
                Demonstrated Strengths
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(user.assessmentScore?.demonstratedSkills || [
                  'Algorithmic Complexity & Big-O',
                  'Two-Pointer Technique',
                ]).map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-purple-400 block mb-1.5">
                Target Improvement Gaps
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(user.assessmentScore?.improvementSkills || [
                  'Distributed Caching & Concurrency',
                  'SOLID & System Design',
                ]).map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium"
                  >
                    ▲ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Feed Saved in SQLite Database (Zero MongoDB) */}
      <div className="bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                SQLite Storage • Zero MongoDB
              </span>
              <span className="text-xs text-slate-400">
                Persistent Activity Ledger
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Live Preparation & Challenge Activity History
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Storage: <strong className="text-slate-200">SQLite Database</strong></span>
          </div>
        </div>

        {/* Activity List */}
        {loadingActivities ? (
          <div className="py-8 text-center text-xs text-slate-500 font-mono">
            Loading activity stream...
          </div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center bg-[#080d1a] border border-slate-800 rounded-2xl p-6 space-y-2">
            <History className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-300">No Activity Recorded Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your preparation actions will appear here in real time. Solve a challenge in Debug Arena or complete an AI Mock Interview to record your progress.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activities.slice(0, 8).map((act, idx) => (
              <div
                key={act.id || idx}
                className="bg-[#080d1a] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      act.type === 'challenge'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : act.type === 'interview'
                        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                        : act.type === 'assessment'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {act.type === 'challenge' ? (
                      <Swords className="w-4 h-4" />
                    ) : act.type === 'interview' ? (
                      <HelpCircle className="w-4 h-4" />
                    ) : act.type === 'assessment' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Compass className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {act.title}
                      </span>
                      {act.score !== undefined && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                          {act.score}% Score
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {act.detail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    +{act.xpEarned} XP
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
