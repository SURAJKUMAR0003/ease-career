import React, { useState } from 'react';
import {
  Code2,
  BrainCircuit,
  Database,
  Cpu,
  TerminalSquare,
  Cloud,
  Layout,
  Server,
  Palette,
  Briefcase,
  ChevronLeft,
  Check,
  Target,
  GraduationCap,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CareerField, TargetCompany, ExperienceLevel } from '../types.js';
import { CAREER_FIELDS, TARGET_COMPANIES } from '../data/mockData.js';
import { api } from '../services/api.js';

interface OnboardingFlowProps {
  userName: string;
  onComplete: (data: {
    field: CareerField;
    company: TargetCompany;
    role: string;
    experienceLevel: ExperienceLevel;
  }) => void;
  onLogout: () => void;
}

const COMPANY_ROLES_MAP: Record<string, string[]> = {
  Google: ['Software Engineer', 'Data Analyst', 'UX Designer'],
  Amazon: ['Software Development Engineer', 'Data Engineer', 'Product Manager'],
  Microsoft: ['Software Engineer', 'Data Scientist', 'Cloud/Azure Engineer'],
  NVIDIA: ['GPU/Systems Software Engineer', 'AI/ML Engineer', 'Embedded/Firmware Engineer'],
  Adobe: ['Frontend Engineer', 'Backend Engineer', 'Machine Learning Engineer'],
  Other: ['Full-Stack Developer', 'DevOps Engineer', 'Core Systems Engineer'],
};

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  userName,
  onComplete,
  onLogout,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Selections
  const [field, setField] = useState<CareerField>('Software Development');
  const [company, setCompany] = useState<TargetCompany>('Google');
  const [role, setRole] = useState<string>('Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Intermediate');

  // Step 5: Preferences
  const [preferredLanguage, setPreferredLanguage] = useState<string>('JavaScript');
  const [studyHours, setStudyHours] = useState<number>(2);
  const [timelineWeeks, setTimelineWeeks] = useState<number>(12);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Available roles for chosen company
  const availableRoles = COMPANY_ROLES_MAP[company] || COMPANY_ROLES_MAP['Google'];

  const handleNext = async () => {
    if (step < 5) {
      if (step === 2) {
        // adjust default role when company changes
        const rolesForCo = COMPANY_ROLES_MAP[company] || COMPANY_ROLES_MAP['Google'];
        setRole(rolesForCo[0]);
      }
      setStep((prev) => (prev + 1) as any);
    } else {
      setIsSubmitting(true);
      try {
        await api.saveOnboarding({
          field,
          company,
          role,
          experienceLevel,
          preferredLanguage,
          studyHoursPerDay: studyHours,
          targetTimelineWeeks: timelineWeeks,
        });
        onComplete({
          field,
          company,
          role,
          experienceLevel,
        });
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as any);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            EC
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white">
              Ease Career
            </span>
            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
              Orientation • Step {step} of 5
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                step === s
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : step > s
                  ? 'bg-slate-800 text-amber-400 border border-amber-400/40'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {step > s ? '✓' : s}
            </div>
          ))}
          <button
            onClick={onLogout}
            className="text-xs text-slate-500 hover:text-slate-300 ml-4 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Step Container */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8">
        {/* STEP 1: Career Field */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Step 1 • Career Field
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                What field do you want to build your career in, {userName.split(' ')[0]}?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Choose the primary engineering domain you are preparing for.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {CAREER_FIELDS.map((f) => {
                const isSelected = field === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setField(f.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-900 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{f.title}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 text-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                        {f.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Target Company */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Step 2 • Target Company
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Which company are you targeting?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Choose your dream company. Roadmaps and questions will align with their hiring rubrics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {['Google', 'Amazon', 'Microsoft', 'NVIDIA', 'Adobe'].map((co) => {
                const isSelected = company === co;
                return (
                  <div
                    key={co}
                    onClick={() => setCompany(co as TargetCompany)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-900 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-white">{co}</h3>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 text-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {co === 'Google' && 'Planetary-scale systems, algorithms, clean code.'}
                        {co === 'Amazon' && 'Customer Obsession, AWS scalability, OOP design.'}
                        {co === 'Microsoft' && 'Azure cloud, scalable full-stack, enterprise services.'}
                        {co === 'NVIDIA' && 'CUDA, GPU acceleration, C++, low-level firmware.'}
                        {co === 'Adobe' && 'Creative Cloud, graphics rendering, high performance.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Target Role */}
        {step === 3 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Step 3 • Target Role
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Select your target job role at {company}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                These roles represent active hiring tracks at {company}.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {availableRoles.map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md font-bold'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-sm">{r}</span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Current Experience Level */}
        {step === 4 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Step 4 • Current Experience Level
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                How would you rate your current skill level?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                We use this to calibrate the starting difficulty of your skill assessment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'Beginner', desc: 'Starting from scratch; learning basic programming' },
                { id: 'Basic knowledge', desc: 'Comfortable with language syntax and standard libraries' },
                { id: 'Intermediate', desc: 'Can solve standard data structures & algorithm problems' },
                { id: 'Advanced', desc: 'Looking for system design, edge-case tuning, and mock polish' },
              ].map((lvl) => {
                const isSelected = experienceLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExperienceLevel(lvl.id as ExperienceLevel)}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-1 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-md'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                      {lvl.id}
                    </div>
                    <p className="text-xs text-slate-400">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Learning Preferences */}
        {step === 5 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Step 5 • Study Schedule &amp; Preferences
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Customize your preparation pace
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                We calibrate your personalized roadmap milestones based on your available study time.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Preferred Programming Language</label>
                <div className="grid grid-cols-3 gap-2">
                  {['JavaScript', 'Python', 'C++'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setPreferredLanguage(lang)}
                      className={`py-2 rounded-xl border text-xs font-semibold ${
                        preferredLanguage === lang
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Daily Available Study Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 4].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setStudyHours(hrs)}
                      className={`py-2 rounded-xl border text-xs font-semibold ${
                        studyHours === hrs
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {hrs} hour{hrs > 1 ? 's' : ''} / day
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Target Preparation Timeline</label>
                <div className="grid grid-cols-3 gap-2">
                  {[4, 12, 24].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setTimelineWeeks(w)}
                      className={`py-2 rounded-xl border text-xs font-semibold ${
                        timelineWeeks === w
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {w} weeks
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Controls */}
      <footer className="max-w-5xl w-full mx-auto pt-6 border-t border-slate-800/80 flex items-center justify-between">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <span>{step === 5 ? (isSubmitting ? 'Saving...' : 'Begin Scored Assessment') : 'Continue'}</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </footer>
    </div>
  );
};
