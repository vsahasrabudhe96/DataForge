import { TopicConfig } from '../learning-modules';

export const ADVANCED_TOPICS: TopicConfig[] = [
  {
    id: 'lakehouse',
    title: 'Data Lakehouse Architecture',
    description: 'Modern architecture combining data lake flexibility with warehouse reliability.',
    icon: '🏠',
    color: 'yellow',
    skillLevel: 'advanced',
    modules: [
      {
        id: 'lh-evolution',
        title: 'Evolution of Data Architecture',
        description: 'From data warehouses to lakes to lakehouses.',
        category: 'lakehouse',
        difficulty: 'advanced',
        estimatedTime: 30,
        xpReward: 200,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lh-evo-1',
            title: 'Three Generations of Data Architecture',
            type: 'text',
            content: `**The Evolution of Data Architecture:**

Understanding how we got here helps you make better architecture decisions and ace interview questions.

**Generation 1: Data Warehouses (1990s-2010s)** 🏢

**Technology:** Teradata, Oracle, SQL Server, IBM DB2

**Characteristics:**
- Structured data only (tables, rows, columns)
- Schema-on-write (define schema before loading)
- Expensive proprietary storage
- SQL-based analytics
- Excellent for BI and reporting
- Strong ACID guarantees

**Limitations:**
- Couldn't handle unstructured data (logs, images, JSON)
- Very expensive to scale
- Vendor lock-in
- Rigid schemas made changes difficult
- Couldn't support ML/AI workloads

**Generation 2: Data Lakes (2010s)** 🌊

**Technology:** Hadoop, S3, ADLS, HDFS, Spark

**Characteristics:**
- All data types (structured, semi-structured, unstructured)
- Schema-on-read (interpret schema when querying)
- Cheap object storage (S3 = $0.023/GB/month)
- Open file formats (Parquet, ORC, Avro)
- Flexible processing (Spark, Presto, Hive)

**The Promise:**
"Store everything cheaply, figure out schema later!"

**The Reality (Data Swamp):**
- No ACID transactions → data corruption
- No schema enforcement → "garbage in, garbage out"
- Poor query performance → slow analytics
- No data quality → trust issues
- Multiple engines with different behaviors`,
          },
          {
            id: 'lh-evo-2',
            title: 'The Data Lakehouse Paradigm',
            type: 'text',
            content: `**Generation 3: Data Lakehouse (2020s+)** 🏠

**Technology:** Delta Lake, Apache Iceberg, Apache Hudi

**The Best of Both Worlds:**

Data Lakehouse = Data Lake storage + Data Warehouse features

**Core Innovation:**
Add a **metadata layer** on top of data lake storage that provides:

1. **ACID Transactions** ✅
   - Atomicity: All or nothing
   - Consistency: Valid state after each operation
   - Isolation: Concurrent operations don't interfere
   - Durability: Committed data survives failures

2. **Schema Enforcement** ✅
   - Define schema before writing
   - Reject invalid data
   - Support schema evolution

3. **Time Travel** ✅
   - Query historical versions
   - Audit changes
   - Rollback mistakes

4. **Unified Batch & Streaming** ✅
   - Same table for both workloads
   - No separate streaming infrastructure

**How It Works:**

| Layer | Component | Purpose |
|-------|-----------|---------|
| Query | Spark, Trino, Flink | Process data |
| Metadata | Delta/Iceberg/Hudi | ACID, versioning, schema |
| Storage | S3/ADLS/GCS | Cheap object storage |
| Format | Parquet/ORC | Columnar compression |

**Key Lakehouse Technologies:**

**Delta Lake** (Databricks)
- Most mature, Spark-native
- Great Databricks integration
- Open-sourced (Apache 2.0)

**Apache Iceberg** (Netflix origin)
- Most vendor-neutral
- Excellent partition evolution
- Strong community growth

**Apache Hudi** (Uber origin)
- Best for incremental processing
- Built-in CDC support
- Strong streaming support`,
          },
          {
            id: 'lh-evo-3',
            title: 'Lakehouse Architecture Deep Dive',
            type: 'text',
            content: `**Medallion Architecture** 🥇🥈🥉

The most popular data organization pattern in lakehouses:

**Bronze Layer (Raw)** 🥉
- Ingested data in original format
- Minimal transformation
- Append-only (keep everything)
- Source of truth for replay

**Purpose:**
- Historical archive
- Debugging data issues
- Reprocessing capability

**Example:** Raw JSON from APIs, CDC events, log files

**Silver Layer (Cleaned)** 🥈
- Cleansed and conformed data
- Schema enforced
- Deduplication applied
- Business rules applied

**Purpose:**
- Consistent data model
- Joined/enriched entities
- Ready for analysis

**Example:** Cleaned customer records, validated transactions

**Gold Layer (Business)** 🥇
- Business-level aggregates
- Dimensional models (star schema)
- Pre-computed metrics
- Optimized for consumption

**Purpose:**
- BI dashboards
- ML features
- Business KPIs

**Example:** Daily sales summary, customer lifetime value

**Data Flow:**

Source → Bronze → Silver → Gold → Consumers

**Benefits of Medallion:**
- Clear data lineage
- Progressive data quality
- Reprocessing capability
- Separation of concerns
- Multiple consumer access levels`,
          },
        ],
      },
      {
        id: 'lh-delta-lake',
        title: 'Delta Lake Deep Dive',
        description: 'Master Delta Lake features and operations.',
        category: 'lakehouse',
        difficulty: 'advanced',
        estimatedTime: 40,
        xpReward: 250,
        prerequisites: ['lh-evolution'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lh-delta-1',
            title: 'How Delta Lake Works',
            type: 'text',
            content: `**Delta Lake Internals:**

Delta Lake achieves ACID transactions on object storage through a clever design:

**Components:**

**1. Data Files (Parquet)**
- Actual data stored in Parquet format
- Immutable - never modified, only added
- Located in table directory

**2. Transaction Log (_delta_log)**
- JSON files tracking all changes
- Each transaction = one log file
- Contains: adds, removes, metadata changes
- Single source of truth for table state

**Transaction Log Structure:**

table/
├── _delta_log/
│   ├── 00000000000000000000.json  (version 0)
│   ├── 00000000000000000001.json  (version 1)
│   ├── 00000000000000000002.json  (version 2)
│   └── ...
├── part-00000-xxx.parquet
├── part-00001-xxx.parquet
└── ...

**How Writes Work:**

1. Writer creates new Parquet file(s)
2. Writer creates new log entry
3. Log entry atomically committed
4. Readers see new data

**How Reads Work:**

1. Reader reads transaction log
2. Computes current table state (which files are valid)
3. Reads only valid Parquet files
4. Returns consistent snapshot

**Optimistic Concurrency:**

Multiple writers can work simultaneously:
1. Both start transaction
2. Both write files
3. Both try to commit
4. One wins (first commit)
5. Other retries with updated state

**Key Insight:**
All the magic is in the transaction log. The Parquet files are just regular files - the log tells us which ones are "active" in the current table version.`,
          },
          {
            id: 'lh-delta-2',
            title: 'Delta Lake Operations',
            type: 'code',
            content: 'Essential Delta Lake commands and operations:',
            codeExample: {
              language: 'sql',
              description: 'Delta Lake SQL Operations',
              code: `-- ====================================================
-- CREATING DELTA TABLES
-- ====================================================

-- Create managed Delta table (Databricks manages location)
CREATE TABLE sales (
    sale_id BIGINT,
    customer_id INT,
    product_id INT,
    sale_date DATE,
    amount DECIMAL(10,2)
)
USING DELTA;

-- Create external Delta table (you specify location)
CREATE TABLE sales_external
USING DELTA
LOCATION 's3://my-bucket/delta/sales/'
AS SELECT * FROM raw_sales;

-- Convert existing Parquet to Delta
CONVERT TO DELTA parquet.'s3://bucket/old_parquet_table/';


-- ====================================================
-- DML OPERATIONS (ACID-compliant!)
-- ====================================================

-- INSERT
INSERT INTO sales VALUES (1, 101, 201, '2024-01-15', 99.99);

INSERT INTO sales
SELECT * FROM staging_sales WHERE sale_date = '2024-01-15';

-- UPDATE (unlike data lakes - this actually works!)
UPDATE sales
SET amount = amount * 1.1  -- 10% price increase
WHERE sale_date >= '2024-01-01';

-- DELETE
DELETE FROM sales
WHERE sale_date < '2020-01-01';  -- Remove old data

-- MERGE (Upsert - most powerful operation)
MERGE INTO sales AS target
USING daily_sales AS source
ON target.sale_id = source.sale_id

WHEN MATCHED AND source.is_deleted = TRUE THEN
    DELETE

WHEN MATCHED THEN
    UPDATE SET *

WHEN NOT MATCHED THEN
    INSERT *;


-- ====================================================
-- TIME TRAVEL (Query Historical Data)
-- ====================================================

-- Query by version number
SELECT * FROM sales VERSION AS OF 5;

-- Query by timestamp  
SELECT * FROM sales TIMESTAMP AS OF '2024-01-15 10:30:00';

-- See table history
DESCRIBE HISTORY sales;

-- Result shows all versions:
-- | version | timestamp | operation | operationMetrics |
-- |---------|-----------|-----------|------------------|
-- | 5 | 2024-01-15 | MERGE | {numTargetRowsInserted: 100} |
-- | 4 | 2024-01-14 | UPDATE | {numUpdatedRows: 50} |
-- | 3 | 2024-01-13 | DELETE | {numDeletedRows: 10} |

-- Restore to previous version
RESTORE TABLE sales TO VERSION AS OF 3;


-- ====================================================
-- TABLE MAINTENANCE
-- ====================================================

-- OPTIMIZE: Compact small files
-- Delta creates many small files - compact them for performance
OPTIMIZE sales;

-- Z-ORDER: Co-locate data for faster queries
-- Groups data that's frequently queried together
OPTIMIZE sales
ZORDER BY (customer_id, sale_date);

-- VACUUM: Remove old files (free storage)
-- Keep 7 days by default for time travel
VACUUM sales RETAIN 168 HOURS;

-- Aggressive vacuum (lose time travel!)
SET spark.databricks.delta.retentionDurationCheck.enabled = false;
VACUUM sales RETAIN 0 HOURS;


-- ====================================================
-- SCHEMA EVOLUTION
-- ====================================================

-- Add new column (automatic)
INSERT INTO sales (sale_id, customer_id, ..., new_column)
SELECT *, 'value' as new_column FROM ...;

-- Enable automatic schema evolution
SET spark.databricks.delta.schema.autoMerge.enabled = true;

-- Explicit schema change
ALTER TABLE sales ADD COLUMN region STRING;
ALTER TABLE sales DROP COLUMN temp_column;`,
              runnable: false,
            },
          },
          {
            id: 'lh-delta-3',
            title: 'Delta Lake Performance Optimization',
            type: 'text',
            content: `**Optimizing Delta Lake Performance:**

**1. File Size Optimization**

**The Problem:**
- Many small files = slow queries (file overhead)
- Few huge files = slow writes (can't parallelize)

**Target:** 128MB - 1GB per file

**Solutions:**

OPTIMIZE - Compacts small files
- Run daily or after large ingestion
- Schedule during low-usage periods

Auto-optimization:
- delta.autoOptimize.optimizeWrite = true
- delta.autoOptimize.autoCompact = true

**2. Z-Ordering**

Co-locates related data in same files:

OPTIMIZE sales ZORDER BY (customer_id, sale_date);

**Best Practices:**
- Z-order on high-cardinality filter columns
- Maximum 2-4 columns (diminishing returns)
- Most selective column first
- Don't Z-order on partition columns

**3. Partitioning**

Partition on columns used in WHERE clauses:

CREATE TABLE sales (...)
PARTITIONED BY (sale_date);

**Best Practices:**
- Partition on low-cardinality columns
- Each partition should have 1GB+ data
- Don't over-partition (thousands of partitions = slow)
- Common: date, region, customer_segment

**4. Data Skipping**

Delta automatically tracks min/max values per file:

-- This is fast (skips files where amount is all < 1000)
SELECT * FROM sales WHERE amount > 1000;

**Enable statistics on more columns:**

ALTER TABLE sales SET TBLPROPERTIES (
    'delta.dataSkippingNumIndexedCols' = '10'
);

**5. Caching**

-- Cache hot tables in memory
CACHE SELECT * FROM dim_product;

-- Delta cache (Databricks)
-- Automatic SSD caching of frequently accessed data

**Performance Checklist:**

✅ Run OPTIMIZE regularly (daily)
✅ Z-ORDER on query filter columns
✅ Partition on low-cardinality date/category
✅ Don't over-partition
✅ VACUUM to clean old files
✅ Use Delta cache for hot data
✅ Monitor file sizes (target 128MB-1GB)`,
          },
        ],
      },
      {
        id: 'lh-iceberg',
        title: 'Apache Iceberg',
        description: 'The vendor-neutral table format gaining rapid adoption.',
        category: 'lakehouse',
        difficulty: 'advanced',
        estimatedTime: 35,
        xpReward: 225,
        prerequisites: ['lh-delta-lake'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lh-ice-1',
            title: 'Iceberg vs Delta Lake',
            type: 'text',
            content: `**Apache Iceberg: The Vendor-Neutral Alternative**

Originally created at Netflix, Iceberg is rapidly gaining adoption as a vendor-neutral lakehouse format.

**Feature Comparison:**

| Feature | Delta Lake | Apache Iceberg |
|---------|------------|----------------|
| Origin | Databricks | Netflix |
| License | Apache 2.0 | Apache 2.0 |
| ACID | Yes | Yes |
| Time Travel | Yes | Yes |
| Schema Evolution | Yes | Yes |
| Partition Evolution | Limited | Excellent |
| Hidden Partitioning | No | Yes |
| Engine Support | Spark-centric | Multi-engine |
| Cloud Adoption | All clouds | All clouds |

**Why Choose Iceberg:**

**1. Partition Evolution** 🎯

Change partitioning without rewriting data!

-- Original: partitioned by month
-- Later: need daily partitions
-- Iceberg: Just change metadata!
ALTER TABLE sales SET PARTITION SPEC (days(sale_date));

Delta: Would need to rewrite entire table

**2. Hidden Partitioning** 🔒

Users don't need to know partition scheme:

-- Iceberg: Just query naturally
SELECT * FROM sales WHERE sale_date = '2024-01-15';
-- Automatically uses partitions

-- Hive/Delta: Must include partition column
SELECT * FROM sales WHERE dt = '20240115' AND sale_date = '2024-01-15';

**3. Multi-Engine Support** 🔧

Same table works across all engines:
- Spark
- Trino/Presto
- Flink
- Hive
- Dremio
- Snowflake (external tables)
- BigQuery (BigLake)

**4. Branching & Tagging** 🌿

Git-like workflows for data:
- Create branch for experiments
- Test changes without affecting production
- Merge or discard

**When to Choose Each:**

**Choose Delta Lake:**
- Heavy Databricks user
- Need tight Spark integration
- Existing Delta investment

**Choose Iceberg:**
- Multi-cloud/multi-engine strategy
- Need partition evolution
- Want vendor neutrality
- Snowflake/BigQuery integration`,
          },
          {
            id: 'lh-ice-2',
            title: 'Iceberg Table Structure',
            type: 'text',
            content: `**Iceberg Metadata Architecture:**

Iceberg uses a hierarchical metadata structure:

**Catalog** → **Table** → **Snapshot** → **Manifest List** → **Manifest** → **Data Files**

**Layer 1: Catalog**
- Registry of all tables
- Stores current metadata pointer
- Types: Hive Metastore, AWS Glue, REST catalog

**Layer 2: Table Metadata**
- Table schema
- Partition spec
- Current snapshot pointer
- Table properties

**Layer 3: Snapshot**
- Point-in-time view of table
- Links to manifest list
- Each write creates new snapshot

**Layer 4: Manifest List**
- List of manifest files
- Statistics for pruning

**Layer 5: Manifest Files**
- List of data files
- Per-file statistics (min/max, null counts)
- Partition values

**Layer 6: Data Files**
- Parquet/ORC/Avro files
- Actual data

**File Layout:**

warehouse/
└── db/
    └── sales/
        ├── metadata/
        │   ├── v1.metadata.json
        │   ├── v2.metadata.json (current)
        │   ├── snap-xxx-1.avro (manifest list)
        │   └── xxx-m0.avro (manifest)
        └── data/
            ├── date=2024-01-15/
            │   ├── file1.parquet
            │   └── file2.parquet
            └── date=2024-01-16/
                └── file3.parquet

**Key Benefits:**

**1. Atomic Commits**
New snapshot created atomically - readers see old or new, never partial

**2. Efficient Scanning**
Manifest statistics enable skipping irrelevant files without reading them

**3. Snapshot Isolation**
Concurrent readers see consistent view even during writes`,
          },
        ],
      },
    ],
  },
  {
    id: 'data-quality',
    title: 'Data Quality & Governance',
    description: 'Build reliable, trustworthy data systems.',
    icon: '✅',
    color: 'magenta',
    skillLevel: 'advanced',
    modules: [
      {
        id: 'dq-fundamentals',
        title: 'Data Quality Fundamentals',
        description: 'Understanding and measuring data quality.',
        category: 'data-quality',
        difficulty: 'advanced',
        estimatedTime: 35,
        xpReward: 200,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dq-fund-1',
            title: 'The Six Dimensions of Data Quality',
            type: 'text',
            content: `**Why Data Quality Matters:**

"Garbage in, garbage out" - poor data quality leads to:
- Wrong business decisions
- Lost revenue
- Compliance violations
- Lost trust in data teams
- Wasted analyst time

**The Six Pillars of Data Quality:**

**1. Accuracy** ✓
Does the data correctly represent reality?

Questions to ask:
- Is the customer email actually valid?
- Is the price what's in the source system?
- Does the address match the real location?

**Measurement:**
- Compare against authoritative source
- Validate against business rules
- Sample and manually verify

**2. Completeness** 📋
Is all required data present?

Questions to ask:
- Are there unexpected NULLs?
- Are there missing records?
- Are all required fields populated?

**Measurement:**
- NULL rate per column
- Row count vs expected
- Required field population %

**3. Consistency** 🔄
Does data match across systems and within itself?

Questions to ask:
- Same customer in CRM = same in warehouse?
- Sum of parts = total?
- Same definition used everywhere?

**Measurement:**
- Cross-system reconciliation
- Aggregate consistency checks
- Business rule validation

**4. Timeliness** ⏰
Is data available when needed?

Questions to ask:
- Is today's data loaded?
- How fresh is the data?
- Does it meet SLAs?

**Measurement:**
- Data freshness (max timestamp)
- Load completion time
- SLA compliance %

**5. Uniqueness** 🎯
No duplicate records?

Questions to ask:
- Primary keys truly unique?
- Same entity stored once?
- Deduplication applied correctly?

**Measurement:**
- Duplicate key count
- Fuzzy match duplicate rate
- Entity resolution accuracy

**6. Validity** ✅
Does data conform to defined rules and formats?

Questions to ask:
- Email format correct?
- Values in acceptable range?
- Referential integrity maintained?

**Measurement:**
- Format validation pass rate
- Range violation count
- FK constraint violations`,
          },
          {
            id: 'dq-fund-2',
            title: 'Data Quality Checks Implementation',
            type: 'code',
            content: 'Implementing comprehensive data quality checks:',
            codeExample: {
              language: 'sql',
              description: 'Data Quality Validation Queries',
              code: `-- ====================================================
-- COMPLETENESS CHECKS
-- ====================================================

-- Check NULL rates for critical columns
SELECT 
    'dim_customer' as table_name,
    COUNT(*) as total_rows,
    
    -- Required fields
    SUM(CASE WHEN customer_id IS NULL THEN 1 ELSE 0 END) as null_customer_id,
    SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) as null_email,
    SUM(CASE WHEN created_at IS NULL THEN 1 ELSE 0 END) as null_created_at,
    
    -- Percentages
    ROUND(100.0 * SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) / COUNT(*), 2) as null_email_pct
    
FROM dim_customer;

-- Check for missing expected data
SELECT 
    'Missing dates' as check_name,
    d.full_date as missing_date
FROM dim_date d
LEFT JOIN fact_sales f ON d.date_key = f.date_key
WHERE d.full_date BETWEEN '2024-01-01' AND CURRENT_DATE - 1
  AND d.is_weekend = FALSE
  AND f.sale_key IS NULL;


-- ====================================================
-- UNIQUENESS CHECKS
-- ====================================================

-- Find duplicate primary keys (should be 0!)
SELECT 
    'Duplicate customers' as check_name,
    customer_id,
    COUNT(*) as duplicate_count
FROM dim_customer
WHERE is_current = TRUE
GROUP BY customer_id
HAVING COUNT(*) > 1;

-- Find potential duplicates (fuzzy matching)
SELECT 
    a.customer_id as customer_a,
    b.customer_id as customer_b,
    a.email,
    a.first_name, b.first_name,
    a.phone, b.phone
FROM dim_customer a
JOIN dim_customer b ON a.customer_key < b.customer_key
WHERE a.is_current = TRUE AND b.is_current = TRUE
  AND (
      a.email = b.email
      OR (a.first_name = b.first_name AND a.phone = b.phone)
  );


-- ====================================================
-- VALIDITY CHECKS
-- ====================================================

-- Email format validation
SELECT 
    customer_id, email
FROM dim_customer
WHERE email NOT LIKE '%@%.%'
   OR email LIKE '% %'
   OR email LIKE '%..%';

-- Range validation
SELECT 
    'Invalid amounts' as check_name,
    COUNT(*) as invalid_count
FROM fact_sales
WHERE amount < 0 
   OR amount > 1000000  -- Suspiciously large
   OR quantity < 1;

-- Referential integrity
SELECT 
    'Orphan records' as check_name,
    COUNT(*) as orphan_count
FROM fact_sales f
LEFT JOIN dim_customer c ON f.customer_key = c.customer_key
WHERE c.customer_key IS NULL;


-- ====================================================
-- CONSISTENCY CHECKS
-- ====================================================

-- Cross-system reconciliation
SELECT 
    'Source vs DWH mismatch' as check_name,
    ABS(source.total - dwh.total) as difference,
    source.total as source_total,
    dwh.total as dwh_total
FROM (
    SELECT SUM(amount) as total FROM source_system.orders
    WHERE order_date = '2024-01-15'
) source,
(
    SELECT SUM(amount) as total FROM dwh.fact_sales
    WHERE sale_date = '2024-01-15'
) dwh
WHERE ABS(source.total - dwh.total) > 0.01;

-- Aggregate consistency
SELECT 
    'Sum mismatch' as check_name,
    o.order_id,
    o.order_total,
    SUM(oi.line_total) as calculated_total
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, o.order_total
HAVING ABS(o.order_total - SUM(oi.line_total)) > 0.01;


-- ====================================================
-- TIMELINESS CHECKS
-- ====================================================

SELECT 
    'fact_sales' as table_name,
    MAX(sale_date) as latest_data,
    CURRENT_DATE - MAX(sale_date) as days_stale,
    CASE 
        WHEN CURRENT_DATE - MAX(sale_date) <= 1 THEN 'PASS'
        ELSE 'FAIL - DATA STALE'
    END as status
FROM fact_sales;


-- ====================================================
-- COMPREHENSIVE DQ DASHBOARD
-- ====================================================

CREATE OR REPLACE VIEW dq_dashboard AS
SELECT * FROM (
    -- Completeness
    SELECT 'dim_customer' as table_name, 'completeness' as dimension,
           'email_not_null' as check_name,
           ROUND(100.0 * SUM(CASE WHEN email IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*), 2) as score,
           99.0 as threshold,
           CASE WHEN score >= 99 THEN 'PASS' ELSE 'FAIL' END as status
    FROM dim_customer
    
    UNION ALL
    
    -- Uniqueness
    SELECT 'dim_customer', 'uniqueness', 'no_duplicate_ids',
           CASE WHEN COUNT(*) = COUNT(DISTINCT customer_id) THEN 100.0 
                ELSE ROUND(100.0 * COUNT(DISTINCT customer_id) / COUNT(*), 2) END,
           100.0, 
           CASE WHEN COUNT(*) = COUNT(DISTINCT customer_id) THEN 'PASS' ELSE 'FAIL' END
    FROM dim_customer WHERE is_current = TRUE
    
    -- Add more checks...
);`,
              runnable: false,
            },
          },
          {
            id: 'dq-fund-3',
            title: 'Data Quality Tools and Frameworks',
            type: 'text',
            content: `**Data Quality Tools Landscape:**

**1. Great Expectations** (Open Source)

The most popular open-source DQ framework.

**Features:**
- Python-based expectations
- Auto-generated documentation
- Built-in profiling
- Integrates with Airflow, dbt, Spark

**Example:**
expect_column_values_to_not_be_null(column="email")
expect_column_values_to_be_between(column="age", min_value=0, max_value=120)
expect_column_values_to_match_regex(column="email", regex="^[a-z]+@[a-z]+\\.[a-z]+$")

**2. dbt Tests** (Built into dbt)

Simple, declarative tests in YAML:

models:
  - name: dim_customer
    columns:
      - name: customer_id
        tests:
          - unique
          - not_null
      - name: email
        tests:
          - not_null
          - accepted_values:
              values: ['valid_format']

**3. Soda** (Open Source / Commercial)

SQL-based checks:

checks for dim_customer:
  - row_count > 0
  - missing_percent(email) < 1%
  - duplicate_count(customer_id) = 0

**4. Monte Carlo** (Commercial)

ML-powered anomaly detection:
- Automatically detects schema changes
- Volume anomalies
- Freshness issues
- Distribution shifts

**5. Datafold** (Commercial)

Data diffing and regression testing:
- Compare data across environments
- PR-level data quality checks
- Impact analysis

**Choosing a Tool:**

| Need | Recommended Tool |
|------|------------------|
| Starting out, Python shop | Great Expectations |
| Using dbt | dbt tests + Great Expectations |
| SQL-first team | Soda |
| Enterprise, low-code | Monte Carlo, Datafold |
| Real-time monitoring | Monte Carlo |

**Best Practice: Defense in Depth**

Layer 1: Source validation (reject bad data at ingestion)
Layer 2: Transform tests (dbt tests during transformation)
Layer 3: Output validation (Great Expectations before serving)
Layer 4: Monitoring (Monte Carlo for anomaly detection)`,
          },
        ],
      },
      {
        id: 'dq-contracts',
        title: 'Data Contracts',
        description: 'Establishing agreements between data producers and consumers.',
        category: 'data-quality',
        difficulty: 'advanced',
        estimatedTime: 30,
        xpReward: 175,
        prerequisites: ['dq-fundamentals'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dq-contract-1',
            title: 'What Are Data Contracts?',
            type: 'text',
            content: `**Data Contracts: A Modern Approach to Data Quality**

A **data contract** is a formal agreement between data producers (upstream teams) and data consumers (downstream teams) that specifies:

1. **Schema** - What fields exist and their types
2. **Semantics** - What the data means
3. **Quality** - Expected quality levels (SLAs)
4. **Ownership** - Who's responsible

**Why Data Contracts Matter:**

**Traditional Approach (Problems):**
- Backend team changes API schema
- Data pipeline breaks at 2 AM
- Data team scrambles to fix
- Reports are wrong for hours
- Trust in data erodes

**With Data Contracts:**
- Schema changes require contract update
- Breaking changes flagged before deployment
- Clear ownership and communication
- Automated validation at boundaries

**Analogy: API Contracts**

Just like REST APIs have:
- OpenAPI/Swagger specs
- Versioning
- Breaking change policies

Data should have:
- Schema definitions
- Semantic descriptions
- Quality SLAs
- Change management

**Contract Components:**

**1. Schema Definition**
- Field names and types
- Required vs optional
- Nested structures
- Versioning

**2. Semantic Layer**
- Business definitions
- Calculation logic
- Relationships to other data

**3. Quality Expectations**
- Completeness thresholds
- Freshness SLAs
- Uniqueness requirements
- Valid value ranges

**4. Ownership & Support**
- Producer team contact
- Escalation path
- On-call rotation
- SLA response times

**5. Change Management**
- How to request changes
- Approval process
- Deprecation policy
- Migration support`,
          },
          {
            id: 'dq-contract-2',
            title: 'Data Contract Example',
            type: 'code',
            content: 'A complete data contract specification:',
            codeExample: {
              language: 'sql',
              description: 'Data Contract in YAML Format',
              code: `# ====================================================
# DATA CONTRACT: Customer Events
# ====================================================
# This is a YAML format, shown as SQL for syntax highlighting

/*
dataContract:
  name: customer_events
  version: 2.1.0
  status: active
  
  # Ownership
  owner:
    team: customer-platform
    email: customer-platform@company.com
    slack: "#customer-platform-support"
    oncall: "https://pagerduty.com/customer-platform"
  
  # Schema Definition
  schema:
    type: object
    properties:
      event_id:
        type: string
        format: uuid
        description: "Unique identifier for each event"
        required: true
        pii: false
        
      customer_id:
        type: string
        description: "Customer identifier from auth system"
        required: true
        pii: true  # Personally identifiable
        
      event_type:
        type: string
        enum: [signup, login, purchase, logout, profile_update]
        description: "Type of customer action"
        required: true
        
      event_timestamp:
        type: string
        format: datetime
        description: "When the event occurred (UTC)"
        required: true
        
      properties:
        type: object
        description: "Event-specific attributes"
        required: false
  
  # Quality Expectations
  quality:
    completeness:
      - column: event_id
        threshold: 100%  # Must be complete
      - column: customer_id
        threshold: 99.9%
      - column: event_type
        threshold: 100%
        
    uniqueness:
      - column: event_id
        threshold: 100%  # No duplicates
        
    freshness:
      maxDelay: 5 minutes
      checkFrequency: 1 minute
      
    volume:
      minDailyEvents: 10000
      maxDailyEvents: 10000000
      alertOnAnomaly: true
      
    validity:
      - column: event_type
        rule: "must be in enum list"
      - column: event_timestamp
        rule: "must be within last 24 hours"
  
  # SLAs
  sla:
    availability: 99.9%
    latency:
      p50: 100ms
      p99: 500ms
    supportResponseTime:
      severity1: 15 minutes
      severity2: 4 hours
      severity3: 24 hours
  
  # Change Management
  changes:
    breakingChangePolicy: "2 weeks notice minimum"
    deprecationPolicy: "6 months support after deprecation"
    changeLog:
      - version: 2.1.0
        date: 2024-01-15
        changes: "Added profile_update event type"
        breaking: false
      - version: 2.0.0
        date: 2023-06-01
        changes: "Changed customer_id from int to string"
        breaking: true
  
  # Consumers (who uses this data)
  consumers:
    - name: analytics-warehouse
      team: data-engineering
      usage: "Load to dim_customer_events"
      slaRequired: true
    - name: ml-features
      team: data-science
      usage: "Customer behavior features"
      slaRequired: false
*/

-- Contract enforcement in SQL
-- Validate incoming data against contract

CREATE OR REPLACE PROCEDURE validate_customer_events()
LANGUAGE plpgsql AS $$
DECLARE
    v_null_event_id INT;
    v_null_customer_id DECIMAL;
    v_duplicates INT;
    v_invalid_types INT;
BEGIN
    -- Completeness: event_id 100%
    SELECT COUNT(*) INTO v_null_event_id
    FROM staging_customer_events
    WHERE event_id IS NULL;
    
    IF v_null_event_id > 0 THEN
        RAISE EXCEPTION 'CONTRACT VIOLATION: event_id has % NULL values', v_null_event_id;
    END IF;
    
    -- Completeness: customer_id 99.9%
    SELECT 100.0 * SUM(CASE WHEN customer_id IS NULL THEN 1 ELSE 0 END) / COUNT(*)
    INTO v_null_customer_id
    FROM staging_customer_events;
    
    IF v_null_customer_id > 0.1 THEN
        RAISE EXCEPTION 'CONTRACT VIOLATION: customer_id NULL rate is %', v_null_customer_id;
    END IF;
    
    -- Uniqueness: event_id 100%
    SELECT COUNT(*) - COUNT(DISTINCT event_id) INTO v_duplicates
    FROM staging_customer_events;
    
    IF v_duplicates > 0 THEN
        RAISE EXCEPTION 'CONTRACT VIOLATION: % duplicate event_ids', v_duplicates;
    END IF;
    
    -- Validity: event_type enum
    SELECT COUNT(*) INTO v_invalid_types
    FROM staging_customer_events
    WHERE event_type NOT IN ('signup', 'login', 'purchase', 'logout', 'profile_update');
    
    IF v_invalid_types > 0 THEN
        RAISE EXCEPTION 'CONTRACT VIOLATION: % invalid event_types', v_invalid_types;
    END IF;
    
    RAISE NOTICE 'All contract validations passed';
END;
$$;`,
              runnable: false,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'performance',
    title: 'Performance Optimization',
    description: 'Speed up queries and optimize data systems.',
    icon: '⚡',
    color: 'orange',
    skillLevel: 'advanced',
    modules: [
      {
        id: 'perf-indexing',
        title: 'Database Indexing Strategies',
        description: 'Master indexing for optimal query performance.',
        category: 'performance',
        difficulty: 'advanced',
        estimatedTime: 35,
        xpReward: 200,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'perf-idx-1',
            title: 'Index Types and Selection',
            type: 'text',
            content: `**Understanding Database Indexes:**

An index is a data structure that improves query speed at the cost of additional storage and write overhead.

**Analogy:** 
Index = Book's table of contents
Without index: Read entire book to find a topic
With index: Jump directly to the right page

**Index Types:**

**1. B-Tree Index** (Default, most common)

**Best for:**
- Range queries: <, >, BETWEEN
- Equality: =
- Sorting: ORDER BY
- Prefix matching: LIKE 'abc%'

**Structure:** Balanced tree, O(log n) lookups

**Use cases:**
- Primary keys
- Foreign keys
- Date columns (range queries)
- High-cardinality columns

**2. Hash Index**

**Best for:**
- Exact match only: =
- Faster than B-Tree for equality

**Cannot support:**
- Range queries
- Sorting
- Partial matches

**Use cases:**
- Lookup tables
- Session IDs
- Exact string matching

**3. Bitmap Index**

**Best for:**
- Low-cardinality columns
- AND/OR operations
- Data warehouses

**Structure:** Bit vector per distinct value

**Use cases:**
- Gender (M/F)
- Status (Active/Inactive)
- Boolean flags
- Category columns

**4. Composite Index** (Multi-column)

Index on multiple columns: (customer_id, order_date)

**Critical rule:** Leftmost prefix matters!

Index on (A, B, C) supports:
✅ WHERE A = ?
✅ WHERE A = ? AND B = ?
✅ WHERE A = ? AND B = ? AND C = ?
❌ WHERE B = ? (doesn't use index efficiently)
❌ WHERE C = ? (doesn't use index)

**5. Covering Index**

Index that contains ALL columns needed by a query.
Query answered entirely from index - no table access!

CREATE INDEX idx_covering 
ON orders(customer_id, order_date) 
INCLUDE (total_amount, status);

-- This query uses only the index:
SELECT total_amount, status 
FROM orders 
WHERE customer_id = 100;`,
          },
          {
            id: 'perf-idx-2',
            title: 'Index Implementation',
            type: 'code',
            content: 'Creating and analyzing indexes:',
            codeExample: {
              language: 'sql',
              description: 'Index Creation and Analysis',
              code: `-- ====================================================
-- CREATING INDEXES
-- ====================================================

-- Single column index
CREATE INDEX idx_orders_date 
ON fact_orders(order_date);

-- Composite index (column order matters!)
-- Good for: WHERE customer_id = ? AND order_date = ?
-- Also good for: WHERE customer_id = ?
-- NOT good for: WHERE order_date = ? (alone)
CREATE INDEX idx_orders_cust_date 
ON fact_orders(customer_id, order_date);

-- Covering index (includes non-key columns)
CREATE INDEX idx_orders_covering 
ON fact_orders(customer_id, order_date)
INCLUDE (order_total, status);

-- Partial index (only indexes subset of rows)
CREATE INDEX idx_orders_recent 
ON fact_orders(order_date, customer_id)
WHERE order_date >= '2024-01-01';
-- Smaller index, faster for recent data queries

-- Unique index (also enforces constraint)
CREATE UNIQUE INDEX idx_customer_email 
ON dim_customer(email) 
WHERE is_current = TRUE;

-- Expression index (index on computed value)
CREATE INDEX idx_customer_lower_email 
ON dim_customer(LOWER(email));
-- Supports: WHERE LOWER(email) = 'john@example.com'


-- ====================================================
-- ANALYZING INDEX USAGE
-- ====================================================

-- PostgreSQL: Check index usage statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as times_used,
    idx_tup_read as rows_read,
    idx_tup_fetch as rows_fetched,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'dwh'
ORDER BY idx_scan DESC;

-- Find UNUSED indexes (candidates for removal)
SELECT 
    schemaname, tablename, indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE idx_scan = 0  -- Never used!
  AND indexname NOT LIKE '%_pkey'  -- Keep primary keys
ORDER BY pg_relation_size(indexrelid) DESC;

-- Find tables that NEED indexes (lots of sequential scans)
SELECT 
    schemaname, relname as table_name,
    seq_scan,
    seq_tup_read,
    idx_scan,
    CASE WHEN seq_scan > 0 
         THEN seq_tup_read / seq_scan 
    END as avg_rows_per_scan
FROM pg_stat_user_tables
WHERE seq_scan > 1000  -- Many sequential scans
  AND seq_tup_read / NULLIF(seq_scan, 0) > 10000  -- Scanning many rows
ORDER BY seq_tup_read DESC;


-- ====================================================
-- QUERY PLAN ANALYSIS (EXPLAIN)
-- ====================================================

-- Basic explain
EXPLAIN 
SELECT * FROM fact_orders 
WHERE customer_id = 100 AND order_date > '2024-01-01';

-- With execution statistics
EXPLAIN ANALYZE
SELECT * FROM fact_orders 
WHERE customer_id = 100 AND order_date > '2024-01-01';

-- What to look for:
-- ✅ "Index Scan" or "Index Only Scan" = Good!
-- ❌ "Seq Scan" on large table = Needs index
-- ❌ "Bitmap Heap Scan" with many rows = Consider covering index


-- ====================================================
-- INDEX MAINTENANCE
-- ====================================================

-- Rebuild bloated index
REINDEX INDEX idx_orders_date;

-- Rebuild all indexes on table
REINDEX TABLE fact_orders;

-- Concurrent reindex (doesn't lock table)
REINDEX INDEX CONCURRENTLY idx_orders_date;

-- Update statistics (helps query planner)
ANALYZE fact_orders;`,
              runnable: false,
            },
          },
          {
            id: 'perf-idx-3',
            title: 'Indexing Best Practices',
            type: 'text',
            content: `**When to Create Indexes:**

✅ **DO index:**
- Primary keys (automatic)
- Foreign keys (JOIN performance)
- Columns in WHERE clauses (especially equality)
- Columns in ORDER BY
- Columns in GROUP BY
- High-selectivity columns (many distinct values)

❌ **DON'T index:**
- Small tables (< 1000 rows) - sequential scan is faster
- Frequently updated columns (index maintenance overhead)
- Low-selectivity columns (e.g., boolean, gender)
- Wide columns (large strings, text)
- Columns rarely used in queries

**Composite Index Column Order:**

Most selective column FIRST:

-- If customer_id has 100K values and status has 5 values:
✅ CREATE INDEX ON orders(customer_id, status);
❌ CREATE INDEX ON orders(status, customer_id);

**Rule of thumb:** Put equality conditions before range conditions

-- Query: WHERE status = 'active' AND created_at > '2024-01-01'
CREATE INDEX ON orders(status, created_at);

**Index Trade-offs:**

| More Indexes | Fewer Indexes |
|--------------|---------------|
| Faster reads | Slower reads |
| Slower writes | Faster writes |
| More storage | Less storage |
| More maintenance | Less maintenance |

**For OLTP (transactional):**
- Balance carefully
- Index only what's needed
- Watch write performance

**For OLAP (analytics):**
- Index aggressively
- Writes are batch/infrequent
- Read performance is critical

**Index Monitoring Checklist:**

☐ Review unused indexes quarterly (remove them!)
☐ Check for missing indexes (high seq_scan tables)
☐ Rebuild bloated indexes
☐ Update statistics after large loads
☐ Test query performance after index changes`,
          },
        ],
      },
      {
        id: 'perf-query-opt',
        title: 'Query Optimization',
        description: 'Write faster, more efficient SQL queries.',
        category: 'performance',
        difficulty: 'advanced',
        estimatedTime: 40,
        xpReward: 225,
        prerequisites: ['perf-indexing'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'perf-qo-1',
            title: 'Query Optimization Principles',
            type: 'text',
            content: `**The Three Laws of Query Optimization:**

**1. Reduce Data Scanned** 📉

The fastest query reads the least data.

**Tactics:**
- Use selective WHERE clauses early
- Leverage partitioning (only read relevant partitions)
- Use covering indexes (avoid table access)
- Filter before joining

**2. Minimize Data Movement** 🚚

Moving data between nodes/processes is expensive.

**Tactics:**
- Push predicates down (filter at source)
- Avoid SELECT * (only select needed columns)
- Aggregate before joining when possible
- Use broadcast joins for small tables

**3. Optimize Operations** ⚙️

Some operations are more expensive than others.

**Cost hierarchy (most to least expensive):**
1. Cartesian product (CROSS JOIN)
2. Sorting large datasets (ORDER BY)
3. Hash joins on large tables
4. Full table scans
5. Index range scans
6. Index point lookups

**Common Anti-Patterns to Avoid:**

**❌ Functions on indexed columns:**
WHERE YEAR(order_date) = 2024
-- Can't use index on order_date!

**✅ Sargable alternative:**
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'
-- Uses index!

**❌ Leading wildcards:**
WHERE name LIKE '%Smith'
-- Full scan required

**✅ Trailing wildcard:**
WHERE name LIKE 'Smith%'
-- Can use index

**❌ Implicit type conversion:**
WHERE customer_id = '100'  -- customer_id is INT
-- May prevent index use

**✅ Matching types:**
WHERE customer_id = 100

**❌ OR across different columns:**
WHERE customer_id = 100 OR product_id = 200
-- Often can't use indexes efficiently

**✅ UNION alternative:**
SELECT * FROM orders WHERE customer_id = 100
UNION ALL
SELECT * FROM orders WHERE product_id = 200 AND customer_id != 100`,
          },
          {
            id: 'perf-qo-2',
            title: 'Query Optimization Examples',
            type: 'code',
            content: 'Before and after query optimizations:',
            codeExample: {
              language: 'sql',
              description: 'Query Optimization Transformations',
              code: `-- ====================================================
-- OPTIMIZATION 1: Sargable Predicates
-- ====================================================

-- ❌ BAD: Function on column prevents index use
SELECT * FROM fact_orders
WHERE YEAR(order_date) = 2024 AND MONTH(order_date) = 1;

-- ✅ GOOD: Range query uses index
SELECT * FROM fact_orders
WHERE order_date >= '2024-01-01' 
  AND order_date < '2024-02-01';


-- ====================================================
-- OPTIMIZATION 2: Avoid SELECT *
-- ====================================================

-- ❌ BAD: Selects all 50 columns, can't use covering index
SELECT * FROM fact_orders f
JOIN dim_customer c ON f.customer_key = c.customer_key
WHERE f.order_date = '2024-01-15';

-- ✅ GOOD: Only needed columns, may use covering index
SELECT 
    f.order_id,
    f.order_total,
    c.customer_name,
    c.email
FROM fact_orders f
JOIN dim_customer c ON f.customer_key = c.customer_key
WHERE f.order_date = '2024-01-15';


-- ====================================================
-- OPTIMIZATION 3: Filter Before Join
-- ====================================================

-- ❌ BAD: Join everything, then filter
SELECT c.customer_name, SUM(f.amount)
FROM fact_orders f
JOIN dim_customer c ON f.customer_key = c.customer_key
WHERE f.order_date >= '2024-01-01'
  AND c.state = 'CA'
GROUP BY c.customer_name;

-- ✅ GOOD: Filter first with CTE or subquery
WITH filtered_orders AS (
    SELECT customer_key, amount
    FROM fact_orders
    WHERE order_date >= '2024-01-01'
),
ca_customers AS (
    SELECT customer_key, customer_name
    FROM dim_customer
    WHERE state = 'CA' AND is_current = TRUE
)
SELECT c.customer_name, SUM(o.amount)
FROM filtered_orders o
JOIN ca_customers c ON o.customer_key = c.customer_key
GROUP BY c.customer_name;


-- ====================================================
-- OPTIMIZATION 4: Avoid Correlated Subqueries
-- ====================================================

-- ❌ BAD: Subquery runs once per customer row
SELECT 
    customer_id,
    (SELECT SUM(amount) 
     FROM fact_orders f 
     WHERE f.customer_key = c.customer_key) as total_orders
FROM dim_customer c
WHERE is_current = TRUE;

-- ✅ GOOD: Single join with aggregation
SELECT 
    c.customer_id,
    COALESCE(SUM(f.amount), 0) as total_orders
FROM dim_customer c
LEFT JOIN fact_orders f ON c.customer_key = f.customer_key
WHERE c.is_current = TRUE
GROUP BY c.customer_id;


-- ====================================================
-- OPTIMIZATION 5: Use EXISTS Instead of IN for Large Sets
-- ====================================================

-- ❌ BAD: IN with large subquery
SELECT * FROM dim_customer
WHERE customer_key IN (
    SELECT DISTINCT customer_key 
    FROM fact_orders 
    WHERE order_date >= '2024-01-01'
);

-- ✅ GOOD: EXISTS (stops at first match)
SELECT * FROM dim_customer c
WHERE EXISTS (
    SELECT 1 
    FROM fact_orders f 
    WHERE f.customer_key = c.customer_key
      AND f.order_date >= '2024-01-01'
);


-- ====================================================
-- OPTIMIZATION 6: Aggregate Early
-- ====================================================

-- ❌ BAD: Join detail, then aggregate
SELECT 
    p.category,
    d.year,
    d.month,
    SUM(f.amount) as total_sales
FROM fact_order_items f
JOIN dim_product p ON f.product_key = p.product_key
JOIN dim_date d ON f.date_key = d.date_key
GROUP BY p.category, d.year, d.month;

-- ✅ GOOD: Pre-aggregate, then join for labels
WITH daily_category_sales AS (
    SELECT 
        product_key,
        date_key,
        SUM(amount) as daily_total
    FROM fact_order_items
    GROUP BY product_key, date_key
)
SELECT 
    p.category,
    d.year,
    d.month,
    SUM(s.daily_total) as total_sales
FROM daily_category_sales s
JOIN dim_product p ON s.product_key = p.product_key
JOIN dim_date d ON s.date_key = d.date_key
GROUP BY p.category, d.year, d.month;


-- ====================================================
-- EXPLAIN ANALYZE: Always Check Your Work!
-- ====================================================
EXPLAIN ANALYZE
SELECT ...your optimized query...;

-- Look for:
-- ✅ Index Scan / Index Only Scan
-- ✅ Low "actual rows" vs "rows"
-- ✅ Hash Join for large tables
-- ❌ Seq Scan on large tables
-- ❌ Nested Loop with many iterations
-- ❌ High "rows removed by filter"`,
              runnable: false,
            },
          },
          {
            id: 'perf-qo-3',
            title: 'Partitioning Strategies',
            type: 'text',
            content: `**Table Partitioning for Performance:**

Partitioning divides large tables into smaller, more manageable pieces.

**Types of Partitioning:**

**1. Range Partitioning** (Most common for time-series)

Partition by date ranges:

CREATE TABLE fact_orders (
    order_id BIGINT,
    order_date DATE,
    amount DECIMAL(10,2)
) PARTITION BY RANGE (order_date);

CREATE TABLE fact_orders_2024_q1 
PARTITION OF fact_orders
FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE fact_orders_2024_q2
PARTITION OF fact_orders
FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

**Benefits:**
- Easy to drop old data (DROP PARTITION)
- Queries on date range only scan relevant partitions
- Parallelism across partitions

**2. List Partitioning**

Partition by specific values:

CREATE TABLE fact_orders (...)
PARTITION BY LIST (region);

CREATE TABLE fact_orders_us 
PARTITION OF fact_orders FOR VALUES IN ('US');

CREATE TABLE fact_orders_eu 
PARTITION OF fact_orders FOR VALUES IN ('EU', 'UK');

**3. Hash Partitioning**

Evenly distribute data:

CREATE TABLE fact_orders (...)
PARTITION BY HASH (customer_id);

CREATE TABLE fact_orders_p0 
PARTITION OF fact_orders FOR VALUES WITH (MODULUS 4, REMAINDER 0);
-- Creates 4 partitions

**Partition Pruning:**

The query optimizer skips irrelevant partitions:

-- Only scans 2024_q1 partition
SELECT * FROM fact_orders 
WHERE order_date = '2024-02-15';

**Partitioning Best Practices:**

✅ Partition on columns used in WHERE clauses
✅ Keep partition count manageable (< 1000)
✅ Each partition should have substantial data (1GB+)
✅ Use range partitioning for time-series data
✅ Plan partition management (create future, drop old)

❌ Don't over-partition (thousands of tiny partitions)
❌ Don't partition small tables (< 10GB)
❌ Don't partition on high-cardinality columns

**Partition Maintenance:**

-- Add new partition before data arrives
CREATE TABLE fact_orders_2025_q1 
PARTITION OF fact_orders
FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');

-- Remove old data by dropping partition (instant!)
DROP TABLE fact_orders_2020_q1;`,
          },
        ],
      },
    ],
  },
];

