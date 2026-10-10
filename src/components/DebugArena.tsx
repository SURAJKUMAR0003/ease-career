import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import {
  Swords,
  Timer,
  Play,
  Send,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
  Clock,
  Terminal,
  FileCode,
  FileText,
  History,
  FolderTree,
  Activity,
  Trophy,
} from 'lucide-react';
import { api } from '../services/api.js';

interface DebugArenaProps {
  onRefreshStats?: () => void;
  onAddXp?: (amount: number, badgeAwarded?: string) => void;
}

export const DebugArena: React.FC<DebugArenaProps> = ({ onRefreshStats, onAddXp }) => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // File explorer tab
  const [activeFile, setActiveFile] = useState<'solution' | 'tests' | 'spec' | 'history'>('solution');

  // Execution state
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [runnerError, setRunnerError] = useState<string | null>(null);

  // Gemini Rival Replay state
  const [showRivalReplay, setShowRivalReplay] = useState<boolean>(false);
  const [rivalReplayData, setRivalReplayData] = useState<any>(null);
  const [battleWinner, setBattleWinner] = useState<'user' | 'gemini'>('user');

  // Submission history & auto-progression
  const [solvedSuccess, setSolvedSuccess] = useState<boolean>(false);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);
  const [submissionHistory, setSubmissionHistory] = useState<any[]>([
    {
      id: 'sub-1',
      timestamp: 'Today, 10:14 AM',
      status: 'Passed All 5/5',
      timeTaken: '03:42',
      xpAwarded: 120,
    },
  ]);

  const handleNextChallenge = () => {
    if (challenges.length === 0) return;
    const currentIdx = challenges.findIndex((c) => c.id === selectedChallengeId);
    const nextIdx = (currentIdx + 1) % challenges.length;
    setSelectedChallengeId(challenges[nextIdx].id);
    setSolvedSuccess(false);
    setAutoAdvanceCountdown(null);
  };

  // Auto-countdown effect
  useEffect(() => {
    if (autoAdvanceCountdown === null) return;
    if (autoAdvanceCountdown <= 0) {
      handleNextChallenge();
      return;
    }
    const timer = setTimeout(() => {
      setAutoAdvanceCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [autoAdvanceCountdown, challenges, selectedChallengeId]);

  useEffect(() => {
    api.getChallenges()
      .then((data) => {
        if (data.challenges && data.challenges.length > 0) {
          setChallenges(data.challenges);
          setSelectedChallengeId(data.challenges[0].id);
          setCode(data.challenges[0].starterCode[language] || data.challenges[0].starterCode.javascript);
        }
      })
      .catch(console.error);
  }, []);

  const activeChallenge = challenges.find((c) => c.id === selectedChallengeId) || challenges[0];

  useEffect(() => {
    if (activeChallenge) {
      setCode(activeChallenge.starterCode[language] || activeChallenge.starterCode.javascript || '');
      setTimeLeft(600);
      setIsTimerRunning(true);
      setTestResults(null);
      setRunnerError(null);
      setShowRivalReplay(false);
    }
  }, [selectedChallengeId, language]);

  // Timer tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRunTests = async () => {
    if (!activeChallenge) return;
    setIsRunningTests(true);
    setRunnerError(null);

    try {
      const res = await api.runChallenge(activeChallenge.id, code, language);
      setTestResults(res.results || []);
      if (res.results && res.results.every((r: any) => r.passed)) {
        setSolvedSuccess(true);
        setAutoAdvanceCountdown(5);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setRunnerError(err.message || 'Execution failed. Check syntax and function signature.');
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleSubmit = async () => {
    if (!activeChallenge) return;
    setIsSubmitting(true);
    setRunnerError(null);

    try {
      const res = await api.submitChallenge(
        activeChallenge.id,
        code,
        language,
        600 - timeLeft
      );

      setTestResults(res.results || []);
      setRivalReplayData(res);
      setBattleWinner(res.userWon ? 'user' : 'gemini');

      if (res.userWon || (res.execution && res.execution.allPassed)) {
        setSolvedSuccess(true);
        setAutoAdvanceCountdown(5);
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.6 },
        });
        if (onAddXp) onAddXp(120, 'Bug Hunter Elite');
      }

      setSubmissionHistory((prev) => [
        {
          id: `sub-${Date.now()}`,
          timestamp: 'Just now',
          status: res.userWon ? 'Victory (All Passed)' : 'Gemini Outpaced Solution',
          timeTaken: formatTime(600 - timeLeft),
          xpAwarded: res.userWon ? 120 : 30,
        },
        ...prev,
      ]);

      if (onRefreshStats) onRefreshStats();
      setShowRivalReplay(true);
    } catch (err: any) {
      setRunnerError(err.message || 'Submission failed. Ensure code conforms to entry function.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activeChallenge) {
    return (
      <div className="py-16 text-center text-slate-500 text-xs">
        Loading coding challenges...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-100">
      {/* Challenge Solved Celebration & Auto-Advance Banner */}
      {solvedSuccess && (
        <div className="bg-gradient-to-r from-emerald-950/90 via-cyan-950/80 to-blue-950/90 border-2 border-emerald-500/60 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Trophy className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">Challenge Solved! +120 XP Awarded</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  All Tests Passed
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {autoAdvanceCountdown !== null
                  ? `Loading next coding challenge in ${autoAdvanceCountdown}s...`
                  : 'Ready for the next coding challenge!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {autoAdvanceCountdown !== null && (
              <button
                onClick={() => setAutoAdvanceCountdown(null)}
                className="px-3 py-2 bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition"
              >
                Pause Auto-Advance
              </button>
            )}
            <button
              onClick={handleNextChallenge}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 transition transform hover:scale-105 active:scale-95"
            >
              <span>Next Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Problem Picker */}
      <div className="bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Debug Arena • Human vs Gemini
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Runner: Active (Isolated Node VM Sandbox)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            {activeChallenge.title}
          </h1>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedChallengeId}
            onChange={(e) => setSelectedChallengeId(e.target.value)}
            className="bg-[#080d1a] border border-slate-700 text-xs font-semibold text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
          >
            {challenges.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.difficulty}] {c.title}
              </option>
            ))}
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#080d1a] border border-slate-700 text-xs font-semibold text-cyan-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="javascript">JavaScript (Node VM)</option>
            <option value="python">Python 3</option>
          </select>

          {/* 10-Min Timer */}
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-sm font-bold border ${
              timeLeft < 120
                ? 'bg-rose-950/40 text-rose-400 border-rose-800/80 animate-pulse'
                : 'bg-[#080d1a] text-cyan-400 border-slate-700'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => {
              setCode(activeChallenge.starterCode[language] || '');
              setTimeLeft(600);
              setIsTimerRunning(true);
              setTestResults(null);
            }}
            title="Reset code & timer"
            className="p-2 rounded-xl bg-[#080d1a] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Opponent Banner */}
      <div className="bg-gradient-to-r from-[#0b1021] via-cyan-950/20 to-[#0b1021] border border-cyan-500/30 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Rival: Gemini 3.8 Flash</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Analyzing code logic, edge cases, and runtime complexity in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real test suite: {activeChallenge.testCases.length} public &amp; hidden cases</span>
        </div>
      </div>

      {/* Main Grid: File Explorer + Problem Spec + Monaco Editor + Test Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File Explorer & Problem Spec (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* File Explorer Bar */}
          <div className="bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center gap-1.5 pb-3 border-b border-slate-800 text-xs font-bold text-slate-400">
              <FolderTree className="w-4 h-4 text-cyan-400" />
              <span>Workspace Files</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-3">
              {[
                { id: 'solution', label: `solution.${language === 'python' ? 'py' : 'js'}`, icon: FileCode },
                { id: 'tests', label: 'test_cases.json', icon: Terminal },
                { id: 'spec', label: 'problem.md', icon: FileText },
                { id: 'history', label: 'history.log', icon: History },
              ].map((f) => {
                const Icon = f.icon;
                const isSelected = activeFile === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFile(f.id as any)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-mono font-semibold transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-sm'
                        : 'bg-[#080d1a] border border-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate w-full text-center">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Context view based on active file */}
          <div className="bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            {activeFile === 'spec' || activeFile === 'solution' ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Problem Description
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {activeChallenge.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeChallenge.description}
                </p>

                <div className="p-3.5 rounded-2xl bg-[#080d1a] border border-slate-800 text-xs space-y-1 font-mono">
                  <span className="font-bold text-slate-400 text-[11px] block">
                    Entry Function Signature:
                  </span>
                  <div className="text-cyan-300">{activeChallenge.entryFunction}()</div>
                </div>
              </>
            ) : activeFile === 'tests' ? (
              <div className="space-y-3 font-mono text-xs">
                <span className="font-bold text-white block">Test Case Specifications:</span>
                <div className="space-y-2">
                  {activeChallenge.testCases.map((tc: any) => (
                    <div
                      key={tc.id}
                      className="p-3 rounded-xl bg-[#080d1a] border border-slate-800 space-y-1"
                    >
                      <div className="text-cyan-300 text-[11px]">Case #{tc.id}</div>
                      <div className="text-slate-300 text-[11px]">Input: {JSON.stringify(tc.input)}</div>
                      <div className="text-slate-400 text-[11px]">
                        Expected: {tc.isHidden ? '[Hidden Test Value]' : JSON.stringify(tc.expected)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* History log */
              <div className="space-y-3 text-xs">
                <span className="font-bold text-white block">Submission Audit History:</span>
                <div className="space-y-2">
                  {submissionHistory.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl bg-[#080d1a] border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-emerald-400">{sub.status}</div>
                        <div className="text-[10px] text-slate-500">{sub.timestamp} • Time: {sub.timeTaken}</div>
                      </div>
                      <span className="font-bold text-cyan-300 text-xs">+{sub.xpAwarded} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Cases Quick Summary */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Verification Test Suite
              </span>

              <div className="space-y-1.5 font-mono text-xs">
                {activeChallenge.testCases.map((tc: any) => (
                  <div
                    key={tc.id}
                    className="p-2.5 rounded-xl bg-[#080d1a] border border-slate-800/80 flex items-center justify-between"
                  >
                    <span className="text-slate-300 text-[11px]">
                      Case #{tc.id}: {JSON.stringify(tc.input)}
                    </span>
                    {tc.isHidden ? (
                      <span className="text-[10px] text-purple-400 font-bold uppercase">Hidden</span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">= {JSON.stringify(tc.expected)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Monaco Editor & Output Console (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0b1021]/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Editor Bar */}
            <div className="bg-[#080d1a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-cyan-300 ml-2">
                  solution.{language === 'python' ? 'py' : 'js'}
                </span>
              </div>

              <button
                onClick={() => setCode(activeChallenge.starterCode[language] || '')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
              >
                Reset Starter Code
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="h-72 w-full bg-[#1e1e1e]">
              <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                value={code}
                onChange={(val) => setCode(val || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Action Bar */}
            <div className="bg-[#080d1a] px-4 py-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Isolated Sandbox Runner • {language.toUpperCase()}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunTests}
                  disabled={isRunningTests || isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isRunningTests ? 'Executing...' : 'Run Visible Tests'}</span>
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit Fix & Duel Gemini'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {runnerError && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5 shadow-lg">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Execution Exception:</span>
                <p className="font-mono text-[11px] leading-relaxed">{runnerError}</p>
              </div>
            </div>
          )}

          {/* Test Results Output Console */}
          {testResults && (
            <div className="bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Execution Console Results
                </span>

                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    testResults.every((t) => t.passed)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {testResults.filter((t) => t.passed).length} / {testResults.length} Tests Passed
                </span>
              </div>

              <div className="space-y-2">
                {testResults.map((tr) => (
                  <div
                    key={tr.id}
                    className={`p-3 rounded-2xl border text-xs font-mono flex items-center justify-between ${
                      tr.passed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {tr.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span>Test Case #{tr.id}</span>
                      {tr.error && (
                        <span className="text-[10px] text-rose-400 font-sans">({tr.error})</span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>Expected: {JSON.stringify(tr.expected)}</span>
                      <span>Output: {JSON.stringify(tr.actual)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {testResults.every((t) => t.passed) && (
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    All test assertions verified!
                  </span>
                  <button
                    onClick={handleNextChallenge}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition transform hover:scale-105"
                  >
                    <span>Next Challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Rival Replay / Gemini Duel Summary */}
          {showRivalReplay && rivalReplayData && (
            <div className="bg-[#0b1021]/90 border border-purple-500/40 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Duel Results Breakdown: Gemini vs You
                </span>

                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    battleWinner === 'user'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {battleWinner === 'user' ? '🏆 Victory: You Won' : '🤖 Gemini Outpaced'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#080d1a] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {rivalReplayData.geminiExplanation || activeChallenge.geminiExplanation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
