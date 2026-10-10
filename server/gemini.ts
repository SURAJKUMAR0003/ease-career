import { GoogleGenAI } from '@google/genai';

let client: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!client) {
    client = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return client;
}

export function isGeminiConfigured(): boolean {
  return !!getAiClient();
}

export async function askCareerCoach(params: {
  userMessage: string;
  userContext: {
    name: string;
    field: string;
    company: string;
    role: string;
    experienceLevel: string;
    xp: number;
  };
  chatHistory?: { role: 'user' | 'model'; text: string }[];
}): Promise<{ reply: string; isLiveAi: boolean }> {
  const ai = getAiClient();
  if (!ai) {
    return {
      reply: `[System Notice: Gemini API key is not configured in the server environment. Set GEMINI_API_KEY in AI Studio secrets to enable live reasoning.]\n\nFor preparing for ${params.userContext.company} (${params.userContext.role}), focus on breaking down algorithmic problems into verifiable base cases, writing clean modular functions, and analyzing Big-O time and space tradeoffs before jumping to code.`,
      isLiveAi: false,
    };
  }

  const systemInstruction = `You are the lead AI Career Mentor on the Ease Career platform.
Student Profile:
- Name: ${params.userContext.name}
- Target Company: ${params.userContext.company}
- Target Role: ${params.userContext.role}
- Field: ${params.userContext.field}
- Experience Level: ${params.userContext.experienceLevel}

Provide concise, practical technical guidance and interview coaching. Formulate answers clearly using bullet points and code examples when relevant.`;

  try {
    const contents: any[] = [];
    if (params.chatHistory && params.chatHistory.length > 0) {
      for (const m of params.chatHistory.slice(-6)) {
        contents.push({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: params.userMessage }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: { systemInstruction },
    });

    return {
      reply: response.text || 'Unable to generate coach response.',
      isLiveAi: true,
    };
  } catch (err: any) {
    console.error('[Gemini Service] Error:', err?.message);
    return {
      reply: `Error contacting Gemini: ${err.message}. Please check quota and network connectivity.`,
      isLiveAi: false,
    };
  }
}

export async function evaluateMockInterview(params: {
  company: string;
  role: string;
  questionsAndAnswers: { question: string; answer: string; keyPoints: string[] }[];
}): Promise<{
  feedbackSummary: string;
  scorePercentage: number;
  strengths: string[];
  improvements: string[];
  recommendedRoadmapSkills: string[];
  isLiveAi: boolean;
}> {
  const ai = getAiClient();
  if (!ai) {
    // Deterministic rubric evaluation when API key is unconfigured
    const answeredCount = params.questionsAndAnswers.filter((qa) => qa.answer.trim().length > 20).length;
    const score = Math.min(95, Math.max(40, Math.round((answeredCount / params.questionsAndAnswers.length) * 85)));

    return {
      feedbackSummary: `[Deterministic Rubric Evaluation — Live Gemini API Key Unconfigured] You completed ${answeredCount} of ${params.questionsAndAnswers.length} responses. Your answers demonstrated understanding of core principles, but need more quantitative metrics and STAR method structural depth.`,
      scorePercentage: score,
      strengths: ['Addressed the fundamental technical question', 'Outlined general approach'],
      improvements: ['Include exact time and space complexity measurements', 'Structure behavioral questions using Situation, Task, Action, Result (STAR)'],
      recommendedRoadmapSkills: ['System Design & Architecture', 'Algorithmic Complexity & Big-O'],
      isLiveAi: false,
    };
  }

  const prompt = `You are a senior technical hiring evaluator for ${params.company} evaluating a candidate for the role of ${params.role}.
Evaluate these responses against the company's hiring standards:

${JSON.stringify(params.questionsAndAnswers, null, 2)}

Return a strict JSON object with these keys:
{
  "feedbackSummary": "Concise 2-sentence evaluation summary",
  "scorePercentage": number between 30 and 100,
  "strengths": ["array of 2 strengths demonstrated"],
  "improvements": ["array of 2 specific areas needing improvement"],
  "recommendedRoadmapSkills": ["array of 2 technical skills to master"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      feedbackSummary: parsed.feedbackSummary || 'Mock interview evaluated.',
      scorePercentage: parsed.scorePercentage || 70,
      strengths: parsed.strengths || ['Good foundational clarity'],
      improvements: parsed.improvements || ['Practice articulating trade-offs'],
      recommendedRoadmapSkills: parsed.recommendedRoadmapSkills || ['Core Algorithms'],
      isLiveAi: true,
    };
  } catch (err: any) {
    console.error('[Gemini Service] Mock interview evaluation error:', err?.message);
    return {
      feedbackSummary: `Mock interview evaluation fallback (API error: ${err.message}).`,
      scorePercentage: 70,
      strengths: ['Completed all question prompts'],
      improvements: ['Focus on deeper edge-case coverage'],
      recommendedRoadmapSkills: ['Algorithm Design'],
      isLiveAi: false,
    };
  }
}

export async function generateRivalReplay(params: {
  problemTitle: string;
  problemDesc: string;
  userCode: string;
  language: string;
  userPassed: boolean;
}): Promise<{
  geminiCode: string;
  explanation: string;
  timeComplexityUser: string;
  timeComplexityGemini: string;
  keyLessons: string[];
  isLiveAi: boolean;
}> {
  const ai = getAiClient();
  if (!ai) {
    return {
      geminiCode: `// Optimal reference solution\nfunction isPalindrome(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;\n    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;\n    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;\n    left++; right--;\n  }\n  return true;\n}`,
      explanation: 'Notice how the two pointers converge inwards in-place. By skipping non-alphanumeric characters with inner loops, we avoid creating extra string allocations and achieve strictly O(N) time and O(1) auxiliary space.',
      timeComplexityUser: 'O(N) Time, O(1) Space',
      timeComplexityGemini: 'O(N) Time, O(1) Space',
      keyLessons: [
        'Avoid nested string regex replacements inside tight loops.',
        'Always check pointer boundary conditions (left < right) before character access.',
        'Test single-character and whitespace-only edge cases.'
      ],
      isLiveAi: false,
    };
  }

  const prompt = `You are participating in a competitive coding analysis for "${params.problemTitle}".
Description: ${params.problemDesc}
User's Code:
\`\`\`${params.language}
${params.userCode}
\`\`\`

Provide a JSON response:
{
  "geminiCode": "The optimal, bug-free solution code",
  "explanation": "2-3 sentences explaining the key architectural differences and why this solution is optimal",
  "timeComplexityUser": "e.g. O(N) Time, O(1) Space",
  "timeComplexityGemini": "e.g. O(N) Time, O(1) Space",
  "keyLessons": ["array of 3 short takeaway bullets"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      geminiCode: parsed.geminiCode || params.userCode,
      explanation: parsed.explanation || 'Optimal solution generated.',
      timeComplexityUser: parsed.timeComplexityUser || 'O(N) Time',
      timeComplexityGemini: parsed.timeComplexityGemini || 'O(N) Time',
      keyLessons: parsed.keyLessons || ['Verify boundary conditions', 'Prefer in-place mutations'],
      isLiveAi: true,
    };
  } catch (err: any) {
    return {
      geminiCode: params.userCode,
      explanation: `AI Rival Replay fallback due to API error: ${err.message}`,
      timeComplexityUser: 'O(N) Time',
      timeComplexityGemini: 'O(N) Time',
      keyLessons: ['Always test edge cases'],
      isLiveAi: false,
    };
  }
}

export interface SingleAnswerEvaluation {
  verdict: 'STRONG PASS' | 'GOOD ANSWER' | 'NEEDS REVISION' | 'INCOMPLETE';
  scorePercentage: number;
  dimensions: {
    technicalAccuracy: number;
    structureAndClarity: number;
    depthAndTradeoffs: number;
    edgeCases: number;
  };
  feedbackSummary: string;
  strengths: string[];
  improvements: string[];
  conceptsCovered: string[];
  conceptsMissed: string[];
  exemplarResponse: string;
  isLiveAi: boolean;
}

export async function evaluateSingleAnswer(params: {
  question: string;
  topic: string;
  expectedKeyPoints?: string[];
  sampleAnswer?: string;
  rubricCriteria?: string[];
  userAnswer: string;
  company?: string;
  role?: string;
}): Promise<SingleAnswerEvaluation> {
  const { question, topic, expectedKeyPoints = [], sampleAnswer = '', rubricCriteria = [], userAnswer, company = 'Google', role = 'Software Engineer' } = params;
  const cleanAnswer = (userAnswer || '').trim();

  // If answer is blank or too short to be meaningful
  if (cleanAnswer.length < 15) {
    return {
      verdict: 'INCOMPLETE',
      scorePercentage: 20,
      dimensions: {
        technicalAccuracy: 15,
        structureAndClarity: 25,
        depthAndTradeoffs: 10,
        edgeCases: 10,
      },
      feedbackSummary: 'The submitted response is too brief to demonstrate technical competence. Please provide a detailed explanation of your approach, reasoning, and trade-offs.',
      strengths: ['Attempted the interview question prompt'],
      improvements: [
        'Elaborate on core underlying concepts with concrete examples',
        'State time and space complexity explicitly',
        'Provide structural reasoning using the STAR or architectural frameworks',
      ],
      conceptsCovered: [],
      conceptsMissed: expectedKeyPoints.length > 0 ? expectedKeyPoints : ['Core Algorithmic / Architectural Concepts'],
      exemplarResponse: sampleAnswer || 'A senior engineering candidate outlines the root problem, evaluates 2-3 trade-offs, and quantifies latency, throughput, or complexity impacts.',
      isLiveAi: false,
    };
  }

  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `You are a Principal Hiring Committee Member at ${company} conducting a rigorous technical evaluation for the ${role} position.
Question: "${question}"
Topic: "${topic}"
Candidate's Response:
"""${cleanAnswer}"""

Expected Core Key Points / Rubric:
${JSON.stringify(expectedKeyPoints, null, 2)}
Ideal Exemplar Solution Reference:
"${sampleAnswer}"

Evaluate the candidate's answer with senior engineering discernment. Return ONLY a valid JSON object matching this exact structure:
{
  "verdict": "STRONG PASS" (if score >= 85) | "GOOD ANSWER" (if score 70-84) | "NEEDS REVISION" (if score 45-69) | "INCOMPLETE" (if score < 45),
  "scorePercentage": number between 25 and 98,
  "dimensions": {
    "technicalAccuracy": number 0-100,
    "structureAndClarity": number 0-100,
    "depthAndTradeoffs": number 0-100,
    "edgeCases": number 0-100
  },
  "feedbackSummary": "Clear 2-sentence direct evaluation summary stating whether the answer is right, what is missing, and hiring verdict.",
  "strengths": ["array of 2 specific strong points in the answer"],
  "improvements": ["array of 2 specific actionable areas needing technical expansion or correction"],
  "conceptsCovered": ["array of expected key points the candidate addressed well"],
  "conceptsMissed": ["array of expected key points or trade-offs the candidate missed or omitted"],
  "exemplarResponse": "${sampleAnswer ? sampleAnswer.replace(/"/g, '\\"') : 'Detailed senior reference breakdown.'}"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.scorePercentage && parsed.verdict) {
        return {
          verdict: parsed.verdict,
          scorePercentage: Number(parsed.scorePercentage),
          dimensions: {
            technicalAccuracy: Number(parsed.dimensions?.technicalAccuracy || parsed.scorePercentage),
            structureAndClarity: Number(parsed.dimensions?.structureAndClarity || parsed.scorePercentage),
            depthAndTradeoffs: Number(parsed.dimensions?.depthAndTradeoffs || parsed.scorePercentage - 5),
            edgeCases: Number(parsed.dimensions?.edgeCases || parsed.scorePercentage - 10),
          },
          feedbackSummary: parsed.feedbackSummary,
          strengths: parsed.strengths || ['Demonstrated grasp of topic'],
          improvements: parsed.improvements || ['Incorporate more quantitative metrics'],
          conceptsCovered: parsed.conceptsCovered || expectedKeyPoints.slice(0, 2),
          conceptsMissed: parsed.conceptsMissed || expectedKeyPoints.slice(2),
          exemplarResponse: parsed.exemplarResponse || sampleAnswer,
          isLiveAi: true,
        };
      }
    } catch (err: any) {
      console.warn('[Gemini Service] Single answer evaluation fallback:', err?.message);
    }
  }

  // Deterministic Semantic Grader Fallback
  const lowerAns = cleanAnswer.toLowerCase();
  const covered: string[] = [];
  const missed: string[] = [];

  expectedKeyPoints.forEach((point) => {
    const words = point.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const hasOverlap = words.some((w) => lowerAns.includes(w));
    if (hasOverlap) {
      covered.push(point);
    } else {
      missed.push(point);
    }
  });

  const wordCount = cleanAnswer.split(/\s+/).length;
  let baseScore = 55;

  if (wordCount >= 40) baseScore += 10;
  if (wordCount >= 80) baseScore += 10;
  if (wordCount >= 130) baseScore += 5;

  if (expectedKeyPoints.length > 0) {
    const matchRatio = covered.length / expectedKeyPoints.length;
    baseScore = Math.round(baseScore * 0.4 + matchRatio * 85 * 0.6);
  }

  // Check for complexity notation or STAR keywords
  const hasComplexity = /o\([1nlog\^]+\)/i.test(cleanAnswer) || /time complexity|space complexity/i.test(cleanAnswer);
  if (hasComplexity) baseScore = Math.min(96, baseScore + 6);

  const finalScore = Math.min(96, Math.max(30, baseScore));
  let verdict: 'STRONG PASS' | 'GOOD ANSWER' | 'NEEDS REVISION' | 'INCOMPLETE' = 'GOOD ANSWER';
  if (finalScore >= 85) verdict = 'STRONG PASS';
  else if (finalScore >= 70) verdict = 'GOOD ANSWER';
  else if (finalScore >= 50) verdict = 'NEEDS REVISION';
  else verdict = 'INCOMPLETE';

  return {
    verdict,
    scorePercentage: finalScore,
    dimensions: {
      technicalAccuracy: Math.min(98, Math.max(25, finalScore + (covered.length > 0 ? 4 : -10))),
      structureAndClarity: Math.min(98, Math.max(30, wordCount > 50 ? finalScore + 5 : finalScore - 12)),
      depthAndTradeoffs: Math.min(98, Math.max(20, hasComplexity ? finalScore + 3 : finalScore - 8)),
      edgeCases: Math.min(98, Math.max(20, finalScore - 6)),
    },
    feedbackSummary: verdict === 'STRONG PASS' || verdict === 'GOOD ANSWER'
      ? `Solid response demonstrating comprehension of ${topic}. Covered ${covered.length} of ${expectedKeyPoints.length || 3} core architectural concepts.`
      : `Response captures basic ideas but lacks critical technical precision and trade-off considerations expected at ${company}.`,
    strengths: [
      covered.length > 0 ? `Addressed core key point: "${covered[0]}"` : 'Directly targeted the problem statement',
      wordCount >= 40 ? 'Well-formed paragraph structure and clear technical phrasing' : 'Concise framing of initial intuition',
    ],
    improvements: [
      missed.length > 0 ? `Missing key technical coverage: "${missed[0]}"` : 'Quantify performance impacts with exact Big-O complexity or latency metrics',
      'Provide concrete production edge cases and error-handling scenarios',
    ],
    conceptsCovered: covered,
    conceptsMissed: missed,
    exemplarResponse: sampleAnswer || 'A top candidate establishes the operational context, details algorithmic steps, explicitly articulates time/space tradeoffs, and addresses scalability limits.',
    isLiveAi: false,
  };
}
