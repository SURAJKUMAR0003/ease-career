import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Lock,
  Mail,
  User,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { api } from '../services/api.js';

interface LampLoginProps {
  onAuthSuccess?: (userData: any) => void;
  onLoginSuccess?: (email: string, name: string) => void;
}

export const LampLogin: React.FC<LampLoginProps> = ({ onAuthSuccess, onLoginSuccess }) => {
  const notifySuccess = (data: any, fallbackEmail?: string, fallbackName?: string) => {
    if (onAuthSuccess) onAuthSuccess(data);
    if (onLoginSuccess) {
      const em = data?.user?.email || fallbackEmail || email || 'student@easecareer.com';
      const nm = data?.user?.name || fallbackName || name || 'Aspiring Engineer';
      onLoginSuccess(em, nm);
    }
  };
  const [isLampOn, setIsLampOn] = useState<boolean>(true);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  // Form Fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [resetStep, setResetStep] = useState<'request' | 'submit'>('request');

  const fireflies = [
    { id: 1, top: '24%', left: '32%', delay: '0s', duration: '6s', size: 6 },
    { id: 2, top: '40%', left: '42%', delay: '1.2s', duration: '7.5s', size: 4 },
    { id: 3, top: '55%', left: '36%', delay: '2.5s', duration: '5.8s', size: 7 },
    { id: 4, top: '35%', left: '48%', delay: '0.8s', duration: '8s', size: 5 },
    { id: 5, top: '65%', left: '44%', delay: '3.1s', duration: '6.4s', size: 4 },
    { id: 6, top: '20%', left: '40%', delay: '1.8s', duration: '7s', size: 5 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (isSignUp) {
      if (!name.trim()) return setErrorMessage('Please enter your full name.');
      if (password !== confirmPassword) return setErrorMessage('Passwords do not match.');
      if (!termsAccepted) return setErrorMessage('You must accept the terms of service.');

      setIsLoading(true);
      try {
        const data = await api.register(name, email, password);
        notifySuccess(data, email, name);
      } catch (err: any) {
        setErrorMessage(err.message || 'Registration failed.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        const data = await api.login(email, password);
        notifySuccess(data, email, name);
      } catch (err: any) {
        setErrorMessage(err.message || 'Invalid email or password.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuickDemoFill = async () => {
    setName('Rahul Sharma');
    setEmail('rahul.ece@college.edu');
    setPassword('password123');
    setConfirmPassword('password123');
    setErrorMessage(null);

    // Auto-login or register demo account
    setIsLoading(true);
    try {
      try {
        const data = await api.login('rahul.ece@college.edu', 'password123');
        notifySuccess(data, 'rahul.ece@college.edu', 'Rahul Sharma');
      } catch {
        // If not registered yet, auto-register
        const data = await api.register('Rahul Sharma', 'rahul.ece@college.edu', 'password123');
        notifySuccess(data, 'rahul.ece@college.edu', 'Rahul Sharma');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.forgotPassword(forgotEmail);
      if (res.demoToken) {
        setResetToken(res.demoToken);
      }
      setResetStep('submit');
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.resetPassword(forgotEmail, resetToken, newPassword);
      setSuccessMessage('Password reset successfully! Please sign in with your new password.');
      setShowForgotModal(false);
      setResetStep('request');
      setPassword(newPassword);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden select-none font-sans">
      {/* Dynamic Warm Ambient Light Layer when Lamp is ON */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-in-out ${
          isLampOn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Lamp Bulb Origin Glow */}
        <div className="absolute top-[18%] left-[20%] sm:left-[24%] w-[380px] h-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-400/35 via-yellow-500/20 to-transparent blur-[80px]" />

        {/* Golden Light Cone illuminating the center-right desk */}
        <div
          className="absolute top-[18%] left-[22%] sm:left-[26%] w-[1000px] h-[850px] opacity-70 blur-[90px]"
          style={{
            background:
              'radial-gradient(circle at 10% 20%, rgba(251, 191, 36, 0.45) 0%, rgba(245, 158, 11, 0.22) 35%, rgba(217, 119, 6, 0.08) 65%, transparent 85%)',
          }}
        />

        {/* Warm desk surface floor bounce */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-amber-500/10 via-amber-600/5 to-transparent blur-2xl" />
      </div>

      {/* Floating Animated Fireflies */}
      {isLampOn && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {fireflies.map((ff) => (
            <div
              key={ff.id}
              className="absolute rounded-full bg-amber-300 shadow-[0_0_12px_#fbbf24] animate-pulse"
              style={{
                top: ff.top,
                left: ff.left,
                width: `${ff.size}px`,
                height: `${ff.size}px`,
                animationDelay: ff.delay,
                animationDuration: ff.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Grid Container */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-20">
        {/* Left Column: Cinematic Desk Lamp Art & Interactive Switch */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[320px] sm:min-h-[440px]">
          <div className="relative w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center">
            {/* Interactive Switch Pill above the lamp */}
            <div className="mb-4 z-30">
              <button
                type="button"
                onClick={() => setIsLampOn(!isLampOn)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-lg border ${
                  isLampOn
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-amber-500/20 hover:bg-amber-500/30'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Lightbulb className={`w-3.5 h-3.5 ${isLampOn ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                <span>{isLampOn ? 'Desk Lamp: ON (Click to Dim)' : 'Desk Lamp: OFF (Click to Light)'}</span>
              </button>
            </div>

            {/* Architectural SVG Desk Lamp */}
            <div className="relative w-72 sm:w-84 h-80 sm:h-96">
              <svg
                viewBox="0 0 320 360"
                className="w-full h-full drop-shadow-2xl overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Desk Base Oval */}
                <ellipse cx="110" cy="335" rx="58" ry="14" fill="#131722" stroke="#2a3346" strokeWidth="2.5" />
                <ellipse cx="110" cy="332" rx="46" ry="10" fill="#1c2333" />
                <circle
                  cx="110"
                  cy="325"
                  r="9"
                  fill="#2e384d"
                  stroke="#fbbf24"
                  strokeWidth={isLampOn ? '2' : '0.5'}
                  className="cursor-pointer"
                  onClick={() => setIsLampOn(!isLampOn)}
                />

                {/* Lower Arm */}
                <line x1="110" y1="325" x2="145" y2="195" stroke="#374151" strokeWidth="9" strokeLinecap="round" />
                <line x1="110" y1="325" x2="145" y2="195" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />

                {/* Middle Articulated Joint */}
                <circle cx="145" cy="195" r="11" fill="#1f2937" stroke="#4b5563" strokeWidth="2.5" />
                <circle cx="145" cy="195" r="5" fill="#fbbf24" opacity={isLampOn ? 0.9 : 0.3} />

                {/* Upper Arm */}
                <line x1="145" y1="195" x2="215" y2="105" stroke="#374151" strokeWidth="8" strokeLinecap="round" />
                <line x1="145" y1="195" x2="215" y2="105" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />

                {/* Lamp Neck */}
                <circle cx="215" cy="105" r="10" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />

                {/* Lamp Shade Head */}
                <path d="M195 95 L260 70 L285 130 L210 145 Z" fill="#181e2b" stroke="#333f56" strokeWidth="2.5" />
                <path
                  d="M210 145 L285 130 C275 140 230 155 210 145 Z"
                  fill={isLampOn ? '#fbbf24' : '#2b3445'}
                  opacity={isLampOn ? 0.95 : 0.5}
                />

                {/* Glowing Bulb */}
                {isLampOn ? (
                  <g>
                    <circle cx="245" cy="135" r="14" fill="#fffbeb" filter="drop-shadow(0px 0px 18px #fbbf24)" />
                    <circle cx="245" cy="135" r="8" fill="#fef08a" />
                  </g>
                ) : (
                  <circle cx="245" cy="135" r="9" fill="#475569" opacity="0.6" />
                )}

                {/* Pull-Cord Switch */}
                <line x1="225" y1="140" x2="228" y2="175" stroke="#6b7280" strokeWidth="2" strokeDasharray="3 3" />
                <circle
                  cx="228"
                  cy="178"
                  r="5"
                  fill={isLampOn ? '#fbbf24' : '#4b5563'}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setIsLampOn(!isLampOn)}
                />
              </svg>

              {/* Light Cone projecting right */}
              {isLampOn && (
                <div
                  className="absolute top-[35%] left-[72%] w-[420px] h-[360px] pointer-events-none opacity-60 mix-blend-screen transition-opacity duration-700"
                  style={{
                    background:
                      'radial-gradient(ellipse at 0% 0%, rgba(254, 240, 138, 0.45) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 75%)',
                    transform: 'rotate(15deg)',
                  }}
                />
              )}
            </div>

            {/* Atmosphere copy */}
            <div className="text-center mt-2 space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-300/80">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ease Career • Real Placement Preparation</span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs">
                From initial assessment to your dream offer at Google, NVIDIA, Amazon, Microsoft &amp; Adobe.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Translucent Glass Card */}
        <div className="lg:col-span-6 relative z-30">
          <div
            className={`rounded-3xl p-6 sm:p-9 transition-all duration-700 border backdrop-blur-xl shadow-2xl relative overflow-hidden ${
              isLampOn
                ? 'bg-slate-900/80 border-amber-500/30 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.15)]'
                : 'bg-slate-900/60 border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

            {/* Header */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {isSignUp ? 'Create Real Account' : 'Welcome Back'}
                </span>
                <span className="text-[11px] text-slate-400">Database-Backed Auth</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {isSignUp ? 'Join Ease Career' : 'Sign In to Your Workspace'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {isSignUp
                  ? 'Create your account to start calibrated assessments and track your roadmap.'
                  : 'Resume your personalized skill-gap roadmap, practice challenges, and mock loops.'}
              </p>
            </div>

            {/* Alerts */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setShowForgotModal(true);
                      }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer">
                      I agree to the Terms of Service &amp; Privacy Policy
                    </label>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              {/* One-Click Quick Demo User Setup */}
              <button
                type="button"
                onClick={handleQuickDemoFill}
                disabled={isLoading}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>One-Click Demo Account (Rahul Sharma • ECE)</span>
              </button>
            </form>

            {/* Switch Sign In / Sign Up */}
            <div className="mt-5 text-center text-xs text-slate-400">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setErrorMessage(null);
                    }}
                    className="text-amber-400 font-semibold hover:underline ml-1"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setErrorMessage(null);
                    }}
                    className="text-amber-400 font-semibold hover:underline ml-1"
                  >
                    Sign Up for Free
                  </button>
                </>
              )}
            </div>

            {/* Note */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Real Password Hashing with Bcrypt &amp; Secure JWT Storage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              Reset Your Password
            </h3>

            {resetStep === 'request' ? (
              <form onSubmit={handleForgotPasswordRequest} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Enter your registered email address to receive a secure password reset token.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  required
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
                  >
                    Generate Token
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Enter the verification token and your new password.
                </p>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Reset Token</label>
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="e.g. 8AB12C"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
