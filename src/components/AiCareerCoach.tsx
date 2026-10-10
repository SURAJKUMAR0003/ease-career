import React, { useState, useRef, useEffect } from 'react';
import {
  BrainCircuit,
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  BookOpen,
  Target,
  Briefcase,
  Compass,
} from 'lucide-react';
import { UserCareerProfile } from '../types.js';

interface AiCareerCoachProps {
  user: UserCareerProfile;
}

export const AiCareerCoach: React.FC<AiCareerCoachProps> = ({ user }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; time: string }[]>([
    {
      role: 'model',
      text: `Hello ${user.name.split(' ')[0]}! I am your AI Career Coach on **Ease Career**. 

I am calibrated for your goal: **${user.role}** at **${user.company}** in the **${user.field}** track.

Ask me about:
1. What technical topics to focus on this week.
2. How to explain tricky algorithmic tradeoffs in an interview.
3. How ${user.company} structures their hiring loops.
4. How to overcome specific skill gaps identified in your assessment.`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (overrideText?: string) => {
    const text = overrideText || inputText.trim();
    if (!text || isTyping) return;

    const userMsg = { role: 'user' as const, text, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    if (!overrideText) setInputText('');
    setIsTyping(true);

    // Simulate intelligent coach response tailored to target company and role
    setTimeout(() => {
      let coachReply = '';
      const lower = text.toLowerCase();

      if (lower.includes('week') || lower.includes('focus') || lower.includes('roadmap')) {
        coachReply = `Based on your target of **${user.company} (${user.role})**, here is your 7-day sprint:

1. **Days 1-2**: Master Sliding Window and Two-Pointer invariant checks (standard round 1 filter at ${user.company}).
2. **Days 3-4**: Tackle 2 challenges in our **Debug Arena** under the 10-minute timer.
3. **Days 5-6**: Study struct padding and memory alignment if focusing on low-level systems, or asynchronous microtasks if focusing on web.
4. **Day 7**: Complete 1 timed mock interview round in the question bank.`;
      } else if (lower.includes('interview') || lower.includes('google') || lower.includes('nvidia') || lower.includes('rounds')) {
        coachReply = `For **${user.company}**, interviewers look for three distinct criteria:
- **Clarification**: Did you ask clarifying questions about input bounds (empty arrays, negative numbers, concurrency)?
- **Clean Code**: Do you write modular functions with descriptive variable names?
- **Trade-Off Articulation**: Never jump to coding before verbally analyzing O(N) time vs O(1) space tradeoffs.`;
      } else if (lower.includes('resume') || lower.includes('project')) {
        coachReply = `To stand out for ${user.company}:
Highlight **measurable engineering outcomes** on your projects. Instead of writing *"Built an API"*, write *"Architected an Express/Go service handling 1,500 req/sec with Redis caching, reducing p99 latency by 35%"*.`;
      } else {
        coachReply = `Great question regarding **${user.field}**!

The key is breaking this down into first principles:
1. Define the baseline invariant.
2. Formulate test cases with edge constraints.
3. Optimize from brute-force (O(N²)) to linear or logarithmic time complexity.

Try practicing this in the **Debug Arena** to solidify your muscle memory!`;
      }

      setMessages((prev) => [
        ...prev,
        { role: 'model', text: coachReply, time: 'Just now' },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const starterPrompts = [
    `What is ${user.company}'s typical interview process?`,
    'What should I prioritize this week?',
    'How do I answer behavioral questions using STAR?',
    'Explain how to optimize two-pointer solutions',
  ];

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto font-sans text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <BrainCircuit className="w-7 h-7 text-cyan-400" />
            AI Career Coach &amp; Mentor
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Personalized guidance calibrated for {user.role} at {user.company}.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#0b1021] border border-cyan-500/30 text-xs text-cyan-300 font-semibold flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-cyan-400" />
          <span>{user.company} Focus</span>
        </div>
      </div>

      {/* Suggested Starter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {starterPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0b1021] hover:bg-slate-800 border border-slate-800 hover:border-cyan-400/50 text-xs text-slate-300 font-medium whitespace-nowrap transition-colors"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-[#0b1021]/90 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 min-h-[460px] max-h-[560px] overflow-y-auto shadow-2xl backdrop-blur-xl scrollbar-thin">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-tr from-cyan-400 to-indigo-500 text-slate-950 font-bold'
                    : 'bg-[#080d1a] text-cyan-400 border border-slate-800'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium rounded-tr-none shadow-md'
                    : 'bg-[#080d1a] border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div
                  className={`text-[10px] mt-1.5 ${
                    isUser ? 'text-cyan-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#080d1a] text-cyan-400 border border-slate-800 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#080d1a] border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Coach is preparing guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-[#0b1021] border border-slate-800 rounded-2xl p-2.5 flex items-center gap-2 shadow-2xl">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask anything about ${user.company} interviews, roadmaps, or algorithms...`}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isTyping}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-40 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5 text-slate-950" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
};
