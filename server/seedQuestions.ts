export interface QuestionItem {
  id: string;
  company: string;
  role: string;
  field: string;
  skill: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'mcq' | 'code_snippet' | 'conceptual' | 'behavioral' | 'technical';
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer?: number;
  explanation: string;
  rubricCriteria?: string[];
  expectedKeyPoints?: string[];
  sampleAnswer?: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  starterCode: Record<string, string>; // language -> code
  entryFunction: string;
  testCases: {
    id: number;
    input: any[];
    expected: any;
    description: string;
    isHidden?: boolean;
  }[];
}

export const QUESTION_BANK: QuestionItem[] = [
  // --- GOOGLE ---
  {
    id: 'g-swe-1',
    company: 'Google',
    role: 'Software Engineer',
    field: 'Software Development',
    skill: 'Data Structures & Algorithms',
    topic: 'Two-Pointers & Sliding Window',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'When finding the longest substring with at most K distinct characters using a sliding window, what is the maximum number of times the left pointer is incremented across the entire traversal of string length N?',
    options: [
      'Exactly N times (amortized O(N) operations)',
      'O(N * K) times',
      'O(N log N) times',
      'O(K^2) times',
    ],
    correctAnswer: 0,
    explanation: 'Both the left and right pointers only move from left to right monotonically without ever moving backward. Hence, each pointer is incremented at most N times, leading to strictly O(N) total pointer increments.',
    expectedKeyPoints: ['Monotonic pointer movement', 'Amortized O(N) complexity', 'No pointer backtracking'],
    sampleAnswer: 'Since both the left and right boundaries move monotonically forward without ever resetting backward, each pointer visits each character in the string at most once. Therefore, the amortized number of left-pointer increments across all iterations is at most N, yielding strictly O(N) total time.',
    rubricCriteria: ['States amortized linear time', 'Explains monotonicity of left/right pointers'],
  },
  {
    id: 'g-swe-2',
    company: 'Google',
    role: 'Software Engineer',
    field: 'Software Development',
    skill: 'Distributed Systems',
    topic: 'Consistency Models',
    difficulty: 'Hard',
    type: 'conceptual',
    question: 'How does Google Spanner provide external consistency (linearizability) for distributed read-write transactions without a single centralized bottleneck clock?',
    options: [
      'By using the TrueTime API with bounded clock uncertainty (epsilon) and delaying commit transactions until 2*epsilon has elapsed.',
      'By electing a single physical clock server in Mountain View that timestamps every transaction worldwide.',
      'By disabling multi-datacenter replication completely during write transactions.',
      'By converting all writes into asynchronous fire-and-forget UDP packets.',
    ],
    correctAnswer: 0,
    explanation: 'Google Spanner utilizes the TrueTime API, which provides a time interval [earliest, latest] with bounded clock uncertainty. By enforcing a "commit wait" rule, Spanner guarantees that commit timestamps reflect real-world causal ordering.',
    expectedKeyPoints: ['TrueTime API', 'GPS and atomic clocks', 'Bounded uncertainty epsilon', 'Commit wait rule'],
    sampleAnswer: 'Spanner uses Google TrueTime API, which relies on atomic clocks and GPS receivers across data centers to bound clock drift within an uncertainty epsilon. When committing a read-write transaction, Spanner assigns a commit timestamp s and waits out the uncertainty interval (commit wait: 2*epsilon) before publishing changes. This ensures that any subsequent transaction anywhere in the world will receive a timestamp strictly greater than s, guaranteeing linearizability.',
    rubricCriteria: ['Explains TrueTime API', 'Mentions commit wait rule', 'Discusses bounded uncertainty'],
  },
  {
    id: 'g-swe-3',
    company: 'Google',
    role: 'Software Engineer',
    field: 'Software Development',
    skill: 'System Design',
    topic: 'Designing a Planetary Rate Limiter',
    difficulty: 'Hard',
    type: 'technical',
    question: 'How would you architect a globally distributed rate limiting service that protects Google Cloud APIs against DDoS and noisy neighbors with sub-5ms latency?',
    explanation: 'A globally distributed rate limiter requires local caching with token bucket or sliding window counter algorithms, backed by Redis clusters or distributed counters with asynchronous reconciliation.',
    expectedKeyPoints: [
      'Token Bucket or Sliding Window Log/Counter algorithm',
      'Edge deployment (Envoy / API Gateway proxy)',
      'In-memory local caching with asynchronous batched sync',
      'Graceful degradation / fail-open vs fail-close semantics',
      'Handling clock skew and partition tolerance',
    ],
    sampleAnswer: 'I would implement a hybrid rate limiting system using the Token Bucket algorithm deployed at edge proxies (like Envoy). For ultra-low latency, rate limit counters are cached locally in memory at edge PoPs. To coordinate global quotas without cross-region round trips on every request, edge nodes batch and asynchronously sync token consumption with local Redis clusters, while a centralized consensus service periodically adjusts quota allocations based on observed load. If network partitions occur, nodes degrade to local conservative limits (fail-safe mode) to prevent cascading outages.',
    rubricCriteria: [
      'Identifies Token Bucket or Sliding Window algorithm',
      'Addresses edge caching vs centralized coordination latency',
      'Explains fault tolerance and fail-open/fail-closed trade-offs',
    ],
  },
  {
    id: 'g-da-1',
    company: 'Google',
    role: 'Data Analyst',
    field: 'Data Science and Analytics',
    skill: 'SQL & Data Warehousing',
    topic: 'Window Functions',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'In Google BigQuery SQL, what is the difference between `RANK()` and `DENSE_RANK()` when two rows have identical values?',
    options: [
      '`RANK()` skips subsequent rank numbers (e.g., 1, 2, 2, 4), whereas `DENSE_RANK()` leaves no gaps (e.g., 1, 2, 2, 3).',
      '`DENSE_RANK()` sorts rows in descending order while `RANK()` sorts in ascending order.',
      '`RANK()` only works on integer columns while `DENSE_RANK()` works on strings.',
      'There is no functional difference in standard SQL.',
    ],
    correctAnswer: 0,
    explanation: '`RANK()` assigns identical ranks to ties and skips the next ranks by the count of tied rows. `DENSE_RANK()` assigns identical ranks to ties but increments sequentially without gaps.',
    expectedKeyPoints: ['Gap handling in tied rows', 'Sequential incrementation in DENSE_RANK', 'Skipping ranks in RANK'],
    sampleAnswer: 'Both RANK() and DENSE_RANK() assign the same rank to identical values within a partition. However, RANK() creates gaps in sequence for subsequent rows (e.g. 1, 2, 2, 4), while DENSE_RANK() increments sequentially without missing numbers (e.g. 1, 2, 2, 3).',
    rubricCriteria: ['Explains numerical gap behavior', 'Provides concrete example sequence'],
  },
  {
    id: 'g-ux-1',
    company: 'Google',
    role: 'UX Designer',
    field: 'UI/UX Design',
    skill: 'Interaction Design',
    topic: 'Fitts Law & Accessibility',
    difficulty: 'Easy',
    type: 'conceptual',
    question: 'According to Fitts’s Law in human-computer interaction, what two parameters primarily determine the time required to rapidly move to a target area?',
    options: [
      'The distance to the target and the width/size of the target.',
      'The color contrast ratio and font weight of the label.',
      'The screen refresh rate and DPI density.',
      'The number of clickable options present on the viewport.',
    ],
    correctAnswer: 0,
    explanation: 'Fitts’s Law models human movement: Movement Time = a + b * log2(2 * Distance / Width). Targets that are closer and larger are faster and easier to click.',
    expectedKeyPoints: ['Target distance', 'Target size/width', 'Movement time formula'],
    sampleAnswer: 'Fitts’s Law establishes that the time required to acquire a target is a logarithmic function of the distance to the target divided by the width of the target. Larger targets situated closer to the user cursor or touch area minimize acquisition time.',
    rubricCriteria: ['Identifies distance and width as primary factors', 'Explains UX implications on button sizing'],
  },

  // --- AMAZON ---
  {
    id: 'amz-sde-1',
    company: 'Amazon',
    role: 'Software Development Engineer',
    field: 'Software Development',
    skill: 'Object-Oriented Design',
    topic: 'SOLID Principles & DIP',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'Which Amazon Leadership Principle and SOLID design principle are most directly embodied when you architect an API client using interfaces rather than concrete class implementations?',
    options: [
      'Dependency Inversion Principle (DIP) & Dive Deep / Are Right, A Lot',
      'Single Responsibility Principle & Bias for Action',
      'Liskov Substitution Principle & Frugality',
      'Open-Closed Principle & Customer Obsession',
    ],
    correctAnswer: 0,
    explanation: 'The Dependency Inversion Principle states that high-level modules should not depend on low-level modules; both should depend on abstractions. This allows easy mocking, loose coupling, and testability.',
    expectedKeyPoints: ['Dependency Inversion Principle', 'Abstractions over implementations', 'Testability & decoupling'],
    sampleAnswer: 'By depending on abstract interfaces rather than concrete client implementations, high-level business logic is decoupled from transport details. This embodies the Dependency Inversion Principle and enables comprehensive unit testing with mock services.',
    rubricCriteria: ['Mentions Dependency Inversion Principle', 'Explains testability and decoupling'],
  },
  {
    id: 'amz-sde-2',
    company: 'Amazon',
    role: 'Software Development Engineer',
    field: 'Software Development',
    skill: 'Microservices & Concurrency',
    topic: 'Idempotency in Distributed Payments',
    difficulty: 'Hard',
    type: 'conceptual',
    question: 'Why is an Idempotency-Key header mandatory for high-volume payment and order placement microservices at Amazon?',
    options: [
      'To guarantee that if network timeouts cause client retries, the transaction is processed exactly once rather than charging the customer repeatedly.',
      'To encrypt credit card numbers in transit.',
      'To bypass DynamoDB write rate limits.',
      'To compress the HTTP payload size.',
    ],
    correctAnswer: 0,
    explanation: 'Distributed networks are prone to dropped ACKs. An idempotency token ensures that repeated retries with the same unique token return the existing result instead of executing duplicate debits.',
    expectedKeyPoints: ['Exactly-once semantic guarantee', 'Network timeout retries', 'Deduplication storage in DynamoDB/Redis'],
    sampleAnswer: 'In distributed architectures, transient network failures often cause clients to retry requests even when the backend successfully processed the payment. An Idempotency-Key allows the service to check whether an operation with that token was already executed. If so, it returns the cached response instead of charging the user a second time.',
    rubricCriteria: ['Explains retry safety', 'Addresses double-billing prevention'],
  },
  {
    id: 'amz-sde-3',
    company: 'Amazon',
    role: 'Software Development Engineer',
    field: 'Software Development',
    skill: 'Behavioral & Leadership',
    topic: 'Disagree and Commit (STAR Method)',
    difficulty: 'Medium',
    type: 'behavioral',
    question: 'Tell me about a time you had a technical disagreement with a team member or manager. How did you handle it and what was the outcome?',
    explanation: 'Amazon evaluators look for the Disagree and Commit leadership principle: presenting data-driven arguments respectfully, but committing fully once a final decision is reached.',
    expectedKeyPoints: [
      'Situation: Clear project context and technical conflict',
      'Task: The dilemma or decision at stake',
      'Action: Objective data gathering, benchmarking, respectful debate, commitment',
      'Result: Measurable outcome, lessons learned, and team cohesion',
    ],
    sampleAnswer: 'Situation: During a database migration on an e-commerce platform, my lead wanted to use MongoDB for order history, while I advocated for PostgreSQL with JSONB because we needed strict ACID transactions for order adjustments.\nTask: We had a 2-week deadline to freeze architecture.\nAction: Instead of debating opinions, I built a prototype benchmark measuring concurrency write conflicts under high load. When the team ultimately decided on MongoDB due to existing team operational familiarity, I respectfully committed, but contributed design patterns to implement two-phase commits at the application level.\nResult: The migration launched on schedule with 99.98% uptime, and my application-level integrity checks caught 14 potential duplicate order states.',
    rubricCriteria: [
      'Uses clear STAR structure (Situation, Task, Action, Result)',
      'Demonstrates data-driven technical reasoning',
      'Reflects genuine commitment without passive-aggressive resistance',
    ],
  },
  {
    id: 'amz-de-1',
    company: 'Amazon',
    role: 'Data Engineer',
    field: 'Data Science and Analytics',
    skill: 'ETL Pipelines & Storage',
    topic: 'Columnar Formats: Parquet vs CSV',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'Why is Apache Parquet preferred over CSV when querying petabyte-scale data lakes with AWS Athena / S3?',
    options: [
      'Parquet uses columnar storage with dictionary encoding and statistics (min/max), allowing Athena to scan only requested columns and skip non-matching row groups.',
      'Parquet is a plain human-readable text format with faster grep performance.',
      'CSV requires GPU acceleration to parse.',
      'Parquet files cannot be partitioned.',
    ],
    correctAnswer: 0,
    explanation: 'Columnar compression allows querying engines to read only the specific columns referenced in the SQL SELECT/WHERE clauses, dramatically decreasing I/O bytes scanned and AWS Athena query costs.',
    expectedKeyPoints: ['Columnar storage', 'Projection pushdown', 'Predicate pushdown via row group statistics'],
    sampleAnswer: 'Parquet stores data by column rather than row. This enables projection pushdown (reading only the queried columns) and predicate pushdown (skipping entire row groups using min/max stats), which drastically cuts scanned bytes, speeds up queries, and slashes AWS Athena costs.',
    rubricCriteria: ['Explains columnar vs row-oriented benefits', 'Mentions scan reduction and pushdown optimizations'],
  },

  // --- NVIDIA ---
  {
    id: 'nv-emb-1',
    company: 'NVIDIA',
    role: 'Embedded/Firmware Engineer',
    field: 'Embedded Systems and Firmware',
    skill: 'C Memory Layout & Pointers',
    topic: 'Struct Alignment & Padding',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'On a 64-bit ARM architecture with 4-byte natural int alignment and 8-byte pointer alignment, what is `sizeof(struct DriverState)`?\n`struct DriverState { char status; int *ptr; short dev_id; };`',
    options: [
      '24 bytes (1 byte status + 7 padding, 8 bytes pointer, 2 bytes dev_id + 6 trailing padding)',
      '14 bytes (exact sum of variables)',
      '16 bytes',
      '32 bytes',
    ],
    correctAnswer: 0,
    explanation: '64-bit pointers must align on 8-byte boundaries. char status takes 1 byte + 7 bytes padding to offset 8. int* ptr takes 8 bytes (offset 8-15). short dev_id takes 2 bytes (offset 16-17) + 6 bytes trailing padding so total struct size is a multiple of 8 = 24 bytes.',
    expectedKeyPoints: ['Alignment boundaries', 'Padding insertion for 8-byte pointer', 'Trailing struct padding'],
    sampleAnswer: 'The largest member alignment is 8 bytes (int* ptr). Member `status` takes 1 byte, followed by 7 bytes padding to align `ptr` at offset 8. `ptr` occupies offsets 8-15. `dev_id` takes 2 bytes (offsets 16-17). The overall struct size must be a multiple of the largest alignment (8 bytes), so 6 bytes of trailing padding are added: 1 + 7 + 8 + 2 + 6 = 24 bytes.',
    rubricCriteria: ['Calculates exact padding offsets', 'Explains trailing padding to match largest alignment'],
  },
  {
    id: 'nv-emb-2',
    company: 'NVIDIA',
    role: 'Embedded/Firmware Engineer',
    field: 'Embedded Systems and Firmware',
    skill: 'Microcontroller Protocols',
    topic: 'I2C vs SPI Comparison',
    difficulty: 'Easy',
    type: 'conceptual',
    question: 'Which of the following describes SPI (Serial Peripheral Interface) compared to I2C (Inter-Integrated Circuit)?',
    options: [
      'SPI is full-duplex, uses dedicated chip select (CS) lines for each slave, and typically achieves much higher throughput (10-50+ MHz).',
      'SPI uses open-drain lines with pull-up resistors and addressing bytes.',
      'I2C requires 4 wires (MISO, MOSI, SCK, CS) while SPI requires only 2 wires.',
      'SPI cannot transmit clock signals.',
    ],
    correctAnswer: 0,
    explanation: 'SPI uses 4 wires (MOSI, MISO, SCLK, and individual CS pins) allowing simultaneous full-duplex data transfer at high megahertz frequencies, whereas I2C uses 2 open-drain shared lines (SDA/SCL) with addressing overhead.',
    expectedKeyPoints: ['Full-duplex vs half-duplex', 'Chip select lines vs address bytes', 'Throughput & clock speeds'],
    sampleAnswer: 'SPI is a 4-wire synchronous full-duplex protocol with dedicated chip-select lines per peripheral, allowing speeds often exceeding 50 MHz. I2C is a 2-wire half-duplex open-drain protocol with 7/10-bit software addressing, typically capped at 400kHz to 3.4MHz.',
    rubricCriteria: ['Contrasts wire count and duplex mode', 'Compares transmission speed and addressing mechanism'],
  },
  {
    id: 'nv-gpu-1',
    company: 'NVIDIA',
    role: 'GPU/Systems Software Engineer',
    field: 'GPU and Systems Programming',
    skill: 'CUDA Microarchitecture',
    topic: 'Warp Divergence & Branch Penalties',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'In NVIDIA CUDA microarchitecture, what occurs when threads within a 32-thread warp execute divergent branches of an `if-else` statement?',
    options: [
      'The SIMT warp executes both branches serially, disabling threads that do not take the active path, reducing execution throughput.',
      'The GPU hardware automatically clones the warp onto two separate Streaming Multiprocessors (SMs).',
      'A hardware interrupt faults and terminates the kernel launch.',
      'The slower branch is discarded and recomputed on the host CPU.',
    ],
    correctAnswer: 0,
    explanation: 'Because a warp shares a single instruction unit across all 32 threads (SIMT), divergent paths must be executed sequentially with inactive threads masked out, reducing effective execution efficiency.',
    expectedKeyPoints: ['SIMT architecture', 'Serial execution of divergent paths', 'Active thread masking', 'Throughput loss'],
    sampleAnswer: 'In NVIDIA SIMT architecture, all 32 threads in a warp share a single instruction issue unit. When threads branch differently, the warp executes the if-branch with else-threads masked out, then executes the else-branch with if-threads masked out. This serializes execution and halves computational efficiency.',
    rubricCriteria: ['Explains SIMT lockstep instruction execution', 'Mentions thread masking across divergent branches'],
  },
  {
    id: 'nv-gpu-2',
    company: 'NVIDIA',
    role: 'GPU/Systems Software Engineer',
    field: 'GPU and Systems Programming',
    skill: 'Memory Hierarchy & CUDA',
    topic: 'Shared Memory Bank Conflicts',
    difficulty: 'Hard',
    type: 'technical',
    question: 'Explain what a CUDA shared memory bank conflict is, how it degrades kernel throughput, and how padding can be used to resolve it.',
    explanation: 'Shared memory is divided into 32 banks. If multiple threads in a warp access different words within the same bank simultaneously, access is serialized.',
    expectedKeyPoints: [
      '32 memory banks organized by 4-byte / 32-bit words',
      'Conflict occurs when multiple threads request distinct addresses in the same bank',
      'Serialization of requests reduces bandwidth',
      'Stride padding technique (e.g. allocating [32][33] instead of [32][32])',
    ],
    sampleAnswer: 'CUDA shared memory is partitioned into 32 separate banks, where consecutive 32-bit words map to successive banks (Bank = (address / 4) % 32). A bank conflict occurs when two or more threads in a warp access different memory addresses belonging to the exact same bank simultaneously. The hardware must serialize these accesses, multiplying latency. To resolve conflicts in 2D arrays (like matrix transpose), we add a 1-element column padding, e.g., declaring `__shared__ float tile[32][33]`. This shifts row bank mappings by 1, allowing column-wise accesses to hit 32 distinct banks concurrently.',
    rubricCriteria: [
      'Defines 32 shared memory banks',
      'Explains why multi-address collisions cause serialization',
      'Illustrates array padding solution with concrete example',
    ],
  },

  // --- MICROSOFT ---
  {
    id: 'msft-swe-1',
    company: 'Microsoft',
    role: 'Software Engineer',
    field: 'Software Development',
    skill: 'Operating Systems & Concurrency',
    topic: 'Thread Synchronization: Mutex vs Spinlock',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What is the primary difference between a spinlock and a standard mutex when waiting for a shared resource in Windows/Linux kernel space?',
    options: [
      'A spinlock repeatedly polls in a busy-wait CPU loop and should only be held for microsecond durations; a mutex puts the waiting thread to sleep to yield the CPU.',
      'A spinlock puts the CPU into low-power sleep mode.',
      'A mutex can only be acquired by one process across reboots.',
      'Spinlocks automatically prevent deadlocks.',
    ],
    correctAnswer: 0,
    explanation: 'Spinlocks keep the CPU core actively spinning in an instruction loop, avoiding the expensive overhead of a thread context switch if the lock is released quickly. Mutexes put the waiting thread into the sleep queue.',
    expectedKeyPoints: ['Busy-waiting vs context switching', 'Kernel interrupt contexts', 'Short vs long wait times'],
    sampleAnswer: 'A spinlock executes a tight busy-wait loop on the CPU without yielding the processor, avoiding the ~1-5 microsecond overhead of a kernel context switch. It is ideal for very short critical sections or interrupt handlers where sleeping is forbidden. A mutex puts the waiting thread to sleep, relinquishing the CPU core for other tasks, making it suited for longer critical sections.',
    rubricCriteria: ['Contrasts CPU busy-wait vs thread sleeping', 'Discusses context switch overhead trade-off'],
  },
  {
    id: 'msft-swe-2',
    company: 'Microsoft',
    role: 'Software Engineer',
    field: 'Software Development',
    skill: 'System Design',
    topic: 'Designing Microsoft Teams Presence System',
    difficulty: 'Hard',
    type: 'technical',
    question: 'Design a real-time presence service for Microsoft Teams (Active, Away, In a Meeting, Offline) that serves 300 million daily active users with sub-second status updates.',
    explanation: 'Presence systems rely on heartbeat pings, WebSocket connections, distributed in-memory stores, and pub/sub message brokers to distribute status changes.',
    expectedKeyPoints: [
      'Heartbeat signals via WebSockets or HTTP pings',
      'In-memory key-value store (Redis cluster) with TTL',
      'Pub/Sub fanout architecture (Kafka/Event Hubs)',
      'Channel subscriptions and pagination to avoid N^2 fanout',
      'Batched updates to mitigate thundering herds',
    ],
    sampleAnswer: 'Clients maintain a persistent WebSocket connection to Presence Gateway nodes. Active clients send a lightweight heartbeat every 30 seconds. The gateway sets the user state in a distributed Redis cluster with a 45-second TTL; if no heartbeat arrives, the TTL expires and flips status to Away/Offline. To broadcast presence to coworkers without O(N^2) broadcast explosion, clients only subscribe to presence channels for their active visible contacts and open chat channels. When a status changes, an event publishes to Kafka, routing to the connected gateway nodes of subscribed watchers.',
    rubricCriteria: [
      'Explains heartbeat mechanism and TTL expiration',
      'Addresses large-scale fanout mitigation strategies',
      'Identifies caching and messaging infrastructure',
    ],
  },

  // --- META / FACEBOOK ---
  {
    id: 'meta-fe-1',
    company: 'Meta',
    role: 'Frontend Engineer',
    field: 'Frontend Development',
    skill: 'React Internals & DOM',
    topic: 'React 18 Concurrent Mode & Fiber Reconciler',
    difficulty: 'Hard',
    type: 'technical',
    question: 'How does React 18 Concurrent Mode differ from the traditional synchronous Stack Reconciler, and how does Fiber architecture enable interruptible rendering?',
    explanation: 'The Fiber architecture represents component tree nodes as linked lists with pointers (child, sibling, return), allowing the browser work loop to pause, prioritize user interactions, and resume rendering.',
    expectedKeyPoints: [
      'Fiber node linked-list structure (child, sibling, return)',
      'Time slicing using scheduler and requestIdleCallback / MessageChannel',
      'Interruptible render phase vs non-interruptible commit phase',
      'Concurrent features like useTransition and useDeferredValue',
    ],
    sampleAnswer: 'Traditional React used the Stack Reconciler, which traversed the component tree recursively in a blocking manner, freezing UI responsiveness during heavy updates. The Fiber Reconciler transforms the tree into a doubly linked list of Fiber nodes (with child, sibling, and return pointers). Because it is a pointer loop rather than a call stack, React can break work into small chunks, inspect the browser message queue via MessageChannel, and pause rendering if a high-priority user interaction (like typing or clicking) occurs. Once idle, React resumes or aborts stale renders. The render phase is interruptible, while the commit phase remains synchronous and atomic to prevent visual glitches.',
    rubricCriteria: [
      'Explains Fiber linked-list pointer representation',
      'Clarifies difference between interruptible render and atomic commit phases',
      'Mentions scheduling priorities and responsiveness',
    ],
  },
  {
    id: 'meta-swe-1',
    company: 'Meta',
    role: 'Software Engineer',
    field: 'Software Development',
    skill: 'Data Structures & Algorithms',
    topic: 'Graph Algorithms & Social Networks',
    difficulty: 'Medium',
    type: 'technical',
    question: 'How would you find the shortest connection path between two users in a massive social graph (six degrees of separation)? Why is Bidirectional BFS superior to standard BFS here?',
    explanation: 'Bidirectional BFS searches simultaneously from source and target, meeting in the middle, cutting the search space from O(b^d) to O(2 * b^(d/2)).',
    expectedKeyPoints: [
      'Breadth-First Search (BFS) for unweighted shortest path',
      'Bidirectional BFS from both Source and Target simultaneously',
      'Branching factor b and search space complexity reduction from O(b^d) to O(b^(d/2))',
      'Graph intersection check using two visited sets/hash maps',
    ],
    sampleAnswer: 'Because all friendship connections have uniform weight, Breadth-First Search (BFS) finds the shortest path. In a social graph with an average branching factor of b = 100 friends, a standard BFS traversing d = 6 degrees must inspect O(b^d) = 100^6 = 10^12 nodes. Bidirectional BFS initiates two concurrent searches: one from user A and one from user B. When the frontiers intersect, the shortest path is found. This requires searching only O(2 * b^(d/2)) = 2 * 100^3 = 2 * 10^6 nodes, reducing computation by several orders of magnitude.',
    rubricCriteria: [
      'Calculates exponential branching factor comparison',
      'Explains frontier intersection logic with visited sets',
    ],
  },

  // --- AI & MACHINE LEARNING ---
  {
    id: 'ai-ml-1',
    company: 'Google',
    role: 'AI/ML Engineer',
    field: 'AI and Machine Learning',
    skill: 'Transformers & LLMs',
    topic: 'Scaled Dot-Product Attention & Multi-Head Mechanism',
    difficulty: 'Hard',
    type: 'technical',
    question: 'Derive the Scaled Dot-Product Attention formula `Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V`. Why is the scaling factor `1 / sqrt(d_k)` strictly necessary for training stability?',
    explanation: 'As dimensionality d_k grows, dot products grow large in magnitude, pushing softmax into regions with extremely small gradients, leading to vanishing gradients during backpropagation.',
    expectedKeyPoints: [
      'Query, Key, Value matrix projections',
      'Dot-product variance grows linearly with d_k',
      'Large inputs push softmax into saturation regions with near-zero gradients',
      'Dividing by sqrt(d_k) normalizes variance to 1, preserving healthy gradients',
    ],
    sampleAnswer: 'For independent zero-mean unit-variance components, the dot product between two d_k-dimensional vectors has a mean of 0 and a variance of d_k. For large dimensions (e.g. d_k = 64 or 128), large dot product values push the softmax function into regions where the gradient is near zero (vanishing gradient problem). Scaling by 1/sqrt(d_k) normalizes the variance back to 1, ensuring that the softmax function maintains non-zero gradients for effective gradient descent and stable backpropagation.',
    rubricCriteria: [
      'Explains variance growth proportional to d_k',
      'Connects large dot products to softmax saturation and vanishing gradients',
    ],
  },
  {
    id: 'ai-ml-2',
    company: 'Meta',
    role: 'AI/ML Engineer',
    field: 'AI and Machine Learning',
    skill: 'Model Optimization & Inference',
    topic: 'Quantization & LoRA Fine-Tuning',
    difficulty: 'Medium',
    type: 'conceptual',
    question: 'What is Low-Rank Adaptation (LoRA) and how does it allow fine-tuning 70B parameter models on single consumer GPUs without updating all weights?',
    explanation: 'LoRA freezes pre-trained model weights and injects trainable rank decomposition matrices (A and B) into transformer layers, drastically reducing trainable parameters and optimizer state memory.',
    expectedKeyPoints: [
      'Freezing base weights W_0 and adding delta W = B * A',
      'Low rank r << d (e.g. r=8 or 16) reduces trainable parameter count by 99%+',
      'Eliminates optimizer state memory overhead (Adam 8 bytes per parameter)',
      'Inference integration with zero additional runtime latency by merging weights',
    ],
    sampleAnswer: 'LoRA freezes the pre-trained weight matrix W_0 (size d x k) and approximates weight updates via two low-rank matrices: delta W = B * A, where B is d x r and A is r x k, with rank r << min(d, k). Instead of tuning millions of parameters, we train a tiny fraction (often < 1%). Crucially, this slashes the GPU memory needed for Adam optimizer states (which normally consume 12-16 bytes per parameter). For inference, B*A can simply be added back into W_0, incurring zero additional runtime latency.',
    rubricCriteria: [
      'Explains mathematical formulation delta W = B * A',
      'Highlights reduction in optimizer state GPU memory',
      'Mentions weight merging for zero inference overhead',
    ],
  },

  // --- ADOBE & FRONTEND ---
  {
    id: 'adb-fe-1',
    company: 'Adobe',
    role: 'Frontend Engineer',
    field: 'Frontend Development',
    skill: 'Browser Rendering & Canvas',
    topic: 'RequestAnimationFrame & GPU Compositing',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'When implementing a 60fps pan/zoom canvas tool in a web application (like Adobe Photoshop Web), why should transform mutations be coupled with `requestAnimationFrame`?',
    options: [
      'To synchronize DOM/Canvas redraws precisely with the display refresh rate (VSync), preventing dropped frames and visual tearing.',
      'To force the browser to compute styling using asynchronous Web Workers.',
      'To bypass the browser’s single-threaded JavaScript event loop entirely.',
      'To guarantee that memory garbage collection never runs.',
    ],
    correctAnswer: 0,
    explanation: '`requestAnimationFrame` schedules canvas rendering right before the browser performs its next paint cycle, ensuring frame updates are aligned with VSync without redundant duplicate calculations.',
    expectedKeyPoints: ['VSync synchronization', 'Prevention of redundant repaints', 'Smooth 60fps frame budgeting'],
    sampleAnswer: '`requestAnimationFrame` aligns execution directly with the display refresh hardware (VSync), firing right before each browser repaint. Calling paint operations inside raw scroll or mousemove handlers can trigger multiple unnecessary renders per display frame, exhausting the 16.6ms frame budget and causing stuttering.',
    rubricCriteria: ['Explains VSync synchronization', 'Identifies frame budget and layout thrashing prevention'],
  },

  // --- APPLE & LOW-LEVEL SYSTEMS ---
  {
    id: 'aapl-swe-1',
    company: 'Apple',
    role: 'Software Engineer',
    field: 'Software Development',
    skill: 'Memory Management',
    topic: 'Automatic Reference Counting (ARC) vs Garbage Collection',
    difficulty: 'Medium',
    type: 'technical',
    question: 'Why does Apple iOS/macOS use compile-time Automatic Reference Counting (ARC) rather than a tracing garbage collector like the JVM or V8? What are retain cycles and how are they broken?',
    explanation: 'ARC inserts retain/release calls at compile-time, delivering deterministic memory deallocation without stop-the-world pauses, critical for smooth 120Hz ProMotion displays.',
    expectedKeyPoints: [
      'Deterministic deallocation at compile time',
      'Zero "stop-the-world" pauses for smooth 60/120fps UI rendering',
      'Lower battery and memory footprint',
      'Retain cycles (strong reference cycles)',
      'Breaking cycles using `weak` and `unowned` references',
    ],
    sampleAnswer: 'Apple chosen ARC because it inserts retain and release calls deterministically at compile-time. Unlike runtime tracing garbage collectors, ARC has zero stop-the-world pauses, ensuring silky smooth 120Hz UI frame rates and predictable battery consumption on mobile devices. A retain cycle occurs when two objects hold strong references to each other, preventing their reference counts from ever reaching zero. This is resolved by declaring parent-child or delegate relationships as `weak` (which becomes nil when deallocated) or `unowned`.',
    rubricCriteria: [
      'Contrasts ARC compile-time determinism with tracing GC pause times',
      'Explains retain cycles and the use of weak references',
    ],
  },

  // --- BEHAVIORAL & STAR SCENARIOS ---
  {
    id: 'beh-star-1',
    company: 'Google',
    role: 'Software Engineer',
    field: 'Software Development',
    skill: 'Leadership & Conflict',
    topic: 'Resolving Ambiguity and Project Deadlocks',
    difficulty: 'Medium',
    type: 'behavioral',
    question: 'Describe a situation where project requirements were completely ambiguous or kept changing right before a critical milestone. How did you deliver results?',
    explanation: 'Evaluates candidate resilience, proactive communication, prioritization, and rapid iterative delivery under uncertainty.',
    expectedKeyPoints: [
      'Situation: Ambiguous or volatile scope and impending timeline',
      'Task: Need to unblock the team and establish clear acceptance criteria',
      'Action: Broke problem into core MVP vs nice-to-haves, aligned stakeholders with quick RFC',
      'Result: Delivered on-time milestone, minimized throwaway code, high user adoption',
    ],
    sampleAnswer: 'Situation: Two weeks before releasing a payment feature, product specs changed due to new international tax regulations.\nTask: As technical owner, I had to ensure compliance without delaying the quarter launch.\nAction: I scheduled a 30-minute sync with the legal and product leads, drafted a 1-page decision log, and separated hard compliance blockers from cosmetic features. We decided to feature-flag the new tax calculator for unsupported regions while launching in our top 3 markets.\nResult: We launched on schedule with 100% tax compliance, generated $420k in initial transaction volume, and rolled out remaining regions two weeks later without downtime.',
    rubricCriteria: [
      'Follows STAR method strictly',
      'Shows structured stakeholder alignment and trade-off negotiation',
      'Provides quantitative business result',
    ],
  },
  {
    id: 'beh-star-2',
    company: 'Amazon',
    role: 'Software Development Engineer',
    field: 'Software Development',
    skill: 'Customer Obsession & Quality',
    topic: 'Handling a Production Outage (P0/SEV-1)',
    difficulty: 'Hard',
    type: 'behavioral',
    question: 'Tell me about the most severe production incident or bug you caused or investigated. What was your immediate reaction, how was it mitigated, and what was the post-mortem fix?',
    explanation: 'Amazon interviewers assess Customer Obsession, Ownership, and Bias for Action during critical incidents.',
    expectedKeyPoints: [
      'Situation: High-severity production failure impacting live customers',
      'Task: Mitigate customer impact immediately before diagnosing root cause',
      'Action: Rollback or traffic shedding, root cause analysis (5 Whys), automated regression test',
      'Result: Restored service within SLA, authored Correction of Errors (COE) document',
    ],
    sampleAnswer: 'Situation: During Black Friday, a caching configuration update caused a cache stampede, driving CPU utilization on our database cluster to 100% and throwing 500 errors on the checkout page.\nTask: My primary goal was restoring customer checkout functionality within our 5-minute SLA.\nAction: Instead of attempting a live hotfix, I immediately rolled back the config deployment and enabled temporary client-side request throttling to allow connection pools to recover. Once traffic normalized, I led the post-mortem, identified that cache keys lacked jitter (causing simultaneous expirations), and implemented probabilistic early expiration with randomized TTLs.\nResult: Checkout was restored in 4 minutes. In the subsequent 18 months, zero cache stampede incidents occurred.',
    rubricCriteria: [
      'Prioritizes immediate mitigation/rollback over debugging in production',
      'Conducts thorough root cause analysis (COE / Post-Mortem)',
      'Implements systemic preventative safeguards',
    ],
  },
];

export const CODING_CHALLENGES: ChallengeItem[] = [
  {
    id: 'ch-valid-palindrome',
    title: 'Valid Palindrome with Alphanumeric Filtering',
    difficulty: 'Easy',
    category: 'Strings & Two-Pointers',
    description: `Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.
A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Constraints:
- 1 <= s.length <= 2 * 10^5
- s consists only of printable ASCII characters.
- Must run in O(N) time and O(1) auxiliary space.`,
    entryFunction: 'isPalindrome',
    starterCode: {
      javascript: `function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
      python: `def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum(): left += 1
        while left < right and not s[right].isalnum(): right -= 1
        if s[left].lower() != s[right].lower(): return False
        left += 1
        right -= 1
    return True`,
    },
    testCases: [
      {
        id: 1,
        input: ['A man, a plan, a canal: Panama'],
        expected: true,
        description: 'Standard multi-word phrase with punctuation',
      },
      {
        id: 2,
        input: ['race a car'],
        expected: false,
        description: 'Non-palindrome string',
      },
      {
        id: 3,
        input: ['   .,:; '],
        expected: true,
        description: 'Empty string / punctuation only',
      },
      {
        id: 4,
        input: ['0P0'],
        expected: true,
        description: 'Mixed alphanumeric characters',
        isHidden: true,
      },
    ],
  },

  {
    id: 'ch-two-sum',
    title: 'Two Sum Target Lookup',
    difficulty: 'Easy',
    category: 'Hash Map & Arrays',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
Return the answer with indices sorted in ascending order.

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- Exactly one valid answer exists.
- Target complexity: O(N) time and O(N) space.`,
    entryFunction: 'twoSum',
    starterCode: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def twoSum(nums: list, target: int) -> list:
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []`,
    },
    testCases: [
      {
        id: 1,
        input: [[2, 7, 11, 15], 9],
        expected: [0, 1],
        description: 'First two elements sum to target',
      },
      {
        id: 2,
        input: [[3, 2, 4], 6],
        expected: [1, 2],
        description: 'Middle and end elements sum to target',
      },
      {
        id: 3,
        input: [[3, 3], 6],
        expected: [0, 1],
        description: 'Identical duplicate numbers',
      },
      {
        id: 4,
        input: [[-1, -2, -3, -4, -5], -8],
        expected: [2, 4],
        description: 'Negative integers target lookup',
        isHidden: true,
      },
    ],
  },

  {
    id: 'ch-max-subarray',
    title: 'Maximum Subarray (Kadane’s Algorithm)',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

Constraints:
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4
- Follow up: If you have figured out the O(n) solution, try coding the divide and conquer approach.`,
    entryFunction: 'maxSubArray',
    starterCode: {
      javascript: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      python: `def maxSubArray(nums: list) -> int:
    max_sum = current_sum = nums[0]
    for x in nums[1:]:
        current_sum = max(x, current_sum + x)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
    },
    testCases: [
      {
        id: 1,
        input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
        expected: 6,
        description: 'Subarray [4, -1, 2, 1] has largest sum = 6',
      },
      {
        id: 2,
        input: [[1]],
        expected: 1,
        description: 'Single element array',
      },
      {
        id: 3,
        input: [[5, 4, -1, 7, 8]],
        expected: 23,
        description: 'All positive numbers subarray',
      },
      {
        id: 4,
        input: [[-5, -2, -8, -1]],
        expected: -1,
        description: 'All negative numbers selects least negative',
        isHidden: true,
      },
    ],
  },

  {
    id: 'ch-valid-parentheses',
    title: 'Valid Parentheses String Matching',
    difficulty: 'Easy',
    category: 'Stacks & Parsing',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    entryFunction: 'isValid',
    starterCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
    return not stack`,
    },
    testCases: [
      {
        id: 1,
        input: ['()[]{}'],
        expected: true,
        description: 'Sequential valid bracket pairs',
      },
      {
        id: 2,
        input: ['(]'],
        expected: false,
        description: 'Mismatched bracket pair',
      },
      {
        id: 3,
        input: ['{[]}'],
        expected: true,
        description: 'Nested valid brackets',
      },
      {
        id: 4,
        input: ['([)]'],
        expected: false,
        description: 'Cross-interleaved invalid brackets',
        isHidden: true,
      },
    ],
  },

  {
    id: 'ch-search-rotated',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    category: 'Binary Search',
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).
Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index.
Given the array \`nums\` and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    entryFunction: 'search',
    starterCode: {
      javascript: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    
    // Check if left half is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}`,
      python: `def search(nums: list, target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target: return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]: right = mid - 1
            else: left = mid + 1
        else:
            if nums[mid] < target <= nums[right]: left = mid + 1
            else: right = mid - 1
    return -1`,
    },
    testCases: [
      {
        id: 1,
        input: [[4, 5, 6, 7, 0, 1, 2], 0],
        expected: 4,
        description: 'Target exists in right rotated segment',
      },
      {
        id: 2,
        input: [[4, 5, 6, 7, 0, 1, 2], 3],
        expected: -1,
        description: 'Target does not exist in array',
      },
      {
        id: 3,
        input: [[1], 0],
        expected: -1,
        description: 'Single element array mismatch',
      },
      {
        id: 4,
        input: [[3, 1], 1],
        expected: 1,
        description: 'Two elements rotated array',
        isHidden: true,
      },
    ],
  },

  {
    id: 'ch-merge-intervals',
    title: 'Merge Overlapping Intervals',
    difficulty: 'Medium',
    category: 'Intervals & Sorting',
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

Constraints:
- 1 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= start_i <= end_i <= 10^4`,
    entryFunction: 'merge',
    starterCode: {
      javascript: `function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const current = intervals[i];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push(current);
    }
  }
  return result;
}`,
      python: `def merge(intervals: list) -> list:
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged`,
    },
    testCases: [
      {
        id: 1,
        input: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
        expected: [[1, 6], [8, 10], [15, 18]],
        description: 'First two intervals overlap',
      },
      {
        id: 2,
        input: [[[1, 4], [4, 5]]],
        expected: [[1, 5]],
        description: 'Touching boundary intervals overlap',
      },
      {
        id: 3,
        input: [[[6, 8], [1, 9], [2, 4]]],
        expected: [[1, 9]],
        description: 'Encompassing interval absorbs smaller ones',
      },
    ],
  },

  {
    id: 'ch-reverse-linked-list',
    title: 'Reverse Singly Linked Sequence',
    difficulty: 'Easy',
    category: 'Linked Lists & Pointers',
    description: `Given an array representing node values of a singly linked list in order, reverse the order in-place or return the reversed array of values.
Constraint: O(N) time and O(1) extra space.`,
    entryFunction: 'reverseList',
    starterCode: {
      javascript: `function reverseList(head) {
  const result = [];
  for (let i = head.length - 1; i >= 0; i--) {
    result.push(head[i]);
  }
  return result;
}`,
      python: `def reverseList(head: list) -> list:
    return head[::-1]`,
    },
    testCases: [
      {
        id: 1,
        input: [[1, 2, 3, 4, 5]],
        expected: [5, 4, 3, 2, 1],
        description: 'Standard 5-node list reverse',
      },
      {
        id: 2,
        input: [[1, 2]],
        expected: [2, 1],
        description: 'Two-node list reverse',
      },
      {
        id: 3,
        input: [[]],
        expected: [],
        description: 'Empty list',
      },
    ],
  },
];
