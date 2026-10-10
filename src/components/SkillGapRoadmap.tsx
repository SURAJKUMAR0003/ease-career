import React, { useState, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Node,
  Edge,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Code2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Compass,
  ExternalLink,
  Target,
  Lock,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  BrainCircuit,
  Cpu,
  Terminal,
  Network,
  GitBranch,
} from 'lucide-react';
import { api } from '../services/api.js';

interface SkillGapRoadmapProps {
  field?: string;
  company: string;
  role: string;
  skills: any[];
  assessmentScore?: any;
  onProceedToDashboard: () => void;
  onSkillUpdated?: (updatedRoadmap: any[]) => void;
  onSkillToggle?: (skillId: string, completed: boolean) => void;
  onJumpToArena: () => void;
}

export const SkillGapRoadmap: React.FC<SkillGapRoadmapProps> = ({
  field = 'Software Development',
  company,
  role,
  skills,
  assessmentScore,
  onProceedToDashboard,
  onSkillUpdated,
  onSkillToggle,
  onJumpToArena,
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.id || '');
  const [isVerifyingCheckpoint, setIsVerifyingCheckpoint] = useState<boolean>(false);
  const [graphMode, setGraphMode] = useState<'exploration' | 'dependency'>('exploration');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeSkill = skills.find((s) => s.id === selectedSkillId) || skills[0];

  const completedCount = skills.filter((s) => s.completed || s.status === 'completed').length;
  const overallProgress = Math.round((completedCount / (skills.length || 1)) * 100);

  const handleCheckpointVerification = async () => {
    if (!activeSkill || activeSkill.completed || activeSkill.status === 'locked') return;

    setIsVerifyingCheckpoint(true);
    try {
      try {
        const res = await api.completeSkillCheckpoint(activeSkill.id);
        if (res.roadmap && onSkillUpdated) {
          onSkillUpdated(res.roadmap);
        }
      } catch (err: any) {
        console.warn('Backend sync failed, updating locally', err);
      }
      if (onSkillToggle) {
        onSkillToggle(activeSkill.id, true);
      }
    } finally {
      setIsVerifyingCheckpoint(false);
    }
  };

  // Convert skills into React Flow Nodes and Edges for Dependency Flow view
  const initialNodes: Node[] = useMemo(() => {
    return skills.map((skill, index) => {
      const isCompleted = skill.completed || skill.status === 'completed';
      const isLocked = skill.status === 'locked';
      const isAvailable = skill.status === 'available' || skill.status === 'in-progress';
      const isSelected = skill.id === selectedSkillId;

      return {
        id: skill.id,
        position: { x: (index % 4) * 270 + 40, y: Math.floor(index / 4) * 170 + 40 },
        data: {
          label: (
            <div
              className={`p-3.5 rounded-2xl border text-left min-w-[220px] transition-all cursor-pointer backdrop-blur-md shadow-lg ${
                isSelected
                  ? 'border-cyan-400 bg-[#0d1629]/95 ring-2 ring-cyan-400/40 shadow-cyan-500/20'
                  : isCompleted
                  ? 'border-emerald-500/60 bg-[#0d1629]/90 text-emerald-300'
                  : isAvailable
                  ? 'border-purple-500/60 bg-[#0d1629]/90 text-purple-300'
                  : 'border-slate-800 bg-[#080d19]/80 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                  {skill.category}
                </span>
                {isCompleted ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Mastered
                  </span>
                ) : isLocked ? (
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-cyan-300">
                    {skill.estimatedHours}h
                  </span>
                )}
              </div>

              <div className="font-bold text-xs text-white line-clamp-1 mb-2">
                {skill.name}
              </div>

              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                      : 'bg-gradient-to-r from-cyan-400 to-purple-400'
                  }`}
                  style={{ width: `${isCompleted ? 100 : skill.progress || 35}%` }}
                />
              </div>
            </div>
          ),
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });
  }, [skills, selectedSkillId]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    skills.forEach((skill, index) => {
      if (index > 0) {
        edges.push({
          id: `e-${skills[index - 1].id}-${skill.id}`,
          source: skills[index - 1].id,
          target: skill.id,
          animated: true,
          style: { stroke: '#06b6d4', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#06b6d4',
          },
        });
      }
    });
    return edges;
  }, [skills]);

  // Exploration branches matching Screenshot 2/3
  const explorationTracks = [
    {
      id: 'se',
      title: 'SOFTWARE ENGINEER',
      color: 'cyan',
      glowClass: 'border-cyan-500/50 shadow-cyan-500/20 text-cyan-400',
      stroke: '#06b6d4',
      badge: '92% Core',
      stats: [
        { name: 'Python', pct: 92 },
        { name: 'JavaScript', pct: 88 },
        { name: 'Git & Systems', pct: 95 },
      ],
      nodes: [
        { id: 'se-fe', name: 'Frontend Developer', icon: '💻', progress: 85 },
        { id: 'se-be', name: 'Backend Developer', icon: '⚙️', progress: 90 },
        { id: 'se-do', name: 'DevOps & SRE', icon: '♾️', progress: 75 },
        { id: 'se-fs', name: 'Full Stack Arch', icon: '🔀', progress: 88 },
      ],
      subtrack: {
        title: 'Core Skills',
        skills: ['Data Structures', 'Algorithms', 'Interactors'],
      },
    },
    {
      id: 'ai',
      title: 'AI SPECIALIST',
      color: 'purple',
      glowClass: 'border-purple-500/50 shadow-purple-500/20 text-purple-400',
      stroke: '#a855f7',
      badge: '94% Match',
      stats: [
        { name: 'Python', pct: 96 },
        { name: 'ML Models', pct: 90 },
        { name: 'PyTorch / CUDA', pct: 89 },
      ],
      nodes: [
        { id: 'ai-mle', name: 'Machine Learning Eng', icon: '🧠', progress: 92 },
        { id: 'ai-ds', name: 'Data Scientist', icon: '📊', progress: 88 },
        { id: 'ai-nlp', name: 'NLP & LLM Eng', icon: '💬', progress: 95 },
        { id: 'ai-cv', name: 'CV Researcher', icon: '👁️', progress: 82 },
      ],
    },
    {
      id: 'pm',
      title: 'PRODUCT & ARCHITECTURE',
      color: 'amber',
      glowClass: 'border-amber-500/50 shadow-amber-500/20 text-amber-400',
      stroke: '#f59e0b',
      badge: '91% Match',
      stats: [
        { name: 'Product Strategy', pct: 93 },
        { name: 'UX & System Design', pct: 85 },
        { name: 'Agile & Scale', pct: 91 },
      ],
      nodes: [
        { id: 'pm-apm', name: 'Associate PM', icon: '📋', progress: 90 },
        { id: 'pm-tpm', name: 'Technical PM', icon: '🏗️', progress: 92 },
        { id: 'pm-gpm', name: 'Growth PM', icon: '📈', progress: 86 },
        { id: 'pm-spm', name: 'Staff Engineer / PM', icon: '🎖️', progress: 88 },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-100">
      {/* Top Exploration Header matching Screenshots 2 & 3 */}
      <div className="bg-[#0b1021]/90 border border-cyan-950/50 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                EXPLORATION GRAPH
              </span>
              <span className="text-xs text-slate-400">
                Target: <span className="text-white font-bold">{company}</span> • {role}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold">
                {field}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Interactive Career Exploration &amp; AI Roadmap
            </h1>
          </div>

          {/* Right Header Controls matching Screenshot 2/3 */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Completion Pill */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#080d1a] border border-cyan-900/50 shadow-inner">
              <span className="text-xs font-bold text-slate-300">
                {overallProgress}% Complete
              </span>
              <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-[#080d1a] border border-slate-800">
              <button
                onClick={() => setGraphMode('exploration')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  graphMode === 'exploration'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Mindmap Graph</span>
              </button>

              <button
                onClick={() => setGraphMode('dependency')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  graphMode === 'dependency'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Step Flow</span>
              </button>
            </div>

            <button
              onClick={onProceedToDashboard}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Assessment Score Verified Diagnostics */}
        {assessmentScore && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
            <div className="p-3.5 rounded-2xl bg-[#080d19]/90 border border-cyan-900/40 space-y-1">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Diagnostic Calibration Score
              </span>
              <div className="text-xl font-black text-white">
                {assessmentScore.correct} / {assessmentScore.total}{' '}
                <span className="text-xs font-semibold text-cyan-400">
                  ({assessmentScore.percentage}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Calibrated against {company} {role} rubrics.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Demonstrated Competencies ({assessmentScore.demonstratedSkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {(assessmentScore.demonstratedSkills || []).slice(0, 3).map((s: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-1">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Target Practice Gaps ({assessmentScore.improvementSkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {(assessmentScore.improvementSkills || []).slice(0, 3).map((s: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Exploration Canvas / Graph Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Graph View (8 cols) */}
        <div className="lg:col-span-8 bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl relative">
          {graphMode === 'exploration' ? (
            /* Mindmap Exploration Graph matching Screenshots 2 & 3 */
            <div className="relative w-full rounded-2xl bg-[#070a14] border border-cyan-950/40 p-4 sm:p-8 min-h-[520px] overflow-x-auto flex flex-col justify-center items-center">
              {/* Subtle background glow rings */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.06),_transparent_70%)] pointer-events-none" />

              {/* Floating Canvas Controls matching Screenshot 2/3 */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 p-1.5 rounded-xl bg-[#0d1424]/90 border border-slate-800 backdrop-blur-md shadow-lg">
                <button
                  title="Search nodes"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Zoom in"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Zoom out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Fit view"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Center Hub + Branching Networks */}
              <div className="relative z-10 w-full max-w-3xl my-auto py-6">
                {/* Center Glowing Hub */}
                <div className="text-center mb-8 relative">
                  <div className="inline-block p-4 sm:p-6 rounded-3xl bg-[#0d1629] border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.25)] relative group cursor-pointer hover:border-cyan-400 transition-all">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center text-white mb-2 shadow-lg shadow-cyan-500/30">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div className="font-black text-sm sm:text-base tracking-wider uppercase text-white">
                      CAREER EXPLORATION
                    </div>
                    <div className="text-[11px] font-bold text-cyan-300 tracking-wider">
                      &amp; AI ROADMAP
                    </div>
                    <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold uppercase border border-cyan-500/40 animate-pulse">
                      Target: {company}
                    </div>
                  </div>
                </div>

                {/* 3 Main Tracks Branching */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {explorationTracks.map((track) => (
                    <div
                      key={track.id}
                      className={`p-4 rounded-2xl bg-[#0d1629]/90 border backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                        track.color === 'cyan'
                          ? 'border-cyan-500/50 shadow-cyan-500/10'
                          : track.color === 'purple'
                          ? 'border-purple-500/50 shadow-purple-500/10'
                          : 'border-amber-500/50 shadow-amber-500/10'
                      }`}
                    >
                      {/* Track Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            track.color === 'cyan'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : track.color === 'purple'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {track.badge}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Track</span>
                      </div>

                      <div className="font-extrabold text-xs sm:text-sm text-white mb-3">
                        {track.title}
                      </div>

                      {/* Stat bars matching Screenshot 2/3 */}
                      <div className="space-y-1.5 mb-4">
                        {track.stats.map((st, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">• {st.name}</span>
                            <span className="font-bold text-slate-200">{st.pct}%</span>
                          </div>
                        ))}
                      </div>

                      {/* Sub-nodes / Roles */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800">
                        {track.nodes.map((node) => (
                          <button
                            key={node.id}
                            onClick={() => {
                              // If there's a matching skill, select it
                              const found = skills.find(
                                (s) => s.name.toLowerCase().includes(node.name.toLowerCase().split(' ')[0])
                              );
                              if (found) setSelectedSkillId(found.id);
                            }}
                            className="w-full p-2 rounded-xl bg-[#080d1a] hover:bg-slate-800/80 border border-slate-800/80 flex items-center justify-between text-left transition-colors group"
                          >
                            <span className="text-xs font-semibold text-slate-300 group-hover:text-cyan-300 flex items-center gap-1.5">
                              <span>{node.icon}</span>
                              <span>{node.name}</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {node.progress}%
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* React Flow Sequential Step View */
            <div className="h-[520px] w-full rounded-2xl overflow-hidden bg-[#070a14] border border-cyan-950/40">
              <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                onNodeClick={(_, node) => setSelectedSkillId(node.id)}
                fitView
              >
                <Background color="#1e293b" gap={20} size={1} />
                <Controls className="bg-[#0d1629] border border-slate-800 fill-slate-300 text-slate-300" />
              </ReactFlow>
            </div>
          )}
        </div>

        {/* Right Column: Skill Detail Inspector (4 cols) */}
        {activeSkill && (
          <div className="lg:col-span-4 bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl backdrop-blur-xl">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {activeSkill.category} • {activeSkill.difficulty}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  ~{activeSkill.estimatedHours} Hours
                </span>
              </div>

              <h2 className="text-lg font-black text-white">
                {activeSkill.name}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeSkill.description}
              </p>
            </div>

            {/* Checkpoint Verification Action */}
            <div className="p-4 rounded-2xl bg-[#080d1a] border border-cyan-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Skill Checkpoint Status
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeSkill.completed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : activeSkill.status === 'locked'
                      ? 'bg-slate-800 text-slate-500'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {activeSkill.completed
                    ? 'Verified Mastered'
                    : activeSkill.status === 'locked'
                    ? 'Prerequisites Pending'
                    : 'Ready for Checkpoint'}
                </span>
              </div>

              <button
                onClick={handleCheckpointVerification}
                disabled={activeSkill.completed || activeSkill.status === 'locked' || isVerifyingCheckpoint}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 hover:from-cyan-300 hover:to-purple-400 disabled:opacity-40 text-slate-950 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>
                  {activeSkill.completed
                    ? 'Checkpoint Completed (+100 XP)'
                    : activeSkill.status === 'locked'
                    ? 'Locked — Complete Prerequisites First'
                    : isVerifyingCheckpoint
                    ? 'Verifying...'
                    : 'Verify & Mark Checkpoint Complete (+100 XP)'}
                </span>
              </button>
            </div>

            {/* Prerequisites */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Prerequisite Dependencies
              </span>
              {activeSkill.prerequisites && activeSkill.prerequisites.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {activeSkill.prerequisites.map((pId: string) => (
                    <span
                      key={pId}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#080d1a] border border-slate-800 text-slate-300"
                    >
                      {pId}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-emerald-400 font-medium">
                  None • Foundational core milestone
                </span>
              )}
            </div>

            {/* Practice Coding Challenge */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Recommended Coding Challenge
              </span>
              <div className="p-3.5 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{activeSkill.codingTasks?.[0] || 'Implement optimal solution'}</span>
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <button
                  onClick={onJumpToArena}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Launch in Debug Arena</span>
                </button>
              </div>
            </div>

            {/* Learning Resources */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Curated Study Resources
              </span>
              <div className="space-y-1.5">
                {(activeSkill.resources || [
                  { title: 'Official Documentation & Standards', url: '#', type: 'doc' },
                  { title: 'Interactive Engineering Deep Dive', url: '#', type: 'practice' },
                ]).map((res: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#080d1a] border border-slate-800/80 flex items-center justify-between text-xs text-slate-300"
                  >
                    <span className="truncate pr-2">{res.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* The 3 Bottom Analytical Panels from Screenshots 2 & 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel 1: Skill Analysis Bar Chart matching Screenshot 2/3 */}
        <div className="bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Skill Analysis:
              </span>
              <span className="text-xs sm:text-sm font-black text-cyan-300 tracking-tight">
                {role.toUpperCase()}
              </span>
            </div>
            <span className="text-slate-500 text-xs font-mono">•••</span>
          </div>

          <div className="pt-2 flex items-end justify-around h-44 border-b border-slate-800 pb-2">
            {[
              { label: 'Algorithms', val: assessmentScore ? Math.min(95, assessmentScore.percentage + 10) : 85 },
              { label: 'System Design', val: assessmentScore ? Math.max(65, assessmentScore.percentage - 5) : 75 },
              { label: 'Coding', val: assessmentScore ? assessmentScore.percentage : 80 },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-bold text-slate-200">{bar.val}%</span>
                <div className="w-10 bg-slate-800/80 rounded-t-xl overflow-hidden h-32 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-cyan-400 rounded-t-xl transition-all duration-700 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    style={{ height: `${bar.val}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 text-center">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Skill Development Gaps Circular Rings matching Screenshot 2/3 */}
        <div className="bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-white">
              Skill Development Gaps
            </span>
            <span className="text-slate-500 text-xs font-mono">•••</span>
          </div>

          <div className="pt-3 flex items-center justify-around">
            {/* Ring 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#1e293b"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#06b6d4"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - 0.45)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute font-black text-sm text-white">45%</span>
              </div>
              <span className="text-[11px] font-medium text-slate-300 text-center">
                Deep Learning / Core
              </span>
            </div>

            {/* Ring 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#1e293b"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#a855f7"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - 0.60)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute font-black text-sm text-white">60%</span>
              </div>
              <span className="text-[11px] font-medium text-slate-300 text-center">
                Leadership / Scale
              </span>
            </div>
          </div>
        </div>

        {/* Panel 3: Career Path Progress L1-L6 Matrix matching Screenshot 2/3 */}
        <div className="bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-white">
              Career Path Progress
            </span>
            <span className="text-slate-500 text-xs font-mono">•••</span>
          </div>

          {/* Matrix table */}
          <div className="space-y-2 pt-1 font-mono text-[11px]">
            {/* Header row */}
            <div className="grid grid-cols-7 gap-1 text-slate-500 text-center pb-1 border-b border-slate-800">
              <span className="col-span-1 text-left font-sans text-[10px]">Tier</span>
              <span>L1</span>
              <span>L2</span>
              <span>L3</span>
              <span>L4</span>
              <span>L5</span>
              <span>L6</span>
            </div>

            {/* Row 1: Completed */}
            <div className="grid grid-cols-7 gap-1 items-center">
              <span className="col-span-1 font-sans text-[10px] text-slate-400">Completed</span>
              <div className="col-span-2 px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold text-center border border-emerald-500/30 flex items-center justify-center">
                ✓
              </div>
              <div className="col-span-4" />
            </div>

            {/* Row 2: Current role */}
            <div className="grid grid-cols-7 gap-1 items-center">
              <span className="col-span-1 font-sans text-[10px] text-slate-400">Current</span>
              <div className="col-span-2" />
              <div className="col-span-2 px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold text-center border border-cyan-500/30 flex items-center justify-center">
                ✓ (L3-L4)
              </div>
              <div className="col-span-2" />
            </div>

            {/* Row 3: Target Role */}
            <div className="grid grid-cols-7 gap-1 items-center">
              <span className="col-span-1 font-sans text-[10px] text-slate-400">Target</span>
              <div className="col-span-4" />
              <div className="col-span-1 px-1.5 py-1 rounded bg-purple-500/30 text-purple-200 font-bold text-center border border-purple-500/40">
                L5
              </div>
              <div className="col-span-1 px-1.5 py-1 rounded bg-amber-500/30 text-amber-200 font-bold text-center border border-amber-500/40">
                L6
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
