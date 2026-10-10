# Ease Career — Complete Career Preparation Platform

> **Production-grade, end-to-end career readiness platform** built with **React**, **TypeScript**, **Tailwind CSS**, **Node.js/Express**, and a **local persistent SQLite database** (Zero MongoDB).

---

## 🚀 1. Overview & Vision

**Ease Career** is a comprehensive career preparation platform designed to help students and software engineers prepare for their dream tech companies (Google, NVIDIA, Amazon, Microsoft, Meta, Apple, TCS, and more).

Unlike static prototypes or mockups, Ease Career is a **fully functional, data-persistent application** where users:
1. Create real accounts and authenticate through a cinematic **Lamp Login**.
2. Configure their **target company, role, career track, and experience level**.
3. Take a **real scored diagnostic assessment** with immediate skill-gap analysis.
4. Navigate a **personalized, dependency-based Exploration Graph roadmap**.
5. Solve coding challenges in an isolated **Debug Arena** with **automatic progression to the next question** upon completion.
6. Practice in the **AI Mock Interview Studio** with **30+ curated questions** and **real-time, side-by-side answer correctness analysis** (rubric scoring, STAR evaluation, and concept coverage).
7. Track their full learning history on the **Career Dashboard** via a **persistent SQLite activity ledger** (No MongoDB).

---

## 🛠️ 2. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EASE CAREER FRONTEND                            │
│  React 18 • TypeScript • Tailwind CSS • Vite • React Flow • Monaco     │
├────────────────────────────────────────────────────────────────────────┤
│  • Lamp Login & Auth Flow                                              │
│  • Step-by-Step Career Onboarding (Company / Role / Experience)        │
│  • Role Diagnostic Assessment & Anti-Cheat Scoring                     │
│  • Dual-Mode Roadmap (Exploration Mindmap & React Flow Dependency Flow)│
│  • Debug Arena (Monaco Editor + VM Sandbox Runner + Auto-Next Queue)  │
│  • AI Interview Studio (30+ Questions + Side-by-Side Rubric Grader)    │
│  • Career Dashboard & Persistent Activity Stream                       │
│  • Progress Analytics & 5-Axis Competency Spider Radar                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST API (JWT Authenticated)
┌───────────────────────────────────▼────────────────────────────────────┐
│                       EXPRESS / NODE.JS BACKEND                        │
│  Server-side Execution Sandbox • JWT Authentication • Gemini AI Proxy  │
├────────────────────────────────────────────────────────────────────────┤
│  • /api/auth/*              (Register, Login, Me, Forgot/Reset Password)│
│  • /api/onboarding          (Target Career Calibration)                │
│  • /api/assessment/*        (Dynamic Questions & Server Scoring)       │
│  • /api/roadmap/*           (Skill Dependency Graph & Checkpoint Sync) │
│  • /api/challenges/*        (Isolated VM Runner & Gemini Rival Replay) │
│  • /api/interview/*         (30+ Questions & Side-by-Side Answer Grader│
│  • /api/user/activities     (Persistent Activity Ledger)               │
│  • /api/coach/chat          (Server-side Gemini AI Career Coach)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                    PERSISTENT STORAGE & AI ENGINES                     │
├────────────────────────────────────────────────────────────────────────┤
│  • Local Persistent SQLite Database (data/easecareer.db.json)          │
│    Zero MongoDB • Durable File Persistence • Automatic Bootstrapping   │
│  • Google Gemini 3.8 Flash SDK (@google/genai)                         │
│    Server-side AI evaluation with deterministic offline fallbacks      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 3. Modules & Features Implemented

### 🌟 3.1. Lamp-Themed Authentication & Accounts
- **Cinematic Visuals**: Deep obsidian background with an interactive desk lamp emitting a warm golden glow, animated floating fireflies, and frosted glass translucent forms.
- **Interactive Lighting Toggle**: Clickable cord switch to toggle warm ambient light without interfering with form usability.
- **Secure Persistence**: Real email/password registration, password hashing, JWT sessions, instant demo credentials, and password recovery.
- **Account Verification**: Automatically verifies accounts and preserves state across sessions.

### 🎯 3.2. Step-by-Step Career Onboarding
- **Step 1 — Career Field**: Software Development, AI & Machine Learning, Data Science, Embedded Systems & Firmware, GPU & Systems Programming, Cloud Computing, Frontend, Backend, UI/UX Design, Product Management.
- **Step 2 — Target Company**: Google, NVIDIA, Amazon, Microsoft, Meta, Apple, TCS, Adobe, Netflix, Uber, Stripe, etc.
- **Step 3 — Target Role**: SDE I, Embedded Firmware Engineer, ML Scientist, Systems Programmer, etc.
- **Step 4 — Experience Level & Weekly Commitment**: Beginner, Intermediate, Advanced with custom study hours per day.

### 📝 3.3. Real Diagnostic Assessment & Scoring Engine
- **Targeted Question Bank**: Dynamically selects assessment MCQs tailored to the chosen company and role.
- **Server-Side Anti-Cheat Scoring**: Answers are evaluated securely on the backend; correct options are never sent to the client beforehand.
- **Evidence-Based Diagnostics**: Categorizes demonstrated strengths and improvement gaps based strictly on real responses.

### 🗺️ 3.4. Dual-View Exploration Graph & Dependency Roadmap
- **View 1 — Exploration Mindmap Graph**: Inspired by professional skill maps with glowing Bezier branches, interconnected tracks (Software Engineering, AI Specialist, Systems & Architecture), and interactive node details.
- **View 2 — React Flow Dependency Flow**: Strict prerequisite-enforced learning graph. Downstream nodes remain locked until prerequisite milestones are mastered.
- **Verified Checkpoints**: Users verify skills by completing tasks; progress is saved directly to the SQLite backend.

### ⚔️ 3.5. Debug Arena (Live Code Sandbox & Auto-Next Progression)
- **Multi-Challenge Suite**:
  1. *Valid Palindrome with Alphanumeric Filtering* (Strings & Two-Pointers)
  2. *Two Sum Target Lookup* (Hash Maps & Arrays)
  3. *Maximum Subarray* (Kadane’s Algorithm / Dynamic Programming)
  4. *Valid Parentheses String Matching* (Stacks & Parsing)
  5. *Search in Rotated Sorted Array* (Binary Search)
  6. *Merge Overlapping Intervals* (Intervals & Sorting)
  7. *Reverse Singly Linked Sequence* (Pointers & Linked Lists)
- **Monaco Code Editor**: VS Code-grade in-browser editor with syntax highlighting, line numbers, and language toggles (JavaScript / Python).
- **Isolated Node.js VM Sandbox**: Executes user code against public test cases and hidden edge cases safely with execution timers.
- **Gemini Rival Replay**: Competes against Gemini in time-pressured duels, comparing user solution complexity with AI optimal code.
- **Automatic Question Progression**:
  - When all tests pass, a celebratory **+120 XP Awarded** banner appears.
  - A countdown automatically loads the next coding challenge in 5 seconds.
  - Prominent **Next Challenge →** button allows instant advancement.

### 🎙️ 3.6. AI Mock Interview Studio (Clean English & Side-by-Side Analysis)
- **Zero Mixed Language**: Clean, professional English terminology across all tabs, buttons, tips, and rubrics.
- **35+ Curated Interview Questions**: Spanning Google Spanner external consistency, Amazon Leadership Principles (STAR method), NVIDIA Warp Divergence & CUDA bank conflicts, Microsoft Windows thread synchronization, Meta React 18 Fiber Reconciler, AI/ML Scaled Dot-Product Attention, and production P0 outages.
- **Side-by-Side Real-Time Evaluation**:
  - **Left Side**: Question card with company tags, core concepts hint, and candidate response writing area (with speech/voice input simulation and sample answer loader).
  - **Right Side**: Immediate analysis station that answers: **"Is the answer correct?"**
    - **Verdict Badge**: *STRONG PASS (≥85%)*, *GOOD ANSWER (70-84%)*, *NEEDS REVISION (45-69%)*, or *INCOMPLETE (<45%)*.
    - **4-Bar Dimension Breakdown**: Technical Accuracy (0-100%), Structure & Communication (0-100%), Depth & Trade-offs (0-100%), Edge Cases & Scalability (0-100%).
    - **Concepts Covered vs Missed Checklist**: Green checkmarks for covered concepts, amber warnings for missed concepts.
    - **Strengths & Improvements**: Bulleted feedback on what was done well and what needs expansion.
    - **Exemplar Response**: Model solution illustrating how a Senior/Staff Engineer at Google or NVIDIA would answer.
    - **Persistent XP**: Automatically saves practice record to SQLite database and awards **+75 XP**.
    - **Next Question Button**: Allows seamless one-click practice of the next question.

### 📊 3.7. Career Dashboard & Persistent Activity Stream
- **Target Company & Role Overview**: Shows calibration details and honest readiness index.
- **Recommended Next Milestone**: Directly points to the next highest-priority skill.
- **Live Activity Feed (Saved in SQLite • Zero MongoDB)**:
  - Real-time ledger recording every diagnostic assessment, solved debug challenge, evaluated interview answer, and completed milestone.
  - Displays activity type icon, title, score percentage, XP earned (+120 XP, +75 XP), and timestamps.

### 📈 3.8. Progress Analytics & Competency Radar
- **5-Axis Competence Spider Radar**: Visualizes Problem Solving, Technical Knowledge, System Design, Communication, and Leadership.
- **Persistent Assessment History Log**: Records scores, dates, and certification statuses from previous attempts.
- **Achievement Badges Showcase**: Unlocks badges such as *Orientation Pioneer*, *Assessment Verified*, *Bug Hunter Elite*, and *Interview Master*.

### 🤖 3.9. AI Career Coach (Server-Side Gemini API Proxy)
- **Model**: `gemini-3.8-flash` via `@google/genai` TypeScript SDK.
- **Personalized Context**: Injects user’s name, target company, role, experience level, and XP into prompt instructions.
- **Graceful Fallback**: If `GEMINI_API_KEY` is not supplied, the system provides high-fidelity deterministic domain guidance without breaking or throwing runtime errors.

---

## 🗄️ 4. Data Persistence & Database Design

### Why SQLite (Local File Database) and Zero MongoDB?
As specified, this platform **strictly does not use MongoDB Atlas or cloud NoSQL databases**. Instead, it uses a **local persistent SQLite-style file database** (`data/easecareer.db.json`):
- **Zero External Dependencies**: Automatically initializes on server boot; no online database clusters or connection strings required.
- **Durable Disk Writes**: Uses atomic temporary file writes (`tmpFile` -> rename) to prevent corruption during concurrent writes.
- **Full Schema Persistence**:
  - `users`: User credentials, password hashes, email verification tokens.
  - `profiles`: Target company, role, track, study hours, timeline.
  - `assessments`: Diagnostic test attempts, scores, demonstrated and improvement skills.
  - `roadmaps`: Skill status (locked, available, completed), progress, and prerequisites.
  - `submissions`: Code submissions, execution times, passed test cases.
  - `practiceRecords`: Interview questions practiced with candidate scores.
  - `activities`: Timestamped stream of all preparation events, XP rewards, and challenge completions.
  - `userStats`: XP, level, daily streaks, unlocked achievement badges.

---

## 🚦 5. API Reference Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account with hashed password |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT bearer token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile, stats, and recent activities |
| `POST` | `/api/onboarding` | Save target company, role, and study preferences |
| `GET` | `/api/assessment/questions` | Retrieve tailored assessment questions for company/role |
| `POST` | `/api/assessment/submit` | Score assessment on backend, log activity, and build roadmap |
| `GET` | `/api/roadmap` | Retrieve user’s personalized skill graph |
| `POST` | `/api/roadmap/skill/:id/checkpoint` | Verify skill completion and unlock downstream prerequisites |
| `GET` | `/api/challenges` | Retrieve all 7 coding challenges |
| `POST` | `/api/challenges/:id/run` | Execute user code in isolated sandbox against visible tests |
| `POST` | `/api/challenges/:id/submit` | Submit code against all tests, duel Gemini, and award +120 XP |
| `GET` | `/api/interviews` | Retrieve 30+ curated interview questions with filter/search |
| `POST` | `/api/interview/evaluate-answer` | **Side-by-side answer correctness analysis**, scoring, and +75 XP |
| `GET` | `/api/user/activities` | Fetch persistent user activity stream from SQLite database |
| `POST` | `/api/coach/chat` | Chat with AI Career Coach (Gemini 3.8 Flash proxy) |

---

## 💻 6. Running the Application Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Variables
Create a `.env` file in the root directory (optional for Gemini AI features):
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If `GEMINI_API_KEY` is not provided, the application runs seamlessly using built-in deterministic rubric evaluators.)*

### Step 3: Run the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000` with the Express API and Vite frontend running simultaneously on the same port.

### Step 4: Build for Production
```bash
npm run build
npm start
```

---

## ✅ 7. Verification Checklist

- [x] **Lamp Login**: Cinematic desk lamp with responsive warm light toggle, animated fireflies, and password show/hide.
- [x] **Zero MongoDB**: Powered entirely by persistent local SQLite file storage (`data/easecareer.db.json`).
- [x] **Clean English Interview Studio**: Removed all Portuguese text; professional English technical copy throughout.
- [x] **Side-by-Side Interview Analysis**: Candidate writes answer on the left; right panel analyzes correctness, score (0-100), STAR breakdown, and covered/missed concepts.
- [x] **30+ Curated Interview Questions**: Covers DSA, Distributed Systems, React/Frontend, Backend & DBs, OS/C++, AI/ML, and Behavioral.
- [x] **Debug Arena Auto-Progression**: Automatically loads the next coding challenge upon completion, with instant Next Challenge button.
- [x] **Live Activity Dashboard**: Every assessment, challenge, and interview is saved into the user's persistent activity ledger and rendered on the Career Dashboard.
- [x] **Zero Linter/Build Errors**: Fully verified TypeScript compilation on Vite & Express.
