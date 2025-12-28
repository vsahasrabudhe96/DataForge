import { LearningModule, TopicCategory } from '@/types';

export interface TopicConfig {
  id: TopicCategory;
  title: string;
  description: string;
  icon: string;
  color: 'cyan' | 'purple' | 'green' | 'yellow' | 'magenta' | 'orange';
  modules: LearningModule[];
}

export const LEARNING_TOPICS: TopicConfig[] = [
  {
    id: 'data-modeling',
    title: 'Data Modeling',
    description: 'Master dimensional modeling with fact tables, dimension tables, and schema design patterns.',
    icon: '🏗️',
    color: 'cyan',
    modules: [
      {
        id: 'dm-intro',
        title: 'Introduction to Data Modeling',
        description: 'Learn the fundamentals of data modeling and why it matters.',
        category: 'data-modeling',
        difficulty: 'beginner',
        estimatedTime: 15,
        xpReward: 100,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-intro-1',
            title: 'What is Data Modeling?',
            type: 'text',
            content: `Data modeling is the process of creating a visual representation of data elements and the relationships between them. It's fundamental to building efficient data warehouses and analytics systems.

**Why Data Modeling Matters:**
- Improves data quality and consistency
- Enables efficient querying and analytics
- Facilitates communication between teams
- Reduces storage costs through normalization

**Types of Data Models:**
1. **Conceptual Model**: High-level business view
2. **Logical Model**: Detailed structure without implementation
3. **Physical Model**: Database-specific implementation`,
          },
          {
            id: 'dm-intro-2',
            title: 'OLTP vs OLAP',
            type: 'text',
            content: `Understanding the difference between operational and analytical systems is crucial:

**OLTP (Online Transaction Processing)**
- Designed for day-to-day operations
- Many concurrent users, short transactions
- Normalized schema (3NF)
- Examples: Order processing, banking transactions

**OLAP (Online Analytical Processing)**
- Designed for complex queries and analysis
- Fewer users, long-running queries
- Denormalized schema (star/snowflake)
- Examples: Business intelligence, reporting

| Characteristic | OLTP | OLAP |
|---------------|------|------|
| Query Type | Simple, frequent | Complex, infrequent |
| Data | Current, detailed | Historical, aggregated |
| Schema | Normalized | Denormalized |
| Users | Many | Few analysts |`,
          },
        ],
      },
      {
        id: 'dm-fact-tables',
        title: 'Fact Tables Deep Dive',
        description: 'Understand the backbone of dimensional modeling.',
        category: 'data-modeling',
        difficulty: 'beginner',
        estimatedTime: 25,
        xpReward: 150,
        prerequisites: ['dm-intro'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-fact-1',
            title: 'What are Fact Tables?',
            type: 'text',
            content: `Fact tables are the central tables in a star schema that store quantitative data for analysis. They contain:
- **Measures**: Numeric values to analyze (sales, quantity, revenue)
- **Foreign keys**: References to dimension tables
- **Degenerate dimensions**: Attributes without a dimension table (like invoice number)

**Characteristics of Fact Tables:**
- Very large (millions to billions of rows)
- Relatively narrow (few columns)
- Contain mostly foreign keys and measures
- Represent business events or transactions`,
          },
          {
            id: 'dm-fact-2',
            title: 'Types of Fact Tables',
            type: 'text',
            content: `**1. Transaction Fact Tables**
- One row per transaction/event
- Most detailed grain
- Example: Individual sales transactions

**2. Periodic Snapshot Fact Tables**
- Captures state at regular intervals
- One row per period per entity
- Example: Daily account balances, monthly inventory levels

**3. Accumulating Snapshot Fact Tables**
- Tracks process milestones
- Updated as process progresses
- Example: Order fulfillment pipeline

**4. Factless Fact Tables**
- No measures, only foreign keys
- Track events or coverage
- Example: Student attendance, promotion eligibility`,
          },
          {
            id: 'dm-fact-3',
            title: 'Fact Table Example',
            type: 'code',
            content: 'Real-world example of a sales fact table:',
            codeExample: {
              language: 'sql',
              description: 'Sales Fact Table DDL',
              code: `CREATE TABLE fact_sales (
    -- Surrogate key (optional)
    sale_sk BIGINT PRIMARY KEY,
    
    -- Foreign keys to dimensions
    date_key INT NOT NULL REFERENCES dim_date(date_key),
    product_key INT NOT NULL REFERENCES dim_product(product_key),
    customer_key INT NOT NULL REFERENCES dim_customer(customer_key),
    store_key INT NOT NULL REFERENCES dim_store(store_key),
    
    -- Degenerate dimension
    order_number VARCHAR(20) NOT NULL,
    
    -- Measures
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    sales_amount DECIMAL(12,2) NOT NULL,
    cost_amount DECIMAL(12,2) NOT NULL,
    profit_amount DECIMAL(12,2) GENERATED ALWAYS AS 
        (sales_amount - cost_amount) STORED,
    
    -- Audit columns
    etl_load_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common query patterns
CREATE INDEX idx_fact_sales_date ON fact_sales(date_key);
CREATE INDEX idx_fact_sales_product ON fact_sales(product_key);`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'dm-dimension-tables',
        title: 'Dimension Tables Explained',
        description: 'Learn about different types of dimensions and their purposes.',
        category: 'data-modeling',
        difficulty: 'beginner',
        estimatedTime: 30,
        xpReward: 175,
        prerequisites: ['dm-fact-tables'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-dim-1',
            title: 'Dimension Table Fundamentals',
            type: 'text',
            content: `Dimension tables provide the context for facts. They contain descriptive attributes that answer "who, what, where, when, why, how" questions.

**Key Characteristics:**
- Relatively small compared to fact tables
- Wide tables with many attributes
- Often denormalized for query performance
- Contains both natural and surrogate keys

**Common Dimensions:**
- **Date/Time**: Calendar attributes
- **Product**: Product hierarchy and attributes
- **Customer**: Customer demographics and segments
- **Geography**: Location hierarchies
- **Employee**: Organizational structure`,
          },
          {
            id: 'dm-dim-2',
            title: 'Types of Dimensions',
            type: 'text',
            content: `**1. Conformed Dimensions**
- Shared across multiple fact tables
- Same keys, attributes, and meaning everywhere
- Example: Date dimension used by all facts

**2. Role-Playing Dimensions**
- Same dimension used multiple times in a fact
- Each usage has a different meaning
- Example: Date dimension as order_date, ship_date, delivery_date

**3. Junk Dimensions**
- Combines low-cardinality flags and indicators
- Reduces fact table width
- Example: is_gift, is_rush_order, payment_type

**4. Degenerate Dimensions**
- Dimension attributes stored in fact table
- No separate dimension table needed
- Example: Invoice number, order number

**5. Outrigger Dimensions**
- Dimension that references another dimension
- Used sparingly to avoid snowflaking
- Example: Sales rep referencing office location`,
          },
          {
            id: 'dm-dim-3',
            title: 'Customer Dimension Example',
            type: 'code',
            content: 'A well-designed customer dimension:',
            codeExample: {
              language: 'sql',
              description: 'Customer Dimension Table DDL',
              code: `CREATE TABLE dim_customer (
    -- Keys
    customer_key INT PRIMARY KEY,  -- Surrogate key
    customer_id VARCHAR(20) NOT NULL,  -- Natural/Business key
    
    -- Descriptive attributes
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    full_name VARCHAR(100) GENERATED ALWAYS AS 
        (first_name || ' ' || last_name) STORED,
    email VARCHAR(100),
    phone VARCHAR(20),
    
    -- Address (denormalized)
    street_address VARCHAR(200),
    city VARCHAR(100),
    state_province VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50),
    
    -- Demographics
    birth_date DATE,
    gender VARCHAR(10),
    age_group VARCHAR(20),
    
    -- Segmentation
    customer_segment VARCHAR(50),
    loyalty_tier VARCHAR(20),
    acquisition_channel VARCHAR(50),
    
    -- Lifecycle dates
    first_order_date DATE,
    most_recent_order_date DATE,
    customer_since_date DATE,
    
    -- SCD Type 2 tracking
    effective_date DATE NOT NULL,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE,
    
    -- Audit
    source_system VARCHAR(50),
    etl_batch_id INT
);`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'dm-keys',
        title: 'Key Types in Data Warehousing',
        description: 'Understand surrogate, natural, business, and composite keys.',
        category: 'data-modeling',
        difficulty: 'intermediate',
        estimatedTime: 25,
        xpReward: 175,
        prerequisites: ['dm-dimension-tables'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-keys-1',
            title: 'Types of Keys',
            type: 'text',
            content: `**1. Natural Key (Business Key)**
- Meaningful identifier from source system
- Example: SSN, email, product SKU
- Pros: Business meaning, no translation needed
- Cons: Can change, may be recycled, composite

**2. Surrogate Key**
- System-generated identifier (usually integer)
- No business meaning
- Pros: Immutable, simple joins, compact
- Cons: No business meaning, requires mapping

**3. Primary Key**
- Uniquely identifies each row
- Can be natural or surrogate
- Must be unique and non-null

**4. Foreign Key**
- References primary key in another table
- Establishes relationships between tables
- Enables joins for queries

**5. Composite Key**
- Multiple columns together form unique identifier
- Common in bridge/junction tables
- Example: (customer_id, product_id, date)`,
          },
          {
            id: 'dm-keys-2',
            title: 'Why Use Surrogate Keys?',
            type: 'text',
            content: `Surrogate keys are the preferred approach in data warehouses:

**Advantages:**
1. **Insulation from source changes**: Natural keys may change or be reused
2. **Performance**: Integer joins are faster than string comparisons
3. **SCD Type 2 support**: Multiple rows per natural key
4. **Unified representation**: Same key format across dimensions
5. **Privacy**: Don't expose sensitive natural keys

**Best Practices:**
- Always have a surrogate key as primary key
- Keep natural key as a separate column
- Create indexes on natural keys for lookups
- Use sequences or identity columns for generation`,
          },
          {
            id: 'dm-keys-3',
            title: 'Key Implementation Example',
            type: 'code',
            content: 'Implementing proper key management:',
            codeExample: {
              language: 'sql',
              description: 'Key Types in Action',
              code: `-- Dimension with surrogate and natural keys
CREATE TABLE dim_product (
    product_key SERIAL PRIMARY KEY,      -- Surrogate key
    product_id VARCHAR(20) NOT NULL,     -- Natural key
    product_sku VARCHAR(30) NOT NULL,    -- Business key
    
    product_name VARCHAR(200),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    
    -- SCD Type 2 columns
    effective_date DATE NOT NULL,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE,
    version_number INT DEFAULT 1,
    
    -- Ensure natural key uniqueness for current records
    CONSTRAINT uk_product_current 
        UNIQUE (product_id, is_current) 
        WHERE is_current = TRUE
);

-- Lookup function: Natural key → Surrogate key
CREATE OR REPLACE FUNCTION get_product_key(p_product_id VARCHAR)
RETURNS INT AS $$
    SELECT product_key 
    FROM dim_product 
    WHERE product_id = p_product_id 
      AND is_current = TRUE;
$$ LANGUAGE SQL STABLE;`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'dm-star-snowflake',
        title: 'Star Schema vs Snowflake Schema',
        description: 'Compare the two fundamental schema designs.',
        category: 'data-modeling',
        difficulty: 'intermediate',
        estimatedTime: 30,
        xpReward: 200,
        prerequisites: ['dm-keys'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-schema-1',
            title: 'Star Schema',
            type: 'text',
            content: `The star schema is the simplest and most widely used dimensional model.

**Structure:**
- Central fact table
- Surrounding denormalized dimension tables
- Single join between fact and each dimension

**Characteristics:**
- Dimensions are fully denormalized
- Redundant data in dimensions (intentional)
- Simple queries with few joins
- Optimized for read performance

**When to Use:**
- Standard analytics and BI workloads
- When query simplicity is priority
- When dimensions are manageable in size
- Most data warehouse scenarios`,
          },
          {
            id: 'dm-schema-2',
            title: 'Snowflake Schema',
            type: 'text',
            content: `The snowflake schema normalizes dimension tables into sub-dimensions.

**Structure:**
- Central fact table
- Normalized dimension hierarchies
- Multiple tables per dimension

**Characteristics:**
- Reduced data redundancy
- More complex queries (more joins)
- Smaller storage footprint
- Harder to understand and maintain

**When to Use:**
- Storage is a major constraint
- Dimension tables are very large
- Data quality/consistency is critical
- Updates to dimensions are frequent

**Trade-offs:**
| Aspect | Star | Snowflake |
|--------|------|-----------|
| Query Complexity | Simple | Complex |
| Performance | Faster | Slower |
| Storage | More | Less |
| Maintenance | Easier | Harder |`,
          },
          {
            id: 'dm-schema-3',
            title: 'Schema Comparison',
            type: 'code',
            content: 'Visual comparison through SQL:',
            codeExample: {
              language: 'sql',
              description: 'Star vs Snowflake Query Comparison',
              code: `-- STAR SCHEMA: Simple query, few joins
-- All product info in one denormalized table
SELECT 
    d.calendar_year,
    p.category_name,
    p.subcategory_name,
    p.brand_name,
    SUM(f.sales_amount) as total_sales
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_product p ON f.product_key = p.product_key
GROUP BY 1, 2, 3, 4;

-- SNOWFLAKE SCHEMA: More joins required
-- Product hierarchy normalized into separate tables
SELECT 
    d.calendar_year,
    c.category_name,
    sc.subcategory_name,
    b.brand_name,
    SUM(f.sales_amount) as total_sales
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_product p ON f.product_key = p.product_key
JOIN dim_subcategory sc ON p.subcategory_key = sc.subcategory_key
JOIN dim_category c ON sc.category_key = c.category_key
JOIN dim_brand b ON p.brand_key = b.brand_key
GROUP BY 1, 2, 3, 4;`,
              runnable: false,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'scd',
    title: 'Slowly Changing Dimensions',
    description: 'Master all SCD types and learn when to apply each pattern.',
    icon: '🔄',
    color: 'purple',
    modules: [
      {
        id: 'scd-intro',
        title: 'Introduction to SCDs',
        description: 'Understand why we need slowly changing dimensions.',
        category: 'scd',
        difficulty: 'beginner',
        estimatedTime: 20,
        xpReward: 100,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-intro-1',
            title: 'The Problem SCDs Solve',
            type: 'text',
            content: `Dimension data changes over time, but we often need to preserve history for accurate historical analysis.

**Example Scenario:**
A customer moves from New York to California. How should we handle this in our data warehouse?

- **Option A**: Just update the address → Lose all history
- **Option B**: Keep history somehow → Need SCD strategies

**Why History Matters:**
1. Accurate historical reporting
2. Trend analysis over time
3. Audit and compliance requirements
4. Understanding customer/product evolution

**Common Changing Attributes:**
- Customer addresses and demographics
- Product prices and descriptions
- Employee roles and departments
- Store locations and regions`,
          },
        ],
      },
      {
        id: 'scd-type1',
        title: 'SCD Type 1: Overwrite',
        description: 'The simplest approach - just update in place.',
        category: 'scd',
        difficulty: 'beginner',
        estimatedTime: 15,
        xpReward: 75,
        prerequisites: ['scd-intro'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-type1-1',
            title: 'How Type 1 Works',
            type: 'text',
            content: `**SCD Type 1: Overwrite**

Simply update the dimension record with new values. No history is preserved.

**Characteristics:**
- Simplest to implement
- No historical tracking
- Fact table references unchanged
- Smallest storage footprint

**When to Use:**
- Correcting data entry errors
- Attributes that don't need history
- Non-business-critical attributes
- When storage is extremely limited

**Pros:**
- Simple implementation
- No complex queries needed
- Minimal storage

**Cons:**
- No history preserved
- Can't analyze historical context
- May misrepresent past transactions`,
          },
          {
            id: 'scd-type1-2',
            title: 'Type 1 Implementation',
            type: 'code',
            content: 'SQL implementation of Type 1 SCD:',
            codeExample: {
              language: 'sql',
              description: 'SCD Type 1 Merge Pattern',
              code: `-- Type 1: Simple UPDATE
-- Customer changes address from NY to CA

-- Before: Customer record shows NY
-- After: Customer record shows CA (history lost)

MERGE INTO dim_customer tgt
USING staging_customer src
ON tgt.customer_id = src.customer_id

WHEN MATCHED THEN
    UPDATE SET
        first_name = src.first_name,
        last_name = src.last_name,
        email = src.email,
        street_address = src.street_address,
        city = src.city,
        state = src.state,           -- Overwrites NY → CA
        postal_code = src.postal_code,
        updated_at = CURRENT_TIMESTAMP
        
WHEN NOT MATCHED THEN
    INSERT (customer_id, first_name, last_name, email,
            street_address, city, state, postal_code, created_at)
    VALUES (src.customer_id, src.first_name, src.last_name, src.email,
            src.street_address, src.city, src.state, src.postal_code, 
            CURRENT_TIMESTAMP);`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'scd-type2',
        title: 'SCD Type 2: Historical Tracking',
        description: 'The gold standard for tracking complete history.',
        category: 'scd',
        difficulty: 'intermediate',
        estimatedTime: 35,
        xpReward: 200,
        prerequisites: ['scd-type1'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-type2-1',
            title: 'How Type 2 Works',
            type: 'text',
            content: `**SCD Type 2: Add New Row**

Create a new row for each change while keeping historical rows. The most powerful and commonly used SCD type.

**Key Components:**
1. **Surrogate Key**: Unique identifier for each version
2. **Natural Key**: Business identifier (same across versions)
3. **Effective Date**: When this version became active
4. **Expiration Date**: When this version became inactive
5. **Is Current Flag**: Boolean for easy current record lookup

**Tracking Columns Pattern:**
\`\`\`
effective_date DATE
expiration_date DATE (usually '9999-12-31' for current)
is_current BOOLEAN
version_number INT (optional)
\`\`\`

**When to Use:**
- Must preserve complete history
- Need accurate point-in-time reporting
- Audit/compliance requirements
- Tracking attribute evolution`,
          },
          {
            id: 'scd-type2-2',
            title: 'Type 2 Example',
            type: 'text',
            content: `**Scenario:** Customer John moves from NY to CA on March 15, 2024

**Before (1 row):**
| customer_key | customer_id | city | state | effective_date | expiration_date | is_current |
|--------------|-------------|------|-------|----------------|-----------------|------------|
| 1001 | C123 | New York | NY | 2023-01-15 | 9999-12-31 | true |

**After (2 rows):**
| customer_key | customer_id | city | state | effective_date | expiration_date | is_current |
|--------------|-------------|------|-------|----------------|-----------------|------------|
| 1001 | C123 | New York | NY | 2023-01-15 | 2024-03-14 | false |
| 2547 | C123 | Los Angeles | CA | 2024-03-15 | 9999-12-31 | true |

**Notice:**
- Same customer_id but different customer_key
- Original row's expiration_date and is_current updated
- New row gets new surrogate key
- Fact tables reference the correct version's key`,
          },
          {
            id: 'scd-type2-3',
            title: 'Type 2 Implementation',
            type: 'code',
            content: 'Complete SCD Type 2 merge pattern:',
            codeExample: {
              language: 'sql',
              description: 'SCD Type 2 Full Implementation',
              code: `-- Step 1: Identify changed records
WITH changes AS (
    SELECT 
        s.*,
        d.customer_key as existing_key
    FROM staging_customer s
    LEFT JOIN dim_customer d 
        ON s.customer_id = d.customer_id 
        AND d.is_current = TRUE
    WHERE d.customer_key IS NULL  -- New customer
       OR s.city != d.city        -- Changed city
       OR s.state != d.state      -- Changed state
       OR s.email != d.email      -- Changed email
),

-- Step 2: Expire old records
expire_old AS (
    UPDATE dim_customer d
    SET 
        expiration_date = CURRENT_DATE - INTERVAL '1 day',
        is_current = FALSE
    FROM changes c
    WHERE d.customer_id = c.customer_id
      AND d.is_current = TRUE
      AND c.existing_key IS NOT NULL
    RETURNING d.customer_id
)

-- Step 3: Insert new versions
INSERT INTO dim_customer (
    customer_id, first_name, last_name, email,
    city, state, postal_code,
    effective_date, expiration_date, is_current, version_number
)
SELECT 
    c.customer_id, c.first_name, c.last_name, c.email,
    c.city, c.state, c.postal_code,
    CURRENT_DATE,
    '9999-12-31'::DATE,
    TRUE,
    COALESCE(
        (SELECT MAX(version_number) + 1 
         FROM dim_customer 
         WHERE customer_id = c.customer_id), 
        1
    )
FROM changes c;`,
              runnable: false,
            },
          },
          {
            id: 'scd-type2-4',
            title: 'Point-in-Time Queries',
            type: 'code',
            content: 'Querying historical data with SCD Type 2:',
            codeExample: {
              language: 'sql',
              description: 'Historical and Point-in-Time Queries',
              code: `-- Get current customer data
SELECT * FROM dim_customer 
WHERE is_current = TRUE;

-- Get customer state as of specific date
SELECT * FROM dim_customer
WHERE customer_id = 'C123'
  AND '2024-02-01' BETWEEN effective_date AND expiration_date;

-- Analyze sales with point-in-time dimension
-- Shows sales by state AS IT WAS at time of sale
SELECT 
    c.state as customer_state_at_sale,
    SUM(f.sales_amount) as total_sales
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_customer c ON f.customer_key = c.customer_key
WHERE d.calendar_year = 2024
GROUP BY c.state;

-- Customer history timeline
SELECT 
    customer_id,
    city,
    state,
    effective_date,
    expiration_date,
    version_number
FROM dim_customer
WHERE customer_id = 'C123'
ORDER BY version_number;`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'scd-type3',
        title: 'SCD Type 3: Previous Value',
        description: 'Track current and previous values in the same row.',
        category: 'scd',
        difficulty: 'intermediate',
        estimatedTime: 20,
        xpReward: 125,
        prerequisites: ['scd-type2'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-type3-1',
            title: 'How Type 3 Works',
            type: 'text',
            content: `**SCD Type 3: Add New Column**

Add columns to store the previous value alongside the current value.

**Structure:**
- current_[attribute]: The current value
- previous_[attribute]: The previous value
- [attribute]_change_date: When the change occurred

**When to Use:**
- Only need one level of history
- Comparing current vs previous state
- Simple before/after analysis
- Limited history requirements

**Pros:**
- Simple to query (single row per entity)
- Easy comparison of current vs previous
- No additional rows

**Cons:**
- Limited history (only one previous value)
- Column proliferation for many tracked attributes
- Complex for multiple changing attributes`,
          },
          {
            id: 'scd-type3-2',
            title: 'Type 3 Implementation',
            type: 'code',
            content: 'SCD Type 3 structure and update:',
            codeExample: {
              language: 'sql',
              description: 'SCD Type 3 Pattern',
              code: `-- Table structure with Type 3 columns
CREATE TABLE dim_customer_type3 (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL UNIQUE,
    
    -- Current values
    current_city VARCHAR(100),
    current_state VARCHAR(50),
    current_segment VARCHAR(50),
    
    -- Previous values (one level of history)
    previous_city VARCHAR(100),
    previous_state VARCHAR(50),
    previous_segment VARCHAR(50),
    
    -- Change tracking
    city_change_date DATE,
    state_change_date DATE,
    segment_change_date DATE,
    
    -- Other attributes
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100)
);

-- Update with Type 3 pattern
UPDATE dim_customer_type3
SET 
    previous_state = current_state,
    previous_city = current_city,
    current_state = 'CA',
    current_city = 'Los Angeles',
    state_change_date = CURRENT_DATE,
    city_change_date = CURRENT_DATE
WHERE customer_id = 'C123'
  AND current_state != 'CA';  -- Only update if changed

-- Query: Find customers who changed states
SELECT 
    customer_id,
    previous_state,
    current_state,
    state_change_date,
    current_state AS "Moved To",
    previous_state AS "Moved From"
FROM dim_customer_type3
WHERE previous_state IS NOT NULL
  AND previous_state != current_state;`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'scd-type6',
        title: 'SCD Type 6: Hybrid Approach',
        description: 'Combine Type 1, 2, and 3 for maximum flexibility.',
        category: 'scd',
        difficulty: 'advanced',
        estimatedTime: 30,
        xpReward: 250,
        prerequisites: ['scd-type3'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-type6-1',
            title: 'Understanding Type 6',
            type: 'text',
            content: `**SCD Type 6: Hybrid (1+2+3 = 6)**

Combines Type 1, 2, and 3 approaches for maximum analytical flexibility.

**Structure includes:**
- Type 2: Full row history with effective dates
- Type 1: Current value updated in all historical rows
- Type 3: Previous value column

**When to Use:**
- Need both historical accuracy AND current context
- Complex analytical requirements
- Reports need both "as-was" and "as-is" views
- Customer segmentation with history

**Trade-offs:**
- Most complex to implement and maintain
- Highest storage requirement
- Maximum flexibility for analysis`,
          },
          {
            id: 'scd-type6-2',
            title: 'Type 6 Implementation',
            type: 'code',
            content: 'Complete Type 6 hybrid pattern:',
            codeExample: {
              language: 'sql',
              description: 'SCD Type 6 Hybrid Implementation',
              code: `-- Type 6 table structure
CREATE TABLE dim_customer_type6 (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    
    -- Descriptive attributes
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    
    -- Type 2: Historical value (as-was at this point in time)
    historical_state VARCHAR(50),
    historical_city VARCHAR(100),
    
    -- Type 1: Current value (updated across all rows)
    current_state VARCHAR(50),
    current_city VARCHAR(100),
    
    -- Type 3: Previous value
    previous_state VARCHAR(50),
    
    -- Type 2 tracking
    effective_date DATE NOT NULL,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE
);

-- Type 6 Update Process
-- When customer moves from NY to CA:

-- Step 1: Update Type 1 columns (current_*) in ALL rows
UPDATE dim_customer_type6
SET 
    current_state = 'CA',
    current_city = 'Los Angeles'
WHERE customer_id = 'C123';

-- Step 2: Expire current row and insert new (Type 2)
UPDATE dim_customer_type6
SET 
    expiration_date = CURRENT_DATE - INTERVAL '1 day',
    is_current = FALSE
WHERE customer_id = 'C123' AND is_current = TRUE;

INSERT INTO dim_customer_type6 (
    customer_id, first_name, last_name,
    historical_state, historical_city,
    current_state, current_city,
    previous_state,  -- Type 3
    effective_date, is_current
)
SELECT 
    customer_id, first_name, last_name,
    'CA', 'Los Angeles',        -- New historical value
    'CA', 'Los Angeles',        -- Current (Type 1)
    historical_state,           -- Previous = old historical (Type 3)
    CURRENT_DATE, TRUE
FROM dim_customer_type6
WHERE customer_id = 'C123' 
  AND expiration_date = CURRENT_DATE - INTERVAL '1 day';`,
              runnable: false,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'loading-patterns',
    title: 'Data Loading Patterns',
    description: 'Master full loads, incremental loads, watermarking, and CDC.',
    icon: '📥',
    color: 'green',
    modules: [
      {
        id: 'lp-full-incremental',
        title: 'Full Load vs Incremental Load',
        description: 'Understand when to use each loading strategy.',
        category: 'loading-patterns',
        difficulty: 'beginner',
        estimatedTime: 25,
        xpReward: 125,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lp-fi-1',
            title: 'Full Load Strategy',
            type: 'text',
            content: `**Full Load (Full Refresh)**

Completely replace target data with source data on each run.

**Process:**
1. Truncate target table
2. Load all source data
3. Rebuild indexes

**When to Use:**
- Small datasets (< 1M rows)
- Source doesn't track changes
- Data quality requires full reconciliation
- Simpler is better (initial development)
- Weekly/monthly snapshots

**Pros:**
- Simple to implement
- Guarantees source-target consistency
- No tracking infrastructure needed

**Cons:**
- Inefficient for large tables
- Long processing time
- Resource intensive
- May cause availability issues`,
          },
          {
            id: 'lp-fi-2',
            title: 'Incremental Load Strategy',
            type: 'text',
            content: `**Incremental Load (Delta Load)**

Only process records that have changed since last load.

**Key Concepts:**
- **Delta Detection**: Identify new/changed records
- **Watermark**: Bookmark of last processed point
- **Merge/Upsert**: Insert new, update existing

**When to Use:**
- Large datasets
- Frequent update requirements
- Source supports change tracking
- Real-time or near real-time needs

**Pros:**
- Faster processing
- Lower resource usage
- Minimal system impact
- Supports near real-time

**Cons:**
- More complex implementation
- Requires change detection mechanism
- Risk of missing changes
- Harder to debug`,
          },
          {
            id: 'lp-fi-3',
            title: 'Implementation Comparison',
            type: 'code',
            content: 'SQL patterns for both approaches:',
            codeExample: {
              language: 'sql',
              description: 'Full vs Incremental Loading',
              code: `-- FULL LOAD PATTERN
-- Simple but resource-intensive
BEGIN TRANSACTION;

-- Clear target
TRUNCATE TABLE dwh.fact_orders;

-- Load all data
INSERT INTO dwh.fact_orders
SELECT 
    o.order_id,
    d.date_key,
    c.customer_key,
    p.product_key,
    o.quantity,
    o.amount
FROM source.orders o
JOIN dwh.dim_date d ON o.order_date = d.full_date
JOIN dwh.dim_customer c ON o.customer_id = c.customer_id AND c.is_current
JOIN dwh.dim_product p ON o.product_id = p.product_id AND p.is_current;

COMMIT;

-- INCREMENTAL LOAD PATTERN
-- Efficient but requires watermark tracking
DECLARE @last_watermark TIMESTAMP;
DECLARE @current_watermark TIMESTAMP = CURRENT_TIMESTAMP;

-- Get last successful load timestamp
SELECT @last_watermark = watermark_value
FROM etl.watermarks
WHERE table_name = 'fact_orders';

-- Load only new/changed records
MERGE INTO dwh.fact_orders tgt
USING (
    SELECT 
        o.order_id,
        d.date_key,
        c.customer_key,
        p.product_key,
        o.quantity,
        o.amount
    FROM source.orders o
    JOIN dwh.dim_date d ON o.order_date = d.full_date
    JOIN dwh.dim_customer c ON o.customer_id = c.customer_id 
    JOIN dwh.dim_product p ON o.product_id = p.product_id
    WHERE o.updated_at > @last_watermark  -- Only changes
      AND o.updated_at <= @current_watermark
) src
ON tgt.order_id = src.order_id
WHEN MATCHED THEN UPDATE SET ...
WHEN NOT MATCHED THEN INSERT ...;

-- Update watermark
UPDATE etl.watermarks
SET watermark_value = @current_watermark
WHERE table_name = 'fact_orders';`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'lp-watermarking',
        title: 'Watermarking Strategies',
        description: 'Track incremental load progress effectively.',
        category: 'loading-patterns',
        difficulty: 'intermediate',
        estimatedTime: 30,
        xpReward: 175,
        prerequisites: ['lp-full-incremental'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lp-wm-1',
            title: 'What is Watermarking?',
            type: 'text',
            content: `**Watermarking** is a technique to track the last processed point in your data, enabling reliable incremental loads.

**Types of Watermarks:**

**1. Timestamp Watermark**
- Uses updated_at or created_at columns
- Most common approach
- Works well with append-only data

**2. ID-Based Watermark**
- Uses auto-incrementing IDs
- Good for insert-only scenarios
- Can miss updates to existing records

**3. Sequence Number Watermark**
- Database-specific sequences
- Transactionally consistent
- Common in change data capture

**Watermark Storage:**
Store watermarks in a dedicated control table:
- Table/entity being tracked
- Last processed value
- Last successful load time
- Load status`,
          },
          {
            id: 'lp-wm-2',
            title: 'High Watermark Implementation',
            type: 'code',
            content: 'Complete watermark implementation:',
            codeExample: {
              language: 'sql',
              description: 'Watermark Table and Process',
              code: `-- Watermark control table
CREATE TABLE etl.load_watermarks (
    watermark_id SERIAL PRIMARY KEY,
    source_table VARCHAR(100) NOT NULL,
    target_table VARCHAR(100) NOT NULL,
    watermark_column VARCHAR(50) NOT NULL,
    watermark_value VARCHAR(100),
    watermark_type VARCHAR(20), -- 'timestamp', 'id', 'sequence'
    last_load_start TIMESTAMP,
    last_load_end TIMESTAMP,
    last_load_status VARCHAR(20),
    rows_processed BIGINT,
    UNIQUE(source_table, target_table)
);

-- Initialize watermark
INSERT INTO etl.load_watermarks 
    (source_table, target_table, watermark_column, watermark_type, watermark_value)
VALUES 
    ('source.orders', 'dwh.fact_orders', 'updated_at', 'timestamp', '1900-01-01');

-- Safe incremental load with watermark
CREATE OR REPLACE PROCEDURE etl.load_orders_incremental()
LANGUAGE plpgsql AS $$
DECLARE
    v_low_watermark TIMESTAMP;
    v_high_watermark TIMESTAMP;
    v_rows_affected BIGINT;
BEGIN
    -- Get current watermark
    SELECT watermark_value::TIMESTAMP INTO v_low_watermark
    FROM etl.load_watermarks
    WHERE target_table = 'dwh.fact_orders';
    
    -- Calculate new watermark (with safety buffer)
    SELECT MAX(updated_at) - INTERVAL '5 minutes' INTO v_high_watermark
    FROM source.orders
    WHERE updated_at > v_low_watermark;
    
    -- Update status to running
    UPDATE etl.load_watermarks
    SET last_load_start = CURRENT_TIMESTAMP,
        last_load_status = 'RUNNING'
    WHERE target_table = 'dwh.fact_orders';
    
    -- Perform incremental load
    INSERT INTO dwh.fact_orders
    SELECT * FROM source.orders
    WHERE updated_at > v_low_watermark
      AND updated_at <= v_high_watermark
    ON CONFLICT (order_id) DO UPDATE SET ...;
    
    GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
    
    -- Update watermark on success
    UPDATE etl.load_watermarks
    SET watermark_value = v_high_watermark::VARCHAR,
        last_load_end = CURRENT_TIMESTAMP,
        last_load_status = 'SUCCESS',
        rows_processed = v_rows_affected
    WHERE target_table = 'dwh.fact_orders';
    
EXCEPTION WHEN OTHERS THEN
    -- Mark as failed, don't advance watermark
    UPDATE etl.load_watermarks
    SET last_load_status = 'FAILED',
        last_load_end = CURRENT_TIMESTAMP
    WHERE target_table = 'dwh.fact_orders';
    RAISE;
END;
$$;`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'lp-cdc',
        title: 'Change Data Capture (CDC)',
        description: 'Real-time change detection strategies.',
        category: 'loading-patterns',
        difficulty: 'advanced',
        estimatedTime: 40,
        xpReward: 250,
        prerequisites: ['lp-watermarking'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lp-cdc-1',
            title: 'CDC Fundamentals',
            type: 'text',
            content: `**Change Data Capture (CDC)** identifies and captures changes made to source data in real-time or near real-time.

**CDC Methods:**

**1. Log-Based CDC**
- Reads database transaction logs
- Lowest impact on source
- Most accurate and complete
- Tools: Debezium, AWS DMS, Oracle GoldenGate

**2. Trigger-Based CDC**
- Database triggers capture changes
- Writes to shadow/audit tables
- Higher source impact
- Simpler to implement

**3. Timestamp-Based CDC**
- Relies on updated_at columns
- Simple but can miss changes
- Requires source modification
- May miss deletes

**4. Diff-Based CDC**
- Compare snapshots
- Detects all changes including deletes
- Resource intensive
- Good for batch scenarios`,
          },
          {
            id: 'lp-cdc-2',
            title: 'CDC Implementation',
            type: 'code',
            content: 'Trigger-based CDC example:',
            codeExample: {
              language: 'sql',
              description: 'Trigger-Based CDC Pattern',
              code: `-- CDC audit table
CREATE TABLE cdc.customer_changes (
    change_id BIGSERIAL PRIMARY KEY,
    operation CHAR(1) NOT NULL, -- I/U/D
    change_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id BIGINT,
    
    -- Old values (for updates/deletes)
    old_customer_id VARCHAR(20),
    old_name VARCHAR(100),
    old_email VARCHAR(100),
    old_state VARCHAR(50),
    
    -- New values (for inserts/updates)
    new_customer_id VARCHAR(20),
    new_name VARCHAR(100),
    new_email VARCHAR(100),
    new_state VARCHAR(50),
    
    -- Processing status
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP
);

-- Capture trigger
CREATE OR REPLACE FUNCTION cdc.capture_customer_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO cdc.customer_changes 
            (operation, transaction_id, new_customer_id, new_name, new_email, new_state)
        VALUES 
            ('I', txid_current(), NEW.customer_id, NEW.name, NEW.email, NEW.state);
        RETURN NEW;
        
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO cdc.customer_changes 
            (operation, transaction_id,
             old_customer_id, old_name, old_email, old_state,
             new_customer_id, new_name, new_email, new_state)
        VALUES 
            ('U', txid_current(),
             OLD.customer_id, OLD.name, OLD.email, OLD.state,
             NEW.customer_id, NEW.name, NEW.email, NEW.state);
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO cdc.customer_changes 
            (operation, transaction_id, old_customer_id, old_name, old_email, old_state)
        VALUES 
            ('D', txid_current(), OLD.customer_id, OLD.name, OLD.email, OLD.state);
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER trg_customer_cdc
AFTER INSERT OR UPDATE OR DELETE ON source.customers
FOR EACH ROW EXECUTE FUNCTION cdc.capture_customer_changes();

-- Process CDC records
CREATE OR REPLACE PROCEDURE etl.process_customer_cdc()
LANGUAGE plpgsql AS $$
DECLARE
    v_batch_size INT := 10000;
BEGIN
    -- Process in batches
    WITH batch AS (
        SELECT * FROM cdc.customer_changes
        WHERE processed = FALSE
        ORDER BY change_id
        LIMIT v_batch_size
        FOR UPDATE SKIP LOCKED
    )
    UPDATE dwh.dim_customer d
    SET name = b.new_name,
        email = b.new_email,
        state = b.new_state,
        updated_at = b.change_timestamp
    FROM batch b
    WHERE d.customer_id = b.new_customer_id
      AND b.operation IN ('I', 'U');
    
    -- Mark as processed
    UPDATE cdc.customer_changes
    SET processed = TRUE, processed_at = CURRENT_TIMESTAMP
    WHERE change_id IN (SELECT change_id FROM batch);
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
    id: 'lakehouse',
    title: 'Data Lakehouse',
    description: 'Learn Delta Lake, Iceberg, and modern lakehouse patterns.',
    icon: '🏠',
    color: 'yellow',
    modules: [
      {
        id: 'lh-delta-intro',
        title: 'Delta Lake Fundamentals',
        description: 'Understand ACID transactions on data lakes.',
        category: 'lakehouse',
        difficulty: 'intermediate',
        estimatedTime: 35,
        xpReward: 200,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lh-delta-1',
            title: 'What is Delta Lake?',
            type: 'text',
            content: `**Delta Lake** is an open-source storage layer that brings ACID transactions to data lakes.

**Key Features:**
1. **ACID Transactions**: Serializable isolation for concurrent operations
2. **Time Travel**: Query previous versions of data
3. **Schema Enforcement**: Prevent bad data from entering
4. **Schema Evolution**: Safely change table structure
5. **Audit History**: Track all changes to data
6. **Unified Batch/Streaming**: Same table for both

**How It Works:**
- Stores data in Parquet format
- Transaction log (_delta_log) tracks all changes
- Each change creates a new version
- Supports multiple readers/writers`,
          },
          {
            id: 'lh-delta-2',
            title: 'Delta Lake Operations',
            type: 'code',
            content: 'Common Delta Lake operations:',
            codeExample: {
              language: 'sql',
              description: 'Delta Lake SQL Operations (Spark SQL)',
              code: `-- Create Delta table
CREATE TABLE sales_delta
USING DELTA
LOCATION 's3://bucket/sales'
AS SELECT * FROM raw_sales;

-- Insert data
INSERT INTO sales_delta
SELECT * FROM staging_sales;

-- Update data (ACID compliant)
UPDATE sales_delta
SET status = 'completed'
WHERE order_id = 12345;

-- Delete data
DELETE FROM sales_delta
WHERE order_date < '2023-01-01';

-- Merge (Upsert) - Most common pattern
MERGE INTO sales_delta AS target
USING staging_sales AS source
ON target.order_id = source.order_id
WHEN MATCHED THEN 
    UPDATE SET *
WHEN NOT MATCHED THEN 
    INSERT *;

-- TIME TRAVEL: Query previous versions
-- By version number
SELECT * FROM sales_delta VERSION AS OF 10;

-- By timestamp
SELECT * FROM sales_delta TIMESTAMP AS OF '2024-01-15 10:00:00';

-- View history
DESCRIBE HISTORY sales_delta;

-- Restore to previous version
RESTORE TABLE sales_delta TO VERSION AS OF 5;

-- Schema evolution
ALTER TABLE sales_delta ADD COLUMN region STRING;

-- Vacuum old files (reclaim storage)
VACUUM sales_delta RETAIN 168 HOURS;`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'lh-optimization',
        title: 'Delta Lake Optimization',
        description: 'Master Z-ordering, compaction, and query optimization.',
        category: 'lakehouse',
        difficulty: 'advanced',
        estimatedTime: 40,
        xpReward: 275,
        prerequisites: ['lh-delta-intro'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lh-opt-1',
            title: 'Optimization Techniques',
            type: 'text',
            content: `**Delta Lake Optimization** focuses on organizing data for faster queries.

**Key Techniques:**

**1. OPTIMIZE (Compaction)**
- Combines small files into larger ones
- Reduces file overhead
- Run during low-activity periods

**2. Z-Ordering**
- Co-locates related data in same files
- Enables data skipping
- Works best with high-cardinality columns

**3. Data Skipping**
- Automatically tracks min/max per file
- Skips files that can't contain matches
- Enabled by default

**4. Partitioning**
- Physical organization by column
- Great for date/region filters
- Avoid over-partitioning`,
          },
          {
            id: 'lh-opt-2',
            title: 'Optimization Implementation',
            type: 'code',
            content: 'Performance optimization patterns:',
            codeExample: {
              language: 'sql',
              description: 'Delta Lake Optimization Commands',
              code: `-- OPTIMIZE: Compact small files
OPTIMIZE sales_delta;

-- OPTIMIZE with Z-ORDER
-- Queries that filter on these columns will be faster
OPTIMIZE sales_delta
ZORDER BY (customer_id, product_id);

-- Best practice: Partition + Z-Order
-- Partition by low-cardinality (date)
-- Z-Order by high-cardinality frequently filtered columns
CREATE TABLE sales_optimized
USING DELTA
PARTITIONED BY (order_date)
LOCATION 's3://bucket/sales-optimized'
AS SELECT * FROM raw_sales;

-- Then Z-Order within partitions
OPTIMIZE sales_optimized
ZORDER BY (customer_id, region);

-- Check table statistics
DESCRIBE DETAIL sales_optimized;

-- Analyze columns for optimization
ANALYZE TABLE sales_optimized COMPUTE STATISTICS FOR COLUMNS
    customer_id, product_id, region, order_amount;

-- View file statistics
SELECT 
    file_name,
    num_records,
    size_bytes,
    min_values,
    max_values
FROM delta.\`s3://bucket/sales-optimized\`.files();

-- Auto-optimize settings (Databricks)
ALTER TABLE sales_optimized 
SET TBLPROPERTIES (
    'delta.autoOptimize.optimizeWrite' = 'true',
    'delta.autoOptimize.autoCompact' = 'true'
);`,
              runnable: false,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'data-quality',
    title: 'Data Quality',
    description: 'Learn validation, testing, and quality monitoring.',
    icon: '✅',
    color: 'magenta',
    modules: [
      {
        id: 'dq-fundamentals',
        title: 'Data Quality Fundamentals',
        description: 'Core concepts and dimensions of data quality.',
        category: 'data-quality',
        difficulty: 'beginner',
        estimatedTime: 25,
        xpReward: 125,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dq-fund-1',
            title: 'Data Quality Dimensions',
            type: 'text',
            content: `**Data Quality Dimensions** define what "good" data looks like:

**1. Accuracy**
- Data correctly represents real-world values
- Measured against source of truth

**2. Completeness**
- All required data is present
- No unexpected nulls or gaps

**3. Consistency**
- Data matches across systems
- No contradictions

**4. Timeliness**
- Data is available when needed
- Freshness meets requirements

**5. Uniqueness**
- No duplicate records
- Primary keys are unique

**6. Validity**
- Data conforms to rules/formats
- Within acceptable ranges`,
          },
          {
            id: 'dq-fund-2',
            title: 'Data Quality Checks',
            type: 'code',
            content: 'Implementing data quality rules:',
            codeExample: {
              language: 'sql',
              description: 'SQL Data Quality Validations',
              code: `-- COMPLETENESS: Check for required fields
SELECT 
    'completeness' as check_type,
    'customer_email' as field,
    COUNT(*) as total_rows,
    SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) as null_count,
    ROUND(100.0 * SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) / COUNT(*), 2) as null_pct
FROM dim_customer;

-- UNIQUENESS: Check for duplicates
SELECT 
    'uniqueness' as check_type,
    'customer_id' as field,
    COUNT(*) as total_rows,
    COUNT(DISTINCT customer_id) as unique_values,
    COUNT(*) - COUNT(DISTINCT customer_id) as duplicate_count
FROM dim_customer
WHERE is_current = TRUE;

-- VALIDITY: Check data ranges
SELECT 
    'validity' as check_type,
    'order_amount' as field,
    SUM(CASE WHEN order_amount < 0 THEN 1 ELSE 0 END) as negative_count,
    SUM(CASE WHEN order_amount > 1000000 THEN 1 ELSE 0 END) as outlier_count
FROM fact_orders;

-- CONSISTENCY: Cross-table validation
SELECT 
    'consistency' as check_type,
    'orphan_records' as issue,
    COUNT(*) as orphan_count
FROM fact_orders f
LEFT JOIN dim_customer c ON f.customer_key = c.customer_key
WHERE c.customer_key IS NULL;

-- FRESHNESS: Check data timeliness
SELECT 
    'freshness' as check_type,
    MAX(order_date) as latest_record,
    CURRENT_DATE - MAX(order_date) as days_stale
FROM fact_orders;`,
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
    description: 'Optimize queries, indexes, and data pipelines.',
    icon: '⚡',
    color: 'orange',
    modules: [
      {
        id: 'perf-indexing',
        title: 'Indexing Strategies',
        description: 'Master index types and when to use them.',
        category: 'performance',
        difficulty: 'intermediate',
        estimatedTime: 30,
        xpReward: 175,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'perf-idx-1',
            title: 'Index Types',
            type: 'text',
            content: `**Index Types and Use Cases:**

**1. B-Tree Index** (Default)
- Best for: Equality and range queries
- Supports: =, <, >, <=, >=, BETWEEN, IN, LIKE 'prefix%'
- Use: Primary keys, foreign keys, frequently filtered columns

**2. Hash Index**
- Best for: Equality comparisons only
- Faster than B-Tree for exact matches
- Cannot support range queries

**3. Bitmap Index**
- Best for: Low-cardinality columns
- Efficient for AND/OR operations
- Common in data warehouses

**4. Clustered Index**
- Determines physical row order
- Only one per table
- Usually on primary key

**5. Covering Index**
- Contains all columns needed by query
- Avoids table lookup
- Trades space for speed`,
          },
          {
            id: 'perf-idx-2',
            title: 'Index Implementation',
            type: 'code',
            content: 'Creating effective indexes:',
            codeExample: {
              language: 'sql',
              description: 'Index Strategies and Examples',
              code: `-- Single column index for common filters
CREATE INDEX idx_orders_date ON fact_orders(order_date);

-- Composite index for multi-column filters
-- Order matters! Put most selective column first
CREATE INDEX idx_orders_customer_date 
ON fact_orders(customer_key, order_date);

-- Covering index - includes all needed columns
-- Query can be answered from index alone
CREATE INDEX idx_orders_covering 
ON fact_orders(customer_key, order_date)
INCLUDE (order_amount, quantity);

-- Partial index - for common filtered subsets
CREATE INDEX idx_orders_recent 
ON fact_orders(order_date, customer_key)
WHERE order_date >= CURRENT_DATE - INTERVAL '90 days';

-- Expression index
CREATE INDEX idx_customer_email_lower 
ON dim_customer(LOWER(email));

-- Analyze query execution plan
EXPLAIN ANALYZE
SELECT customer_key, SUM(order_amount)
FROM fact_orders
WHERE order_date >= '2024-01-01'
GROUP BY customer_key;

-- Find missing indexes (PostgreSQL)
SELECT 
    schemaname,
    relname as table_name,
    seq_scan,
    seq_tup_read,
    idx_scan,
    CASE WHEN seq_scan > 0 
         THEN seq_tup_read / seq_scan 
         ELSE 0 
    END as avg_rows_per_scan
FROM pg_stat_user_tables
WHERE seq_scan > 100
ORDER BY seq_tup_read DESC
LIMIT 20;`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'perf-query-opt',
        title: 'Query Optimization',
        description: 'Write efficient queries and understand execution plans.',
        category: 'performance',
        difficulty: 'advanced',
        estimatedTime: 40,
        xpReward: 250,
        prerequisites: ['perf-indexing'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'perf-qo-1',
            title: 'Query Optimization Principles',
            type: 'text',
            content: `**Key Optimization Principles:**

**1. Reduce Data Scanned**
- Filter early (WHERE before JOIN)
- Use partitioning
- Leverage indexes

**2. Minimize Data Movement**
- Avoid SELECT *
- Push predicates down
- Use proper join types

**3. Optimize Joins**
- Join on indexed columns
- Start with smallest table
- Consider join order

**4. Aggregate Wisely**
- Filter before aggregating
- Use approximate functions when acceptable
- Consider pre-aggregation

**5. Understand Execution Plans**
- Look for table scans
- Check join algorithms
- Identify bottlenecks`,
          },
          {
            id: 'perf-qo-2',
            title: 'Query Optimization Examples',
            type: 'code',
            content: 'Before and after optimization:',
            codeExample: {
              language: 'sql',
              description: 'Query Optimization Techniques',
              code: `-- BAD: Select all columns, filter late
SELECT * FROM fact_orders f
JOIN dim_customer c ON f.customer_key = c.customer_key
WHERE c.state = 'CA' AND f.order_date >= '2024-01-01';

-- GOOD: Select needed columns, filter early
SELECT 
    f.order_id,
    f.order_amount,
    c.customer_name
FROM fact_orders f
JOIN dim_customer c ON f.customer_key = c.customer_key
WHERE f.order_date >= '2024-01-01'  -- Filter fact table first
  AND c.state = 'CA'
  AND c.is_current = TRUE;

-- BAD: Correlated subquery
SELECT 
    customer_id,
    (SELECT SUM(order_amount) 
     FROM fact_orders f 
     WHERE f.customer_key = c.customer_key) as total_orders
FROM dim_customer c;

-- GOOD: Join with aggregation
SELECT 
    c.customer_id,
    SUM(f.order_amount) as total_orders
FROM dim_customer c
LEFT JOIN fact_orders f ON c.customer_key = f.customer_key
GROUP BY c.customer_id;

-- BAD: Using OR with different columns
SELECT * FROM fact_orders
WHERE customer_key = 100 OR product_key = 200;

-- GOOD: Use UNION ALL for different indexes
SELECT * FROM fact_orders WHERE customer_key = 100
UNION ALL
SELECT * FROM fact_orders WHERE product_key = 200 
  AND customer_key != 100;

-- Analyze slow queries
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT d.calendar_year, SUM(f.order_amount)
FROM fact_orders f
JOIN dim_date d ON f.date_key = d.date_key
WHERE f.order_date >= '2024-01-01'
GROUP BY d.calendar_year;`,
              runnable: false,
            },
          },
        ],
      },
    ],
  },
];

export const getAllModules = (): LearningModule[] => {
  return LEARNING_TOPICS.flatMap(topic => topic.modules);
};

export const getModuleById = (moduleId: string): LearningModule | undefined => {
  return getAllModules().find(m => m.id === moduleId);
};

export const getTopicById = (topicId: TopicCategory): TopicConfig | undefined => {
  return LEARNING_TOPICS.find(t => t.id === topicId);
};

