import {
  CareerField,
  TargetCompany,
  ExperienceLevel,
  AssessmentQuestion,
  RoadmapSkill,
  DebugProblem,
  InterviewQuestionItem,
} from '../types.js';

export const CAREER_FIELDS: {
  id: CareerField;
  title: string;
  description: string;
  iconName: string;
  popularRoles: string[];
}[] = [
  {
    id: 'Software Development',
    title: 'Software Development',
    description: 'Data structures, algorithms, object-oriented design, and scalable application engineering.',
    iconName: 'Code2',
    popularRoles: ['Software Development Engineer I', 'Full-Stack Developer', 'Core Platform Engineer'],
  },
  {
    id: 'AI and Machine Learning',
    title: 'AI & Machine Learning',
    description: 'Deep learning, LLMs, computer vision, PyTorch, model fine-tuning, and inference pipelines.',
    iconName: 'BrainCircuit',
    popularRoles: ['AI/ML Engineer', 'Applied AI Scientist', 'LLM Application Engineer'],
  },
  {
    id: 'Data Science and Analytics',
    title: 'Data Science & Analytics',
    description: 'Statistical modeling, SQL, data pipelines, predictive analysis, and business intelligence.',
    iconName: 'Database',
    popularRoles: ['Data Scientist', 'Data Engineer', 'Quantitative Analyst'],
  },
  {
    id: 'Embedded Systems and Firmware',
    title: 'Embedded Systems & Firmware',
    description: 'C/C++, microcontrollers, RTOS, memory architecture, hardware protocols (I2C/SPI), and device drivers.',
    iconName: 'Cpu',
    popularRoles: ['Embedded Software Engineer', 'Firmware Developer', 'IoT Systems Engineer'],
  },
  {
    id: 'GPU and Systems Programming',
    title: 'GPU & Systems Programming',
    description: 'CUDA, SIMD acceleration, high-performance computing, compiler optimization, and OS internals.',
    iconName: 'TerminalSquare',
    popularRoles: ['CUDA Kernel Engineer', 'High-Performance Systems Engineer', 'Graphics Engine Programmer'],
  },
  {
    id: 'Cloud Computing',
    title: 'Cloud Computing',
    description: 'AWS, Azure, Kubernetes, microservices architecture, serverless, and cloud resilience.',
    iconName: 'Cloud',
    popularRoles: ['Cloud Solutions Architect', 'DevOps & SRE Engineer', 'Infrastructure Engineer'],
  },
  {
    id: 'Frontend Development',
    title: 'Frontend Development',
    description: 'React, TypeScript, state architecture, browser rendering performance, and accessible UI.',
    iconName: 'Layout',
    popularRoles: ['Frontend Engineer', 'Web Applications Architect', 'UI Performance Engineer'],
  },
  {
    id: 'Backend Development',
    title: 'Backend Development',
    description: 'Distributed systems, REST/gRPC APIs, databases (SQL/NoSQL), caching, and concurrency.',
    iconName: 'Server',
    popularRoles: ['Backend SDE', 'Distributed Systems Engineer', 'API Platform Engineer'],
  },
  {
    id: 'UI/UX Design',
    title: 'UI/UX Design',
    description: 'Design systems, user research, wireframing, interactive prototyping, and design tokens.',
    iconName: 'Palette',
    popularRoles: ['Product Designer', 'Design Systems Engineer', 'UX Researcher'],
  },
  {
    id: 'Product Management',
    title: 'Product Management',
    description: 'Product strategy, metrics, technical roadmaps, stakeholder alignment, and user empathy.',
    iconName: 'Briefcase',
    popularRoles: ['Associate Product Manager', 'Technical Product Manager', 'Growth PM'],
  },
];

export const TARGET_COMPANIES: {
  id: TargetCompany;
  name: string;
  tagline: string;
  hiringTier: string;
  keyFocus: string;
}[] = [
  {
    id: 'Google',
    name: 'Google',
    tagline: 'Organize the world’s information & build at planetary scale.',
    hiringTier: 'Tier 1 Global Tech',
    keyFocus: 'Algorithmic depth, clean code, distributed systems, and Googleyness & Leadership.',
  },
  {
    id: 'Amazon',
    name: 'Amazon',
    tagline: 'Earth’s most customer-centric company and cloud computing pioneer.',
    hiringTier: 'Tier 1 Global Tech',
    keyFocus: 'Leadership Principles (Ownership, Bias for Action), scalable AWS systems, and OOP design.',
  },
  {
    id: 'Microsoft',
    name: 'Microsoft',
    tagline: 'Empower every person and organization on the planet to achieve more.',
    hiringTier: 'Tier 1 Global Tech',
    keyFocus: 'Full-stack engineering, Azure, enterprise microservices, and system architecture.',
  },
  {
    id: 'NVIDIA',
    name: 'NVIDIA',
    tagline: 'The world leader in accelerated computing, GPU chips, and AI.',
    hiringTier: 'AI Hardware & Systems Leader',
    keyFocus: 'Modern C++, CUDA, memory hierarchies, OS internals, and hardware-software co-design.',
  },
  {
    id: 'Adobe',
    name: 'Adobe',
    tagline: 'Creativity, digital media, and digital experience platform.',
    hiringTier: 'Top Product Tier',
    keyFocus: 'Complex client-side rendering, WebAssembly, high-throughput cloud services.',
  },
  {
    id: 'TCS',
    name: 'Tata Consultancy Services',
    tagline: 'Global leader in IT services, consulting, and digital solutions.',
    hiringTier: 'National Top IT Services',
    keyFocus: 'TCS Digital & Ninja tracks: Java/Python, foundational algorithms, SQL, and problem solving.',
  },
  {
    id: 'Infosys',
    name: 'Infosys',
    tagline: 'Navigate your next with AI-first digital enterprise solutions.',
    hiringTier: 'Leading IT Services',
    keyFocus: 'Specialist Programmer (SP) & DSE tracks: Dynamic programming, graphs, DBMS, and OOP.',
  },
  {
    id: 'Wipro',
    name: 'Wipro',
    tagline: 'Transforming businesses with innovative technology solutions.',
    hiringTier: 'Enterprise Services',
    keyFocus: 'Wipro Turbo & Elite tracks: Java/Python programming, relational databases, clean coding.',
  },
  {
    id: 'Other',
    name: 'High-Growth Tech Startups & Product Firms',
    tagline: 'Fast-paced agile environments with direct engineering impact.',
    hiringTier: 'Venture-Backed & Product Tech',
    keyFocus: 'Rapid prototyping, end-to-end full-stack velocity, and practical problem solving.',
  },
];

// Curated Assessment Questions mapped by field
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Software Development / General DSA
  {
    id: 'q-dsa-1',
    field: 'Software Development',
    category: 'Algorithms & Data Structures',
    difficulty: 'Easy',
    question: 'What is the worst-case time complexity of searching for an element in an unsorted array of size N versus a balanced binary search tree (BST)?',
    options: [
      'O(N) for unsorted array, O(log N) for balanced BST',
      'O(log N) for unsorted array, O(N) for balanced BST',
      'O(1) for unsorted array, O(log N) for balanced BST',
      'O(N log N) for unsorted array, O(1) for balanced BST',
    ],
    correctAnswer: 0,
    explanation: 'An unsorted array requires scanning up to N elements linearly in the worst case (O(N)), while a balanced BST divides the search space in half at each step (O(log N)).',
    skillTag: 'Algorithmic Complexity & Big-O',
  },
  {
    id: 'q-dsa-2',
    field: 'Software Development',
    category: 'Algorithms & Data Structures',
    difficulty: 'Medium',
    question: 'Consider the following code snippet using two pointers. What does it return when given `nums = [1, 2, 3, 4, 6]` and `target = 6`?',
    codeSnippet: `function hasPair(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    let sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}`,
    options: [
      '[1, 3] (values 2 and 4)',
      '[0, 4] (values 1 and 6)',
      'null',
      '[2, 2]',
    ],
    correctAnswer: 0,
    explanation: 'At left=0, right=4: 1+6=7 > 6 -> right--. At left=0, right=3: 1+4=5 < 6 -> left++. At left=1, right=3: 2+4=6 === target -> returns indices [1, 3].',
    skillTag: 'Two-Pointer Technique',
  },
  {
    id: 'q-dsa-3',
    field: 'Software Development',
    category: 'System Design & Architecture',
    difficulty: 'Medium',
    question: 'In distributed caching (e.g. Redis/Memcached), what is the "Cache Stampede" (thundering herd) problem and how is it best mitigated?',
    options: [
      'When high-concurrency requests simultaneously miss an expired cache key and all hit the database at once; mitigated with mutex locks or probabilistic early recomputation.',
      'When the cache server runs out of physical memory; mitigated by deleting all keys.',
      'When network packets are dropped between client and cache; mitigated by UDP protocol.',
      'When cache keys are corrupted during serialization; mitigated by JSON schema.',
    ],
    correctAnswer: 0,
    explanation: 'A cache stampede occurs when many concurrent workers simultaneously query an expired key, causing a massive traffic spike on the backend database. Mutual exclusion locks or probabilistic early refreshes protect against it.',
    skillTag: 'Distributed Caching & Concurrency',
  },
  {
    id: 'q-dsa-4',
    field: 'Software Development',
    category: 'OOP & Software Engineering',
    difficulty: 'Hard',
    question: 'Which SOLID principle is directly violated if a derived class overrides a method from its base class by throwing a `NotSupportedException`?',
    options: [
      'Liskov Substitution Principle (LSP)',
      'Single Responsibility Principle (SRP)',
      'Open/Closed Principle (OCP)',
      'Interface Segregation Principle (ISP)',
    ],
    correctAnswer: 0,
    explanation: 'The Liskov Substitution Principle states that objects of a superclass should be replaceable with objects of a subclass without breaking application correctness. Throwing an exception on expected base behavior breaks substitutability.',
    skillTag: 'SOLID Principles & Clean Code',
  },

  // Embedded Systems & Firmware / GPU
  {
    id: 'q-emb-1',
    field: 'Embedded Systems and Firmware',
    category: 'C Pointers & Memory Layout',
    difficulty: 'Easy',
    question: 'On a 32-bit architecture with 4-byte natural word alignment, what is the size of the following struct in C?\n`struct Packet { char flag; int count; short id; };`',
    options: [
      '12 bytes (due to internal and trailing padding)',
      '7 bytes (exact sum of types)',
      '8 bytes',
      '16 bytes',
    ],
    correctAnswer: 0,
    explanation: 'char flag is 1 byte + 3 bytes padding so int count starts at offset 4. int count is 4 bytes (offset 4-7). short id is 2 bytes (offset 8-9) + 2 bytes trailing padding to make total struct size a multiple of 4 = 12 bytes.',
    skillTag: 'Memory Alignment & Padding',
  },
  {
    id: 'q-emb-2',
    field: 'Embedded Systems and Firmware',
    category: 'Hardware & OS Internals',
    difficulty: 'Medium',
    question: 'Why MUST variables shared between an Interrupt Service Routine (ISR) and the main loop in C be declared with the `volatile` keyword?',
    options: [
      'To prevent the compiler optimizer from caching the variable in a CPU register and ignoring asynchronous modifications made by the ISR.',
      'To automatically allocate the variable in high-speed flash ROM.',
      'To guarantee thread-safe atomic operations without hardware mutexes.',
      'To instruct the linker to make the variable read-only.',
    ],
    correctAnswer: 0,
    explanation: 'The volatile keyword tells the C compiler that the value can be altered outside of the local thread flow (e.g., by hardware interrupt or peripheral register), forcing memory re-reads on every access.',
    skillTag: 'Volatile & Interrupt Handling',
  },
  {
    id: 'q-emb-3',
    field: 'Embedded Systems and Firmware',
    category: 'RTOS & Concurrency',
    difficulty: 'Hard',
    question: 'In Real-Time Operating Systems (RTOS), how does Priority Inheritance prevent the Priority Inversion anomaly?',
    options: [
      'A low-priority task holding a mutex needed by a high-priority task temporarily inherits the high task’s priority until releasing the mutex.',
      'It kills any low-priority task that attempts to acquire shared resources.',
      'It forces all tasks to execute in a round-robin schedule with identical time slices.',
      'It disables all hardware interrupts permanently.',
    ],
    correctAnswer: 0,
    explanation: 'Priority Inheritance ensures a medium-priority task cannot preempt a low-priority task that is currently holding a mutex required by a high-priority task, thus preventing priority inversion.',
    skillTag: 'RTOS & Priority Inversion',
  },

  // AI & Machine Learning
  {
    id: 'q-ai-1',
    field: 'AI and Machine Learning',
    category: 'Deep Learning Fundamentals',
    difficulty: 'Easy',
    question: 'What is the primary mathematical reason behind the "vanishing gradient problem" when using the Sigmoid activation function in deep neural networks?',
    options: [
      'The derivative of Sigmoid has a maximum value of 0.25; chaining multiple layers through backpropagation causes gradients to shrink exponentially toward zero.',
      'Sigmoid outputs values strictly greater than 1, causing numeric overflow.',
      'The learning rate is automatically multiplied by zero at each epoch.',
      'Sigmoid cannot be differentiated analytically.',
    ],
    correctAnswer: 0,
    explanation: 'Since d/dx Sigmoid(x) = Sigmoid(x)*(1 - Sigmoid(x)), its maximum derivative is 0.25. In deep networks, multiplying numbers <= 0.25 across many layers causes gradients to vanish.',
    skillTag: 'Neural Network Backpropagation',
  },
  {
    id: 'q-ai-2',
    field: 'AI and Machine Learning',
    category: 'Transformers & LLMs',
    difficulty: 'Medium',
    question: 'In the Scaled Dot-Product Attention mechanism Attention(Q, K, V) = softmax((Q*K^T) / sqrt(d_k)) * V, why is the dot product scaled by 1/sqrt(d_k)?',
    options: [
      'To prevent the dot products from growing excessively large for large dimensions, which would push softmax into regions with extremely small gradients.',
      'To reduce the memory required for storing attention weights.',
      'To enforce that all attention matrices are strictly orthogonal.',
      'To convert matrix multiplication into simple element-wise addition.',
    ],
    correctAnswer: 0,
    explanation: 'For large vector dimensions d_k, dot products grow large in magnitude, causing softmax to yield near-one-hot probabilities where gradients are minuscule. Scaling keeps variance stable at 1.',
    skillTag: 'Transformer Attention Mechanics',
  },

  // Frontend Development
  {
    id: 'q-fe-1',
    field: 'Frontend Development',
    category: 'React Architecture',
    difficulty: 'Medium',
    question: 'In React 18 & 19, what is the primary benefit of `useTransition` when handling state updates triggered by heavy filtering or search typing?',
    options: [
      'It marks the state update as non-urgent, allowing urgent user interactions (like keypresses) to interrupt rendering and keep the UI responsive.',
      'It converts client-side rendering into server-side streaming automatically.',
      'It memoizes the return value permanently in localStorage.',
      'It forces React to bypass the Virtual DOM and mutate the real DOM directly.',
    ],
    correctAnswer: 0,
    explanation: '`useTransition` allows developers to prioritize urgent updates (like typing in an input) over transitions (like rendering a filtered list of 1,000 items), preventing UI freezes.',
    skillTag: 'React Concurrent Mode & Transitions',
  },
  {
    id: 'q-fe-2',
    field: 'Frontend Development',
    category: 'Browser Performance & Rendering',
    difficulty: 'Hard',
    question: 'Which of the following CSS property mutations triggers GPU compositing ONLY, without triggering layout (reflow) or paint?',
    options: [
      '`transform` and `opacity`',
      '`width` and `height`',
      '`margin-top` and `padding`',
      '`border-width` and `color`',
    ],
    correctAnswer: 0,
    explanation: 'Mutating `transform` or `opacity` can be handled directly by the GPU compositor thread without forcing the browser engine to recalculate layout geometry or repaint pixels.',
    skillTag: 'Browser Rendering & GPU Compositing',
  },
];

// Helper to get questions for chosen field or fallback
export function getAssessmentQuestionsForField(field: CareerField): AssessmentQuestion[] {
  const specific = ASSESSMENT_QUESTIONS.filter((q) => q.field === field);
  if (specific.length >= 3) {
    return specific;
  }
  // Fill with general Software Dev questions
  const generals = ASSESSMENT_QUESTIONS.filter((q) => q.field === 'Software Development');
  return [...specific, ...generals].slice(0, 4);
}

// Generate a tailored roadmap based on field, company, and assessment outcome
export function generateTailoredRoadmap(
  field: CareerField,
  company: TargetCompany,
  role: string,
  demonstratedSkills: string[],
  improvementSkills: string[]
): RoadmapSkill[] {
  // Foundational skills tailored to field
  const baseSkills: {
    id: string;
    name: string;
    category: 'core' | 'specialized' | 'tools' | 'architecture';
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    description: string;
    estimatedHours: number;
    prerequisites: string[];
    resources: { title: string; url: string; type: 'doc' | 'video' | 'practice' }[];
    interviewQuestions: string[];
    codingTasks: string[];
  }[] = [
    {
      id: 'skill-core-1',
      name: field === 'Embedded Systems and Firmware' ? 'C Fundamentals & Memory Pointers' : 'Data Structures: Arrays, Maps & Two-Pointers',
      category: 'core',
      difficulty: 'Beginner',
      description: 'Foundational primitives, pointer/reference semantics, and baseline Big-O time and space complexity.',
      estimatedHours: 20,
      prerequisites: [],
      resources: [
        { title: 'Core Language Specification', url: 'https://developer.mozilla.org', type: 'doc' },
        { title: 'Data Structures Visualized', url: 'https://visualgo.net', type: 'practice' },
      ],
      interviewQuestions: [
        `How does ${company} evaluate space complexity in in-place array transformations?`,
        'Explain the difference between stack and heap memory allocation.',
      ],
      codingTasks: ['Two Sum Two-Pointer Fix', 'In-Place Duplicate Removal'],
    },
    {
      id: 'skill-core-2',
      name: field === 'Embedded Systems and Firmware' ? 'Struct Alignment, Bitwise Ops & Volatile' : 'Non-Linear Structures: Trees, Graphs & BFS/DFS',
      category: 'core',
      difficulty: 'Intermediate',
      description: 'Tree traversals, cycle detection, topological sorting, and recursive vs iterative backtracking.',
      estimatedHours: 35,
      prerequisites: ['skill-core-1'],
      resources: [
        { title: 'Graph Theory & Dijkstra Deep Dive', url: 'https://ocw.mit.edu', type: 'video' },
        { title: 'Tree Traversal Interactive Guide', url: 'https://leetcode.com', type: 'practice' },
      ],
      interviewQuestions: [
        'How would you detect a deadlock or cyclic dependency in a package resolver?',
        'When is BFS strictly preferred over DFS for shortest-path queries?',
      ],
      codingTasks: ['Binary Tree Level Order Traversal', 'Course Schedule Dependency Cycle'],
    },
    {
      id: 'skill-specialized-1',
      name: field === 'Embedded Systems and Firmware' ? 'RTOS Internals, Mutexes & Priority Inversion' : 'Concurrency, Asynchronous I/O & Event Loops',
      category: 'specialized',
      difficulty: 'Advanced',
      description: 'Race condition prevention, thread synchronization, mutex lock patterns, and asynchronous task scheduling.',
      estimatedHours: 40,
      prerequisites: ['skill-core-1'],
      resources: [
        { title: 'Operating Systems: Three Easy Pieces', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', type: 'doc' },
        { title: 'Modern Concurrency Patterns', url: 'https://github.com', type: 'practice' },
      ],
      interviewQuestions: [
        `Describe how ${company} microservices avoid race conditions during concurrent user updates.`,
        'What is priority inversion and how does priority inheritance resolve it?',
      ],
      codingTasks: ['Thread-Safe Bounded Queue', 'Rate Limiter Token Bucket'],
    },
    {
      id: 'skill-architecture-1',
      name: `${company} System Design & Architecture Standards`,
      category: 'architecture',
      difficulty: 'Advanced',
      description: `Designing scalable, fault-tolerant solutions aligned with ${company}’s production reliability and hiring rubrics.`,
      estimatedHours: 50,
      prerequisites: ['skill-core-2', 'skill-specialized-1'],
      resources: [
        { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net', type: 'doc' },
        { title: `${company} Engineering Architecture Papers`, url: 'https://research.google', type: 'doc' },
      ],
      interviewQuestions: [
        `Walk through designing a globally distributed notification service for ${company}.`,
        'How do you design for graceful degradation when downstream services timeout?',
      ],
      codingTasks: ['Design an LRU Cache with O(1) Operations', 'Distributed ID Generator'],
    },
  ];

  return baseSkills.map((s, index) => {
    const isDemonstrated = demonstratedSkills.some((d) => s.name.toLowerCase().includes(d.toLowerCase()) || index === 0);
    const needsImprovement = improvementSkills.some((imp) => s.name.toLowerCase().includes(imp.toLowerCase()));

    let status: 'demonstrated' | 'in-progress' | 'prerequisite_needed' | 'locked' = 'locked';
    let progress = 0;

    if (isDemonstrated) {
      status = 'demonstrated';
      progress = 100;
    } else if (index === 1 || needsImprovement) {
      status = 'in-progress';
      progress = 35;
    } else if (index === 2) {
      status = 'prerequisite_needed';
      progress = 0;
    }

    return {
      ...s,
      status,
      progress,
      completed: status === 'demonstrated',
    };
  });
}

// Debug Arena Problems
export const DEBUG_PROBLEMS: DebugProblem[] = [
  {
    id: 'prob-two-pointer-bug',
    title: 'Valid Palindrome with Alphanumeric Normalization',
    difficulty: 'Easy',
    category: 'Strings & Two-Pointers',
    description: `A junior developer submitted a function \`isPalindrome(s)\` intended to return \`true\` if a string is a palindrome after converting all uppercase letters to lowercase and removing all non-alphanumeric characters.
    
However, the current code contains critical bugs:
1. An off-by-one pointer initialization.
2. Inverted pointer increment inside the loop.
3. Missing boundary checks that cause undefined char comparisons.

Fix the function so it operates in O(N) time and O(1) extra space!`,
    language: 'javascript',
    sampleInput: `"A man, a plan, a canal: Panama"`,
    sampleOutput: `true`,
    buggyCode: `function isPalindrome(s) {
  // BUGGY IMPLEMENTATION
  let left = 0;
  let right = s.length; // BUG: off by one!

  while (left <= right) {
    let charL = s[left] ? s[left].toLowerCase() : '';
    let charR = s[right] ? s[right].toLowerCase() : '';

    if (!/[a-z0-9]/.test(charL)) {
      left++;
      continue;
    }
    if (!/[a-z0-9]/.test(charR)) {
      right--;
      continue;
    }

    if (charL !== charR) {
      return false;
    }
    left++;
    right++; // BUG: increments instead of decrementing right!
  }

  return true;
}`,
    geminiSolution: `function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) {
      left++;
    }
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) {
      right--;
    }

    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}`,
    geminiExplanation: `Gemini used a clean while-loop converging pointers inward. Instead of evaluating chars one by one with restart continues, nested while-loops fast-forward past punctuation in O(1) amortized time without mutating the string.`,
    testCases: [
      { id: 1, input: '"A man, a plan, a canal: Panama"', expected: 'true' },
      { id: 2, input: '"race a car"', expected: 'false' },
      { id: 3, input: '"   .,:; "', expected: 'true' },
      { id: 4, input: '"0P0"', expected: 'true', isHidden: true },
    ],
  },
  {
    id: 'prob-binary-search-bug',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    category: 'Binary Search & Overflow',
    description: `Given a rotated sorted array \`nums\` and a target integer, return the index of \`target\`, or \`-1\` if not found.
    
The submitted code suffers from an infinite loop bug when calculating midpoints and flawed branch logic regarding which half is strictly sorted.`,
    language: 'javascript',
    sampleInput: `[4,5,6,7,0,1,2], target = 0`,
    sampleOutput: `4`,
    buggyCode: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) { // BUG: Misses single-element target check
    let mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      // BUG: Missing boundary comparison with target
      if (nums[left] < target && target < nums[mid]) {
        right = mid;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
  }

  return -1;
}`,
    geminiSolution: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}`,
    geminiExplanation: `Gemini corrected loop condition to left <= right, adjusted midpoint increments mid - 1 to prevent infinite recursion, and included <= equality bounds for nums[left].`,
    testCases: [
      { id: 1, input: '[4,5,6,7,0,1,2], 0', expected: '4' },
      { id: 2, input: '[4,5,6,7,0,1,2], 3', expected: '-1' },
      { id: 3, input: '[1], 1', expected: '0' },
      { id: 4, input: '[3,1], 1', expected: '1', isHidden: true },
    ],
  },
];

// Curated Interview Questions
export const INTERVIEW_QUESTIONS: InterviewQuestionItem[] = [
  {
    id: 'int-1',
    company: 'Google',
    roleCategory: 'Software Engineering',
    type: 'technical',
    question: 'How does Google handle eventual consistency versus strong consistency in global databases like Spanner?',
    difficulty: 'Hard',
    hint: 'Think about TrueTime API, GPS receivers, and atomic clocks synchronized across datacenters.',
    suggestedAnswer: 'Google Spanner utilizes the TrueTime API, which relies on atomic clocks and GPS receivers to provide bounded time uncertainty (typically <7ms). This allows Spanner to assign globally monotonic commit timestamps and provide externally consistent (linearizable) transactions without blocking read operations.',
    keyPoints: [
      'TrueTime API bounded clock skew',
      'Two-phase commit combined with Paxos consensus',
      'Snapshot isolation with non-blocking reads',
    ],
  },
  {
    id: 'int-2',
    company: 'NVIDIA',
    roleCategory: 'Systems & Embedded',
    type: 'technical',
    question: 'Explain Warp Divergence in GPU programming and how it impacts SIMT execution efficiency.',
    difficulty: 'Medium',
    hint: 'Consider what happens when threads within a 32-thread warp take different branches of an if-else statement.',
    suggestedAnswer: 'In NVIDIA CUDA microarchitecture, 32 threads execute in lockstep as a warp. When conditional branching causes threads to diverge (e.g. half take the if-path and half take the else-path), the warp must execute both branches serially while disabling non-active threads, cutting hardware utilization in half.',
    keyPoints: [
      '32 threads execute concurrently in lockstep (SIMT)',
      'Serial execution of diverging execution branches',
      'Mitigated by branch reorganization and warp-level primitives',
    ],
  },
  {
    id: 'int-3',
    company: 'Amazon',
    roleCategory: 'All Engineering',
    type: 'hr',
    question: 'Tell me about a time you took a calculated risk and failed, but learned an invaluable technical lesson. (Amazon LP: Bias for Action & Ownership)',
    difficulty: 'Medium',
    hint: 'Use the STAR format: Situation, Task, Action, Result. Emphasize self-reflection and mitigation.',
    suggestedAnswer: 'During our college final-year project, we needed a caching layer under tight deadlines. I made the call to use an in-memory custom dictionary instead of setting up Redis. Under load tests, memory leaked. I owned the issue, benchmarked Redis, re-architected the serialization pipeline overnight, and added automated memory thresholds.',
    keyPoints: [
      'Clear Situation, Task, Action, Result (STAR method)',
      'Accountability without blaming external factors',
      'Systematic post-mortem analysis and preventive guardrails',
    ],
  },
  {
    id: 'int-4',
    company: 'Microsoft',
    roleCategory: 'Full-Stack',
    type: 'technical',
    question: 'How do you design a real-time collaborative document editor that prevents conflicting simultaneous edits?',
    difficulty: 'Hard',
    hint: 'Contrast Operational Transformation (OT) with Conflict-free Replicated Data Types (CRDTs).',
    suggestedAnswer: 'Collaborative editing can be achieved via either Operational Transformation (central server transforms operations against client states) or CRDTs (decentralized data structures where concurrent operations commute deterministically, e.g. Yjs or Automerge). CRDTs are favored for peer-to-peer and offline-first resiliency.',
    keyPoints: [
      'Operational Transformation vs CRDT comparison',
      'Vector clocks and causality tracking',
      'Network latency masking with optimistic local mutation',
    ],
  },
  {
    id: 'int-5',
    company: 'TCS',
    roleCategory: 'Digital / Enterprise',
    type: 'technical',
    question: 'Explain the difference between Primary Key, Unique Key, and Candidate Key in relational databases.',
    difficulty: 'Easy',
    hint: 'Consider nullability rules and uniqueness constraints in SQL.',
    suggestedAnswer: 'A Candidate Key is any minimal set of attributes that can uniquely identify a tuple. The Primary Key is the chosen candidate key (cannot accept NULL values, only one per table). A Unique Key also enforces uniqueness, but allows one NULL value and a table can have multiple unique keys.',
    keyPoints: [
      'Primary Key does not accept NULL values',
      'Unique Key allows one NULL value in standard SQL',
      'Candidate Keys are all minimal superkeys eligible to become primary',
    ],
  },
];
