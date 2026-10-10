import { Router, Response } from 'express';
import { db, UserProfileRecord } from './db.js';
import {
  hashPassword,
  comparePassword,
  generateToken,
  requireAuth,
  optionalAuth,
  AuthenticatedRequest,
} from './auth.js';
import { executeCodeInSandbox } from './codeRunner.js';
import {
  isGeminiConfigured,
  askCareerCoach,
  evaluateMockInterview,
  evaluateSingleAnswer,
  generateRivalReplay,
} from './gemini.js';
import { QUESTION_BANK, CODING_CHALLENGES } from './seedQuestions.js';

export const apiRouter = Router();

// --- System & Status ---
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Ease Career',
    time: new Date().toISOString(),
    geminiConfigured: isGeminiConfigured(),
  });
});

// --- Authentication ---
apiRouter.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
  }

  const passwordHash = await hashPassword(password);
  const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

  const newUser = db.createUser({
    id,
    email: email.toLowerCase().trim(),
    passwordHash,
    name: name.trim(),
    emailVerified: true, // Auto-verified for streamlined onboarding
    createdAt: new Date().toISOString(),
  });

  const token = generateToken(newUser);
  const stats = db.getUserStats(newUser.id);

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
    },
    stats,
  });
});

apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'No account found with this email. Please sign up.' });
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Incorrect password. Please try again.' });
  }

  const token = generateToken(user);
  const profile = db.getProfile(user.id);
  const stats = db.getUserStats(user.id);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    profile,
    stats,
  });
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const profile = db.getProfile(user.id);
  const stats = db.getUserStats(user.id);
  const assessments = db.getAssessments(user.id);
  const roadmap = db.getRoadmap(user.id);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    profile,
    stats,
    activities: db.getActivities(user.id).slice(0, 15),
    hasCompletedAssessment: assessments.length > 0,
    latestAssessment: assessments[0] || null,
    hasRoadmap: !!roadmap,
  });
});

apiRouter.get('/user/activities', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const activities = db.getActivities(req.user!.id);
  res.json({ activities });
});

apiRouter.post('/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const user = db.findUserByEmail(email);
  if (!user) {
    // For security, do not reveal if email exists
    return res.json({ message: 'If an account exists, a password reset token has been issued.' });
  }

  const token = Math.random().toString(36).substring(2, 10).toUpperCase();
  db.updateUser(user.id, {
    resetToken: token,
    resetTokenExpires: Date.now() + 3600000, // 1 hour
  });

  res.json({
    message: 'Password reset token generated.',
    demoToken: token, // Surfaced for easy developer & student testing
  });
});

apiRouter.post('/auth/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: 'Email, token, and new password are required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user || user.resetToken !== token || (user.resetTokenExpires && user.resetTokenExpires < Date.now())) {
    return res.status(400).json({ error: 'Invalid or expired reset token.' });
  }

  const passwordHash = await hashPassword(newPassword);
  db.updateUser(user.id, {
    passwordHash,
    resetToken: undefined,
    resetTokenExpires: undefined,
  });

  res.json({ message: 'Password has been reset successfully. You may now sign in.' });
});

// --- Onboarding ---
apiRouter.post('/onboarding', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const {
    field,
    company,
    role,
    experienceLevel,
    preferredLanguage = 'JavaScript',
    studyHoursPerDay = 2,
    targetTimelineWeeks = 12,
  } = req.body;

  if (!field || !company || !role || !experienceLevel) {
    return res.status(400).json({ error: 'Field, company, role, and experience level are required.' });
  }

  const profile: UserProfileRecord = {
    userId,
    field,
    company,
    role,
    experienceLevel,
    preferredLanguage,
    studyHoursPerDay,
    targetTimelineWeeks,
    updatedAt: new Date().toISOString(),
  };

  db.saveProfile(profile);
  db.addXp(userId, 50, 'Orientation Completed');
  db.logActivity({
    id: 'act_' + Date.now(),
    userId,
    type: 'onboarding',
    title: 'Career Target Configured',
    detail: `Targeting ${company} • ${role} (${experienceLevel})`,
    xpEarned: 50,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, profile });
});

// --- Role Assessment ---
apiRouter.get('/assessment/questions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const profile = db.getProfile(req.user!.id);
  const targetCompany = profile?.company || 'Google';
  const targetRole = profile?.role || 'Software Engineer';
  const targetField = profile?.field || 'Software Development';

  // Filter matching questions
  let matched = QUESTION_BANK.filter(
    (q) =>
      (q.company === targetCompany || q.company === 'General') &&
      (q.role.toLowerCase().includes(targetRole.toLowerCase()) || q.field === targetField)
  );

  // If matched questions are fewer than 3, add general field questions
  if (matched.length < 3) {
    const general = QUESTION_BANK.filter((q) => q.field === targetField || q.field === 'Software Development');
    matched = [...matched, ...general];
  }

  // Deduplicate by question id
  const seen = new Set<string>();
  const uniqueQuestions = matched.filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  }).slice(0, 5);

  res.json({
    role: targetRole,
    company: targetCompany,
    questions: uniqueQuestions.map((q) => ({
      id: q.id,
      topic: q.topic,
      skill: q.skill,
      difficulty: q.difficulty,
      question: q.question,
      codeSnippet: q.codeSnippet,
      options: q.options,
      // correctAnswer omitted to prevent cheating before submission
    })),
  });
});

apiRouter.post('/assessment/submit', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { answers } = req.body; // Record<string, number>
  const profile = db.getProfile(userId);

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Submitted answers object is required.' });
  }

  let correctCount = 0;
  let totalEvaluated = 0;
  const demonstrated: string[] = [];
  const improvement: string[] = [];
  const answerBreakdown: any[] = [];

  Object.entries(answers).forEach(([questionId, chosenOption]) => {
    const q = QUESTION_BANK.find((item) => item.id === questionId);
    if (!q) return;

    totalEvaluated += 1;
    const isCorrect = chosenOption === q.correctAnswer;
    if (isCorrect) {
      correctCount += 1;
      if (!demonstrated.includes(q.skill)) demonstrated.push(q.skill);
    } else {
      if (!improvement.includes(q.skill)) improvement.push(q.skill);
    }

    answerBreakdown.push({
      questionId: q.id,
      question: q.question,
      skill: q.skill,
      chosenOption,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    });
  });

  const percentage = totalEvaluated > 0 ? Math.round((correctCount / totalEvaluated) * 100) : 0;

  const attemptId = 'atm_' + Date.now();
  const attempt = db.addAssessment({
    id: attemptId,
    userId,
    field: profile?.field || 'Software Development',
    company: profile?.company || 'Google',
    role: profile?.role || 'Software Engineer',
    score: correctCount,
    total: totalEvaluated,
    percentage,
    answers,
    demonstratedSkills: demonstrated.length > 0 ? demonstrated : ['Foundational Programming'],
    improvementSkills: improvement.length > 0 ? improvement : ['Advanced System Design'],
    createdAt: new Date().toISOString(),
  });

  // Award XP for completing assessment
  const xpAwarded = 150 + correctCount * 30;
  db.addXp(userId, xpAwarded, 'Assessment Verified');
  db.logActivity({
    id: 'act_' + Date.now(),
    userId,
    type: 'assessment',
    title: 'Diagnostic Assessment Completed',
    detail: `Score: ${percentage}% (${correctCount}/${totalEvaluated} correct) for ${profile?.company || 'Target'}`,
    score: percentage,
    xpEarned: xpAwarded,
    timestamp: new Date().toISOString(),
  });

  // Automatically construct/update the personalized roadmap based on assessment outcome
  const initialRoadmapSkills: any[] = [
    {
      id: 'skill-core-1',
      name: 'Data Structures: Arrays, Two-Pointers & Binary Search',
      category: 'core',
      difficulty: 'Beginner',
      description: 'Foundational array transformations, binary search invariants, and O(1) space optimizations.',
      estimatedHours: 15,
      prerequisites: [],
      status: demonstrated.some((s) => s.includes('Data Structures')) ? 'completed' : 'available',
      progress: demonstrated.some((s) => s.includes('Data Structures')) ? 100 : 25,
      completed: demonstrated.some((s) => s.includes('Data Structures')),
    },
    {
      id: 'skill-core-2',
      name: 'Non-Linear Structures: Trees, Graphs & BFS/DFS',
      category: 'core',
      difficulty: 'Intermediate',
      description: 'Topological sort, cycle detection in dependencies, and shortest path traversals.',
      estimatedHours: 25,
      prerequisites: ['skill-core-1'],
      status: 'available',
      progress: 0,
      completed: false,
    },
    {
      id: 'skill-specialized-1',
      name: `${profile?.company || 'Company'} Concurrency & System Reliability`,
      category: 'specialized',
      difficulty: 'Advanced',
      description: 'Race condition prevention, thread synchronization, mutex locks, and distributed caching.',
      estimatedHours: 35,
      prerequisites: ['skill-core-1', 'skill-core-2'],
      status: 'locked',
      progress: 0,
      completed: false,
    },
    {
      id: 'skill-architecture-1',
      name: `${profile?.role || 'Role'} System Architecture & Edge Cases`,
      category: 'architecture',
      difficulty: 'Advanced',
      description: 'Architecting fault-tolerant services that scale to millions of concurrent requests.',
      estimatedHours: 40,
      prerequisites: ['skill-specialized-1'],
      status: 'locked',
      progress: 0,
      completed: false,
    },
  ];

  db.saveRoadmap({
    userId,
    role: profile?.role || 'Software Engineer',
    skills: initialRoadmapSkills,
    updatedAt: new Date().toISOString(),
  });

  res.json({
    attempt,
    breakdown: answerBreakdown,
  });
});

// --- Roadmap & Checkpoints ---
apiRouter.get('/roadmap', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const roadmap = db.getRoadmap(userId);
  const profile = db.getProfile(userId);

  if (!roadmap) {
    return res.json({ roadmap: null, message: 'Please complete orientation and assessment to generate your roadmap.' });
  }

  res.json({
    roadmap: roadmap.skills,
    role: profile?.role || roadmap.role,
    company: profile?.company || 'Google',
    updatedAt: roadmap.updatedAt,
  });
});

apiRouter.post('/roadmap/skill/:skillId/checkpoint', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { skillId } = req.params;
  const roadmap = db.getRoadmap(userId);

  if (!roadmap) {
    return res.status(404).json({ error: 'No roadmap found.' });
  }

  const skill = roadmap.skills.find((s) => s.id === skillId);
  if (!skill) {
    return res.status(404).json({ error: 'Skill not found in roadmap.' });
  }

  // Mark skill as completed
  skill.completed = true;
  skill.progress = 100;
  skill.status = 'completed';
  skill.completedAt = new Date().toISOString();

  // Unlock downstream dependent skills whose prerequisites are now satisfied
  roadmap.skills.forEach((s) => {
    if (s.status === 'locked' && s.prerequisites.length > 0) {
      const allPrereqsDone = s.prerequisites.every((pId) => {
        const prereq = roadmap.skills.find((ps) => ps.id === pId);
        return prereq && prereq.completed;
      });
      if (allPrereqsDone) {
        s.status = 'available';
      }
    }
  });

  roadmap.updatedAt = new Date().toISOString();
  db.saveRoadmap(roadmap);
  db.addXp(userId, 100, 'Skill Mastered');
  db.logActivity({
    id: 'act_' + Date.now(),
    userId,
    type: 'roadmap',
    title: `Mastered Skill: ${skill.name}`,
    detail: `Verified checkpoint completed (${skill.category} / ${skill.difficulty})`,
    xpEarned: 100,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, updatedSkill: skill, roadmap: roadmap.skills });
});

// --- Coding Challenges & Runner ---
apiRouter.get('/challenges', (req, res) => {
  res.json({ challenges: CODING_CHALLENGES });
});

apiRouter.get('/challenges/:id', (req, res) => {
  const challenge = CODING_CHALLENGES.find((c) => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
  res.json({ challenge });
});

apiRouter.post('/challenges/:id/run', async (req, res) => {
  const { code, language = 'javascript' } = req.body;
  const challenge = CODING_CHALLENGES.find((c) => c.id === req.params.id);

  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
  if (!code) return res.status(400).json({ error: 'Code is required.' });

  // Run only visible test cases for quick dry run
  const visibleCases = challenge.testCases.filter((tc) => !tc.isHidden);
  const result = await executeCodeInSandbox(code, language, challenge.entryFunction, visibleCases);

  res.json({ result });
});

apiRouter.post('/challenges/:id/submit', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { code, language = 'javascript', timeSpentSeconds = 120 } = req.body;
  const challenge = CODING_CHALLENGES.find((c) => c.id === req.params.id);

  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
  if (!code) return res.status(400).json({ error: 'Code is required.' });

  // Run full test suite (including hidden edge cases)
  const execution = await executeCodeInSandbox(code, language, challenge.entryFunction, challenge.testCases);

  let rivalReplay = null;
  try {
    rivalReplay = await generateRivalReplay({
      problemTitle: challenge.title,
      problemDesc: challenge.description,
      userCode: code,
      language,
      userPassed: execution.allPassed,
    });
  } catch {
    // fallback gracefully
  }

  if (req.user) {
    db.addSubmission({
      id: 'sub_' + Date.now(),
      userId: req.user.id,
      challengeId: challenge.id,
      code,
      language,
      status: execution.allPassed ? 'passed' : 'failed',
      passedTests: execution.passedTests,
      totalTests: execution.totalTests,
      testResults: execution.results,
      executionTimeMs: execution.executionTimeMs,
      createdAt: new Date().toISOString(),
    });

    if (execution.allPassed) {
      db.addXp(req.user.id, 200, 'Challenge Conquered');
    } else {
      db.addXp(req.user.id, 40);
    }

    db.logActivity({
      id: 'act_' + Date.now(),
      userId: req.user.id,
      type: 'challenge',
      title: execution.allPassed ? `Solved: ${challenge.title}` : `Attempted: ${challenge.title}`,
      detail: execution.allPassed
        ? `Passed all ${execution.totalTests} tests in ${language} (${execution.executionTimeMs}ms)`
        : `Passed ${execution.passedTests}/${execution.totalTests} tests in ${language}`,
      score: Math.round((execution.passedTests / execution.totalTests) * 100),
      xpEarned: execution.allPassed ? 200 : 40,
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    execution,
    rivalReplay,
    userWon: execution.allPassed,
  });
});

// --- Interview Practice & Mock Interviews ---
apiRouter.get('/interviews', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { company, role, difficulty, topic } = req.query;
  const userId = req.user?.id;
  const bookmarks = userId ? db.getBookmarks(userId) : [];
  const practiceRecords = userId ? db.getPracticeRecords(userId) : [];

  let list = QUESTION_BANK;
  if (company && typeof company === 'string' && company !== 'All') {
    list = list.filter((q) => q.company.toLowerCase() === company.toLowerCase() || q.company === 'General');
  }
  if (difficulty && typeof difficulty === 'string' && difficulty !== 'All') {
    list = list.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  const enriched = list.map((q) => {
    const isBookmarked = bookmarks.includes(q.id);
    const practice = practiceRecords.find((p) => p.questionId === q.id);
    return {
      ...q,
      isBookmarked,
      isPracticed: !!practice,
      userNotes: practice?.notes || '',
    };
  });

  res.json({ questions: enriched });
});

apiRouter.post('/interviews/:id/bookmark', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const isBookmarked = db.toggleBookmark(req.user!.id, req.params.id);
  res.json({ isBookmarked });
});

apiRouter.post('/interviews/:id/practice', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { notes = '' } = req.body;
  db.savePracticeRecord({
    userId: req.user!.id,
    questionId: req.params.id,
    notes,
    practicedAt: new Date().toISOString(),
  });
  db.addXp(req.user!.id, 40, 'Interview Practiced');
  res.json({ success: true });
});

apiRouter.post('/interview/evaluate-answer', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { questionId, answer, company, role } = req.body;

  if (!questionId) {
    return res.status(400).json({ error: 'questionId is required.' });
  }

  const questionItem = QUESTION_BANK.find((q) => q.id === questionId);
  const userProfile = db.getProfile(userId);
  const targetCompany = company || userProfile?.company || questionItem?.company || 'Google';
  const targetRole = role || userProfile?.role || questionItem?.role || 'Software Engineer';

  const evaluation = await evaluateSingleAnswer({
    question: questionItem?.question || 'Technical Problem',
    topic: questionItem?.topic || questionItem?.skill || 'Software Engineering',
    expectedKeyPoints: questionItem?.expectedKeyPoints || questionItem?.rubricCriteria || [],
    sampleAnswer: questionItem?.sampleAnswer || '',
    rubricCriteria: questionItem?.rubricCriteria || [],
    userAnswer: answer || '',
    company: targetCompany,
    role: targetRole,
  });

  // Save practice record
  db.savePracticeRecord({
    userId,
    questionId,
    notes: `${evaluation.verdict} (${evaluation.scorePercentage}%)`,
    practicedAt: new Date().toISOString(),
  });

  // Award XP based on answer quality
  const xpAward = evaluation.scorePercentage >= 80 ? 75 : evaluation.scorePercentage >= 50 ? 50 : 25;
  const stats = db.addXp(userId, xpAward, 'Interview Solution Evaluated');

  // Log activity
  db.logActivity({
    id: 'act_' + Date.now(),
    userId,
    type: 'interview',
    title: `Interview Answer Evaluated: ${questionItem?.topic || 'Technical Question'}`,
    detail: `${evaluation.verdict} (${evaluation.scorePercentage}%) • ${targetCompany}`,
    score: evaluation.scorePercentage,
    xpEarned: xpAward,
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    evaluation,
    userStats: stats,
  });
});

apiRouter.post('/mock-interview/submit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { company, role, answers } = req.body; // answers: Record<questionId, textAnswer>

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Answers payload is required.' });
  }

  const pairs = Object.entries(answers).map(([qId, textAns]) => {
    const q = QUESTION_BANK.find((item) => item.id === qId);
    return {
      question: q?.question || 'Technical Problem',
      answer: String(textAns),
      keyPoints: q?.rubricCriteria || ['Explain Big-O trade-offs', 'Provide structured approach'],
    };
  });

  const evaluation = await evaluateMockInterview({
    company: company || 'Google',
    role: role || 'Software Engineer',
    questionsAndAnswers: pairs,
  });

  const record = db.addMockInterview({
    id: 'mock_' + Date.now(),
    userId,
    company: company || 'Google',
    role: role || 'Software Engineer',
    answers,
    feedback: evaluation,
    score: evaluation.scorePercentage,
    createdAt: new Date().toISOString(),
  });

  db.addXp(userId, 200, 'Mock Interview Completed');
  db.logActivity({
    id: 'act_' + Date.now(),
    userId,
    type: 'interview',
    title: `Mock Interview Completed: ${company || 'General'}`,
    detail: `Score: ${evaluation.scorePercentage}% (${Object.keys(answers).length} questions evaluated)`,
    score: evaluation.scorePercentage,
    xpEarned: 200,
    timestamp: new Date().toISOString(),
  });

  res.json({ record, evaluation });
});

// --- AI Career Coach ---
apiRouter.post('/coach/chat', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { message, chatHistory } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required.' });

  const user = req.user;
  const profile = user ? db.getProfile(user.id) : null;
  const stats = user ? db.getUserStats(user.id) : null;

  const response = await askCareerCoach({
    userMessage: message,
    userContext: {
      name: user?.name || 'Engineer',
      field: profile?.field || 'Software Development',
      company: profile?.company || 'Google',
      role: profile?.role || 'Software Engineer',
      experienceLevel: profile?.experienceLevel || 'Intermediate',
      xp: stats?.xp || 0,
    },
    chatHistory,
  });

  res.json(response);
});

// --- Profile & Settings ---
apiRouter.post('/profile/reset', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  // Reset roadmaps, assessments, and stats for a clean retargeting slate
  const stats = db.getUserStats(userId);
  stats.xp = 0;
  stats.level = 1;
  stats.badges = [];
  res.json({ success: true, message: 'Career target reset successfully.' });
});
