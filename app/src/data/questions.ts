import { Question, TopicCategory } from '@/types';

export const QUESTIONS: Question[] = [
  // Data Modeling Questions
  {
    id: 'dm-q1',
    topic: 'data-modeling',
    difficulty: 'beginner',
    type: 'mcq',
    title: 'Fact Table Purpose',
    question: 'What is the primary purpose of a fact table in a star schema?',
    options: [
      'Store descriptive attributes about business entities',
      'Store quantitative measurements and metrics',
      'Store lookup values for reference data',
      'Store slowly changing dimension history'
    ],
    correctAnswer: 'Store quantitative measurements and metrics',
    explanation: 'Fact tables store quantitative data (measures/metrics) that can be aggregated, such as sales amounts, quantities, or counts. They contain foreign keys to dimension tables and represent business events or transactions.',
    hints: ['Think about what you would SUM or COUNT in a query'],
    relatedTopics: ['star-schema', 'dimension-tables'],
    xpReward: 10,
    timeLimit: 30,
  },
  {
    id: 'dm-q2',
    topic: 'data-modeling',
    difficulty: 'beginner',
    type: 'mcq',
    title: 'Dimension Table Characteristics',
    question: 'Which of the following is NOT a typical characteristic of dimension tables?',
    options: [
      'Contains descriptive attributes',
      'Relatively few rows compared to fact tables',
      'Wide tables with many columns',
      'Contains aggregated metrics'
    ],
    correctAnswer: 'Contains aggregated metrics',
    explanation: 'Dimension tables contain descriptive attributes (who, what, where, when), not metrics. Metrics and measures belong in fact tables. Dimensions are typically wide (many columns) but shallow (fewer rows).',
    relatedTopics: ['fact-tables', 'star-schema'],
    xpReward: 10,
    timeLimit: 30,
  },
  {
    id: 'dm-q3',
    topic: 'data-modeling',
    difficulty: 'intermediate',
    type: 'mcq',
    title: 'Surrogate vs Natural Keys',
    question: 'Why are surrogate keys preferred over natural keys in data warehouse dimension tables?',
    options: [
      'They are easier for end users to understand',
      'They take less storage space',
      'They are insulated from source system changes and support SCD Type 2',
      'They are automatically indexed by the database'
    ],
    correctAnswer: 'They are insulated from source system changes and support SCD Type 2',
    explanation: 'Surrogate keys (system-generated integers) don\'t change when source systems change, allow multiple rows for the same business entity (SCD Type 2), and provide consistent key format across all dimensions.',
    hints: ['Think about what happens when a customer moves to a new address'],
    relatedTopics: ['scd-type-2', 'key-management'],
    xpReward: 15,
    timeLimit: 45,
  },
  {
    id: 'dm-q4',
    topic: 'data-modeling',
    difficulty: 'intermediate',
    type: 'mcq',
    title: 'Junk Dimensions',
    question: 'What is a junk dimension used for?',
    options: [
      'Storing historical versions of dimension records',
      'Combining low-cardinality flags and indicators into a single table',
      'Storing records that failed data quality checks',
      'Tracking deleted dimension records'
    ],
    correctAnswer: 'Combining low-cardinality flags and indicators into a single table',
    explanation: 'A junk dimension combines multiple low-cardinality attributes (flags, indicators, codes) that don\'t fit naturally into other dimensions. This reduces the width of the fact table and avoids creating many small dimension tables.',
    relatedTopics: ['fact-tables', 'schema-design'],
    xpReward: 15,
    timeLimit: 45,
  },
  {
    id: 'dm-q5',
    topic: 'data-modeling',
    difficulty: 'advanced',
    type: 'mcq',
    title: 'Degenerate Dimensions',
    question: 'An order number stored directly in a fact table (without a corresponding dimension table) is an example of:',
    options: [
      'Conformed dimension',
      'Role-playing dimension',
      'Degenerate dimension',
      'Outrigger dimension'
    ],
    correctAnswer: 'Degenerate dimension',
    explanation: 'A degenerate dimension is a dimension key in the fact table that has no corresponding dimension table. Common examples include order numbers, invoice numbers, and transaction IDs - they\'re useful for grouping/filtering but don\'t need additional attributes.',
    relatedTopics: ['fact-tables', 'dimension-types'],
    xpReward: 20,
    timeLimit: 45,
  },

  // SCD Questions
  {
    id: 'scd-q1',
    topic: 'scd',
    difficulty: 'beginner',
    type: 'mcq',
    title: 'SCD Type 1',
    question: 'What happens to historical data when using SCD Type 1?',
    options: [
      'Historical data is preserved in a separate archive table',
      'Historical data is overwritten and lost',
      'Historical data is tracked using effective dates',
      'Historical data is stored in a new column'
    ],
    correctAnswer: 'Historical data is overwritten and lost',
    explanation: 'SCD Type 1 simply overwrites the old value with the new value. No history is preserved. This is appropriate for correcting errors or when historical accuracy is not required.',
    relatedTopics: ['scd-type-2', 'data-history'],
    xpReward: 10,
    timeLimit: 30,
  },
  {
    id: 'scd-q2',
    topic: 'scd',
    difficulty: 'intermediate',
    type: 'mcq',
    title: 'SCD Type 2 Components',
    question: 'Which columns are typically required to implement SCD Type 2?',
    options: [
      'Only a version number',
      'Effective date, expiration date, and current flag',
      'Previous value column and change date',
      'Hash of all columns'
    ],
    correctAnswer: 'Effective date, expiration date, and current flag',
    explanation: 'SCD Type 2 tracks history by adding new rows. The standard implementation includes: effective_date (when this version started), expiration_date (when it ended, usually 9999-12-31 for current), and is_current flag for easy filtering.',
    hints: ['Think about what you need to query both current state and point-in-time'],
    relatedTopics: ['scd-type-1', 'time-travel'],
    xpReward: 15,
    timeLimit: 45,
  },
  {
    id: 'scd-q3',
    topic: 'scd',
    difficulty: 'advanced',
    type: 'mcq',
    title: 'SCD Type 6',
    question: 'SCD Type 6 (Hybrid) combines which SCD types?',
    options: [
      'Type 1 and Type 2',
      'Type 2 and Type 3',
      'Type 1, Type 2, and Type 3',
      'Type 0 and Type 2'
    ],
    correctAnswer: 'Type 1, Type 2, and Type 3',
    explanation: 'SCD Type 6 (1+2+3=6) combines all three approaches: Type 2 rows with effective dates, Type 1 current value updated in all historical rows, and Type 3 previous value column. This provides maximum flexibility for analysis.',
    relatedTopics: ['scd-type-1', 'scd-type-2', 'scd-type-3'],
    xpReward: 25,
    timeLimit: 60,
  },
  {
    id: 'scd-q4',
    topic: 'scd',
    difficulty: 'intermediate',
    type: 'sql',
    title: 'Find Current Record',
    question: 'Write a SQL query to find the current address for customer_id = "C123" from a SCD Type 2 customer dimension table.',
    correctAnswer: "SELECT * FROM dim_customer WHERE customer_id = 'C123' AND is_current = TRUE;",
    explanation: 'In SCD Type 2, the current record is typically identified by an is_current flag set to TRUE, or by checking that expiration_date equals the far-future date (like 9999-12-31).',
    hints: ['Use the is_current flag or check the expiration_date'],
    relatedTopics: ['scd-type-2', 'dimension-queries'],
    xpReward: 20,
    timeLimit: 120,
  },

  // Loading Patterns Questions
  {
    id: 'lp-q1',
    topic: 'loading-patterns',
    difficulty: 'beginner',
    type: 'mcq',
    title: 'Full vs Incremental',
    question: 'When is a full load strategy preferred over incremental loading?',
    options: [
      'When the source table has billions of rows',
      'When real-time data is required',
      'When the source system doesn\'t track changes and the table is small',
      'When network bandwidth is limited'
    ],
    correctAnswer: 'When the source system doesn\'t track changes and the table is small',
    explanation: 'Full loads are appropriate when: 1) The source has no change tracking (no updated_at column), 2) The table is small enough to reload efficiently, or 3) You need to ensure complete source-target consistency.',
    relatedTopics: ['incremental-load', 'etl-patterns'],
    xpReward: 10,
    timeLimit: 30,
  },
  {
    id: 'lp-q2',
    topic: 'loading-patterns',
    difficulty: 'intermediate',
    type: 'mcq',
    title: 'Watermarking',
    question: 'What is the purpose of a watermark in incremental data loading?',
    options: [
      'To mark records that failed data quality checks',
      'To track the last successfully processed point in source data',
      'To identify duplicate records',
      'To encrypt sensitive data'
    ],
    correctAnswer: 'To track the last successfully processed point in source data',
    explanation: 'A watermark (high water mark) stores the last successfully processed timestamp or ID. On the next run, only records after this watermark are processed, enabling efficient incremental loads.',
    hints: ['Think about how you know where to start the next load'],
    relatedTopics: ['incremental-load', 'cdc'],
    xpReward: 15,
    timeLimit: 45,
  },
  {
    id: 'lp-q3',
    topic: 'loading-patterns',
    difficulty: 'advanced',
    type: 'mcq',
    title: 'CDC Methods',
    question: 'Which CDC (Change Data Capture) method has the lowest impact on source system performance?',
    options: [
      'Trigger-based CDC',
      'Timestamp-based CDC',
      'Log-based CDC',
      'Full table comparison'
    ],
    correctAnswer: 'Log-based CDC',
    explanation: 'Log-based CDC reads from the database transaction log, which is already being written for recovery purposes. It doesn\'t require triggers (overhead on writes), polling queries, or full table scans.',
    relatedTopics: ['cdc', 'incremental-load'],
    xpReward: 25,
    timeLimit: 60,
  },
  {
    id: 'lp-q4',
    topic: 'loading-patterns',
    difficulty: 'intermediate',
    type: 'mcq',
    title: 'Idempotency',
    question: 'Why is idempotency important in data pipelines?',
    options: [
      'It makes pipelines run faster',
      'It allows safe re-runs without creating duplicates or incorrect results',
      'It reduces storage requirements',
      'It enables real-time processing'
    ],
    correctAnswer: 'It allows safe re-runs without creating duplicates or incorrect results',
    explanation: 'An idempotent operation produces the same result whether run once or multiple times. This is crucial for data pipelines because failures happen, and you need to be able to safely re-run a job without duplicating data.',
    relatedTopics: ['etl-patterns', 'data-quality'],
    xpReward: 15,
    timeLimit: 45,
  },

  // Lakehouse Questions
  {
    id: 'lh-q1',
    topic: 'lakehouse',
    difficulty: 'beginner',
    type: 'mcq',
    title: 'Delta Lake Benefits',
    question: 'Which feature does Delta Lake add to data lakes that traditional data lakes lack?',
    options: [
      'Distributed storage',
      'Schema-on-read',
      'ACID transactions',
      'Columnar storage'
    ],
    correctAnswer: 'ACID transactions',
    explanation: 'Delta Lake brings ACID transactions (Atomicity, Consistency, Isolation, Durability) to data lakes, enabling reliable concurrent reads and writes, which traditional data lakes (raw Parquet/CSV files) cannot guarantee.',
    relatedTopics: ['data-lakes', 'parquet'],
    xpReward: 10,
    timeLimit: 30,
  },
  {
    id: 'lh-q2',
    topic: 'lakehouse',
    difficulty: 'intermediate',
    type: 'mcq',
    title: 'Time Travel',
    question: 'Delta Lake time travel allows you to:',
    options: [
      'Speed up query execution',
      'Query previous versions of your data',
      'Predict future data values',
      'Compress historical data'
    ],
    correctAnswer: 'Query previous versions of your data',
    explanation: 'Time travel in Delta Lake lets you query data as it existed at a previous point in time or version number. This is useful for auditing, debugging, reproducing experiments, and rolling back mistakes.',
    relatedTopics: ['delta-lake', 'data-versioning'],
    xpReward: 15,
    timeLimit: 45,
  },
  {
    id: 'lh-q3',
    topic: 'lakehouse',
    difficulty: 'advanced',
    type: 'mcq',
    title: 'Z-Ordering',
    question: 'What is the primary benefit of Z-ordering in Delta Lake?',
    options: [
      'Reduces file sizes through compression',
      'Enables data skipping by co-locating related data',
      'Speeds up INSERT operations',
      'Encrypts data at rest'
    ],
    correctAnswer: 'Enables data skipping by co-locating related data',
    explanation: 'Z-ordering reorganizes data within files so that related values are stored together. This enables data skipping - when you filter on a Z-ordered column, Delta can skip entire files that don\'t contain matching values.',
    hints: ['Think about how the data is physically organized in files'],
    relatedTopics: ['delta-lake', 'query-optimization'],
    xpReward: 25,
    timeLimit: 60,
  },

  // Data Quality Questions
  {
    id: 'dq-q1',
    topic: 'data-quality',
    difficulty: 'beginner',
    type: 'mcq',
    title: 'Data Quality Dimensions',
    question: 'Which of the following is NOT a standard dimension of data quality?',
    options: [
      'Accuracy',
      'Completeness',
      'Velocity',
      'Consistency'
    ],
    correctAnswer: 'Velocity',
    explanation: 'The standard data quality dimensions are: Accuracy, Completeness, Consistency, Timeliness, Uniqueness, and Validity. Velocity is one of the "3 Vs" of big data (Volume, Velocity, Variety), not a data quality dimension.',
    relatedTopics: ['data-validation', 'data-governance'],
    xpReward: 10,
    timeLimit: 30,
  },
  {
    id: 'dq-q2',
    topic: 'data-quality',
    difficulty: 'intermediate',
    type: 'mcq',
    title: 'Referential Integrity',
    question: 'What type of data quality issue occurs when a fact table references a dimension key that doesn\'t exist?',
    options: [
      'Duplicate records',
      'Orphan records',
      'Null values',
      'Data type mismatch'
    ],
    correctAnswer: 'Orphan records',
    explanation: 'Orphan records (or orphaned foreign keys) occur when a fact table contains a dimension key that has no matching row in the dimension table. This breaks referential integrity and causes JOIN failures or data loss.',
    relatedTopics: ['referential-integrity', 'etl-validation'],
    xpReward: 15,
    timeLimit: 45,
  },

  // Performance Questions
  {
    id: 'perf-q1',
    topic: 'performance',
    difficulty: 'intermediate',
    type: 'mcq',
    title: 'Index Selection',
    question: 'For a column frequently used in WHERE clauses with range conditions (>, <, BETWEEN), which index type is most appropriate?',
    options: [
      'Hash index',
      'B-tree index',
      'Bitmap index',
      'Full-text index'
    ],
    correctAnswer: 'B-tree index',
    explanation: 'B-tree indexes are ideal for range queries because they maintain sorted order. Hash indexes only support equality comparisons. Bitmap indexes are best for low-cardinality columns, and full-text is for text search.',
    relatedTopics: ['query-optimization', 'database-internals'],
    xpReward: 15,
    timeLimit: 45,
  },
  {
    id: 'perf-q2',
    topic: 'performance',
    difficulty: 'advanced',
    type: 'mcq',
    title: 'Partitioning Strategy',
    question: 'For a time-series fact table commonly queried by date range, what is the recommended partitioning strategy?',
    options: [
      'Partition by customer_id',
      'Partition by date column',
      'No partitioning needed',
      'Partition by random hash'
    ],
    correctAnswer: 'Partition by date column',
    explanation: 'Partitioning by the date column aligns with query patterns, enabling partition pruning. When querying a date range, only relevant partitions are scanned. This dramatically reduces I/O for time-based queries.',
    hints: ['Think about which partitions can be skipped'],
    relatedTopics: ['query-optimization', 'table-design'],
    xpReward: 25,
    timeLimit: 60,
  },
  {
    id: 'perf-q3',
    topic: 'performance',
    difficulty: 'advanced',
    type: 'mcq',
    title: 'Query Optimization',
    question: 'When optimizing a slow query that joins multiple large tables, which approach should you try FIRST?',
    options: [
      'Add more memory to the database server',
      'Analyze execution plan and ensure proper indexes exist on join columns',
      'Rewrite the query in a different programming language',
      'Increase the query timeout limit'
    ],
    correctAnswer: 'Analyze execution plan and ensure proper indexes exist on join columns',
    explanation: 'Always start by examining the execution plan (EXPLAIN ANALYZE). Missing indexes on join columns are a common cause of slow queries. Adding hardware should be a last resort after optimizing the query and schema.',
    relatedTopics: ['execution-plans', 'indexing'],
    xpReward: 25,
    timeLimit: 60,
  },
];

export const getQuestionsByTopic = (topic: TopicCategory): Question[] => {
  return QUESTIONS.filter(q => q.topic === topic);
};

export const getQuestionsByDifficulty = (difficulty: Question['difficulty']): Question[] => {
  return QUESTIONS.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count: number, topic?: TopicCategory): Question[] => {
  let pool = topic ? getQuestionsByTopic(topic) : QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

