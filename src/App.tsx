import React, { useState } from 'react';
import { LampLogin } from './components/LampLogin.js';
import { OnboardingFlow } from './components/OnboardingFlow.js';
import { RoleAssessment } from './components/RoleAssessment.js';
import { SkillGapRoadmap } from './components/SkillGapRoadmap.js';
import { MainDashboard } from './components/MainDashboard.js';
import { DebugArena } from './components/DebugArena.js';
import { InterviewPractice } from './components/InterviewPractice.js';
import { AiCareerCoach } from './components/AiCareerCoach.js';
import { ProgressAnalytics } from './components/ProgressAnalytics.js';
import { AppNavbar } from './components/AppNavbar.js';
import {
  UserCareerProfile,
  CareerField,
  TargetCompany,
  ExperienceLevel,
  RoadmapSkill,
} from './types.js';
import { generateTailoredRoadmap } from './data/mockData.js';

type AppStep = 'login' | 'onboarding' | 'assessment' | 'roadmap_reveal' | 'dashboard';

export default function App() {
  const [appStep, setAppStep] = useState<AppStep>('login');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // User state
  const [user, setUser] = useState<UserCareerProfile>({
    name: 'Rahul Sharma',
    email: 'rahul.ece@college.edu',
    field: 'Software Development',
    company: 'Google',
    role: 'Software Development Engineer I',
    experienceLevel: 'Intermediate',
    xp: 450,
    streak: 5,
    level: 2,
    badges: ['Orientation Pioneer', 'Assessment Verified', '3-Day Streak'],
    assessmentCompleted: false,
  });

  // Roadmap skills state
  const [roadmapSkills, setRoadmapSkills] = useState<RoadmapSkill[]>(() =>
    generateTailoredRoadmap(
      'Software Development',
      'Google',
      'Software Development Engineer I',
      ['Two-Pointer Technique', 'Algorithmic Complexity & Big-O'],
      ['Distributed Caching & Concurrency', 'SOLID Principles']
    )
  );

  // 1. Lamp Login completion -> Onboarding
  const handleLoginSuccess = (email: string, name: string) => {
    setUser((prev) => ({
      ...prev,
      email,
      name,
    }));
    setAppStep('onboarding');
  };

  // 2. Onboarding completion -> Role Assessment
  const handleOnboardingComplete = (data: {
    field: CareerField;
    company: TargetCompany;
    role: string;
    experienceLevel: ExperienceLevel;
  }) => {
    setUser((prev) => ({
      ...prev,
      field: data.field,
      company: data.company,
      role: data.role,
      experienceLevel: data.experienceLevel,
    }));
    setAppStep('assessment');
  };

  // 3. Assessment completion -> Skill-Gap Roadmap Reveal
  const handleAssessmentComplete = (scoreData: {
    correct: number;
    total: number;
    percentage: number;
    demonstratedSkills: string[];
    improvementSkills: string[];
  }) => {
    const updatedSkills = generateTailoredRoadmap(
      user.field,
      user.company,
      user.role,
      scoreData.demonstratedSkills,
      scoreData.improvementSkills
    );

    setRoadmapSkills(updatedSkills);

    setUser((prev) => ({
      ...prev,
      assessmentCompleted: true,
      assessmentScore: scoreData,
      xp: prev.xp + scoreData.correct * 40,
    }));

    setAppStep('roadmap_reveal');
  };

  // Add XP from Arena / Interview practice
  const handleAddXp = (amount: number, badgeAwarded?: string) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 350) + 1;
      const updatedBadges = [...prev.badges];
      if (badgeAwarded && !updatedBadges.includes(badgeAwarded)) {
        updatedBadges.push(badgeAwarded);
      }
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        badges: updatedBadges,
      };
    });
  };

  // Toggle skill completion in roadmap
  const handleSkillToggle = (skillId: string, completed: boolean) => {
    setRoadmapSkills((prev) =>
      prev.map((s) => (s.id === skillId ? { ...s, completed, progress: completed ? 100 : 35 } : s))
    );
    if (completed) {
      handleAddXp(100, 'Milestone Mastered');
    }
  };

  const handleLogout = () => {
    setAppStep('login');
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans">
      {/* 1. First Screen: Lamp Login */}
      {appStep === 'login' && <LampLogin onLoginSuccess={handleLoginSuccess} />}

      {/* 2. Onboarding Flow */}
      {appStep === 'onboarding' && (
        <OnboardingFlow
          userName={user.name}
          onComplete={handleOnboardingComplete}
          onLogout={handleLogout}
        />
      )}

      {/* 3. Role-Specific Assessment */}
      {appStep === 'assessment' && (
        <RoleAssessment
          field={user.field}
          company={user.company}
          role={user.role}
          onCompleteAssessment={handleAssessmentComplete}
          onBackToOnboarding={() => setAppStep('onboarding')}
        />
      )}

      {/* 4. Initial Roadmap Reveal after Assessment */}
      {appStep === 'roadmap_reveal' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <SkillGapRoadmap
            field={user.field}
            company={user.company}
            role={user.role}
            skills={roadmapSkills}
            assessmentScore={user.assessmentScore}
            onProceedToDashboard={() => {
              setAppStep('dashboard');
              setCurrentTab('dashboard');
            }}
            onSkillToggle={handleSkillToggle}
            onJumpToArena={() => {
              setAppStep('dashboard');
              setCurrentTab('arena');
            }}
          />
        </div>
      )}

      {/* 5. Main Dashboard Experience (with top navbar and tab switcher) */}
      {appStep === 'dashboard' && (
        <>
          <AppNavbar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            user={user}
            onRetakeOnboarding={() => setAppStep('onboarding')}
            onLogout={handleLogout}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {currentTab === 'dashboard' && (
              <MainDashboard
                user={user}
                skills={roadmapSkills}
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentTab === 'roadmap' && (
              <SkillGapRoadmap
                field={user.field}
                company={user.company}
                role={user.role}
                skills={roadmapSkills}
                assessmentScore={user.assessmentScore}
                onProceedToDashboard={() => setCurrentTab('dashboard')}
                onSkillToggle={handleSkillToggle}
                onJumpToArena={() => setCurrentTab('arena')}
              />
            )}

            {currentTab === 'arena' && <DebugArena onAddXp={handleAddXp} />}

            {currentTab === 'interview' && (
              <InterviewPractice
                userCompany={user.company}
                userRole={user.role}
                onAddXp={handleAddXp}
              />
            )}

            {currentTab === 'coach' && <AiCareerCoach user={user} />}

            {currentTab === 'analytics' && (
              <ProgressAnalytics user={user} skills={roadmapSkills} />
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-900 bg-[#06070a] py-6 text-center text-xs text-slate-500 mt-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-slate-400">
                Ease Career • Cinematic Lamp Orientation to Placement Mastery
              </span>
              <span className="text-slate-500">
                Calibrated for {user.company} ({user.role})
              </span>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
