export type CareerField =
  | 'Software Development'
  | 'AI and Machine Learning'
  | 'Data Science and Analytics'
  | 'Embedded Systems and Firmware'
  | 'GPU and Systems Programming'
  | 'Cloud Computing'
  | 'Frontend Development'
  | 'Backend Development'
  | 'UI/UX Design'
  | 'Product Management';

export type TargetCompany =
  | 'Google'
  | 'Amazon'
  | 'Microsoft'
  | 'NVIDIA'
  | 'Adobe'
  | 'TCS'
  | 'Infosys'
  | 'Wipro'
  | 'Other';

export type ExperienceLevel =
  | 'Beginner'
  | 'Basic knowledge'
  | 'Intermediate'
  | 'Advanced';

export interface UserCareerProfile {
  name: string;
  email: string;
  field: CareerField;
  company: TargetCompany;
  role: string;
  experienceLevel: ExperienceLevel;
  xp: number;
  streak: number;
  level: number;
  badges: string[];
  assessmentCompleted: boolean;
  assessmentScore?: {
    correct: number;
    total: number;
    percentage: number;
    demonstratedSkills: string[];
    improvementSkills: string[];
  };
}

export interface AssessmentQuestion {
  id: string;
  field: CareerField;
  category: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  skillTag: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface RoadmapSkill {
  id: string;
  name: string;
  category: 'core' | 'specialized' | 'tools' | 'architecture';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  status: 'demonstrated' | 'in-progress' | 'prerequisite_needed' | 'locked';
  progress: number; // 0 to 100
  estimatedHours: number;
  prerequisites: string[];
  resources: { title: string; url: string; type: 'doc' | 'video' | 'practice' }[];
  interviewQuestions: string[];
  codingTasks: string[];
  completed: boolean;
}

export interface DebugProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  buggyCode: string;
  language: string;
  sampleInput: string;
  sampleOutput: string;
  testCases: {
    id: number;
    input: string;
    expected: string;
    isHidden?: boolean;
  }[];
  geminiSolution: string;
  geminiExplanation: string;
}

export interface InterviewQuestionItem {
  id: string;
  company: TargetCompany | 'General';
  roleCategory: string;
  type: 'technical' | 'hr' | 'system_design';
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hint: string;
  suggestedAnswer: string;
  keyPoints: string[];
  bookmarked?: boolean;
}
