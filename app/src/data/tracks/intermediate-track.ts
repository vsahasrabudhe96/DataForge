import { TopicConfig } from '../learning-modules';

export const INTERMEDIATE_TOPICS: TopicConfig[] = [
  {
    id: 'scd',
    title: 'Slowly Changing Dimensions',
    description: 'Master all SCD types for handling historical data in data warehouses.',
    icon: '🔄',
    color: 'purple',
    skillLevel: 'intermediate',
    modules: [
      {
        id: 'scd-intro',
        title: 'Introduction to SCDs',
        description: 'Understanding why and when to track dimensional changes.',
        category: 'scd',
        difficulty: 'intermediate',
        estimatedTime: 25,
        xpReward: 150,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-intro-1',
            title: 'The History Problem',
            type: 'text',
            content: `**Why Do We Need Slowly Changing Dimensions?**

Dimension data changes over time. Customers move, products get repriced, employees change departments. The fundamental question is: **how should we handle these changes?**

**Real-World Scenario:**

Sarah, a customer, moves from New York to California on March 15th.

In Q1, Sarah made 3 purchases while in New York.
In Q2, Sarah made 5 purchases while in California.

**The Business Questions:**

1. "What were total sales by state in Q1?"
   - Should Sarah's Q1 sales count as NY or CA?
   
2. "What were total sales by state for the full year?"
   - How do we handle Sarah's sales accurately?

3. "How many customers do we have in each state TODAY?"
   - Is Sarah a NY customer or CA customer?

**Two Different Truths:**

- **Point-in-Time Truth**: Sarah WAS in NY when she made Q1 purchases
- **Current Truth**: Sarah IS currently in CA

Both are correct! The question is: which truth does the business need?

**Why This Matters for Analytics:**

❌ **Without proper SCD handling:**
- Q1 sales might be attributed to CA (wrong!)
- Historical reports change every time data refreshes
- Audit requirements fail
- Customer journey analysis impossible

✅ **With proper SCD handling:**
- Historical accuracy preserved
- Reports are reproducible
- Compliance requirements met
- Full customer lifecycle visible

**Common Scenarios Requiring SCDs:**
- Customer address/contact changes
- Product price/category updates
- Employee department/title changes
- Store region reorganization
- Organizational restructuring
- Pricing tier changes`,
          },
          {
            id: 'scd-intro-2',
            title: 'SCD Types Overview',
            type: 'text',
            content: `**All SCD Types at a Glance:**

| Type | Name | History Preserved | Complexity | When to Use |
|------|------|-------------------|------------|-------------|
| 0 | Fixed | None (immutable) | Lowest | Static reference data |
| 1 | Overwrite | None (lost) | Low | Corrections, non-critical |
| 2 | New Row | Complete | Medium | Audit, point-in-time reporting |
| 3 | New Column | Limited (one prior) | Medium | Current vs previous comparison |
| 4 | History Table | Complete (separate) | Higher | Fast current + full history |
| 6 | Hybrid (1+2+3) | Complete + Current | Highest | Maximum flexibility |

**Decision Framework:**

**Use Type 0 when:**
- Data should NEVER change (birth date, original signup date)
- Reference data (country codes, currencies)
- Audit keys that must be immutable

**Use Type 1 when:**
- Fixing data entry errors/typos
- Attribute doesn't need history (middle name, nickname)
- Storage is extremely limited (rare these days)
- Changes are corrections, not business changes

**Use Type 2 when:**
- Must preserve complete history (most common!)
- Point-in-time reporting required
- Audit/compliance requirements
- Tracking customer journey
- Any dimension where "what was true then" matters

**Use Type 3 when:**
- Only need current + previous value
- Simple before/after comparisons
- Limited history requirements
- Tracking "old vs new" scenarios

**Use Type 6 when:**
- Need maximum query flexibility
- Want to avoid Type 2 JOINs for current value
- Willing to accept complexity for performance

**Interview Tip:** Know Type 1 and Type 2 cold - they cover 90% of real-world scenarios. Type 6 is a bonus that shows deep knowledge.`,
          },
        ],
      },
      {
        id: 'scd-type1',
        title: 'SCD Type 1: Overwrite',
        description: 'The simplest approach - update in place, no history.',
        category: 'scd',
        difficulty: 'intermediate',
        estimatedTime: 20,
        xpReward: 125,
        prerequisites: ['scd-intro'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-type1-1',
            title: 'Type 1 Concept',
            type: 'text',
            content: `**SCD Type 1: Just Update It**

The simplest approach - when data changes, simply overwrite the existing value. No history is preserved.

**How It Works:**

Customer changes email from john@old.com to john@new.com:

**Before:**
| customer_key | customer_id | email | city |
|--------------|-------------|-------|------|
| 1001 | CUST001 | john@old.com | NYC |

**After Type 1 Update:**
| customer_key | customer_id | email | city |
|--------------|-------------|-------|------|
| 1001 | CUST001 | john@new.com | NYC |

The old email is **gone forever**.

**Characteristics:**
- No history preserved whatsoever
- Single row per entity
- Smallest storage footprint
- Simplest to implement
- Reports always show current state

**When to Use Type 1:**

✅ Correcting data entry errors
- Typo in name: "Jonh" → "John"
- Wrong phone format: "5550100" → "555-0100"

✅ Non-critical attributes
- Middle name, nickname
- Preferred language, timezone
- Marketing preferences

✅ Attributes that don't affect reporting
- Profile picture URL
- Communication preferences
- Internal notes

✅ When old value was objectively wrong
- Invalid email that bounced
- Incorrect product weight

**When NOT to Use Type 1:**

❌ Any attribute used in historical analysis
❌ Audit/compliance requirements exist
❌ Point-in-time reporting needed
❌ Customer journey analysis required
❌ Financial attributes (prices, costs)`,
          },
          {
            id: 'scd-type1-2',
            title: 'Type 1 Implementation',
            type: 'code',
            content: 'SQL patterns for Type 1 SCD:',
            codeExample: {
              language: 'sql',
              description: 'SCD Type 1 Merge Patterns',
              code: `-- ====================================================
-- SIMPLE UPDATE: Single Record
-- ====================================================
UPDATE dim_customer
SET 
    email = 'john.new@email.com',
    phone = '555-0200',
    updated_at = CURRENT_TIMESTAMP
WHERE customer_id = 'CUST001';

-- ====================================================
-- BATCH UPDATE: Multiple Records from Staging
-- ====================================================

-- Method 1: MERGE (SQL Server, Oracle, PostgreSQL 15+)
MERGE INTO dim_customer AS target
USING staging_customers AS source
ON target.customer_id = source.customer_id

WHEN MATCHED THEN
    UPDATE SET
        first_name = source.first_name,
        last_name = source.last_name,
        email = source.email,
        phone = source.phone,
        city = source.city,
        state = source.state,
        updated_at = CURRENT_TIMESTAMP

WHEN NOT MATCHED THEN
    INSERT (customer_id, first_name, last_name, 
            email, phone, city, state, created_at, updated_at)
    VALUES (source.customer_id, source.first_name, source.last_name,
            source.email, source.phone, source.city, source.state,
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ====================================================
-- PostgreSQL: INSERT ON CONFLICT (Upsert)
-- ====================================================
INSERT INTO dim_customer (
    customer_id, first_name, last_name, email, phone, city, state
)
SELECT 
    customer_id, first_name, last_name, email, phone, city, state
FROM staging_customers

ON CONFLICT (customer_id) 
DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    updated_at = CURRENT_TIMESTAMP;

-- ====================================================
-- CONDITIONAL Type 1: Only Update If Changed
-- ====================================================
-- Avoid unnecessary updates (better for audit trails)

UPDATE dim_customer t
SET 
    email = s.email,
    phone = s.phone,
    updated_at = CURRENT_TIMESTAMP
FROM staging_customers s
WHERE t.customer_id = s.customer_id
  AND (
      t.email IS DISTINCT FROM s.email
      OR t.phone IS DISTINCT FROM s.phone
  );
-- IS DISTINCT FROM handles NULLs properly

-- ====================================================
-- TRACKING Type 1 Changes (Optional Logging)
-- ====================================================
-- If you want to log changes even with Type 1

CREATE TABLE dim_customer_changelog (
    change_id BIGSERIAL PRIMARY KEY,
    customer_key INT,
    field_name VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(50)
);

-- Trigger or ETL logic captures changes before overwrite`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'scd-type2',
        title: 'SCD Type 2: Historical Tracking',
        description: 'The gold standard for complete history preservation.',
        category: 'scd',
        difficulty: 'intermediate',
        estimatedTime: 40,
        xpReward: 250,
        prerequisites: ['scd-type1'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-type2-1',
            title: 'Type 2 Concept',
            type: 'text',
            content: `**SCD Type 2: Create a New Row**

When data changes, keep the old row and create a new one. This preserves **complete history** - the most powerful SCD type.

**How It Works:**

Customer Sarah moves from NY to CA on March 15, 2024:

**Before (1 row):**
| customer_key | customer_id | state | effective_date | expiration_date | is_current |
|--------------|-------------|-------|----------------|-----------------|------------|
| 1001 | CUST001 | NY | 2023-01-01 | 9999-12-31 | TRUE |

**After (2 rows):**
| customer_key | customer_id | state | effective_date | expiration_date | is_current |
|--------------|-------------|-------|----------------|-----------------|------------|
| 1001 | CUST001 | NY | 2023-01-01 | 2024-03-14 | FALSE |
| 2547 | CUST001 | CA | 2024-03-15 | 9999-12-31 | TRUE |

**Key Components:**

**1. Surrogate Key** (customer_key)
- Unique per VERSION, not per customer
- Customer CUST001 now has TWO surrogate keys
- Fact tables link to specific versions

**2. Natural Key** (customer_id)
- Same across all versions
- Identifies the business entity

**3. Effective Date** (effective_date)
- When this version became active
- Start of validity period

**4. Expiration Date** (expiration_date)
- When this version ended
- '9999-12-31' = still current (convention)
- Or use NULL for current

**5. Current Flag** (is_current)
- Easy way to find current record
- Only ONE row per customer has TRUE

**Why This Works:**

- Fact tables link to customer_key (surrogate)
- Sarah's Q1 orders link to key 1001 (NY version)
- Sarah's Q2 orders link to key 2547 (CA version)
- Historical accuracy preserved automatically!`,
          },
          {
            id: 'scd-type2-2',
            title: 'Type 2 Update Process',
            type: 'text',
            content: `**The Type 2 Update Process:**

When a change is detected, three things must happen:

**Step 1: Identify Changes**
Compare incoming data with current dimension records to find changes.

**Step 2: Expire Current Records**
Update the existing current records:
- Set expiration_date = yesterday (or change date - 1)
- Set is_current = FALSE

**Step 3: Insert New Records**
Create new rows for changed records:
- New surrogate key (auto-generated)
- Set effective_date = today (or change date)
- Set expiration_date = '9999-12-31'
- Set is_current = TRUE

**Critical Considerations:**

**Date Handling:**
- effective_date of new = expiration_date of old + 1 day
- No gaps in history (Jan 15 expires, Jan 16 starts)
- No overlaps (same date can't have two current records)

**What Triggers a Type 2 Change?**
Not every change needs a new row! Define which attributes are "Type 2 tracked":

✅ **Track with Type 2:**
- Address/location (city, state, country)
- Customer segment/tier
- Department, job title
- Pricing tier
- Account status

❌ **Handle with Type 1 (overwrite):**
- Typo corrections
- Phone number
- Email address (usually)
- Preferences

**Mixed Approach (Common):**
One table can have both Type 1 and Type 2 columns:
- Type 2: city, state, segment (need history)
- Type 1: email, phone, name (just corrections)`,
          },
          {
            id: 'scd-type2-3',
            title: 'Type 2 Implementation',
            type: 'code',
            content: 'Complete SCD Type 2 implementation:',
            codeExample: {
              language: 'sql',
              description: 'SCD Type 2 Full Implementation',
              code: `-- ====================================================
-- TABLE STRUCTURE FOR SCD TYPE 2
-- ====================================================
CREATE TABLE dim_customer (
    -- Surrogate key (unique per version)
    customer_key SERIAL PRIMARY KEY,
    
    -- Natural key (same across versions)
    customer_id VARCHAR(20) NOT NULL,
    
    -- Type 1 attributes (just overwrite)
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    
    -- Type 2 attributes (track history)
    city VARCHAR(50),
    state VARCHAR(50),
    customer_segment VARCHAR(30),
    
    -- SCD Type 2 metadata
    effective_date DATE NOT NULL,
    expiration_date DATE NOT NULL DEFAULT '9999-12-31',
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    version INT NOT NULL DEFAULT 1,
    
    -- Audit columns
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_dim_customer_current 
ON dim_customer(customer_id) WHERE is_current = TRUE;

CREATE INDEX idx_dim_customer_effective 
ON dim_customer(customer_id, effective_date, expiration_date);

-- ====================================================
-- SCD TYPE 2 MERGE PROCESS
-- ====================================================

-- Step 1: Identify records that have Type 2 changes
CREATE TEMP TABLE type2_changes AS
SELECT 
    s.customer_id,
    s.first_name,
    s.last_name,
    s.email,
    s.phone,
    s.city,
    s.state,
    s.customer_segment
FROM staging_customers s
JOIN dim_customer d 
    ON s.customer_id = d.customer_id 
    AND d.is_current = TRUE
WHERE 
    -- Type 2 attributes changed
    s.city IS DISTINCT FROM d.city
    OR s.state IS DISTINCT FROM d.state
    OR s.customer_segment IS DISTINCT FROM d.customer_segment;

-- Step 2: Expire current records for changes
UPDATE dim_customer d
SET 
    expiration_date = CURRENT_DATE - INTERVAL '1 day',
    is_current = FALSE,
    updated_at = CURRENT_TIMESTAMP
FROM type2_changes c
WHERE d.customer_id = c.customer_id
  AND d.is_current = TRUE;

-- Step 3: Insert new versions
INSERT INTO dim_customer (
    customer_id,
    first_name, last_name, email, phone,
    city, state, customer_segment,
    effective_date, expiration_date, is_current, version
)
SELECT 
    c.customer_id,
    c.first_name, c.last_name, c.email, c.phone,
    c.city, c.state, c.customer_segment,
    CURRENT_DATE,          -- effective today
    '9999-12-31',          -- no expiration yet
    TRUE,                  -- this is current
    COALESCE((
        SELECT MAX(version) + 1 
        FROM dim_customer 
        WHERE customer_id = c.customer_id
    ), 1)
FROM type2_changes c;

-- Step 4: Handle Type 1 updates (no history needed)
UPDATE dim_customer d
SET 
    first_name = s.first_name,
    last_name = s.last_name,
    email = s.email,
    phone = s.phone,
    updated_at = CURRENT_TIMESTAMP
FROM staging_customers s
WHERE d.customer_id = s.customer_id
  AND d.is_current = TRUE
  AND (
      d.first_name IS DISTINCT FROM s.first_name
      OR d.last_name IS DISTINCT FROM s.last_name
      OR d.email IS DISTINCT FROM s.email
      OR d.phone IS DISTINCT FROM s.phone
  );

-- Step 5: Insert brand new customers
INSERT INTO dim_customer (
    customer_id, first_name, last_name, email, phone,
    city, state, customer_segment,
    effective_date, is_current, version
)
SELECT 
    s.customer_id, s.first_name, s.last_name, s.email, s.phone,
    s.city, s.state, s.customer_segment,
    CURRENT_DATE, TRUE, 1
FROM staging_customers s
WHERE NOT EXISTS (
    SELECT 1 FROM dim_customer d 
    WHERE d.customer_id = s.customer_id
);`,
              runnable: false,
            },
          },
          {
            id: 'scd-type2-4',
            title: 'Querying Type 2 Data',
            type: 'code',
            content: 'Different query patterns for SCD Type 2:',
            codeExample: {
              language: 'sql',
              description: 'Point-in-Time and Historical Queries',
              code: `-- ====================================================
-- QUERY 1: Get Current Customer Data
-- ====================================================
SELECT * FROM dim_customer 
WHERE is_current = TRUE;

-- Or using date (equivalent)
SELECT * FROM dim_customer
WHERE expiration_date = '9999-12-31';

-- ====================================================
-- QUERY 2: Customer State as of Specific Date
-- ====================================================
-- "What was Sarah's state on Feb 15, 2024?"

SELECT * FROM dim_customer
WHERE customer_id = 'CUST001'
  AND '2024-02-15' BETWEEN effective_date AND expiration_date;

-- ====================================================
-- QUERY 3: Complete Customer History
-- ====================================================
SELECT 
    customer_id,
    city,
    state,
    customer_segment,
    effective_date,
    expiration_date,
    version,
    CASE WHEN is_current THEN 'CURRENT' ELSE 'HISTORICAL' END as status
FROM dim_customer
WHERE customer_id = 'CUST001'
ORDER BY version;

-- ====================================================
-- QUERY 4: Point-in-Time Sales Analysis
-- ====================================================
-- "What were sales by state AT THE TIME of the sale?"

SELECT 
    c.state as customer_state_at_sale,
    d.year,
    d.month_name,
    SUM(f.sales_amount) as total_sales
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_customer c ON f.customer_key = c.customer_key
-- Because fact links to customer_KEY (surrogate), not customer_ID
-- We automatically get the correct historical version!
WHERE d.year = 2024
GROUP BY c.state, d.year, d.month_name
ORDER BY d.year, d.month_name;

-- ====================================================
-- QUERY 5: Current-State Sales Analysis
-- ====================================================
-- "Sales by CURRENT customer state (regardless of when sold)"

SELECT 
    curr.state as current_state,
    d.year,
    SUM(f.sales_amount) as total_sales
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_customer hist ON f.customer_key = hist.customer_key
JOIN dim_customer curr ON hist.customer_id = curr.customer_id 
                       AND curr.is_current = TRUE
WHERE d.year = 2024
GROUP BY curr.state, d.year;

-- ====================================================
-- QUERY 6: Find Customers Who Changed States
-- ====================================================
SELECT 
    customer_id,
    COUNT(*) as num_versions,
    MIN(effective_date) as first_record,
    STRING_AGG(state, ' -> ' ORDER BY version) as state_history
FROM dim_customer
GROUP BY customer_id
HAVING COUNT(*) > 1
ORDER BY num_versions DESC;

-- ====================================================
-- QUERY 7: Late-Arriving Fact Lookup
-- ====================================================
-- When loading facts for a past date, find correct customer version

SELECT customer_key
FROM dim_customer
WHERE customer_id = 'CUST001'
  AND '2023-06-15' BETWEEN effective_date AND expiration_date;

-- Use this key when inserting the fact row`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'scd-type3-6',
        title: 'SCD Types 3 and 6',
        description: 'Advanced SCD patterns for specific requirements.',
        category: 'scd',
        difficulty: 'intermediate',
        estimatedTime: 30,
        xpReward: 175,
        prerequisites: ['scd-type2'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-type36-1',
            title: 'SCD Type 3: Previous Value Column',
            type: 'text',
            content: `**SCD Type 3: Add Column for Previous Value**

Instead of adding rows, add columns to store both current and previous values.

**How It Works:**

Customer moves from NY to CA:

**Structure:**
| customer_key | customer_id | current_state | previous_state | state_change_date |
|--------------|-------------|---------------|----------------|-------------------|
| 1001 | CUST001 | CA | NY | 2024-03-15 |

**When to Use Type 3:**

✅ Only need ONE level of history
✅ Before/after comparisons
✅ "New vs Old" reporting
✅ Limited storage constraints
✅ Simple queries (no date range logic)

**Real-World Examples:**

**1. Sales Territory Realignment**
- "Compare performance under old territory vs new"
- current_territory, previous_territory

**2. Pricing Changes**
- "Compare sales at old price vs new price"
- current_price, previous_price

**3. Organizational Restructuring**
- "Compare metrics under old department vs new"
- current_department, previous_department

**Limitations of Type 3:**

❌ Only stores ONE previous value
❌ Multiple changes? Only keep most recent change
❌ Cannot answer "what was state on date X?"
❌ Complex for multiple tracked attributes
❌ Not suitable for audit requirements

**Example Query:**
"Show me customers who recently changed states"

SELECT 
    customer_id,
    current_state,
    previous_state,
    state_change_date
FROM dim_customer
WHERE current_state != previous_state
  AND state_change_date >= CURRENT_DATE - 30;`,
          },
          {
            id: 'scd-type36-2',
            title: 'SCD Type 6: Hybrid Approach',
            type: 'text',
            content: `**SCD Type 6: Best of All Worlds (1 + 2 + 3 = 6)**

Combines Types 1, 2, and 3 for maximum query flexibility at the cost of complexity.

**How It Works:**

Customer moves from NY to CA:

**Type 6 Structure (2 rows):**
| customer_key | customer_id | historical_state | current_state | previous_state | effective_date | is_current |
|--------------|-------------|------------------|---------------|----------------|----------------|------------|
| 1001 | CUST001 | NY | CA | NY | 2023-01-01 | FALSE |
| 2547 | CUST001 | CA | CA | NY | 2024-03-15 | TRUE |

**The Three Components:**

**Type 2 Component:**
- Multiple rows with effective/expiration dates
- historical_state = what it WAS during that period
- Enables point-in-time analysis

**Type 1 Component:**
- current_state updated in ALL rows when change occurs
- Row 1001 gets current_state = 'CA' too
- Quick access to current value from any row

**Type 3 Component:**
- previous_state column tracks prior value
- Easy before/after comparison

**Query Flexibility:**

**"Sales by state AT TIME of transaction"** (Type 2)
→ Use historical_state (varies by row)

**"Sales by CURRENT state"** (Type 1)
→ Use current_state (same in all rows)

**"Customers who changed states"** (Type 3)
→ Compare current_state vs previous_state

**When to Use Type 6:**

✅ Need all three query patterns frequently
✅ Performance is critical (avoid Type 2 self-joins)
✅ Worth the ETL complexity
✅ Team understands the model

**Trade-offs:**

| Aspect | Type 6 | Type 2 |
|--------|--------|--------|
| ETL Complexity | Higher | Moderate |
| Storage | More | Less |
| Query Simplicity | Depends on use case | Consistent |
| "Current" queries | Very fast | Needs WHERE |
| Historical queries | Fast | Fast |`,
          },
          {
            id: 'scd-type36-3',
            title: 'Type 3 & 6 Implementation',
            type: 'code',
            content: 'SQL implementation patterns:',
            codeExample: {
              language: 'sql',
              description: 'Type 3 and Type 6 Patterns',
              code: `-- ====================================================
-- SCD TYPE 3: Previous Value Columns
-- ====================================================

CREATE TABLE dim_customer_type3 (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Current values
    current_city VARCHAR(50),
    current_state VARCHAR(50),
    current_segment VARCHAR(30),
    
    -- Previous values (one level of history)
    previous_city VARCHAR(50),
    previous_state VARCHAR(50),
    previous_segment VARCHAR(30),
    
    -- When did changes occur?
    city_change_date DATE,
    state_change_date DATE,
    segment_change_date DATE
);

-- Type 3 Update Process
UPDATE dim_customer_type3
SET 
    -- Shift current to previous
    previous_state = current_state,
    previous_city = current_city,
    
    -- Set new current values
    current_state = 'CA',
    current_city = 'Los Angeles',
    
    -- Record change dates
    state_change_date = CURRENT_DATE,
    city_change_date = CURRENT_DATE
WHERE customer_id = 'CUST001'
  AND current_state IS DISTINCT FROM 'CA';  -- Only if actually changed


-- ====================================================
-- SCD TYPE 6: Hybrid (1 + 2 + 3)
-- ====================================================

CREATE TABLE dim_customer_type6 (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    
    -- Type 2: Historical value (what it was during this period)
    historical_state VARCHAR(50),
    historical_city VARCHAR(50),
    historical_segment VARCHAR(30),
    
    -- Type 1: Current value (updated in ALL rows)
    current_state VARCHAR(50),
    current_city VARCHAR(50),
    current_segment VARCHAR(30),
    
    -- Type 3: Previous value
    previous_state VARCHAR(50),
    previous_city VARCHAR(50),
    previous_segment VARCHAR(30),
    
    -- Type 2 tracking
    effective_date DATE NOT NULL,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE
);

-- ====================================================
-- TYPE 6 UPDATE PROCESS
-- ====================================================
-- When customer CUST001 moves from NY to CA:

-- Step 1: Update current_* in ALL rows (Type 1 behavior)
UPDATE dim_customer_type6
SET 
    current_state = 'CA',
    current_city = 'Los Angeles'
WHERE customer_id = 'CUST001';

-- Step 2: Expire current row (Type 2 behavior)
UPDATE dim_customer_type6
SET 
    expiration_date = CURRENT_DATE - 1,
    is_current = FALSE
WHERE customer_id = 'CUST001' 
  AND is_current = TRUE;

-- Step 3: Insert new row with all components
INSERT INTO dim_customer_type6 (
    customer_id,
    historical_state, historical_city,    -- Type 2: new historical value
    current_state, current_city,          -- Type 1: current value
    previous_state, previous_city,        -- Type 3: what it was before
    effective_date, is_current
)
SELECT 
    'CUST001',
    'CA', 'Los Angeles',                  -- New historical (for this period)
    'CA', 'Los Angeles',                  -- Current (same as historical now)
    historical_state, historical_city,    -- Previous = old historical
    CURRENT_DATE, TRUE
FROM dim_customer_type6
WHERE customer_id = 'CUST001'
  AND expiration_date = CURRENT_DATE - 1;

-- ====================================================
-- TYPE 6 QUERY EXAMPLES
-- ====================================================

-- Query 1: Sales by state at time of sale (historical)
SELECT historical_state, SUM(amount)
FROM fact_sales f
JOIN dim_customer_type6 c ON f.customer_key = c.customer_key
GROUP BY historical_state;

-- Query 2: Sales by current state (no join to find current!)
SELECT current_state, SUM(amount)
FROM fact_sales f
JOIN dim_customer_type6 c ON f.customer_key = c.customer_key
GROUP BY current_state;

-- Query 3: Customers who changed (Type 3)
SELECT * FROM dim_customer_type6
WHERE current_state != previous_state
  AND is_current = TRUE;`,
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
    description: 'Master ETL strategies for efficient data pipelines.',
    icon: '📥',
    color: 'green',
    skillLevel: 'intermediate',
    modules: [
      {
        id: 'lp-full-vs-incremental',
        title: 'Full Load vs Incremental Load',
        description: 'Choosing the right loading strategy for your use case.',
        category: 'loading-patterns',
        difficulty: 'intermediate',
        estimatedTime: 30,
        xpReward: 175,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lp-fi-1',
            title: 'Loading Strategies Overview',
            type: 'text',
            content: `**Two Fundamental Data Loading Approaches:**

**Full Load (Full Refresh)** 🔄

Completely replace target data with source data every time.

**Process:**
1. Truncate/delete target table
2. Load ALL records from source
3. Rebuild indexes and statistics
4. Done!

**Characteristics:**
- Simple logic
- Guaranteed data consistency
- No change tracking required
- Can be slow for large datasets
- High resource consumption

**When to Use Full Load:**

✅ Small tables (< 1M rows, or fast enough)
✅ No change tracking in source system
✅ Complete consistency required
✅ Weekly/monthly refresh is acceptable
✅ Initial load of new tables
✅ Dimension tables (usually small)

**Incremental Load (Delta Load)** ⚡

Only process records that are new or changed since last load.

**Process:**
1. Identify new/changed records (using watermark)
2. Extract only delta records
3. Apply changes to target (insert/update/delete)
4. Update watermark
5. Done!

**Characteristics:**
- Complex logic
- Much faster for large datasets
- Requires change tracking mechanism
- Lower resource consumption
- Risk of missing changes if not careful

**When to Use Incremental Load:**

✅ Large tables (millions/billions of rows)
✅ Frequent refresh needed (hourly, daily)
✅ Source has reliable change tracking
✅ Near real-time requirements
✅ Production workloads with SLAs
✅ Fact tables (usually large)`,
          },
          {
            id: 'lp-fi-2',
            title: 'Comparison and Decision Framework',
            type: 'text',
            content: `**Detailed Comparison:**

| Aspect | Full Load | Incremental Load |
|--------|-----------|------------------|
| Speed | Slow (processes all) | Fast (processes delta) |
| Resources | High (full scan) | Low (targeted) |
| Complexity | Simple | Medium-High |
| Missing Data Risk | None | Possible |
| Delete Handling | Automatic | Complex |
| Source Requirements | None | Change tracking |
| Recovery | Easy (just reload) | Complex (replay deltas) |

**Decision Framework:**

**Question 1: How big is the dataset?**
- < 100K rows → Full load always works
- 100K - 10M rows → Depends on frequency
- 10M+ rows → Incremental strongly preferred

**Question 2: How often do you need to refresh?**
- Monthly/Weekly → Full load often fine
- Daily → Consider incremental for large tables
- Hourly/Real-time → Incremental required

**Question 3: Does source track changes?**
- updated_at column exists → Incremental possible
- Change Data Capture (CDC) available → Incremental easy
- No change tracking → Full load or source modification

**Question 4: What about deletes?**
- Hard deletes in source → Full load handles automatically
- Hard deletes with incremental → Need separate delete detection
- Soft deletes (is_deleted flag) → Incremental works well

**Real-World Example:**

**E-commerce data warehouse:**
- dim_date: Full load (tiny, static)
- dim_customer: Incremental (large, SCD Type 2)
- dim_product: Full load daily (medium, changes often)
- fact_sales: Incremental (huge, append-mostly)
- fact_inventory_snapshot: Full load (daily snapshot)`,
          },
          {
            id: 'lp-fi-3',
            title: 'Implementation Examples',
            type: 'code',
            content: 'SQL patterns for both approaches:',
            codeExample: {
              language: 'sql',
              description: 'Full vs Incremental Loading',
              code: `-- ====================================================
-- FULL LOAD: Simple but resource-intensive
-- ====================================================

-- Method 1: TRUNCATE and INSERT
BEGIN TRANSACTION;

-- Clear existing data
TRUNCATE TABLE dwh.dim_product;

-- Load all source data
INSERT INTO dwh.dim_product (
    product_id, product_name, category, 
    subcategory, brand, price, is_active
)
SELECT 
    product_id, product_name, category,
    subcategory, brand, price, is_active
FROM source.products
WHERE is_deleted = FALSE;

-- Rebuild statistics
ANALYZE dwh.dim_product;

COMMIT;

-- Method 2: Swap tables (zero-downtime)
-- Create new table with fresh data
CREATE TABLE dwh.dim_product_new AS
SELECT * FROM source.products WHERE is_deleted = FALSE;

-- Create indexes on new table
CREATE INDEX idx_product_new ON dwh.dim_product_new(product_id);

-- Atomic swap
BEGIN;
ALTER TABLE dwh.dim_product RENAME TO dim_product_old;
ALTER TABLE dwh.dim_product_new RENAME TO dim_product;
COMMIT;

-- Drop old table
DROP TABLE dwh.dim_product_old;


-- ====================================================
-- INCREMENTAL LOAD: Efficient for large datasets
-- ====================================================

-- Control table to track watermarks
CREATE TABLE etl.load_control (
    table_name VARCHAR(100) PRIMARY KEY,
    watermark_column VARCHAR(50),
    watermark_value TIMESTAMP,
    last_run_start TIMESTAMP,
    last_run_end TIMESTAMP,
    rows_processed BIGINT,
    status VARCHAR(20)
);

-- Initialize watermark
INSERT INTO etl.load_control VALUES 
('fact_orders', 'updated_at', '2024-01-01 00:00:00', NULL, NULL, 0, 'ready');

-- Incremental load procedure
DO $$
DECLARE
    v_low_watermark TIMESTAMP;
    v_high_watermark TIMESTAMP;
    v_rows BIGINT;
BEGIN
    -- Get watermarks
    SELECT watermark_value INTO v_low_watermark
    FROM etl.load_control 
    WHERE table_name = 'fact_orders';
    
    -- High watermark with safety buffer (5 min behind)
    v_high_watermark := CURRENT_TIMESTAMP - INTERVAL '5 minutes';
    
    -- Mark as running
    UPDATE etl.load_control 
    SET last_run_start = CURRENT_TIMESTAMP, 
        status = 'running'
    WHERE table_name = 'fact_orders';
    
    -- MERGE changed records
    MERGE INTO dwh.fact_orders AS target
    USING (
        SELECT * FROM source.orders
        WHERE updated_at > v_low_watermark
          AND updated_at <= v_high_watermark
    ) AS source
    ON target.order_id = source.order_id
    
    WHEN MATCHED THEN
        UPDATE SET
            customer_key = source.customer_key,
            amount = source.amount,
            status = source.status,
            updated_at = CURRENT_TIMESTAMP
    
    WHEN NOT MATCHED THEN
        INSERT (order_id, customer_key, amount, status, created_at)
        VALUES (source.order_id, source.customer_key, 
                source.amount, source.status, CURRENT_TIMESTAMP);
    
    GET DIAGNOSTICS v_rows = ROW_COUNT;
    
    -- Update control table on success
    UPDATE etl.load_control 
    SET watermark_value = v_high_watermark,
        last_run_end = CURRENT_TIMESTAMP,
        rows_processed = v_rows,
        status = 'success'
    WHERE table_name = 'fact_orders';

EXCEPTION WHEN OTHERS THEN
    -- Log failure, DON'T update watermark (will retry)
    UPDATE etl.load_control 
    SET last_run_end = CURRENT_TIMESTAMP,
        status = 'failed'
    WHERE table_name = 'fact_orders';
    RAISE;
END $$;`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'lp-cdc',
        title: 'Change Data Capture (CDC)',
        description: 'Capturing changes efficiently from source systems.',
        category: 'loading-patterns',
        difficulty: 'intermediate',
        estimatedTime: 35,
        xpReward: 200,
        prerequisites: ['lp-full-vs-incremental'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lp-cdc-1',
            title: 'What is CDC?',
            type: 'text',
            content: `**Change Data Capture (CDC)** is a technique for identifying and capturing changes made to data in a database, then delivering those changes in real-time or near-real-time to downstream systems.

**Why CDC Matters:**

Traditional approaches have significant drawbacks:

**Polling/Querying (Traditional):**
- Query source every X minutes: WHERE updated_at > last_run
- Misses deletes (no row to query!)
- High load on source database
- Not truly real-time
- Requires updated_at column on every table

**CDC (Modern):**
- Reads database transaction log
- Captures ALL changes (insert, update, delete)
- Minimal source impact
- Near real-time (seconds)
- Works without schema modifications

**How CDC Works:**

Databases maintain a **transaction log** (also called WAL, redo log, binlog) for recovery purposes. CDC tools read this log to capture changes.

**Database Transaction Logs:**
- PostgreSQL: Write-Ahead Log (WAL)
- MySQL: Binary Log (binlog)
- SQL Server: Transaction Log
- Oracle: Redo Log

**CDC Capture Flow:**
1. Application writes to database
2. Database records change in transaction log
3. CDC tool reads transaction log
4. CDC tool publishes change event
5. Consumers process change event

**Types of Changes Captured:**
- **INSERT**: New row added
- **UPDATE**: Existing row modified (before + after values)
- **DELETE**: Row removed

**Popular CDC Tools:**

| Tool | Databases | Output |
|------|-----------|--------|
| Debezium | PostgreSQL, MySQL, MongoDB, Oracle | Kafka |
| AWS DMS | Most major databases | S3, Kinesis, RDS |
| Fivetran | 150+ connectors | Cloud DWH |
| Airbyte | 300+ connectors | Various destinations |
| Oracle GoldenGate | Oracle, others | Various |`,
          },
          {
            id: 'lp-cdc-2',
            title: 'CDC Patterns and Implementation',
            type: 'text',
            content: `**CDC Event Structure:**

A typical CDC event contains:

**1. Operation Type**
- 'c' = create (insert)
- 'u' = update
- 'd' = delete
- 'r' = read (snapshot)

**2. Before Image** (for updates/deletes)
- State of row BEFORE the change
- NULL for inserts

**3. After Image** (for inserts/updates)
- State of row AFTER the change
- NULL for deletes

**4. Metadata**
- Source database, table, schema
- Transaction ID
- Timestamp
- Log position (for ordering)

**Example CDC Event (Debezium format):**

{
  "op": "u",  // update
  "before": {
    "customer_id": 1001,
    "email": "john@old.com",
    "city": "New York"
  },
  "after": {
    "customer_id": 1001,
    "email": "john@new.com",
    "city": "New York"
  },
  "source": {
    "db": "ecommerce",
    "table": "customers",
    "ts_ms": 1704067200000
  }
}

**CDC Processing Patterns:**

**1. Direct Apply**
Apply each change directly to target as it arrives.
- Simplest approach
- Works for small volumes
- Order matters!

**2. Micro-Batch**
Collect changes for X seconds/minutes, then apply as batch.
- Better throughput
- Easier transaction handling
- Slight delay acceptable

**3. Event Streaming**
Publish to Kafka/Kinesis, multiple consumers process.
- Most scalable
- Multiple destinations
- Replay capability

**Handling Out-of-Order Events:**

CDC events can arrive out of order. Always use:
- Transaction timestamp for ordering
- Idempotent operations (same event twice = same result)
- Deduplication based on transaction ID`,
          },
          {
            id: 'lp-cdc-3',
            title: 'CDC Best Practices',
            type: 'text',
            content: `**CDC Implementation Best Practices:**

**1. Initial Snapshot Strategy**

Before streaming changes, you need baseline data:

**Option A: Full snapshot first**
1. Take consistent snapshot of source
2. Load snapshot to target
3. Start CDC from snapshot position
4. Apply changes going forward

**Option B: Parallel snapshot + stream**
1. Start CDC capture (buffer events)
2. Take snapshot
3. Load snapshot
4. Apply buffered events
5. Continue streaming

**2. Schema Evolution Handling**

Source schemas change! Plan for:
- New columns → Add to target (nullable)
- Dropped columns → Keep in target (stop populating)
- Type changes → Transform during apply
- Table renames → Update CDC configuration

**3. Delete Handling Strategies**

| Strategy | How | When |
|----------|-----|------|
| Hard Delete | DELETE from target | Small tables, compliance |
| Soft Delete | SET is_deleted = TRUE | Audit trails, recovery |
| Delete Log | INSERT to deleted_records table | Full history needed |

**4. Monitoring and Alerting**

Critical metrics to monitor:
- **Lag**: Time between source change and target apply
- **Throughput**: Events processed per second
- **Errors**: Failed events, schema mismatches
- **Log Position**: Ensure not falling behind

**5. Failure Recovery**

CDC must be **exactly-once** or **at-least-once** with deduplication:

- Store last processed position in target DB
- Use transactions: apply changes + update position atomically
- On restart, resume from stored position
- Handle duplicates with MERGE or ON CONFLICT

**6. Performance Optimization**

- Batch multiple changes before applying
- Use bulk operations (COPY, bulk INSERT)
- Partition target tables appropriately
- Consider columnar formats for analytics targets`,
          },
        ],
      },
      {
        id: 'lp-idempotency',
        title: 'Idempotent Data Pipelines',
        description: 'Building reliable, rerunnable data pipelines.',
        category: 'loading-patterns',
        difficulty: 'intermediate',
        estimatedTime: 25,
        xpReward: 150,
        prerequisites: ['lp-full-vs-incremental'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lp-idem-1',
            title: 'What is Idempotency?',
            type: 'text',
            content: `**Idempotency** means that running the same operation multiple times produces the same result as running it once.

**Why Idempotency Matters in Data Engineering:**

Data pipelines fail. Networks timeout. Servers crash. When you retry a failed job, will it:
- ❌ Duplicate data?
- ❌ Corrupt existing data?
- ❌ Skip records?
- ✅ Produce correct results?

**Non-Idempotent (Dangerous):**

INSERT INTO fact_sales (order_id, amount)
SELECT order_id, amount FROM staging;

Run twice → Duplicates!

**Idempotent (Safe):**

INSERT INTO fact_sales (order_id, amount)
SELECT order_id, amount FROM staging
ON CONFLICT (order_id) DO NOTHING;

Run twice → Same result!

**Real-World Scenarios:**

**Scenario 1: Network Timeout**
- ETL job runs for 30 minutes
- Completes successfully
- But network times out before job reports success
- Orchestrator thinks job failed, retries
- Non-idempotent: Data duplicated
- Idempotent: Safe to retry

**Scenario 2: Partial Failure**
- Loading 1 million records
- Fails at record 750,000
- Need to restart
- Non-idempotent: First 750K duplicated
- Idempotent: Safely reprocess all

**Scenario 3: Manual Rerun**
- Business user requests data fix
- Developer reruns pipeline for date range
- Non-idempotent: Data corruption risk
- Idempotent: Safe to rerun anytime

**The Golden Rule:**
Every data pipeline should be safe to run multiple times. If it isn't, you will eventually have data quality issues.`,
          },
          {
            id: 'lp-idem-2',
            title: 'Idempotent Patterns',
            type: 'code',
            content: 'Implementing idempotent data loads:',
            codeExample: {
              language: 'sql',
              description: 'Idempotent Loading Patterns',
              code: `-- ====================================================
-- PATTERN 1: DELETE-INSERT (Partition-based)
-- ====================================================
-- Idempotent: Delete target data for the date, then insert
-- Safe to rerun: will produce same result

BEGIN TRANSACTION;

-- Delete existing data for this date
DELETE FROM fact_sales 
WHERE sale_date = '2024-01-15';

-- Insert fresh data
INSERT INTO fact_sales (sale_date, order_id, customer_key, amount)
SELECT 
    sale_date, order_id, customer_key, amount
FROM staging_sales
WHERE sale_date = '2024-01-15';

COMMIT;

-- Works because we clear the partition first!


-- ====================================================
-- PATTERN 2: MERGE/UPSERT (Record-level)
-- ====================================================
-- Idempotent: Insert new, update existing

MERGE INTO fact_sales AS target
USING staging_sales AS source
ON target.order_id = source.order_id

WHEN MATCHED THEN
    UPDATE SET
        customer_key = source.customer_key,
        amount = source.amount,
        updated_at = CURRENT_TIMESTAMP

WHEN NOT MATCHED THEN
    INSERT (order_id, customer_key, amount, created_at)
    VALUES (source.order_id, source.customer_key, 
            source.amount, CURRENT_TIMESTAMP);

-- Safe to run multiple times!


-- ====================================================
-- PATTERN 3: INSERT ON CONFLICT (PostgreSQL)
-- ====================================================

-- Option A: Ignore duplicates
INSERT INTO fact_sales (order_id, customer_key, amount)
SELECT order_id, customer_key, amount
FROM staging_sales
ON CONFLICT (order_id) DO NOTHING;

-- Option B: Update on conflict (upsert)
INSERT INTO fact_sales (order_id, customer_key, amount, updated_at)
SELECT order_id, customer_key, amount, CURRENT_TIMESTAMP
FROM staging_sales
ON CONFLICT (order_id) 
DO UPDATE SET
    customer_key = EXCLUDED.customer_key,
    amount = EXCLUDED.amount,
    updated_at = CURRENT_TIMESTAMP;


-- ====================================================
-- PATTERN 4: Staging + Swap (Full refresh)
-- ====================================================
-- Atomic table replacement

-- Load to staging table
CREATE TABLE dwh.dim_product_staging AS
SELECT * FROM source.products;

-- Create indexes
CREATE INDEX idx_staging ON dwh.dim_product_staging(product_id);

-- Atomic swap (idempotent - always ends with fresh data)
BEGIN;
DROP TABLE IF EXISTS dwh.dim_product_old;
ALTER TABLE dwh.dim_product RENAME TO dim_product_old;
ALTER TABLE dwh.dim_product_staging RENAME TO dim_product;
COMMIT;

DROP TABLE dwh.dim_product_old;


-- ====================================================
-- PATTERN 5: Deduplication in Query
-- ====================================================
-- When source might have duplicates

INSERT INTO fact_sales (order_id, customer_key, amount)
SELECT DISTINCT ON (order_id)
    order_id, customer_key, amount
FROM staging_sales
ORDER BY order_id, updated_at DESC  -- Keep most recent
ON CONFLICT (order_id) DO UPDATE SET
    amount = EXCLUDED.amount;


-- ====================================================
-- PATTERN 6: Checksum/Hash for Change Detection
-- ====================================================
-- Only update if data actually changed

UPDATE dim_customer target
SET 
    name = source.name,
    email = source.email,
    updated_at = CURRENT_TIMESTAMP
FROM staging_customers source
WHERE target.customer_id = source.customer_id
  AND MD5(ROW(target.name, target.email)::TEXT) 
   != MD5(ROW(source.name, source.email)::TEXT);

-- Idempotent: Running again won't change anything`,
              runnable: false,
            },
          },
        ],
      },
    ],
  },
];

