// Flashcards for quick review - extracted from main content
export interface Flashcard {
  id: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  front: string;  // Question
  back: string;   // Answer
  tags: string[];
}

export const FLASHCARDS: Flashcard[] = [
  // ==================== BEGINNER: Data Modeling ====================
  {
    id: 'fc-dm-001',
    category: 'Data Modeling',
    difficulty: 'beginner',
    front: 'What is the difference between OLTP and OLAP?',
    back: 'OLTP (Online Transaction Processing) is optimized for fast transactions and current data. OLAP (Online Analytical Processing) is optimized for complex queries on historical data.',
    tags: ['oltp', 'olap', 'fundamentals'],
  },
  {
    id: 'fc-dm-002',
    category: 'Data Modeling',
    difficulty: 'beginner',
    front: 'What are the three types of data models?',
    back: '1. Conceptual (high-level business view)\n2. Logical (detailed structure without technical details)\n3. Physical (database-specific implementation)',
    tags: ['models', 'fundamentals'],
  },
  {
    id: 'fc-dm-003',
    category: 'Data Modeling',
    difficulty: 'beginner',
    front: 'What is First Normal Form (1NF)?',
    back: 'Each column contains atomic (indivisible) values, each row is unique, and there are no repeating groups.',
    tags: ['normalization', '1nf'],
  },
  {
    id: 'fc-dm-004',
    category: 'Data Modeling',
    difficulty: 'beginner',
    front: 'What is Second Normal Form (2NF)?',
    back: 'Must be in 1NF, and all non-key columns must depend on the ENTIRE primary key (no partial dependencies).',
    tags: ['normalization', '2nf'],
  },
  {
    id: 'fc-dm-005',
    category: 'Data Modeling',
    difficulty: 'beginner',
    front: 'What is Third Normal Form (3NF)?',
    back: 'Must be in 2NF, and no transitive dependencies - non-key columns depend ONLY on the primary key.',
    tags: ['normalization', '3nf'],
  },
  {
    id: 'fc-dm-006',
    category: 'Data Modeling',
    difficulty: 'beginner',
    front: 'What is a Star Schema?',
    back: 'A dimensional model with a central FACT table connected to multiple DIMENSION tables, forming a star shape. Optimized for analytical queries.',
    tags: ['star-schema', 'dimensional'],
  },
  {
    id: 'fc-dm-007',
    category: 'Data Modeling',
    difficulty: 'beginner',
    front: 'What is a Fact Table?',
    back: 'A table that stores quantitative data (measures) for analysis. Contains foreign keys to dimension tables and numeric measures like sales_amount, quantity.',
    tags: ['fact-table', 'dimensional'],
  },
  {
    id: 'fc-dm-008',
    category: 'Data Modeling',
    difficulty: 'beginner',
    front: 'What is a Dimension Table?',
    back: 'A table that stores descriptive attributes that provide context to facts. Contains the "who, what, when, where, why" of your data.',
    tags: ['dimension-table', 'dimensional'],
  },
  {
    id: 'fc-dm-009',
    category: 'Data Modeling',
    difficulty: 'beginner',
    front: 'What is a Surrogate Key?',
    back: 'A system-generated, meaningless identifier (usually auto-incrementing integer) used as primary key. Never changes and has no business meaning.',
    tags: ['keys', 'surrogate'],
  },
  {
    id: 'fc-dm-010',
    category: 'Data Modeling',
    difficulty: 'beginner',
    front: 'What is a Natural Key vs Business Key?',
    back: 'A Natural/Business Key is a meaningful identifier from the business (like email, SSN, product SKU). Can change over time and may be recycled.',
    tags: ['keys', 'natural-key'],
  },
  {
    id: 'fc-dm-011',
    category: 'Data Modeling',
    difficulty: 'beginner',
    front: 'Star Schema vs Snowflake Schema?',
    back: 'Star: Denormalized dimensions, simpler queries, faster performance.\nSnowflake: Normalized dimensions, saves storage, more complex queries.',
    tags: ['star-schema', 'snowflake-schema'],
  },
  {
    id: 'fc-dm-012',
    category: 'Data Modeling',
    difficulty: 'beginner',
    front: 'What is Denormalization?',
    back: 'Intentionally adding redundancy to improve query performance. Common in data warehouses to reduce JOINs.',
    tags: ['denormalization', 'performance'],
  },

  // ==================== INTERMEDIATE: SCDs ====================
  {
    id: 'fc-scd-001',
    category: 'Slowly Changing Dimensions',
    difficulty: 'intermediate',
    front: 'What is SCD Type 1?',
    back: 'Overwrite the existing value. No history is preserved. Used for corrections or non-critical attributes.',
    tags: ['scd', 'type-1'],
  },
  {
    id: 'fc-scd-002',
    category: 'Slowly Changing Dimensions',
    difficulty: 'intermediate',
    front: 'What is SCD Type 2?',
    back: 'Create a new row for each change. Preserves complete history using effective_date, expiration_date, and is_current flag.',
    tags: ['scd', 'type-2'],
  },
  {
    id: 'fc-scd-003',
    category: 'Slowly Changing Dimensions',
    difficulty: 'intermediate',
    front: 'What is SCD Type 3?',
    back: 'Add a column to store the previous value. Only preserves one level of history (current + previous).',
    tags: ['scd', 'type-3'],
  },
  {
    id: 'fc-scd-004',
    category: 'Slowly Changing Dimensions',
    difficulty: 'intermediate',
    front: 'What is SCD Type 6?',
    back: 'Hybrid approach combining Type 1 + 2 + 3. Stores historical value, current value (updated everywhere), and previous value.',
    tags: ['scd', 'type-6'],
  },
  {
    id: 'fc-scd-005',
    category: 'Slowly Changing Dimensions',
    difficulty: 'intermediate',
    front: 'When would you use SCD Type 1 vs Type 2?',
    back: 'Type 1: Corrections, non-critical attributes, when history doesn\'t matter.\nType 2: When you need point-in-time reporting, audit requirements, tracking customer journey.',
    tags: ['scd', 'comparison'],
  },

  // ==================== INTERMEDIATE: Loading Patterns ====================
  {
    id: 'fc-lp-001',
    category: 'Loading Patterns',
    difficulty: 'intermediate',
    front: 'Full Load vs Incremental Load?',
    back: 'Full: Replace all data each time. Simple but slow.\nIncremental: Only process changed data. Fast but complex.',
    tags: ['etl', 'loading'],
  },
  {
    id: 'fc-lp-002',
    category: 'Loading Patterns',
    difficulty: 'intermediate',
    front: 'What is a Watermark in ETL?',
    back: 'A bookmark tracking the last processed position (timestamp, ID, or sequence). Enables incremental loads and restartability.',
    tags: ['etl', 'watermark'],
  },
  {
    id: 'fc-lp-003',
    category: 'Loading Patterns',
    difficulty: 'intermediate',
    front: 'What is Change Data Capture (CDC)?',
    back: 'A technique to identify and capture changes (inserts, updates, deletes) in source systems, often using database logs.',
    tags: ['etl', 'cdc'],
  },
  {
    id: 'fc-lp-004',
    category: 'Loading Patterns',
    difficulty: 'intermediate',
    front: 'What is Idempotency in ETL?',
    back: 'Running the same operation multiple times produces the same result. Critical for retries and recovery.',
    tags: ['etl', 'idempotency'],
  },
  {
    id: 'fc-lp-005',
    category: 'Loading Patterns',
    difficulty: 'intermediate',
    front: 'What is the MERGE statement used for?',
    back: 'Combines INSERT, UPDATE, and DELETE in one statement. Used for upserts and SCD implementations.',
    tags: ['sql', 'merge'],
  },

  // ==================== ADVANCED: Lakehouse ====================
  {
    id: 'fc-lh-001',
    category: 'Data Lakehouse',
    difficulty: 'advanced',
    front: 'What is a Data Lakehouse?',
    back: 'Architecture combining data lake (cheap storage, all data types) with warehouse features (ACID, schema enforcement, SQL).',
    tags: ['lakehouse', 'architecture'],
  },
  {
    id: 'fc-lh-002',
    category: 'Data Lakehouse',
    difficulty: 'advanced',
    front: 'What is Delta Lake?',
    back: 'Open-source storage layer that brings ACID transactions, time travel, and schema enforcement to data lakes. Built on Parquet.',
    tags: ['delta-lake', 'lakehouse'],
  },
  {
    id: 'fc-lh-003',
    category: 'Data Lakehouse',
    difficulty: 'advanced',
    front: 'What is Time Travel in Delta Lake?',
    back: 'Ability to query data as of any previous version or timestamp. Enables auditing, rollbacks, and reproducing analyses.',
    tags: ['delta-lake', 'time-travel'],
  },
  {
    id: 'fc-lh-004',
    category: 'Data Lakehouse',
    difficulty: 'advanced',
    front: 'What is Z-Ordering?',
    back: 'Data organization technique that co-locates related data for faster queries. Used with columns frequently filtered together.',
    tags: ['delta-lake', 'optimization'],
  },
  {
    id: 'fc-lh-005',
    category: 'Data Lakehouse',
    difficulty: 'advanced',
    front: 'What does VACUUM do in Delta Lake?',
    back: 'Removes old data files no longer referenced by the transaction log. Helps manage storage costs but limits time travel.',
    tags: ['delta-lake', 'maintenance'],
  },
  {
    id: 'fc-lh-006',
    category: 'Data Lakehouse',
    difficulty: 'advanced',
    front: 'Apache Iceberg vs Delta Lake?',
    back: 'Both provide ACID on data lakes. Iceberg: More vendor-neutral, better partition evolution. Delta: Deeper Spark integration, more mature.',
    tags: ['iceberg', 'delta-lake', 'comparison'],
  },

  // ==================== ADVANCED: Data Quality ====================
  {
    id: 'fc-dq-001',
    category: 'Data Quality',
    difficulty: 'advanced',
    front: 'What are the 6 dimensions of Data Quality?',
    back: '1. Accuracy\n2. Completeness\n3. Consistency\n4. Timeliness\n5. Uniqueness\n6. Validity',
    tags: ['data-quality', 'dimensions'],
  },
  {
    id: 'fc-dq-002',
    category: 'Data Quality',
    difficulty: 'advanced',
    front: 'What is Data Lineage?',
    back: 'Tracking the origin, movement, and transformation of data throughout its lifecycle. Critical for debugging and compliance.',
    tags: ['data-quality', 'lineage'],
  },
  {
    id: 'fc-dq-003',
    category: 'Data Quality',
    difficulty: 'advanced',
    front: 'What is a Data Contract?',
    back: 'Formal agreement between data producers and consumers specifying schema, quality expectations, SLAs, and ownership.',
    tags: ['data-quality', 'governance'],
  },
  {
    id: 'fc-dq-004',
    category: 'Data Quality',
    difficulty: 'advanced',
    front: 'What is Great Expectations?',
    back: 'Open-source Python library for defining, documenting, and validating data quality expectations.',
    tags: ['data-quality', 'tools'],
  },

  // ==================== ADVANCED: Performance ====================
  {
    id: 'fc-perf-001',
    category: 'Performance',
    difficulty: 'advanced',
    front: 'What is a Covering Index?',
    back: 'An index that includes all columns needed by a query, avoiding the need to access the table. Trades space for speed.',
    tags: ['performance', 'indexes'],
  },
  {
    id: 'fc-perf-002',
    category: 'Performance',
    difficulty: 'advanced',
    front: 'What does "sargable" mean?',
    back: 'Search ARGument ABLE - queries that can use indexes. Example: WHERE date >= \'2024-01-01\' is sargable, WHERE YEAR(date) = 2024 is not.',
    tags: ['performance', 'sql'],
  },
  {
    id: 'fc-perf-003',
    category: 'Performance',
    difficulty: 'advanced',
    front: 'What is Partition Pruning?',
    back: 'Query optimization where the engine skips partitions that cannot contain relevant data based on the WHERE clause.',
    tags: ['performance', 'partitioning'],
  },
  {
    id: 'fc-perf-004',
    category: 'Performance',
    difficulty: 'advanced',
    front: 'Clustered vs Non-Clustered Index?',
    back: 'Clustered: Physically reorders table data (one per table).\nNon-Clustered: Separate structure with pointers to data (many per table).',
    tags: ['performance', 'indexes'],
  },
  {
    id: 'fc-perf-005',
    category: 'Performance',
    difficulty: 'advanced',
    front: 'What is Predicate Pushdown?',
    back: 'Optimization that pushes filter conditions closer to the data source, reducing data scanned and transferred.',
    tags: ['performance', 'optimization'],
  },
  {
    id: 'fc-perf-006',
    category: 'Performance',
    difficulty: 'advanced',
    front: 'When should you NOT use an index?',
    back: '• Small tables\n• Frequently updated columns\n• Low-selectivity columns\n• Columns rarely used in queries',
    tags: ['performance', 'indexes'],
  },

  // ==================== ADVANCED: Architecture ====================
  {
    id: 'fc-arch-001',
    category: 'Architecture',
    difficulty: 'advanced',
    front: 'What is the Medallion Architecture?',
    back: 'Bronze (raw), Silver (cleaned/conformed), Gold (business-level aggregates). Common in lakehouse implementations.',
    tags: ['architecture', 'medallion'],
  },
  {
    id: 'fc-arch-002',
    category: 'Architecture',
    difficulty: 'advanced',
    front: 'What is Data Mesh?',
    back: 'Decentralized architecture where domain teams own their data products. Focuses on data as a product, domain ownership, and self-service.',
    tags: ['architecture', 'data-mesh'],
  },
  {
    id: 'fc-arch-003',
    category: 'Architecture',
    difficulty: 'advanced',
    front: 'What is ELT vs ETL?',
    back: 'ETL: Transform before loading (traditional).\nELT: Load first, transform in warehouse (modern approach leveraging warehouse compute).',
    tags: ['architecture', 'etl'],
  },
  {
    id: 'fc-arch-004',
    category: 'Architecture',
    difficulty: 'advanced',
    front: 'What is a Lambda Architecture?',
    back: 'Hybrid processing with batch layer (accuracy), speed layer (real-time), and serving layer. Complex to maintain.',
    tags: ['architecture', 'streaming'],
  },
  {
    id: 'fc-arch-005',
    category: 'Architecture',
    difficulty: 'advanced',
    front: 'What is a Kappa Architecture?',
    back: 'Simplification of Lambda - all processing through streaming layer. Single code path, reprocess by replaying stream.',
    tags: ['architecture', 'streaming'],
  },
];

// Helper functions
export const getFlashcardsByCategory = (category: string): Flashcard[] => {
  return FLASHCARDS.filter(f => f.category === category);
};

export const getFlashcardsByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Flashcard[] => {
  return FLASHCARDS.filter(f => f.difficulty === difficulty);
};

export const getFlashcardsByTag = (tag: string): Flashcard[] => {
  return FLASHCARDS.filter(f => f.tags.includes(tag));
};

export const getRandomFlashcards = (count: number, difficulty?: 'beginner' | 'intermediate' | 'advanced'): Flashcard[] => {
  let cards = difficulty ? getFlashcardsByDifficulty(difficulty) : FLASHCARDS;
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const FLASHCARD_CATEGORIES = Array.from(new Set(FLASHCARDS.map(f => f.category)));

