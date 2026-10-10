export interface SkillNode {
  id: string;
  name: string;
  category: 'core' | 'specialized' | 'tools' | 'architecture';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  targetProficiency: number; // 1 to 5
  estimatedHours: number;
  prerequisites: string[];
  resources: { title: string; url: string; type: 'doc' | 'video' | 'practice' }[];
}

export interface CompanyRole {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  domain: string;
  experienceLevel: string;
  salaryRangeEstimate: string;
  verifiedDate: string;
  source: string;
  overview: string;
  requiredSkills: string[];
  recommendedSkills: string[];
  hiringRounds: string[];
  skillGraph: {
    nodes: SkillNode[];
  };
}

export interface DebugChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeLimitSeconds: number;
  description: string;
  buggyCode: string;
  language: string;
  solutionHint: string;
  starterFunctionSignature: string;
  testCases: {
    id: number;
    description: string;
    input: any[];
    expected: any;
    isHidden?: boolean;
  }[];
}

export const COMPANIES_DATA = [
  {
    id: 'google',
    name: 'Google',
    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=120&auto=format&fit=crop&q=80',
    tier: 'Tier 1 Product',
    category: 'Big Tech',
    hiringSeason: 'Year-round / Summer Internships',
    headquarters: 'Mountain View, California',
    rolesCount: 2,
    description: 'Focuses heavily on algorithmic depth, distributed systems, clean code, and Googleyness & Leadership principles.',
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
    tier: 'Hardware & AI Leader',
    category: 'Accelerated Computing & AI',
    hiringSeason: 'Aug - Nov / Campus Drives',
    headquarters: 'Santa Clara, California',
    rolesCount: 2,
    description: 'Pioneers in GPUs and AI chips. Heavy emphasis on C++, CUDA, memory hierarchies, OS internals, and hardware-software co-design.',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://images.unsplash.com/photo-1523474253243-383be99594b1?w=120&auto=format&fit=crop&q=80',
    tier: 'Tier 1 Product',
    category: 'Cloud & E-Commerce',
    hiringSeason: 'Fall / Spring SDE Hiring',
    headquarters: 'Seattle, Washington',
    rolesCount: 2,
    description: 'Demands rock-solid knowledge of AWS, microservices, concurrency, scale, and customer obsession Leadership Principles.',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'https://images.unsplash.com/photo-1642132652809-8c9096791b97?w=120&auto=format&fit=crop&q=80',
    tier: 'Tier 1 Product',
    category: 'Cloud, OS & Enterprise',
    hiringSeason: 'Campus & Off-Campus Drives',
    headquarters: 'Redmond, Washington',
    rolesCount: 1,
    description: 'Emphasizes full-stack engineering, Azure cloud, scalable TypeScript/C# backends, and low-latency system design.',
  },
  {
    id: 'tcs',
    name: 'Tata Consultancy Services (TCS)',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
    tier: 'National Top IT',
    category: 'Global IT Services',
    hiringSeason: 'TCS NQT (National Qualifier Test)',
    headquarters: 'Mumbai, India',
    rolesCount: 2,
    description: 'Primary hiring tracks: TCS Ninja & TCS Digital (Prime). Focuses on Java, Python, SQL, foundational DSA, and cognitive problem-solving.',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=120&auto=format&fit=crop&q=80',
    tier: 'Tier 1 Streaming & Infrastructure',
    category: 'Entertainment & Cloud Tech',
    hiringSeason: 'Direct Openings & Internships',
    headquarters: 'Los Gatos, California',
    rolesCount: 1,
    description: 'Known for ultra-high frontend engineering standards, client-side resilience, WebGL rendering, and Netflix Culture memos.',
  },
  {
    id: 'adobe',
    name: 'Adobe',
    logo: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=120&auto=format&fit=crop&q=80',
    tier: 'Product & Creative Cloud',
    category: 'Digital Media & AI',
    hiringSeason: 'Campus Placement & SheCodes',
    headquarters: 'San Jose, California',
    rolesCount: 1,
    description: 'Great mix of complex client-side graphics engines (Canvas/WebGL), C++ WebAssembly modules, and cloud microservices.',
  },
  {
    id: 'infosys',
    name: 'Infosys',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
    tier: 'Leading IT Services',
    category: 'Enterprise Consulting',
    hiringSeason: 'InfyTQ & HackWithInfy',
    headquarters: 'Bengaluru, India',
    rolesCount: 1,
    description: 'Specialist Programmer (SP) and Digital Specialist Engineer (DSE) tracks reward competitive programmers in DP, Graphs, and DBMS.',
  },
  {
    id: 'capgemini',
    name: 'Capgemini',
    logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=120&auto=format&fit=crop&q=80',
    tier: 'Global Consulting',
    category: 'Digital Transformation',
    hiringSeason: 'Exceller Campus Drives',
    headquarters: 'Paris, France / Pan-India Hubs',
    rolesCount: 1,
    description: 'Assesses cloud-native software engineering, Spring Boot/Node microservices, API security, and collaborative problem solving.',
  },
  {
    id: 'wipro',
    name: 'Wipro',
    logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=120&auto=format&fit=crop&q=80',
    tier: 'Enterprise Services',
    category: 'Cloud & System Integration',
    hiringSeason: 'Elite National Talent Hunt',
    headquarters: 'Bengaluru, India',
    rolesCount: 1,
    description: 'Wipro Turbo & Elite tracks evaluate algorithmic problem solving, clean code standards, OOP design, and RDBMS.',
  }
];

export const ROLES_DATA: CompanyRole[] = [
  {
    id: 'google-swe',
    companyId: 'google',
    companyName: 'Google',
    title: 'Software Engineer - Web & Distributed Systems',
    domain: 'Software Engineering / Full Stack',
    experienceLevel: 'Entry Level / Early Career (0-2 Yrs)',
    salaryRangeEstimate: '₹22 - 38 LPA (India CTC Base+RSU)',
    verifiedDate: 'October 2024 (Verified Careers Portal)',
    source: 'Google Student Careers & Engineering Job Board',
    overview: 'Design, test, deploy, and maintain software solutions across Google search, cloud, and core developer infrastructure.',
    requiredSkills: ['Data Structures & Algorithms', 'System Architecture', 'Modern JavaScript / TypeScript', 'Concurrency & Asynchronous I/O'],
    recommendedSkills: ['Go or C++', 'Protocol Buffers', 'Distributed Caching', 'Kubernetes Basics'],
    hiringRounds: [
      'Round 1: Online Assessment (2 Algorithmic Problems, 90 mins)',
      'Round 2: Technical Phone Screen (Live Coding on Google Docs / CoderPad)',
      'Round 3 & 4: Virtual Onsite Coding (Advanced DSA, Edge-case analysis)',
      'Round 5: System & Architecture / Googleyness & Behavioral'
    ],
    skillGraph: {
      nodes: [
        {
          id: 'prog-basics',
          name: 'Programming Fundamentals',
          category: 'core',
          difficulty: 'Beginner',
          description: 'Control flow, functions, memory references, and algorithmic complexity (Big-O analysis).',
          targetProficiency: 5,
          estimatedHours: 25,
          prerequisites: [],
          resources: [
            { title: 'MIT 6.0001: Intro to CS', url: 'https://ocw.mit.edu', type: 'video' },
            { title: 'Language Standard Specs', url: 'https://developer.mozilla.org', type: 'doc' },
          ]
        },
        {
          id: 'dsa-arrays',
          name: 'Arrays, Two-Pointers & Sliding Window',
          category: 'core',
          difficulty: 'Intermediate',
          description: 'Linear data structures, in-place mutations, two-pointer convergence, and monotonic queues.',
          targetProficiency: 5,
          estimatedHours: 35,
          prerequisites: ['prog-basics'],
          resources: [
            { title: 'Sliding Window Mastery Guide', url: 'https://leetcode.com', type: 'practice' },
            { title: 'Array Memory Contiguity Notes', url: 'https://geeksforgeeks.org', type: 'doc' }
          ]
        },
        {
          id: 'dsa-trees-graphs',
          name: 'Trees, Graphs & Dynamic Programming',
          category: 'core',
          difficulty: 'Advanced',
          description: 'DFS/BFS, Dijkstra, Topological Sort, Memoization, and Tabulation state transitions.',
          targetProficiency: 5,
          estimatedHours: 60,
          prerequisites: ['dsa-arrays'],
          resources: [
            { title: 'Graph Theory Visualized', url: 'https://visualgo.net', type: 'video' },
            { title: 'Dynamic Programming Patterns', url: 'https://github.com', type: 'practice' }
          ]
        },
        {
          id: 'sys-concurrency',
          name: 'Concurrency & Event Loops',
          category: 'specialized',
          difficulty: 'Advanced',
          description: 'Race condition prevention, thread safety, asynchronous promises, microtasks vs macrotasks.',
          targetProficiency: 4,
          estimatedHours: 30,
          prerequisites: ['prog-basics'],
          resources: [
            { title: 'Node.js / V8 Event Loop Deep Dive', url: 'https://nodejs.org', type: 'doc' }
          ]
        },
        {
          id: 'distributed-caching',
          name: 'Distributed Caching & Sharding',
          category: 'architecture',
          difficulty: 'Advanced',
          description: 'Consistent hashing, cache invalidation strategies (Write-through vs Write-back), Redis cluster topologies.',
          targetProficiency: 4,
          estimatedHours: 40,
          prerequisites: ['sys-concurrency', 'dsa-trees-graphs'],
          resources: [
            { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net', type: 'doc' }
          ]
        }
      ]
    }
  },
  {
    id: 'nvidia-embedded',
    companyId: 'nvidia',
    companyName: 'NVIDIA',
    title: 'Embedded Systems & AI Hardware Engineer',
    domain: 'Embedded Systems / Hardware-Software Co-Design',
    experienceLevel: 'Entry Level / University Graduate',
    salaryRangeEstimate: '₹20 - 36 LPA (India CTC Base+Stocks)',
    verifiedDate: 'September 2024 (Verified Campus Drives)',
    source: 'NVIDIA University Recruiting & Hardware Engineering',
    overview: 'Develop low-level device drivers, firmware, and accelerated execution pipelines for NVIDIA Jetson and GPU microarchitectures.',
    requiredSkills: ['C/C++ (Modern C++17/20)', 'Operating Systems & Memory Hierarchy', 'Computer Architecture', 'Microcontroller / RTOS Programming'],
    recommendedSkills: ['CUDA Basics', 'Linux Kernel Modules', 'Bus Protocols (I2C, SPI, PCIe)', 'Assembly (ARM/x86)'],
    hiringRounds: [
      'Round 1: Hardware & C Programming Online Test (90 mins)',
      'Round 2: Low-Level C/C++ Pointers, Volatile, Bit Manipulation Round',
      'Round 3: OS Kernel, Interrupts, Cache-Coherence & Memory Architecture',
      'Round 4: System Design for Embedded Constraints / Problem Solving'
    ],
    skillGraph: {
      nodes: [
        {
          id: 'c-pointers-memory',
          name: 'C Pointers, Memory & Struct Alignment',
          category: 'core',
          difficulty: 'Intermediate',
          description: 'Manual memory layout, pointer arithmetic, padding, packing, stack vs heap, and valgrind debugging.',
          targetProficiency: 5,
          estimatedHours: 40,
          prerequisites: [],
          resources: [
            { title: 'The C Programming Language (K&R)', url: 'https://iso-9899.info', type: 'doc' }
          ]
        },
        {
          id: 'os-internals',
          name: 'OS Internals, Interrupts & Virtual Memory',
          category: 'core',
          difficulty: 'Advanced',
          description: 'Page tables, TLB, ISRs (Interrupt Service Routines), race conditions, and mutex spinlocks.',
          targetProficiency: 5,
          estimatedHours: 50,
          prerequisites: ['c-pointers-memory'],
          resources: [
            { title: 'OSTEP: Three Easy Pieces', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', type: 'doc' }
          ]
        },
        {
          id: 'hardware-buses',
          name: 'Hardware Communication Protocols (I2C, SPI, UART, PCIe)',
          category: 'specialized',
          difficulty: 'Intermediate',
          description: 'Master-slave clock polarity, DMA transfers, baud rates, and timing diagrams.',
          targetProficiency: 4,
          estimatedHours: 30,
          prerequisites: ['c-pointers-memory'],
          resources: [
            { title: 'Embedded Bus Protocols Guide', url: 'https://embedded.fm', type: 'video' }
          ]
        },
        {
          id: 'cuda-parallel',
          name: 'Parallel Programming & CUDA Basics',
          category: 'architecture',
          difficulty: 'Advanced',
          description: 'SIMD vs SIMT, warp divergence, shared memory banks, kernel grid dimensions, and memory coalescing.',
          targetProficiency: 4,
          estimatedHours: 45,
          prerequisites: ['os-internals', 'c-pointers-memory'],
          resources: [
            { title: 'NVIDIA CUDA C++ Programming Guide', url: 'https://docs.nvidia.com/cuda/', type: 'doc' }
          ]
        }
      ]
    }
  },
  {
    id: 'amazon-backend',
    companyId: 'amazon',
    companyName: 'Amazon',
    title: 'Software Development Engineer I (AWS / Backend)',
    domain: 'Cloud Services & Distributed Architecture',
    experienceLevel: '0 - 1 Years (New Grad)',
    salaryRangeEstimate: '₹28 - 44 LPA (Total Compensation)',
    verifiedDate: 'November 2024',
    source: 'Amazon University Recruiting',
    overview: 'Build highly scalable, fault-tolerant customer-facing services that process millions of requests per second on AWS.',
    requiredSkills: ['Object-Oriented Design (Java/Python/TypeScript)', 'Data Structures & Algorithms', 'RESTful API Architecture', 'Relational & NoSQL Databases'],
    recommendedSkills: ['AWS Lambda & DynamoDB', 'Message Queues (SQS/Kafka)', 'Idempotency in Distributed Transactions'],
    hiringRounds: [
      'Round 1: Online Assessment 1 (Debugging + Coding)',
      'Round 2: Online Assessment 2 (Work Styles Simulation / LP)',
      'Round 3-5: Virtual Loop (DSA, Low-Level Object Oriented Design, Leadership Principles)'
    ],
    skillGraph: {
      nodes: [
        {
          id: 'ood-patterns',
          name: 'Object-Oriented Design & SOLID Principles',
          category: 'core',
          difficulty: 'Intermediate',
          description: 'Factory, Observer, Strategy, Dependency Injection, and loose coupling for production services.',
          targetProficiency: 5,
          estimatedHours: 35,
          prerequisites: [],
          resources: [{ title: 'Refactoring Guru: Design Patterns', url: 'https://refactoring.guru', type: 'doc' }]
        },
        {
          id: 'rest-microservices',
          name: 'RESTful API Design & Validation',
          category: 'core',
          difficulty: 'Intermediate',
          description: 'HTTP status codes, idempotency, rate limiting, and schema validation with Zod / OpenAPI.',
          targetProficiency: 4,
          estimatedHours: 25,
          prerequisites: ['ood-patterns'],
          resources: [{ title: 'REST API Best Practices', url: 'https://restfulapi.net', type: 'doc' }]
        },
        {
          id: 'db-nosql-sql',
          name: 'Database Modeling (SQL vs DynamoDB/MongoDB)',
          category: 'specialized',
          difficulty: 'Advanced',
          description: 'ACID transactions, B-Tree indexes, NoSQL single-table designs, and read/write scaling.',
          targetProficiency: 4,
          estimatedHours: 40,
          prerequisites: ['rest-microservices'],
          resources: [{ title: 'DynamoDB Deep Dive', url: 'https://aws.amazon.com', type: 'video' }]
        }
      ]
    }
  },
  {
    id: 'tcs-digital',
    companyId: 'tcs',
    companyName: 'Tata Consultancy Services',
    title: 'TCS Digital Engineer (Prime/Digital Cadre)',
    domain: 'Software Engineering / Full Stack Enterprise',
    experienceLevel: 'Fresher (Campus)',
    salaryRangeEstimate: '₹7.5 - 9.0 LPA',
    verifiedDate: 'September 2024 (TCS NQT Portal)',
    source: 'TCS National Qualifier Test Official Notification',
    overview: 'Elite hiring cadre of TCS that works on cutting-edge client transformation, AI bots, Cloud ERP, and full-stack solutions.',
    requiredSkills: ['Problem Solving & DSA in Java or Python', 'SQL & Database Queries', 'Object-Oriented Programming', 'Web Technologies Basics'],
    recommendedSkills: ['Spring Boot / FastAPI', 'Git Workflow', 'Docker Basics'],
    hiringRounds: [
      'Round 1: TCS NQT Cognitive + Advanced Coding Test (2 Questions in 60 mins)',
      'Round 2: Technical Interview (Code explanation, SQL Joins, OOP Concepts)',
      'Round 3: HR & Management Interview'
    ],
    skillGraph: {
      nodes: [
        {
          id: 'java-py-core',
          name: 'Core Java & Python Proficiency',
          category: 'core',
          difficulty: 'Intermediate',
          description: 'Collections framework, Exception handling, Streams, List comprehensions, and Memory models.',
          targetProficiency: 4,
          estimatedHours: 30,
          prerequisites: [],
          resources: [{ title: 'Java Documentation Oracle', url: 'https://docs.oracle.com', type: 'doc' }]
        },
        {
          id: 'sql-dbms',
          name: 'SQL Joins, Indexing & Aggregations',
          category: 'core',
          difficulty: 'Intermediate',
          description: 'Subqueries, Window functions, Normalization (1NF to 3NF), and Foreign Key constraints.',
          targetProficiency: 4,
          estimatedHours: 25,
          prerequisites: [],
          resources: [{ title: 'SQL Zoo Interactive Practice', url: 'https://sqlzoo.net', type: 'practice' }]
        },
        {
          id: 'tcs-dsa-advanced',
          name: 'TCS Digital Advanced Coding Patterns',
          category: 'specialized',
          difficulty: 'Intermediate',
          description: 'String manipulation, Sliding window, GCD/Number theory, and Greedy algorithms.',
          targetProficiency: 4,
          estimatedHours: 35,
          prerequisites: ['java-py-core'],
          resources: [{ title: 'NQT Past Coding Papers', url: 'https://prepinsta.com', type: 'practice' }]
        }
      ]
    }
  }
];

export const DEBUG_CHALLENGES: DebugChallenge[] = [
  {
    id: 'ch-palindrome-two-pointer',
    title: 'Valid Palindrome with Special Character Filtering',
    difficulty: 'Easy',
    category: 'Strings & Two-Pointers',
    timeLimitSeconds: 600, // 10 minutes
    description: `A junior engineer wrote a function \`isPalindrome(s)\` that should return \`true\` if a string is a palindrome after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters.
    
However, the code currently fails on edge cases with punctuation, empty strings, and off-by-one pointer increments. Fix the function so that it runs in O(N) time and O(1) auxiliary space!`,
    language: 'javascript',
    solutionHint: 'Verify your alphanumeric check regex / charCode boundary and make sure both pointers advance safely when skipping non-alphanumeric characters.',
    starterFunctionSignature: 'function isPalindrome(s) {',
    buggyCode: `function isPalindrome(s) {
  // BUGGY IMPLEMENTATION
  let left = 0;
  let right = s.length; // BUG: off by one!

  while (left <= right) {
    let charL = s[left].toLowerCase();
    let charR = s[right].toLowerCase();

    // BUG: Regex skips without checking bounds, leading to undefined access
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
    right++; // BUG: Should decrement right!
  }

  return true;
}`,
    testCases: [
      {
        id: 1,
        description: 'Standard phrase with spaces and comma',
        input: ['A man, a plan, a canal: Panama'],
        expected: true
      },
      {
        id: 2,
        description: 'Non-palindrome string',
        input: ['race a car'],
        expected: false
      },
      {
        id: 3,
        description: 'Empty string / punctuation only',
        input: ['   .,:; '],
        expected: true
      },
      {
        id: 4,
        description: 'Single character alphanumeric',
        input: ['a.'],
        expected: true
      },
      {
        id: 5,
        description: 'Numbers and letters mixed palindrome',
        input: ['0P0'],
        expected: true,
        isHidden: true
      }
    ]
  },
  {
    id: 'ch-binary-search-overflow',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    category: 'Binary Search & Off-by-One',
    timeLimitSeconds: 600,
    description: `Given an integer array \`nums\` sorted in ascending order (with distinct values) that has been rotated at an unknown pivot index, and a \`target\` integer.
    
Find the index of \`target\` in \`nums\`, or \`-1\` if not found. You must write an algorithm with \`O(log n)\` runtime complexity.
    
The submitted code suffers from an infinite loop bug when calculating the midpoint and faulty condition checks for the rotated halves.`,
    language: 'javascript',
    solutionHint: 'Check which half is strictly sorted (left or right) before deciding where to shrink your search window.',
    starterFunctionSignature: 'function search(nums, target) {',
    buggyCode: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) { // BUG: Should be left <= right
    let mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    // Check if left half is sorted
    if (nums[left] <= nums[mid]) {
      // BUG: Condition misses equality check with target
      if (nums[left] < target && target < nums[mid]) {
        right = mid; // BUG: Should be mid - 1
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid; // BUG: Should be mid - 1
      }
    }
  }

  return -1;
}`,
    testCases: [
      {
        id: 1,
        description: 'Target exists in rotated array',
        input: [[4, 5, 6, 7, 0, 1, 2], 0],
        expected: 4
      },
      {
        id: 2,
        description: 'Target does not exist in array',
        input: [[4, 5, 6, 7, 0, 1, 2], 3],
        expected: -1
      },
      {
        id: 3,
        description: 'Single element matches target',
        input: [[1], 1],
        expected: 0
      },
      {
        id: 4,
        description: 'Two elements rotated, target at right end',
        input: [[3, 1], 1],
        expected: 1
      },
      {
        id: 5,
        description: 'Target at index 0 of non-rotated segment',
        input: [[5, 1, 3], 5],
        expected: 0,
        isHidden: true
      }
    ]
  },
  {
    id: 'ch-merge-intervals',
    title: 'Merge Overlapping Intervals',
    difficulty: 'Medium',
    category: 'Arrays & Sorting',
    timeLimitSeconds: 600,
    description: `Given an array of \`intervals\` where \`intervals[i] = [start, end]\`, merge all overlapping intervals, and return an array of non-overlapping intervals that cover all intervals in the input.
    
The buggy solution does not sort properly and modifies the array in-place destructively, leading to skipped intervals and bad end-bounds.`,
    language: 'javascript',
    solutionHint: 'Sort intervals by starting time first, then iterate and check if the current start <= previous end.',
    starterFunctionSignature: 'function merge(intervals) {',
    buggyCode: `function merge(intervals) {
  if (!intervals || intervals.length <= 1) return intervals;

  // BUG: Missing sorting by start time
  let result = [];
  let current = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    let next = intervals[i];
    if (current[1] >= next[0]) {
      // BUG: Assumes next[1] is always greater, missing max comparison
      current[1] = next[1];
    } else {
      result.push(current);
      current = next;
    }
  }
  // BUG: Forgot to push the final current interval
  return result;
}`,
    testCases: [
      {
        id: 1,
        description: 'Overlapping clusters',
        input: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
        expected: [[1, 6], [8, 10], [15, 18]]
      },
      {
        id: 2,
        description: 'Adjacent touching intervals',
        input: [[[1, 4], [4, 5]]],
        expected: [[1, 5]]
      },
      {
        id: 3,
        description: 'Unsorted input with nested interval',
        input: [[[1, 4], [0, 4]]],
        expected: [[0, 4]]
      },
      {
        id: 4,
        description: 'Complete encapsulation',
        input: [[[1, 4], [2, 3]]],
        expected: [[1, 4]],
        isHidden: true
      }
    ]
  }
];

export const ASSESSMENTS_DATA = [
  {
    roleId: 'google-swe',
    skillId: 'dsa-arrays',
    skillName: 'Arrays, Two-Pointers & Sliding Window',
    questions: [
      {
        id: 'q1',
        question: 'What is the minimum time complexity to find the maximum sum subarray of fixed size K in an array of N integers?',
        options: ['O(N * K)', 'O(N)', 'O(N log N)', 'O(K log N)'],
        correctAnswer: 1,
        explanation: 'By maintaining a running sum using the sliding window technique, we slide by adding the incoming element and subtracting the outgoing element in O(1) per step, yielding overall O(N) time.',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'When using two pointers to remove duplicates in-place from a sorted array, what is the auxiliary space complexity?',
        options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
        correctAnswer: 0,
        explanation: 'In-place two-pointer modifications only require two integer index registers, using strictly O(1) extra space.',
        difficulty: 'Easy'
      },
      {
        id: 'q3',
        question: 'Consider the code:\n```js\nlet left = 0, maxLen = 0, count = {};\nfor(let right=0; right<s.length; right++){\n  count[s[right]] = (count[s[right]] || 0) + 1;\n  while(count[s[right]] > 1) { count[s[left]]--; left++; }\n  maxLen = Math.max(maxLen, right - left + 1);\n}\n```\nWhat classic problem does this solve in O(N)?',
        options: [
          'Longest Substring Without Repeating Characters',
          'Minimum Window Substring',
          'Longest Palindromic Substring',
          'Reverse Words in a String'
        ],
        correctAnswer: 0,
        explanation: 'This window expands until a duplicate is detected, then shrinks from the left until the window contains only unique characters, finding the longest substring without repeating characters in O(N) time.',
        difficulty: 'Medium'
      }
    ]
  },
  {
    roleId: 'nvidia-embedded',
    skillId: 'c-pointers-memory',
    skillName: 'C Pointers, Memory & Struct Alignment',
    questions: [
      {
        id: 'q1',
        question: 'On a standard 64-bit architecture with 4-byte natural alignment, what is `sizeof(struct { char a; int b; char c; })`?',
        options: ['6 bytes', '8 bytes', '12 bytes', '16 bytes'],
        correctAnswer: 2,
        explanation: 'Due to memory padding: `char a` (1 byte) + 3 bytes padding + `int b` (4 bytes) + `char c` (1 byte) + 3 bytes trailing padding to align the struct to a multiple of 4 bytes = 12 bytes.',
        difficulty: 'Medium'
      },
      {
        id: 'q2',
        question: 'In embedded C, why is the `volatile` keyword used when declaring hardware peripheral registers?',
        options: [
          'To make the variable thread-safe and atomic',
          'To prevent the compiler optimizer from caching the value in a CPU register or omitting reads/writes',
          'To store the variable directly in high-speed flash memory',
          'To ensure the variable cannot be modified by any function'
        ],
        correctAnswer: 1,
        explanation: 'The `volatile` qualifier signals to the C compiler that the value can change asynchronously outside the knowledge of the current program (e.g., via hardware clock or ISR), preventing undesirable compiler optimizations.',
        difficulty: 'Intermediate'
      }
    ]
  }
];

export const SEED_LEADERBOARD = [
  { rank: 1, name: 'Ananya Sharma', college: 'IIT Delhi', xp: 2450, battlesWon: 18, winRate: '94%', streak: 16, avatar: '👩‍💻' },
  { rank: 2, name: 'Rahul Sharma (You)', college: 'Delhi Technological Univ (ECE)', xp: 680, battlesWon: 3, winRate: '75%', streak: 6, avatar: '⚡', isCurrentUser: true },
  { rank: 3, name: 'Karthik Raja', college: 'NIT Trichy', xp: 1980, battlesWon: 14, winRate: '87%', streak: 12, avatar: '🚀' },
  { rank: 4, name: 'Tanvi Gupta', college: 'BITS Pilani', xp: 1820, battlesWon: 12, winRate: '85%', streak: 9, avatar: '🌟' },
  { rank: 5, name: 'Aarav Patel', college: 'IIIT Hyderabad', xp: 1640, battlesWon: 10, winRate: '80%', streak: 8, avatar: '🔥' },
  { rank: 6, name: 'Sneha Rao', college: 'RVCE Bengaluru', xp: 1410, battlesWon: 9, winRate: '78%', streak: 5, avatar: '💡' },
];
