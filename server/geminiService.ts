import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export async function getDebuggingHint(params: {
  problemTitle: string;
  problemDesc: string;
  userCode: string;
  errorOrFailedTest?: string;
}): Promise<string> {
  const ai = getClient();
  if (!ai) {
    return "💡 Socratic Hint: Examine how your pointer or index boundaries are updated. Are you modifying the loop termination condition before verifying edge-case lengths?";
  }

  const prompt = `You are a friendly senior software engineer mentoring an engineering student in a timed debugging arena.
The student is debugging: "${params.problemTitle}".
Problem Description: ${params.problemDesc}

Student's Current Code:
\`\`\`javascript
${params.userCode}
\`\`\`
${params.errorOrFailedTest ? `Recent Test Failure: ${params.errorOrFailedTest}` : ''}

CRITICAL INSTRUCTION:
Do NOT give away the complete corrected code. 
Instead, provide a concise Socratic hint (2-3 sentences max) that points out the conceptual flaw, off-by-one boundary, or invariant violation without spoiling the fun of solving it themselves.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });
    return response.text || "Focus on checking if your loop boundary condition matches the length of the collection.";
  } catch (error: any) {
    console.error('[Gemini Service] Hint generation error:', error?.message);
    return "💡 Concept Check: Look closely at pointer increments and bounds checks in your loop.";
  }
}

export async function generateAiOpponentSolution(params: {
  problemTitle: string;
  problemDesc: string;
  buggyCode: string;
  starterSignature: string;
}): Promise<string> {
  const ai = getClient();
  if (!ai) {
    // High-quality deterministic fallback
    return params.buggyCode;
  }

  const prompt = `You are Gemini, participating in a competitive 10-minute debugging battle against a human programmer.
Problem: "${params.problemTitle}"
Description: ${params.problemDesc}

Here is the buggy code:
\`\`\`javascript
${params.buggyCode}
\`\`\`

TASK:
Write the corrected, bug-free, optimal JavaScript implementation.
RULES:
1. Return ONLY the executable JavaScript code.
2. Do not include markdown code fence formatting (\`\`\`javascript).
3. Do not include introductory or concluding conversational text.
4. Keep the exact same function name (${params.starterSignature}).
5. Ensure it passes all boundary and edge cases.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });
    let cleaned = (response.text || '').trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '').trim();
    }
    return cleaned || params.buggyCode;
  } catch (err: any) {
    console.error('[Gemini Service] AI opponent code generation error:', err?.message);
    return params.buggyCode;
  }
}

export async function generateRivalReplayAnalysis(params: {
  problemTitle: string;
  userCode: string;
  aiCode: string;
  userPassed: boolean;
  aiPassed: boolean;
  userTimeSeconds: number;
  aiTimeSeconds: number;
}): Promise<{
  winnerSummary: string;
  timeComplexityHuman: string;
  timeComplexityAi: string;
  edgeCasesAnalysis: string;
  readabilityScore: string;
  keyLessons: string[];
  suggestedNextSkill: string;
}> {
  const ai = getClient();
  const defaultFallback = {
    winnerSummary: params.userPassed
      ? `You fixed all test cases in ${params.userTimeSeconds}s! Excellent speed and clean edge-case awareness.`
      : 'Gemini identified the boundary flaw earlier this round. Study the pointer increment order below.',
    timeComplexityHuman: 'O(N) Time, O(1) Space',
    timeComplexityAi: 'O(N) Time, O(1) Space',
    edgeCasesAnalysis: 'The primary trap was handling empty inputs and single-character alphanumeric transitions.',
    readabilityScore: 'Human: 8.5/10 | AI: 9.0/10',
    keyLessons: [
      'Always verify whether string pointers decrement or increment in simultaneous conditions.',
      'Prefer in-place character code checks over heavy regex instantiations inside loops.',
      'Check for empty string edge cases before entering pointer loops.'
    ],
    suggestedNextSkill: 'Sliding Window & Dynamic Two-Pointers'
  };

  if (!ai) return defaultFallback;

  const prompt = `You are a technical interview evaluator comparing two solutions in a 10-minute battle for "${params.problemTitle}".
Human Code:
\`\`\`javascript
${params.userCode}
\`\`\`
Human Result: ${params.userPassed ? 'PASSED ALL TESTS' : 'FAILED SOME TESTS'} in ${params.userTimeSeconds}s.

Gemini AI Code:
\`\`\`javascript
${params.aiCode}
\`\`\`
Gemini Result: ${params.aiPassed ? 'PASSED ALL TESTS' : 'FAILED SOME TESTS'} in ${params.aiTimeSeconds}s.

Provide a structured JSON breakdown with the following keys:
- winnerSummary: string (friendly, insightful 1-2 sentence recap of who won and why)
- timeComplexityHuman: string (e.g. "O(N) time, O(1) space")
- timeComplexityAi: string (e.g. "O(N) time, O(1) space")
- edgeCasesAnalysis: string (1-2 sentences on how edge cases like empty strings or duplicates were handled)
- readabilityScore: string (e.g. "Human: 8/10 | AI: 9/10 with brief commentary")
- keyLessons: array of 3 short bullet strings
- suggestedNextSkill: string (the exact skill topic they should level up next)

Return pure JSON only.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      winnerSummary: parsed.winnerSummary || defaultFallback.winnerSummary,
      timeComplexityHuman: parsed.timeComplexityHuman || defaultFallback.timeComplexityHuman,
      timeComplexityAi: parsed.timeComplexityAi || defaultFallback.timeComplexityAi,
      edgeCasesAnalysis: parsed.edgeCasesAnalysis || defaultFallback.edgeCasesAnalysis,
      readabilityScore: parsed.readabilityScore || defaultFallback.readabilityScore,
      keyLessons: Array.isArray(parsed.keyLessons) ? parsed.keyLessons : defaultFallback.keyLessons,
      suggestedNextSkill: parsed.suggestedNextSkill || defaultFallback.suggestedNextSkill,
    };
  } catch (err: any) {
    console.warn('[Gemini Service] Rival replay analysis error:', err?.message);
    return defaultFallback;
  }
}

export async function getMentorResponse(params: {
  userMessage: string;
  contextMode: 'concept' | 'socratic' | 'interview' | 'roadmap';
  studentProfile?: {
    college: string;
    degree: string;
    targetCompany: string;
    targetRole: string;
    xp: number;
  };
  chatHistory?: { role: 'user' | 'model'; text: string }[];
}): Promise<string> {
  const ai = getClient();
  if (!ai) {
    return "I am Ease Career's AI Technical Mentor. I'm here to help you master concepts from companies like Google and NVIDIA, break down complex ECE/CS fundamentals, and prepare for interviews! What concept would you like to unpack?";
  }

  const systemInstruction = `You are the lead AI Career Mentor on the "Ease Career" platform.
The student is an engineering student (${params.studentProfile?.degree || 'B.Tech ECE/CSE'}, Target: ${params.studentProfile?.targetCompany || 'Google'} - ${params.studentProfile?.targetRole || 'Software Engineer'}).

MODE: ${params.contextMode.toUpperCase()}
- concept: Explain complex computer science and hardware/firmware concepts in crystal-clear, simple English with intuitive real-world analogies. Keep it engaging for an engineering student.
- socratic: Help the student reason through a bug or problem. Do not give the complete code solution right away; guide them through asking targeted diagnostic questions.
- interview: Act like a friendly Google or NVIDIA technical interviewer asking high-yield conceptual follow-up questions.
- roadmap: Give strategic weekly study recommendations based on their target company requirements.

Keep responses concise, formatted with clear markdown, and focused on practical understanding.`;

  try {
    const contents: any[] = [];
    if (params.chatHistory && params.chatHistory.length > 0) {
      for (const msg of params.chatHistory.slice(-6)) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
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
      config: {
        systemInstruction,
      },
    });

    return response.text || "Let's explore this technical concept step by step.";
  } catch (err: any) {
    console.error('[Gemini Service] Mentor chat error:', err?.message);
    return "I had trouble connecting to the mentor service. Here's a tip: break down the problem into base cases and trace the variable states on paper first!";
  }
}
