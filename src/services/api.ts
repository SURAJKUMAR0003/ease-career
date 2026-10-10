const TOKEN_KEY = 'easecareer_jwt_token';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request(path: string, options: RequestInit = {}): Promise<any> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(path, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
    }
    return data;
  },

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) this.setToken(data.token);
    return data;
  },

  async register(name: string, email: string, password: string) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) this.setToken(data.token);
    return data;
  },

  async getMe() {
    return this.request('/api/auth/me');
  },

  async forgotPassword(email: string) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(email: string, token: string, newPassword: string) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, token, newPassword }),
    });
  },

  // Onboarding
  async saveOnboarding(data: {
    field: string;
    company: string;
    role: string;
    experienceLevel: string;
    preferredLanguage?: string;
    studyHoursPerDay?: number;
    targetTimelineWeeks?: number;
  }) {
    return this.request('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Assessment
  async getAssessmentQuestions() {
    return this.request('/api/assessment/questions');
  },

  async submitAssessment(answers: Record<string, number>) {
    return this.request('/api/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  // Roadmap
  async getRoadmap() {
    return this.request('/api/roadmap');
  },

  async completeSkillCheckpoint(skillId: string) {
    return this.request(`/api/roadmap/skill/${skillId}/checkpoint`, {
      method: 'POST',
    });
  },

  // Coding Challenges
  async getChallenges() {
    return this.request('/api/challenges');
  },

  async runChallenge(id: string, code: string, language: string) {
    return this.request(`/api/challenges/${id}/run`, {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
  },

  async submitChallenge(id: string, code: string, language: string, timeSpentSeconds?: number) {
    return this.request(`/api/challenges/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ code, language, timeSpentSeconds }),
    });
  },

  // Interview Questions
  async getInterviews(params?: { company?: string; difficulty?: string }) {
    const q = new URLSearchParams(params as any).toString();
    return this.request(`/api/interviews${q ? `?${q}` : ''}`);
  },

  async toggleBookmark(questionId: string) {
    return this.request(`/api/interviews/${questionId}/bookmark`, {
      method: 'POST',
    });
  },

  async markInterviewPracticed(questionId: string, notes?: string) {
    return this.request(`/api/interviews/${questionId}/practice`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  async evaluateInterviewAnswer(questionId: string, answer: string, company?: string, role?: string) {
    return this.request('/api/interview/evaluate-answer', {
      method: 'POST',
      body: JSON.stringify({ questionId, answer, company, role }),
    });
  },

  async submitMockInterview(company: string, role: string, answers: Record<string, string>) {
    return this.request('/api/mock-interview/submit', {
      method: 'POST',
      body: JSON.stringify({ company, role, answers }),
    });
  },

  async getActivities() {
    return this.request('/api/user/activities');
  },

  // AI Coach
  async chatWithCoach(message: string, chatHistory?: any[]) {
    return this.request('/api/coach/chat', {
      method: 'POST',
      body: JSON.stringify({ message, chatHistory }),
    });
  },

  // Profile Reset
  async resetProfile() {
    return this.request('/api/profile/reset', {
      method: 'POST',
    });
  },
};
