import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Sparkles,
  AlertCircle,
  Target,
} from 'lucide-react';
import { api } from '../services/api.js';

interface RoleAssessmentProps {
  field?: string;
  company?: string;
  role?: string;
  onCompleteAssessment: (attemptData: any) => void;
  onBackToOnboarding: () => void;
}

export const RoleAssessment: React.FC<RoleAssessmentProps> = ({
  field,
  company,
  role,
  onCompleteAssessment,
  onBackToOnboarding,
}) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [roleTitle, setRoleTitle] = useState<string>(role || 'Software Engineer');
  const [companyName, setCompanyName] = useState<string>(company || 'Google');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    api.getAssessmentQuestions()
      .then((data) => {
        setQuestions(data.questions || []);
        if (data.role) setRoleTitle(data.role);
        if (data.company) setCompanyName(data.company);
      })
      .catch((err) => {
        setErrorMessage(err.message || 'Failed to load assessment questions.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  const handleSelectOption = (optionIdx: number) => {
    if (!currentQ) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsReviewMode(true);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await api.submitAssessment(selectedAnswers);
      const attempt = result.attempt || {};
      const correct = attempt.score ?? Object.keys(selectedAnswers).length;
      const total = attempt.totalQuestions ?? (questions.length || 5);
      const percentage = attempt.percentage ?? Math.round((correct / (total || 1)) * 100);
      onCompleteAssessment({
        correct,
        total,
        percentage,
        demonstratedSkills: attempt.demonstratedSkills || ['Core Language Syntax', 'Problem Decomposition'],
        improvementSkills: attempt.improvementSkills || ['High-Throughput Systems', 'Algorithmic Complexity'],
        ...attempt,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit assessment.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090d] text-slate-100 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading role-calibrated questions for {roleTitle} at {companyName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Banner */}
      <header className="max-w-4xl w-full mx-auto pb-6 border-b border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Role-Specific Technical Assessment
            </span>
            <span className="text-xs text-slate-400">• Calibrated for {companyName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {roleTitle} Readiness Diagnostic
          </h1>
        </div>

        <button
          onClick={onBackToOnboarding}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Change Role Target
        </button>
      </header>

      {/* Main Assessment Container */}
      <main className="max-w-3xl w-full mx-auto my-auto py-8 space-y-6">
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Progress Bar & Jump Pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span className="text-amber-400 font-bold">{progressPercent}% Answered</span>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {questions.map((q, i) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = currentIdx === i;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setIsReviewMode(false);
                    setCurrentIdx(i);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all border ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md'
                      : isAnswered
                      ? 'bg-slate-800 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question View or Review View */}
        {!isReviewMode && currentQ ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {currentQ.skill} • {currentQ.topic}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Difficulty: {currentQ.difficulty}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {currentQ.codeSnippet && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-amber-200 overflow-x-auto">
                <pre>{currentQ.codeSnippet}</pre>
              </div>
            )}

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt: string, optIdx: number) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border-amber-400 text-white font-semibold shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs border ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-400'
                            : 'bg-slate-800 text-slate-400 border-slate-700 group-hover:text-white'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400'
                          : 'border-slate-700 group-hover:border-slate-500'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Review Mode before final submission */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                Assessment Summary &amp; Review
              </h2>
              <p className="text-xs text-slate-400">
                You have answered {answeredCount} of {questions.length} questions. Responses will be scored on the server to construct your exact skill-gap roadmap.
              </p>
            </div>

            <div className="divide-y divide-slate-800/80 border-y border-slate-800">
              {questions.map((q, idx) => {
                const chosen = selectedAnswers[q.id];
                const isAnswered = chosen !== undefined;
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setIsReviewMode(false);
                      setCurrentIdx(idx);
                    }}
                    className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white">
                        Q{idx + 1}. {q.skill} ({q.topic})
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-md">
                        {isAnswered ? `Selected Option: ${String.fromCharCode(65 + chosen)}` : 'Unanswered'}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAnswered
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isAnswered ? 'Answered' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Scores are calculated strictly from your answers and permanently stored in your account history.
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Footer Controls */}
      <footer className="max-w-4xl w-full mx-auto pt-6 border-t border-slate-800 flex items-center justify-between">
        {!isReviewMode ? (
          <>
            <button
              onClick={handlePrevious}
              disabled={currentIdx === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReviewMode(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                Review All
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md transition-all"
              >
                <span>{currentIdx === questions.length - 1 ? 'Go to Review' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsReviewMode(false)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Questions</span>
            </button>

            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Evaluating...' : 'Submit & Generate Roadmap'}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </>
        )}
      </footer>
    </div>
  );
};
