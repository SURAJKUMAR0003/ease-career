import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'easecareer.db.json');

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  emailVerified: boolean;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpires?: number;
  createdAt: string;
}

export interface UserProfileRecord {
  userId: string;
  field: string;
  company: string;
  role: string;
  experienceLevel: string;
  preferredLanguage: string;
  studyHoursPerDay: number;
  targetTimelineWeeks: number;
  updatedAt: string;
}

export interface AssessmentAttemptRecord {
  id: string;
  userId: string;
  field: string;
  company: string;
  role: string;
  score: number;
  total: number;
  percentage: number;
  answers: Record<string, number>;
  demonstratedSkills: string[];
  improvementSkills: string[];
  createdAt: string;
}

export interface RoadmapSkillRecord {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  description: string;
  estimatedHours: number;
  prerequisites: string[];
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress: number;
  completed: boolean;
  completedAt?: string;
}

export interface UserRoadmapRecord {
  userId: string;
  role: string;
  skills: RoadmapSkillRecord[];
  updatedAt: string;
}

export interface CodeSubmissionRecord {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  language: string;
  status: 'passed' | 'failed' | 'error';
  passedTests: number;
  totalTests: number;
  testResults: any[];
  executionTimeMs: number;
  createdAt: string;
}

export interface PracticeRecord {
  userId: string;
  questionId: string;
  notes: string;
  practicedAt: string;
}

export interface MockInterviewRecord {
  id: string;
  userId: string;
  company: string;
  role: string;
  answers: Record<string, string>;
  feedback: any;
  score: number;
  createdAt: string;
}

export interface UserStatsRecord {
  userId: string;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  lastActiveDate: string;
}

export interface UserActivityRecord {
  id: string;
  userId: string;
  type: 'assessment' | 'challenge' | 'interview' | 'roadmap' | 'onboarding';
  title: string;
  detail: string;
  score?: number;
  xpEarned: number;
  timestamp: string;
}

interface DatabaseSchema {
  users: Record<string, UserRecord>;
  profiles: Record<string, UserProfileRecord>;
  assessments: Record<string, AssessmentAttemptRecord[]>;
  roadmaps: Record<string, UserRoadmapRecord>;
  submissions: Record<string, CodeSubmissionRecord[]>;
  bookmarks: Record<string, string[]>; // userId -> questionId[]
  practiceRecords: Record<string, PracticeRecord[]>; // userId -> PracticeRecord[]
  mockInterviews: Record<string, MockInterviewRecord[]>;
  userStats: Record<string, UserStatsRecord>;
  activities: Record<string, UserActivityRecord[]>;
}

class PersistentDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || {},
          profiles: parsed.profiles || {},
          assessments: parsed.assessments || {},
          roadmaps: parsed.roadmaps || {},
          submissions: parsed.submissions || {},
          bookmarks: parsed.bookmarks || {},
          practiceRecords: parsed.practiceRecords || {},
          mockInterviews: parsed.mockInterviews || {},
          userStats: parsed.userStats || {},
          activities: parsed.activities || {},
        };
      }
    } catch (err) {
      console.error('[Database] Failed to read database file, initializing clean database:', err);
    }
    return {
      users: {},
      profiles: {},
      assessments: {},
      roadmaps: {},
      submissions: {},
      bookmarks: {},
      practiceRecords: {},
      mockInterviews: {},
      userStats: {},
      activities: {},
    };
  }

  private save() {
    try {
      this.ensureDirectory();
      const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('[Database] Save failed:', err);
    }
  }

  // --- Users ---
  findUserByEmail(email: string): UserRecord | undefined {
    const normalized = email.toLowerCase().trim();
    return Object.values(this.data.users).find((u) => u.email.toLowerCase() === normalized);
  }

  findUserById(id: string): UserRecord | undefined {
    return this.data.users[id];
  }

  createUser(user: UserRecord): UserRecord {
    this.data.users[user.id] = user;
    // Initialize default fresh stats
    this.data.userStats[user.id] = {
      userId: user.id,
      xp: 0,
      level: 1,
      streak: 1,
      badges: [],
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    this.save();
    return user;
  }

  updateUser(id: string, updates: Partial<UserRecord>): UserRecord | undefined {
    const user = this.data.users[id];
    if (!user) return undefined;
    Object.assign(user, updates);
    this.save();
    return user;
  }

  // --- Profiles ---
  getProfile(userId: string): UserProfileRecord | undefined {
    return this.data.profiles[userId];
  }

  saveProfile(profile: UserProfileRecord): UserProfileRecord {
    this.data.profiles[profile.userId] = profile;
    this.save();
    return profile;
  }

  // --- Assessments ---
  getAssessments(userId: string): AssessmentAttemptRecord[] {
    return this.data.assessments[userId] || [];
  }

  addAssessment(attempt: AssessmentAttemptRecord): AssessmentAttemptRecord {
    if (!this.data.assessments[attempt.userId]) {
      this.data.assessments[attempt.userId] = [];
    }
    this.data.assessments[attempt.userId].unshift(attempt);
    this.save();
    return attempt;
  }

  // --- Roadmaps ---
  getRoadmap(userId: string): UserRoadmapRecord | undefined {
    return this.data.roadmaps[userId];
  }

  saveRoadmap(roadmap: UserRoadmapRecord): UserRoadmapRecord {
    this.data.roadmaps[roadmap.userId] = roadmap;
    this.save();
    return roadmap;
  }

  // --- Submissions ---
  getSubmissions(userId: string): CodeSubmissionRecord[] {
    return this.data.submissions[userId] || [];
  }

  addSubmission(sub: CodeSubmissionRecord): CodeSubmissionRecord {
    if (!this.data.submissions[sub.userId]) {
      this.data.submissions[sub.userId] = [];
    }
    this.data.submissions[sub.userId].unshift(sub);
    this.save();
    return sub;
  }

  // --- Bookmarks ---
  getBookmarks(userId: string): string[] {
    return this.data.bookmarks[userId] || [];
  }

  toggleBookmark(userId: string, questionId: string): boolean {
    if (!this.data.bookmarks[userId]) {
      this.data.bookmarks[userId] = [];
    }
    const idx = this.data.bookmarks[userId].indexOf(questionId);
    let bookmarked = false;
    if (idx >= 0) {
      this.data.bookmarks[userId].splice(idx, 1);
    } else {
      this.data.bookmarks[userId].push(questionId);
      bookmarked = true;
    }
    this.save();
    return bookmarked;
  }

  // --- Practice Records ---
  getPracticeRecords(userId: string): PracticeRecord[] {
    return this.data.practiceRecords[userId] || [];
  }

  savePracticeRecord(record: PracticeRecord): PracticeRecord {
    if (!this.data.practiceRecords[record.userId]) {
      this.data.practiceRecords[record.userId] = [];
    }
    const existingIdx = this.data.practiceRecords[record.userId].findIndex(
      (p) => p.questionId === record.questionId
    );
    if (existingIdx >= 0) {
      this.data.practiceRecords[record.userId][existingIdx] = record;
    } else {
      this.data.practiceRecords[record.userId].push(record);
    }
    this.save();
    return record;
  }

  // --- Mock Interviews ---
  getMockInterviews(userId: string): MockInterviewRecord[] {
    return this.data.mockInterviews[userId] || [];
  }

  addMockInterview(record: MockInterviewRecord): MockInterviewRecord {
    if (!this.data.mockInterviews[record.userId]) {
      this.data.mockInterviews[record.userId] = [];
    }
    this.data.mockInterviews[record.userId].unshift(record);
    this.save();
    return record;
  }

  // --- Stats & XP ---
  getUserStats(userId: string): UserStatsRecord {
    if (!this.data.userStats[userId]) {
      this.data.userStats[userId] = {
        userId,
        xp: 0,
        level: 1,
        streak: 1,
        badges: [],
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
      this.save();
    }
    return this.data.userStats[userId];
  }

  addXp(userId: string, xpAmount: number, badge?: string): UserStatsRecord {
    const stats = this.getUserStats(userId);
    stats.xp += xpAmount;
    stats.level = Math.floor(stats.xp / 350) + 1;
    if (badge && !stats.badges.includes(badge)) {
      stats.badges.push(badge);
    }

    const today = new Date().toISOString().split('T')[0];
    if (stats.lastActiveDate !== today) {
      const last = new Date(stats.lastActiveDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        stats.streak += 1;
      } else if (diffDays > 1) {
        stats.streak = 1;
      }
      stats.lastActiveDate = today;
    }

    this.save();
    return stats;
  }

  // --- Activities ---
  getActivities(userId: string): UserActivityRecord[] {
    return this.data.activities[userId] || [];
  }

  logActivity(activity: UserActivityRecord): UserActivityRecord {
    if (!this.data.activities[activity.userId]) {
      this.data.activities[activity.userId] = [];
    }
    this.data.activities[activity.userId].unshift(activity);
    // Keep last 100 activities per user
    if (this.data.activities[activity.userId].length > 100) {
      this.data.activities[activity.userId] = this.data.activities[activity.userId].slice(0, 100);
    }
    this.save();
    return activity;
  }
}

export const db = new PersistentDatabase();
