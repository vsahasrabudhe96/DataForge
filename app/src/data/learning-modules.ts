import { LearningModule, TopicCategory, SkillTrack, SkillLevel } from '@/types';

export interface TopicConfig {
  id: TopicCategory;
  title: string;
  description: string;
  icon: string;
  color: 'cyan' | 'purple' | 'green' | 'yellow' | 'magenta' | 'orange';
  skillLevel: SkillLevel;
  modules: LearningModule[];
}

// Skill Tracks Definition
export const SKILL_TRACKS: SkillTrack[] = [
  {
    id: 'beginner',
    title: 'Beginner Track',
    description: 'Master the fundamentals of data engineering. Perfect for those new to data warehousing and ETL concepts.',
    icon: '🌱',
    color: 'green',
    topics: ['data-modeling'],
    estimatedHours: 8,
  },
  {
    id: 'intermediate',
    title: 'Intermediate Track',
    description: 'Dive deeper into advanced data modeling patterns, SCDs, and data loading strategies.',
    icon: '🚀',
    color: 'cyan',
    topics: ['scd', 'loading-patterns'],
    estimatedHours: 12,
  },
  {
    id: 'advanced',
    title: 'Advanced Track',
    description: 'Master modern data lakehouse architectures, performance optimization, and data quality frameworks.',
    icon: '⚡',
    color: 'purple',
    topics: ['lakehouse', 'data-quality', 'performance'],
    estimatedHours: 15,
  },
];

export const LEARNING_TOPICS: TopicConfig[] = [
  // ==================== BEGINNER TRACK ====================
  {
    id: 'data-modeling',
    title: 'Data Modeling Fundamentals',
    description: 'Learn the core concepts of data modeling, normalization, and dimensional design.',
    icon: '🏗️',
    color: 'cyan',
    skillLevel: 'beginner',
    modules: [
      {
        id: 'dm-what-is-data-modeling',
        title: 'What is Data Modeling?',
        description: 'Introduction to data modeling concepts and their importance in data engineering.',
        category: 'data-modeling',
        difficulty: 'beginner',
        estimatedTime: 15,
        xpReward: 100,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-what-1',
            title: 'Introduction to Data Modeling',
            type: 'text',
            content: `**Data modeling** is the process of creating a visual representation of data and the relationships between different data elements. Think of it as creating a blueprint before building a house.

**Why Data Modeling Matters:**
- **Clarity**: Helps teams understand how data flows through systems
- **Quality**: Reduces data inconsistencies and errors
- **Performance**: Well-designed models enable faster queries
- **Communication**: Creates a common language between business and technical teams

**Real-World Analogy:**
Imagine organizing a library. Without a system (data model), books would be scattered randomly. With a model, you organize by genre, author, or subject - making it easy to find what you need.

**Key Takeaway:** Data modeling is the foundation of every successful data warehouse and analytics system.`,
          },
          {
            id: 'dm-what-2',
            title: 'Types of Data Models',
            type: 'text',
            content: `There are three main types of data models, each serving a different purpose:

**1. Conceptual Model** 📝
- **Purpose**: High-level business view
- **Audience**: Business stakeholders, executives
- **Contains**: Main entities and relationships
- **Example**: "Customers place Orders for Products"

**2. Logical Model** 🔍
- **Purpose**: Detailed structure without technical details
- **Audience**: Data architects, analysts
- **Contains**: All entities, attributes, relationships, and keys
- **Example**: Customer(ID, Name, Email) → Order(ID, CustomerID, Date)

**3. Physical Model** ⚙️
- **Purpose**: Database-specific implementation
- **Audience**: Database developers, DBAs
- **Contains**: Tables, columns, data types, indexes, partitions
- **Example**: CREATE TABLE customers (customer_id INT PRIMARY KEY...)

**Pro Tip:** Always start with conceptual, refine to logical, then implement as physical. This prevents costly mistakes!`,
          },
          {
            id: 'dm-what-3',
            title: 'OLTP vs OLAP Systems',
            type: 'text',
            content: `Understanding the difference between transactional and analytical systems is crucial:

**OLTP (Online Transaction Processing)** 💳
- **Purpose**: Day-to-day operations
- **Examples**: E-commerce orders, banking transactions
- **Characteristics**:
  - Many concurrent users
  - Short, fast transactions
  - Current data (real-time)
  - Highly normalized (3NF)
  - Optimized for WRITE operations

**OLAP (Online Analytical Processing)** 📊
- **Purpose**: Business intelligence & reporting
- **Examples**: Sales dashboards, trend analysis
- **Characteristics**:
  - Fewer users (analysts)
  - Complex, long-running queries
  - Historical data (years of history)
  - Denormalized (Star/Snowflake)
  - Optimized for READ operations

| Aspect | OLTP | OLAP |
|--------|------|------|
| Data | Current | Historical |
| Users | Many (1000s) | Few (10-100) |
| Queries | Simple, frequent | Complex, infrequent |
| Schema | Normalized | Denormalized |
| Size | GBs | TBs to PBs |

**Interview Tip:** Be ready to explain why you wouldn't run analytical queries on an OLTP database (performance impact on operations).`,
          },
        ],
      },
      {
        id: 'dm-normalization',
        title: 'Database Normalization',
        description: 'Master the art of organizing data to reduce redundancy and improve integrity.',
        category: 'data-modeling',
        difficulty: 'beginner',
        estimatedTime: 25,
        xpReward: 150,
        prerequisites: ['dm-what-is-data-modeling'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-norm-1',
            title: 'Why Normalize Data?',
            type: 'text',
            content: `**Normalization** is the process of organizing data to minimize redundancy and dependency.

**The Problem Without Normalization:**
Imagine storing customer orders like this:

| OrderID | CustomerName | CustomerEmail | Product | Price |
|---------|--------------|---------------|---------|-------|
| 1 | John Smith | john@email.com | Laptop | 999 |
| 2 | John Smith | john@email.com | Mouse | 29 |
| 3 | Jane Doe | jane@email.com | Laptop | 999 |

**Issues:**
1. **Redundancy**: John's info repeated for each order
2. **Update Anomaly**: If John changes email, must update multiple rows
3. **Delete Anomaly**: Deleting orders might lose customer info
4. **Insert Anomaly**: Can't add a customer without an order

**Goals of Normalization:**
- Eliminate duplicate data
- Ensure data consistency
- Reduce storage space
- Simplify data maintenance
- Improve data integrity`,
          },
          {
            id: 'dm-norm-2',
            title: 'Normal Forms Explained',
            type: 'text',
            content: `**First Normal Form (1NF)** ✅
- Each column contains atomic (indivisible) values
- Each row is unique (has a primary key)
- No repeating groups

❌ **Bad**: Address = "123 Main St, NYC, NY, 10001"
✅ **Good**: Street, City, State, ZipCode as separate columns

**Second Normal Form (2NF)** ✅
- Must be in 1NF
- All non-key columns depend on the ENTIRE primary key
- Remove partial dependencies

❌ **Bad**: (OrderID, ProductID) → ProductName
✅ **Good**: ProductID → ProductName (in separate table)

**Third Normal Form (3NF)** ✅
- Must be in 2NF
- No transitive dependencies
- Non-key columns depend ONLY on the primary key

❌ **Bad**: CustomerID → ZipCode → City (City depends on ZipCode, not CustomerID)
✅ **Good**: Separate Customers and Locations tables

**Memory Trick:** "The key, the whole key, and nothing but the key, so help me Codd" (Edgar Codd invented relational databases)`,
          },
          {
            id: 'dm-norm-3',
            title: 'Normalization Example',
            type: 'code',
            content: 'Let\'s normalize an e-commerce order system:',
            codeExample: {
              language: 'sql',
              description: 'From Unnormalized to 3NF',
              code: `-- UNNORMALIZED (Bad)
-- All data in one messy table
CREATE TABLE orders_unnormalized (
    order_id INT,
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    customer_city VARCHAR(50),
    product_name VARCHAR(100),
    product_category VARCHAR(50),
    product_price DECIMAL(10,2),
    quantity INT,
    order_date DATE
);

-- NORMALIZED (3NF - Good)
-- Customers table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(50)
);

-- Products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2) NOT NULL
);

-- Orders table (links customers and products)
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    order_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Order Items (handles many-to-many)
CREATE TABLE order_items (
    order_id INT REFERENCES orders(order_id),
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id)
);`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'dm-denormalization',
        title: 'Denormalization for Analytics',
        description: 'Learn when and how to denormalize for better query performance.',
        category: 'data-modeling',
        difficulty: 'beginner',
        estimatedTime: 20,
        xpReward: 125,
        prerequisites: ['dm-normalization'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-denorm-1',
            title: 'Why Denormalize?',
            type: 'text',
            content: `While normalization is great for OLTP, analytical workloads benefit from **denormalization**.

**The Problem with Normalized Data for Analytics:**

To get a simple sales report from normalized tables, you might need:
- JOIN orders
- JOIN customers
- JOIN products
- JOIN categories
- JOIN regions

That's 5+ JOINs for one report! 😰

**Benefits of Denormalization:**
1. **Faster Queries**: Fewer JOINs = faster execution
2. **Simpler SQL**: Analysts can write easier queries
3. **Better BI Tools**: Work better with flat, wide tables
4. **Aggregation Performance**: Pre-computed values

**When to Denormalize:**
✅ Data warehouses and analytics
✅ Read-heavy workloads
✅ Reporting and dashboards
✅ Historical data that doesn't change

**When NOT to Denormalize:**
❌ Transactional systems (OLTP)
❌ Data that changes frequently
❌ When storage is a major constraint`,
          },
          {
            id: 'dm-denorm-2',
            title: 'Denormalization Techniques',
            type: 'text',
            content: `**Common Denormalization Strategies:**

**1. Adding Redundant Columns**
Instead of joining to get customer_name, store it in the fact table.

**2. Pre-Computed Aggregates**
Store total_order_amount instead of calculating sum(line_items) every time.

**3. Flattening Hierarchies**
Store category_name, subcategory_name, product_name all in one table instead of joining 3 tables.

**4. Combining Tables**
Merge frequently-joined tables into one (e.g., orders + order_details).

**Trade-offs to Consider:**

| Aspect | Normalized | Denormalized |
|--------|------------|--------------|
| Storage | Less | More |
| Query Speed | Slower | Faster |
| Data Updates | Easier | Harder |
| Data Integrity | Higher | Lower (need processes) |
| Complexity | Schema complex | ETL complex |

**Pro Tip:** In data warehouses, we denormalize during the ETL process, transforming normalized OLTP data into denormalized OLAP structures.`,
          },
        ],
      },
      {
        id: 'dm-star-schema',
        title: 'Star Schema Design',
        description: 'The most popular dimensional modeling pattern for data warehouses.',
        category: 'data-modeling',
        difficulty: 'beginner',
        estimatedTime: 30,
        xpReward: 175,
        prerequisites: ['dm-denormalization'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-star-1',
            title: 'Introduction to Star Schema',
            type: 'text',
            content: `**Star Schema** is the most widely used dimensional modeling pattern. When visualized, it looks like a star - hence the name!

**Structure:**
- **Center**: One FACT table (the star's body)
- **Points**: Multiple DIMENSION tables (the star's points)

**Fact Table** (Center) 📊
- Contains quantitative data (measures)
- Examples: sales_amount, quantity, revenue
- References dimension tables via foreign keys
- Usually very large (millions/billions of rows)
- Narrow (few columns)

**Dimension Tables** (Points) 📦
- Contains descriptive attributes
- Examples: customer_name, product_category, date
- Provides context to facts (who, what, when, where, why)
- Usually smaller (thousands to millions of rows)
- Wide (many columns)

**The "Star" Visual:**
\`\`\`
         dim_date
            |
dim_product-FACT-dim_customer
            |
        dim_store
\`\`\`

**Why Star Schema is Popular:**
- Simple to understand and use
- Excellent query performance
- Works great with BI tools
- Easy to navigate for analysts`,
          },
          {
            id: 'dm-star-2',
            title: 'Fact Tables Deep Dive',
            type: 'text',
            content: `**Types of Fact Tables:**

**1. Transaction Facts** 💰
- One row per event/transaction
- Most detailed grain
- Example: Each individual sale
\`\`\`
sale_id | date_key | product_key | customer_key | quantity | amount
1001    | 20240115 | 5001        | 3001         | 2        | 49.98
\`\`\`

**2. Periodic Snapshot Facts** 📸
- One row per time period per entity
- Captures state at regular intervals
- Example: Daily inventory levels, monthly account balances
\`\`\`
date_key | product_key | store_key | quantity_on_hand | quantity_sold
20240115 | 5001        | 7001      | 150              | 23
\`\`\`

**3. Accumulating Snapshot Facts** 🔄
- One row per entity lifecycle
- Updated as process progresses
- Example: Order fulfillment pipeline
\`\`\`
order_key | order_date | ship_date | delivery_date | payment_date
9001      | 2024-01-10 | 2024-01-12| 2024-01-15    | NULL
\`\`\`

**4. Factless Facts** 🔗
- No measures, only keys
- Tracks events or coverage
- Example: Student attendance, promotion eligibility

**Key Measures in Fact Tables:**
- **Additive**: Can sum across all dimensions (revenue, quantity)
- **Semi-additive**: Can sum across some dimensions (account balance - can't sum across time)
- **Non-additive**: Cannot sum (ratios, percentages)`,
          },
          {
            id: 'dm-star-3',
            title: 'Dimension Tables Deep Dive',
            type: 'text',
            content: `**Anatomy of a Dimension Table:**

**Essential Components:**
1. **Surrogate Key** (Primary Key)
   - System-generated integer
   - Never changes
   - Example: customer_key (1, 2, 3...)

2. **Natural Key** (Business Key)
   - From source system
   - May change or be recycled
   - Example: customer_id ('CUST001')

3. **Descriptive Attributes**
   - The "meat" of the dimension
   - Used in WHERE, GROUP BY, labels
   - Example: customer_name, city, segment

**Common Dimensions:**

**Date Dimension** 📅 (Required in almost every DW)
- date_key, full_date, day_name, month_name
- quarter, year, is_weekend, is_holiday
- fiscal_year, fiscal_quarter

**Customer Dimension** 👤
- customer_key, customer_id, name, email
- segment, tier, acquisition_channel
- geography (city, state, country)

**Product Dimension** 📦
- product_key, sku, name, description
- category, subcategory, brand
- unit_cost, unit_price

**Pro Tips:**
- Dimensions should be "wide" with many attributes
- Include hierarchies (Category → Subcategory → Product)
- Add useful derived attributes (age_group, price_tier)`,
          },
          {
            id: 'dm-star-4',
            title: 'Complete Star Schema Example',
            type: 'code',
            content: 'Building a complete star schema for e-commerce analytics:',
            codeExample: {
              language: 'sql',
              description: 'E-Commerce Star Schema',
              code: `-- DIMENSION: Date (critical for any DW)
CREATE TABLE dim_date (
    date_key INT PRIMARY KEY,        -- YYYYMMDD format
    full_date DATE NOT NULL,
    day_name VARCHAR(10),            -- Monday, Tuesday...
    day_of_week INT,                 -- 1-7
    day_of_month INT,                -- 1-31
    day_of_year INT,                 -- 1-366
    week_of_year INT,
    month_num INT,
    month_name VARCHAR(10),
    quarter INT,
    year INT,
    is_weekend BOOLEAN,
    is_holiday BOOLEAN,
    fiscal_year INT,
    fiscal_quarter INT
);

-- DIMENSION: Customer
CREATE TABLE dim_customer (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,  -- Business key
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    customer_segment VARCHAR(30),      -- Gold, Silver, Bronze
    acquisition_source VARCHAR(50),    -- Organic, Paid, Referral
    first_purchase_date DATE,
    -- SCD Type 2 columns
    effective_date DATE,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE
);

-- DIMENSION: Product
CREATE TABLE dim_product (
    product_key SERIAL PRIMARY KEY,
    product_id VARCHAR(20) NOT NULL,
    product_name VARCHAR(200),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    unit_cost DECIMAL(10,2),
    unit_price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE
);

-- FACT: Sales (the center of our star)
CREATE TABLE fact_sales (
    sale_key BIGSERIAL PRIMARY KEY,
    -- Foreign keys to dimensions
    date_key INT REFERENCES dim_date(date_key),
    customer_key INT REFERENCES dim_customer(customer_key),
    product_key INT REFERENCES dim_product(product_key),
    -- Degenerate dimension
    order_number VARCHAR(20),
    -- Measures (additive)
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    sales_amount DECIMAL(12,2) NOT NULL,
    cost_amount DECIMAL(12,2),
    profit_amount DECIMAL(12,2)
);

-- Sample analytical query
SELECT 
    d.year,
    d.quarter,
    c.customer_segment,
    p.category,
    COUNT(DISTINCT f.order_number) as num_orders,
    SUM(f.quantity) as total_units,
    SUM(f.sales_amount) as total_revenue,
    SUM(f.profit_amount) as total_profit
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_customer c ON f.customer_key = c.customer_key
JOIN dim_product p ON f.product_key = p.product_key
WHERE d.year = 2024
GROUP BY d.year, d.quarter, c.customer_segment, p.category
ORDER BY total_revenue DESC;`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'dm-snowflake-schema',
        title: 'Snowflake Schema',
        description: 'Understanding normalized dimensional modeling.',
        category: 'data-modeling',
        difficulty: 'beginner',
        estimatedTime: 20,
        xpReward: 125,
        prerequisites: ['dm-star-schema'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-snow-1',
            title: 'Star vs Snowflake',
            type: 'text',
            content: `**Snowflake Schema** normalizes dimension tables into sub-dimensions, creating a snowflake-like shape.

**Visual Comparison:**

**Star Schema:**
\`\`\`
         dim_product
              |
dim_date----FACT----dim_customer
              |
         dim_store
\`\`\`

**Snowflake Schema:**
\`\`\`
dim_brand--dim_category
         \\    /
       dim_product
             |
dim_date----FACT----dim_customer--dim_geography
             |
       dim_store--dim_region
\`\`\`

**When Dimensions are Normalized:**
- dim_product → dim_category → dim_brand
- dim_customer → dim_geography → dim_region
- dim_store → dim_region → dim_country

**Trade-offs:**

| Aspect | Star | Snowflake |
|--------|------|-----------|
| Query Complexity | Simple (few JOINs) | Complex (more JOINs) |
| Query Performance | Faster | Slower |
| Storage | More (redundant) | Less (normalized) |
| ETL Complexity | Simpler | More complex |
| Dimension Updates | May need multiple updates | Single place |
| BI Tool Compatibility | Excellent | Good |`,
          },
          {
            id: 'dm-snow-2',
            title: 'When to Use Snowflake',
            type: 'text',
            content: `**Use Snowflake Schema When:**

1. **Storage is Limited** 💾
   - Cloud costs matter
   - Very large dimensions
   - Example: Product dimension with millions of products

2. **Dimension Hierarchies Change Often** 🔄
   - Category restructuring happens frequently
   - Organizational changes are common
   - With star, changes affect many rows

3. **Data Governance is Critical** 🔒
   - Single source of truth for each entity
   - Easier to maintain consistency
   - Audit requirements

4. **Ad-hoc Analysis Needs Flexibility** 🔍
   - Power users who understand the model
   - Complex drill-down requirements

**Stick with Star Schema When:**
- Query performance is priority
- Self-service BI for business users
- Standard reporting use cases
- When in doubt, start with star!

**Hybrid Approach (Common in Practice):**
- Star schema for main dimensions
- Snowflake only for very large/complex hierarchies
- Best of both worlds!`,
          },
        ],
      },
      {
        id: 'dm-keys',
        title: 'Keys in Data Modeling',
        description: 'Master surrogate, natural, and business keys.',
        category: 'data-modeling',
        difficulty: 'beginner',
        estimatedTime: 20,
        xpReward: 125,
        prerequisites: ['dm-star-schema'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-keys-1',
            title: 'Types of Keys',
            type: 'text',
            content: `**Understanding Different Key Types:**

**1. Natural Key (Business Key)** 🏢
- Meaningful identifier from business/source
- Examples: Social Security Number, Email, Product SKU
- **Pros**: Business meaning, no lookup needed
- **Cons**: Can change, may be recycled, might be composite

**2. Surrogate Key** 🔢
- System-generated, meaningless identifier
- Usually auto-incrementing integer
- Examples: customer_key (1, 2, 3...)
- **Pros**: Immutable, simple, efficient joins
- **Cons**: No business meaning, requires lookup

**3. Primary Key** 🔑
- Uniquely identifies each row
- Can be natural OR surrogate
- Must be unique and non-null

**4. Foreign Key** 🔗
- References primary key in another table
- Creates relationships between tables
- Enforces referential integrity

**5. Composite Key** 🧩
- Multiple columns together form unique identifier
- Common in bridge/junction tables
- Example: (order_id, product_id)

**Data Warehouse Best Practice:**
Always use surrogate keys for dimensions, but keep natural keys for lookups!`,
          },
          {
            id: 'dm-keys-2',
            title: 'Why Surrogate Keys Matter',
            type: 'code',
            content: 'Implementing proper key strategy:',
            codeExample: {
              language: 'sql',
              description: 'Surrogate Key Implementation',
              code: `-- PROBLEM: Natural keys can cause issues

-- Scenario 1: Customer email changes
-- Natural key: email
-- Old: john@old-company.com
-- New: john@new-company.com
-- Without surrogate: Historical data links break!

-- Scenario 2: Product SKU reused
-- SKU 'ABC123' discontinued, later used for new product
-- Without surrogate: Can't distinguish old vs new product

-- SOLUTION: Always use surrogate keys

CREATE TABLE dim_customer (
    -- Surrogate key (Primary Key)
    customer_key SERIAL PRIMARY KEY,
    
    -- Natural/Business key (for lookups)
    customer_id VARCHAR(20) NOT NULL,
    
    -- Keep email but not as key
    email VARCHAR(100),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    
    -- SCD Type 2 support (multiple rows per customer)
    effective_date DATE NOT NULL,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE,
    
    -- Index on natural key for ETL lookups
    CONSTRAINT idx_customer_id_current 
        UNIQUE (customer_id, is_current)
);

-- ETL Lookup Function
CREATE OR REPLACE FUNCTION get_customer_key(p_customer_id VARCHAR)
RETURNS INT AS $$
    SELECT customer_key 
    FROM dim_customer 
    WHERE customer_id = p_customer_id 
      AND is_current = TRUE;
$$ LANGUAGE SQL STABLE;

-- Fact table references surrogate key
CREATE TABLE fact_sales (
    sale_key BIGSERIAL PRIMARY KEY,
    customer_key INT REFERENCES dim_customer(customer_key),
    -- NOT customer_id or email!
    ...
);`,
              runnable: false,
            },
          },
        ],
      },
    ],
  },

  // ==================== INTERMEDIATE TRACK ====================
  {
    id: 'scd',
    title: 'Slowly Changing Dimensions',
    description: 'Master all SCD types for handling historical data.',
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
        estimatedTime: 20,
        xpReward: 125,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-intro-1',
            title: 'The History Problem',
            type: 'text',
            content: `**Why Do We Need SCDs?**

Dimension data changes over time. The question is: how should we handle it?

**Real-World Scenario:**
Sarah, a customer, moves from New York to California on March 15th.

**The Business Questions:**
1. "What were total sales by state in Q1?"
   - Should Sarah's sales count as NY or CA?
   
2. "How many customers do we have in each state?"
   - Is Sarah a NY customer or CA customer?

**Two Different Truths:**
- **Point-in-Time Truth**: Sarah was in NY when she made purchases in January
- **Current Truth**: Sarah is currently in CA

**SCD Types Solve This:**
Each type represents a different way to handle changes, based on business requirements.

**Common Scenarios Requiring SCDs:**
- Customer address changes
- Product price updates
- Employee department transfers
- Store region reorganization
- Organizational restructuring`,
          },
          {
            id: 'scd-intro-2',
            title: 'SCD Types Overview',
            type: 'text',
            content: `**Quick Reference: All SCD Types**

| Type | Name | History | Complexity | Use Case |
|------|------|---------|------------|----------|
| 0 | Fixed | None - Never changes | Lowest | Static data |
| 1 | Overwrite | None - Lost | Low | Corrections, non-critical |
| 2 | New Row | Full | Medium | Most common, auditing |
| 3 | New Column | Limited (prev value) | Medium | Compare current vs previous |
| 4 | History Table | Full (separate) | Higher | Audit + fast current lookups |
| 6 | Hybrid (1+2+3) | Full + Current | Highest | Maximum flexibility |

**Which to Choose?**

**Use Type 1 when:**
- Fixing data entry errors
- Attribute doesn't need history
- Storage is extremely limited

**Use Type 2 when:**
- Must preserve complete history
- Point-in-time reporting required
- Audit/compliance requirements
- Most common choice!

**Use Type 3 when:**
- Only need current + previous
- Simple before/after comparisons
- Limited history requirements

**Interview Tip:** Know Type 1, 2, and 3 cold. Type 6 is a bonus!`,
          },
        ],
      },
      {
        id: 'scd-type1',
        title: 'SCD Type 1: Overwrite',
        description: 'The simplest approach - update in place.',
        category: 'scd',
        difficulty: 'intermediate',
        estimatedTime: 15,
        xpReward: 100,
        prerequisites: ['scd-intro'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-type1-1',
            title: 'Type 1 Concept',
            type: 'text',
            content: `**SCD Type 1: Just Update It**

The simplest approach - when data changes, simply update the existing record.

**Characteristics:**
- No history preserved
- Single row per entity
- Smallest storage footprint
- Simplest to implement

**When to Use:**
✅ Correcting data entry errors (typo in name)
✅ Non-critical attributes (middle name, preferred language)
✅ Attributes that don't affect reporting
✅ When storage is extremely limited

**When NOT to Use:**
❌ Need historical analysis
❌ Audit/compliance requirements
❌ Point-in-time reporting
❌ Tracking customer journey

**Example:**
Customer John's phone number changes:

**Before:**
| customer_key | name | phone |
|--------------|------|-------|
| 1001 | John Smith | 555-0100 |

**After (Type 1):**
| customer_key | name | phone |
|--------------|------|-------|
| 1001 | John Smith | 555-0200 |

History of old phone number is LOST.`,
          },
          {
            id: 'scd-type1-2',
            title: 'Type 1 Implementation',
            type: 'code',
            content: 'SQL implementation patterns for Type 1:',
            codeExample: {
              language: 'sql',
              description: 'SCD Type 1 Merge Pattern',
              code: `-- Simple UPDATE for single record
UPDATE dim_customer
SET 
    phone = '555-0200',
    email = 'john.new@email.com',
    updated_at = CURRENT_TIMESTAMP
WHERE customer_id = 'CUST001';

-- MERGE pattern for batch processing
-- Handles both inserts and updates
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
            email, phone, city, state, created_at)
    VALUES (source.customer_id, source.first_name, source.last_name,
            source.email, source.phone, source.city, source.state,
            CURRENT_TIMESTAMP);

-- PostgreSQL alternative (INSERT ... ON CONFLICT)
INSERT INTO dim_customer (customer_id, first_name, last_name, email, phone)
VALUES ('CUST001', 'John', 'Smith', 'john@email.com', '555-0200')
ON CONFLICT (customer_id) 
DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    updated_at = CURRENT_TIMESTAMP;`,
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
        estimatedTime: 35,
        xpReward: 200,
        prerequisites: ['scd-type1'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-type2-1',
            title: 'Type 2 Concept',
            type: 'text',
            content: `**SCD Type 2: Create a New Row**

When data changes, keep the old row and create a new one. This preserves complete history.

**Key Components:**

1. **Surrogate Key** - Unique per version
2. **Natural Key** - Business identifier (same across versions)
3. **Effective Date** - When this version became active
4. **Expiration Date** - When this version ended (usually '9999-12-31' for current)
5. **Is Current Flag** - Easy way to find current record

**Example: Customer Moves from NY to CA**

**Before (1 row):**
| customer_key | customer_id | state | effective_date | expiration_date | is_current |
|--------------|-------------|-------|----------------|-----------------|------------|
| 1001 | CUST001 | NY | 2023-01-01 | 9999-12-31 | TRUE |

**After (2 rows):**
| customer_key | customer_id | state | effective_date | expiration_date | is_current |
|--------------|-------------|-------|----------------|-----------------|------------|
| 1001 | CUST001 | NY | 2023-01-01 | 2024-03-14 | FALSE |
| 2547 | CUST001 | NY | 2024-03-15 | 9999-12-31 | TRUE |

**Key Points:**
- Same customer_id, different customer_key
- Old row's expiration_date and is_current updated
- Fact tables link to specific customer_key (version)
- Historical queries work correctly!`,
          },
          {
            id: 'scd-type2-2',
            title: 'Type 2 Implementation',
            type: 'code',
            content: 'Complete SCD Type 2 merge pattern:',
            codeExample: {
              language: 'sql',
              description: 'SCD Type 2 Full Implementation',
              code: `-- Table with SCD Type 2 columns
CREATE TABLE dim_customer (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    
    -- SCD Type 2 tracking columns
    effective_date DATE NOT NULL,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    
    -- Index for current record lookup
    UNIQUE (customer_id, is_current) WHERE is_current = TRUE
);

-- SCD Type 2 Merge Process
-- Step 1: Identify records that have changed
WITH changes AS (
    SELECT 
        s.customer_id,
        s.first_name,
        s.last_name,
        s.email,
        s.city,
        s.state
    FROM staging_customers s
    LEFT JOIN dim_customer d 
        ON s.customer_id = d.customer_id 
        AND d.is_current = TRUE
    WHERE d.customer_key IS NULL  -- New customer
       OR s.city != d.city        -- Changed city
       OR s.state != d.state      -- Changed state
       OR s.email != d.email      -- Changed email
)

-- Step 2: Expire old current records
UPDATE dim_customer 
SET 
    expiration_date = CURRENT_DATE - 1,
    is_current = FALSE
WHERE customer_id IN (SELECT customer_id FROM changes)
  AND is_current = TRUE;

-- Step 3: Insert new versions
INSERT INTO dim_customer (
    customer_id, first_name, last_name, email, city, state,
    effective_date, expiration_date, is_current, version
)
SELECT 
    c.customer_id, c.first_name, c.last_name, c.email, c.city, c.state,
    CURRENT_DATE,
    '9999-12-31',
    TRUE,
    COALESCE((SELECT MAX(version) + 1 
              FROM dim_customer 
              WHERE customer_id = c.customer_id), 1)
FROM changes c;`,
              runnable: false,
            },
          },
          {
            id: 'scd-type2-3',
            title: 'Querying Type 2 Data',
            type: 'code',
            content: 'Different ways to query SCD Type 2 dimensions:',
            codeExample: {
              language: 'sql',
              description: 'Point-in-Time and Historical Queries',
              code: `-- Get current customer data
SELECT * FROM dim_customer 
WHERE is_current = TRUE;

-- Get customer state as of a specific date
SELECT * FROM dim_customer
WHERE customer_id = 'CUST001'
  AND '2024-02-15' BETWEEN effective_date AND expiration_date;

-- View complete customer history
SELECT 
    customer_id,
    state,
    effective_date,
    expiration_date,
    version
FROM dim_customer
WHERE customer_id = 'CUST001'
ORDER BY version;

-- Point-in-Time Sales Analysis
-- "What were sales by state at the TIME of the sale?"
SELECT 
    c.state as customer_state_at_sale,
    d.year,
    d.month_name,
    SUM(f.sales_amount) as total_sales
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_customer c ON f.customer_key = c.customer_key
-- Note: We join on customer_key (surrogate), not customer_id
-- This automatically gives us the correct version!
WHERE d.year = 2024
GROUP BY c.state, d.year, d.month_name;

-- Compare: Current-State Analysis
-- "What were sales by CURRENT customer state?"
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
GROUP BY curr.state, d.year;`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'scd-type3-6',
        title: 'SCD Types 3 and 6',
        description: 'Alternative approaches for specific requirements.',
        category: 'scd',
        difficulty: 'intermediate',
        estimatedTime: 25,
        xpReward: 150,
        prerequisites: ['scd-type2'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'scd-type36-1',
            title: 'SCD Type 3: Previous Value Column',
            type: 'text',
            content: `**SCD Type 3: Add Column for Previous Value**

Store both current and previous values in the same row.

**Structure:**
\`\`\`
customer_id | current_state | previous_state | state_change_date
CUST001     | CA            | NY             | 2024-03-15
\`\`\`

**When to Use:**
- Only need one level of history
- Before/after comparisons
- Limited storage requirements
- Simple migration tracking

**Limitations:**
- Only stores ONE previous value
- Complex for multiple attributes
- Not suitable for audit requirements

**Example Use Case:**
"Show me all customers who moved states recently"

\`\`\`sql
SELECT * FROM dim_customer
WHERE current_state != previous_state
  AND state_change_date >= CURRENT_DATE - 30;
\`\`\``,
          },
          {
            id: 'scd-type36-2',
            title: 'SCD Type 6: Hybrid Approach',
            type: 'text',
            content: `**SCD Type 6: Best of All Worlds (1 + 2 + 3 = 6)**

Combines Type 1, 2, and 3 for maximum flexibility.

**Structure:**
\`\`\`
customer_key | customer_id | historical_state | current_state | previous_state | effective_date | is_current
1001         | CUST001     | NY               | CA            | NY             | 2023-01-01     | FALSE
2547         | CUST001     | CA               | CA            | NY             | 2024-03-15     | TRUE
\`\`\`

**Components:**
- **Type 2**: Multiple rows with effective dates
- **Type 1**: current_state updated in ALL rows
- **Type 3**: previous_state column

**Query Flexibility:**

"Sales by state at time of transaction" (Type 2)
→ Use historical_state

"Sales by current state" (Type 1)
→ Use current_state

"Customers who moved states" (Type 3)
→ Compare current_state vs previous_state

**Trade-off:**
Most complex to implement and maintain, but most flexible for analytics.`,
          },
          {
            id: 'scd-type36-3',
            title: 'Type 3 & 6 Implementation',
            type: 'code',
            content: 'Implementation patterns:',
            codeExample: {
              language: 'sql',
              description: 'Type 3 and Type 6 Patterns',
              code: `-- SCD TYPE 3: Previous value columns
CREATE TABLE dim_customer_type3 (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Current values
    current_city VARCHAR(50),
    current_state VARCHAR(50),
    
    -- Previous values
    previous_city VARCHAR(50),
    previous_state VARCHAR(50),
    
    -- When did it change?
    city_change_date DATE,
    state_change_date DATE
);

-- Type 3 Update
UPDATE dim_customer_type3
SET 
    previous_state = current_state,
    previous_city = current_city,
    current_state = 'CA',
    current_city = 'Los Angeles',
    state_change_date = CURRENT_DATE,
    city_change_date = CURRENT_DATE
WHERE customer_id = 'CUST001'
  AND current_state != 'CA';  -- Only if actually changed


-- SCD TYPE 6: Hybrid
CREATE TABLE dim_customer_type6 (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    
    -- Historical value (Type 2 - what it was at this point)
    historical_state VARCHAR(50),
    
    -- Current value (Type 1 - updated everywhere)
    current_state VARCHAR(50),
    
    -- Previous value (Type 3)
    previous_state VARCHAR(50),
    
    -- Type 2 tracking
    effective_date DATE NOT NULL,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE
);

-- Type 6 Update Process
-- When customer moves from NY to CA:

-- Step 1: Update current_state in ALL rows (Type 1)
UPDATE dim_customer_type6
SET current_state = 'CA'
WHERE customer_id = 'CUST001';

-- Step 2: Expire current row (Type 2)
UPDATE dim_customer_type6
SET expiration_date = CURRENT_DATE - 1,
    is_current = FALSE
WHERE customer_id = 'CUST001' 
  AND is_current = TRUE;

-- Step 3: Insert new row (Type 2 + Type 3)
INSERT INTO dim_customer_type6 (
    customer_id, historical_state, current_state, previous_state,
    effective_date, is_current
)
SELECT 
    'CUST001', 'CA', 'CA', historical_state,
    CURRENT_DATE, TRUE
FROM dim_customer_type6
WHERE customer_id = 'CUST001'
  AND expiration_date = CURRENT_DATE - 1;`,
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
        title: 'Full Load vs Incremental',
        description: 'Choosing the right loading strategy for your use case.',
        category: 'loading-patterns',
        difficulty: 'intermediate',
        estimatedTime: 25,
        xpReward: 150,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lp-fi-1',
            title: 'Loading Strategies Overview',
            type: 'text',
            content: `**Two Fundamental Approaches:**

**Full Load (Full Refresh)** 🔄
Completely replace target with source data.

Process:
1. Truncate target table
2. Load ALL source data
3. Rebuild indexes

**When to Use:**
- Small tables (< 1M rows)
- No change tracking in source
- Need guaranteed consistency
- Weekly/monthly snapshots
- Initial load

**Incremental Load (Delta Load)** ⚡
Only process new/changed records.

Process:
1. Identify changes since last load
2. Apply changes to target
3. Update watermark

**When to Use:**
- Large tables
- Frequent updates needed
- Source tracks changes
- Near real-time requirements
- Production workloads

**Comparison:**

| Aspect | Full Load | Incremental |
|--------|-----------|-------------|
| Speed | Slow | Fast |
| Resources | High | Low |
| Complexity | Simple | Medium |
| Risk of Missing Data | None | Possible |
| Suitable Size | Small | Any |`,
          },
          {
            id: 'lp-fi-2',
            title: 'Implementation Patterns',
            type: 'code',
            content: 'SQL patterns for both approaches:',
            codeExample: {
              language: 'sql',
              description: 'Full vs Incremental Loading',
              code: `-- ============================================
-- FULL LOAD: Simple but resource-intensive
-- ============================================
BEGIN TRANSACTION;

-- Clear existing data
TRUNCATE TABLE dwh.dim_product;

-- Load all source data
INSERT INTO dwh.dim_product (
    product_id, product_name, category, 
    subcategory, brand, price
)
SELECT 
    product_id, product_name, category,
    subcategory, brand, price
FROM source.products;

-- Rebuild indexes
REINDEX TABLE dwh.dim_product;

COMMIT;

-- ============================================
-- INCREMENTAL LOAD: Efficient for large data
-- ============================================

-- Get last processed timestamp
DECLARE @last_load TIMESTAMP;
SELECT @last_load = last_successful_load
FROM etl.load_control
WHERE table_name = 'dim_product';

-- Load only changed records
MERGE INTO dwh.dim_product AS target
USING (
    SELECT * FROM source.products
    WHERE updated_at > @last_load
) AS source
ON target.product_id = source.product_id

WHEN MATCHED THEN
    UPDATE SET
        product_name = source.product_name,
        category = source.category,
        price = source.price,
        updated_at = CURRENT_TIMESTAMP

WHEN NOT MATCHED THEN
    INSERT (product_id, product_name, category, price, created_at)
    VALUES (source.product_id, source.product_name, 
            source.category, source.price, CURRENT_TIMESTAMP);

-- Update control table
UPDATE etl.load_control
SET last_successful_load = CURRENT_TIMESTAMP
WHERE table_name = 'dim_product';`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'lp-watermarking',
        title: 'Watermarking Strategies',
        description: 'Track incremental load progress reliably.',
        category: 'loading-patterns',
        difficulty: 'intermediate',
        estimatedTime: 25,
        xpReward: 150,
        prerequisites: ['lp-full-vs-incremental'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lp-wm-1',
            title: 'Watermarking Concepts',
            type: 'text',
            content: `**Watermarking** = Bookmarking your place in the data stream.

**Why Watermarks?**
- Track last processed position
- Enable restartability
- Prevent duplicate processing
- Support incremental loads

**Types of Watermarks:**

**1. Timestamp-Based** ⏰
- Use updated_at or created_at columns
- Most common approach
\`\`\`
WHERE updated_at > last_watermark
  AND updated_at <= current_watermark
\`\`\`

**2. ID-Based** 🔢
- Use auto-incrementing IDs
- Good for append-only data
\`\`\`
WHERE id > last_id AND id <= max_id
\`\`\`

**3. Sequence-Based** 📊
- Database-specific sequences
- Transaction log positions
- Common with CDC tools

**Best Practices:**

✅ Store watermarks in a control table
✅ Include safety buffers (late-arriving data)
✅ Update watermark AFTER successful load
✅ Log watermark history for debugging
✅ Handle timezone consistently`,
          },
          {
            id: 'lp-wm-2',
            title: 'Watermark Implementation',
            type: 'code',
            content: 'Complete watermark management:',
            codeExample: {
              language: 'sql',
              description: 'Watermark Control Table Pattern',
              code: `-- Create watermark control table
CREATE TABLE etl.watermarks (
    watermark_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL UNIQUE,
    watermark_column VARCHAR(50) NOT NULL,
    watermark_type VARCHAR(20) NOT NULL, -- timestamp, id, sequence
    watermark_value VARCHAR(100) NOT NULL,
    last_run_start TIMESTAMP,
    last_run_end TIMESTAMP,
    last_run_status VARCHAR(20), -- success, failed, running
    rows_processed BIGINT,
    error_message TEXT
);

-- Initialize watermark
INSERT INTO etl.watermarks (table_name, watermark_column, watermark_type, watermark_value)
VALUES ('fact_orders', 'updated_at', 'timestamp', '2024-01-01 00:00:00');

-- Safe incremental load procedure
CREATE OR REPLACE PROCEDURE etl.load_fact_orders()
LANGUAGE plpgsql AS $$
DECLARE
    v_low_wm TIMESTAMP;
    v_high_wm TIMESTAMP;
    v_rows BIGINT;
BEGIN
    -- Mark as running
    UPDATE etl.watermarks 
    SET last_run_start = CURRENT_TIMESTAMP, 
        last_run_status = 'running'
    WHERE table_name = 'fact_orders';
    
    -- Get watermarks
    SELECT watermark_value::TIMESTAMP INTO v_low_wm
    FROM etl.watermarks WHERE table_name = 'fact_orders';
    
    -- High watermark with 5-minute buffer for late data
    v_high_wm := CURRENT_TIMESTAMP - INTERVAL '5 minutes';
    
    -- Perform the load
    INSERT INTO dwh.fact_orders
    SELECT * FROM staging.orders
    WHERE updated_at > v_low_wm
      AND updated_at <= v_high_wm;
    
    GET DIAGNOSTICS v_rows = ROW_COUNT;
    
    -- Update watermark on success
    UPDATE etl.watermarks 
    SET watermark_value = v_high_wm::VARCHAR,
        last_run_end = CURRENT_TIMESTAMP,
        last_run_status = 'success',
        rows_processed = v_rows,
        error_message = NULL
    WHERE table_name = 'fact_orders';

EXCEPTION WHEN OTHERS THEN
    -- Log failure but DON'T update watermark
    UPDATE etl.watermarks 
    SET last_run_end = CURRENT_TIMESTAMP,
        last_run_status = 'failed',
        error_message = SQLERRM
    WHERE table_name = 'fact_orders';
    RAISE;
END;
$$;`,
              runnable: false,
            },
          },
        ],
      },
    ],
  },

  // ==================== ADVANCED TRACK ====================
  {
    id: 'lakehouse',
    title: 'Data Lakehouse',
    description: 'Modern architecture combining lake and warehouse benefits.',
    icon: '🏠',
    color: 'yellow',
    skillLevel: 'advanced',
    modules: [
      {
        id: 'lh-intro',
        title: 'Lakehouse Architecture',
        description: 'Understanding the modern data lakehouse paradigm.',
        category: 'lakehouse',
        difficulty: 'advanced',
        estimatedTime: 30,
        xpReward: 200,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'lh-intro-1',
            title: 'Evolution of Data Architecture',
            type: 'text',
            content: `**The Journey to Lakehouse:**

**Generation 1: Data Warehouses** 🏢
- Structured data only
- Schema-on-write
- Expensive storage
- SQL analytics
- Examples: Teradata, Oracle, Snowflake

**Generation 2: Data Lakes** 🌊
- All data types (raw)
- Schema-on-read
- Cheap storage (S3, ADLS)
- Often became "data swamps"
- Examples: Hadoop, S3 + Athena

**Generation 3: Data Lakehouse** 🏠
- Best of both worlds!
- Cheap storage + ACID transactions
- Raw AND curated data
- SQL + ML workloads
- Examples: Databricks, Delta Lake, Apache Iceberg

**Lakehouse Key Features:**
1. **ACID Transactions** on data lakes
2. **Schema Enforcement** & Evolution
3. **Time Travel** (query historical data)
4. **Unified Batch & Streaming**
5. **Open File Formats** (Parquet, ORC)`,
          },
          {
            id: 'lh-intro-2',
            title: 'Delta Lake Deep Dive',
            type: 'text',
            content: `**Delta Lake** = Open-source storage layer for data lakes.

**How It Works:**
- Data stored in Parquet files
- Transaction log (_delta_log) tracks changes
- Each write creates a new version
- Readers see consistent snapshots

**Core Capabilities:**

**1. ACID Transactions**
- Atomic: All or nothing
- Consistent: Valid state after each transaction
- Isolated: Concurrent operations don't interfere
- Durable: Committed data survives failures

**2. Time Travel**
- Query data as of any previous version
- Audit changes over time
- Rollback mistakes easily

**3. Schema Management**
- Enforce schema on write
- Evolve schema safely
- Prevent data corruption

**4. Unified Processing**
- Same table for batch and streaming
- No ETL between lake and warehouse
- Single source of truth`,
          },
          {
            id: 'lh-intro-3',
            title: 'Delta Lake Operations',
            type: 'code',
            content: 'Essential Delta Lake commands:',
            codeExample: {
              language: 'sql',
              description: 'Delta Lake SQL Operations',
              code: `-- Create Delta table
CREATE TABLE sales_delta
USING DELTA
LOCATION 's3://bucket/sales/'
AS SELECT * FROM raw_sales;

-- Insert data
INSERT INTO sales_delta VALUES (1, '2024-01-15', 100.00);

-- Update (ACID compliant!)
UPDATE sales_delta
SET amount = 150.00
WHERE sale_id = 1;

-- Delete
DELETE FROM sales_delta
WHERE sale_date < '2020-01-01';

-- Merge (Upsert) - Most powerful operation
MERGE INTO sales_delta AS target
USING new_sales AS source
ON target.sale_id = source.sale_id

WHEN MATCHED AND source.is_deleted = true THEN
    DELETE

WHEN MATCHED THEN
    UPDATE SET *

WHEN NOT MATCHED THEN
    INSERT *;

-- TIME TRAVEL

-- Query by version
SELECT * FROM sales_delta VERSION AS OF 5;

-- Query by timestamp
SELECT * FROM sales_delta 
TIMESTAMP AS OF '2024-01-15 10:00:00';

-- View table history
DESCRIBE HISTORY sales_delta;

-- Restore previous version
RESTORE TABLE sales_delta TO VERSION AS OF 10;

-- MAINTENANCE

-- Compact small files
OPTIMIZE sales_delta;

-- Z-Order for faster queries
OPTIMIZE sales_delta ZORDER BY (customer_id, date);

-- Remove old files
VACUUM sales_delta RETAIN 168 HOURS;`,
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
    description: 'Ensure reliable, accurate data for analytics.',
    icon: '✅',
    color: 'magenta',
    skillLevel: 'advanced',
    modules: [
      {
        id: 'dq-fundamentals',
        title: 'Data Quality Fundamentals',
        description: 'Building a data quality framework.',
        category: 'data-quality',
        difficulty: 'advanced',
        estimatedTime: 30,
        xpReward: 175,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dq-fund-1',
            title: 'Data Quality Dimensions',
            type: 'text',
            content: `**The Six Pillars of Data Quality:**

**1. Accuracy** ✓
- Does data correctly represent reality?
- Is customer email actually valid?
- Is the price what's in the system of record?

**2. Completeness** 📋
- Is all required data present?
- Are there unexpected NULLs?
- Missing records?

**3. Consistency** 🔄
- Does data match across systems?
- Same customer in CRM = same in DW?
- Totals balance correctly?

**4. Timeliness** ⏰
- Is data available when needed?
- How fresh is the data?
- Does it meet SLAs?

**5. Uniqueness** 🎯
- No duplicate records?
- Primary keys truly unique?
- Same entity stored once?

**6. Validity** ✅
- Data conforms to rules?
- Email format correct?
- Values in acceptable ranges?`,
          },
          {
            id: 'dq-fund-2',
            title: 'Data Quality Checks',
            type: 'code',
            content: 'Implementing quality validations:',
            codeExample: {
              language: 'sql',
              description: 'Data Quality Check Queries',
              code: `-- COMPLETENESS: Check for required fields
SELECT 
    'completeness' as check,
    COUNT(*) as total_rows,
    SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) as null_emails,
    ROUND(100.0 * SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) / COUNT(*), 2) as null_pct
FROM dim_customer;

-- UNIQUENESS: Find duplicates
SELECT 
    customer_id,
    COUNT(*) as duplicate_count
FROM dim_customer
WHERE is_current = TRUE
GROUP BY customer_id
HAVING COUNT(*) > 1;

-- VALIDITY: Check data ranges
SELECT 
    'validity' as check,
    SUM(CASE WHEN order_amount < 0 THEN 1 ELSE 0 END) as negative_amounts,
    SUM(CASE WHEN order_amount > 1000000 THEN 1 ELSE 0 END) as suspicious_large
FROM fact_orders;

-- CONSISTENCY: Cross-table validation
SELECT 
    'orphan_records' as issue,
    COUNT(*) as count
FROM fact_orders f
LEFT JOIN dim_customer c ON f.customer_key = c.customer_key
WHERE c.customer_key IS NULL;

-- TIMELINESS: Data freshness
SELECT 
    MAX(order_date) as latest_data,
    CURRENT_DATE - MAX(order_date) as days_stale
FROM fact_orders;

-- Combine into a quality report
CREATE VIEW dq_dashboard AS
SELECT 
    'dim_customer' as table_name,
    'completeness' as dimension,
    'email_not_null' as check_name,
    ROUND(100.0 * SUM(CASE WHEN email IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*), 2) as score,
    CASE WHEN score >= 99 THEN 'PASS' ELSE 'FAIL' END as status
FROM dim_customer
UNION ALL
-- Add more checks...
;`,
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
    description: 'Speed up queries and optimize data pipelines.',
    icon: '⚡',
    color: 'orange',
    skillLevel: 'advanced',
    modules: [
      {
        id: 'perf-indexing',
        title: 'Indexing Strategies',
        description: 'Master database indexes for faster queries.',
        category: 'performance',
        difficulty: 'advanced',
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
            content: `**Index Types and When to Use:**

**B-Tree Index** (Default)
- Best for: Range queries, equality, sorting
- Supports: =, <, >, BETWEEN, IN, LIKE 'prefix%'
- Use for: PKs, FKs, frequently filtered columns

**Hash Index**
- Best for: Exact match only
- Faster than B-Tree for =
- Cannot support range queries

**Bitmap Index**
- Best for: Low-cardinality columns
- Efficient for AND/OR
- Common in warehouses

**Covering Index**
- Contains all query columns
- Avoids table lookup
- Trades space for speed

**When to Index:**
✅ Columns in WHERE clauses
✅ JOIN columns
✅ ORDER BY columns
✅ High-selectivity columns

**When NOT to Index:**
❌ Small tables
❌ Frequently updated columns
❌ Low-selectivity columns
❌ Columns rarely queried`,
          },
          {
            id: 'perf-idx-2',
            title: 'Index Implementation',
            type: 'code',
            content: 'Creating effective indexes:',
            codeExample: {
              language: 'sql',
              description: 'Index Strategy Examples',
              code: `-- Single column index
CREATE INDEX idx_orders_date 
ON fact_orders(order_date);

-- Composite index (order matters!)
-- Supports: WHERE customer = X AND date = Y
-- Also supports: WHERE customer = X
-- Does NOT efficiently support: WHERE date = Y alone
CREATE INDEX idx_orders_cust_date 
ON fact_orders(customer_key, order_date);

-- Covering index - all columns needed by query
CREATE INDEX idx_orders_covering 
ON fact_orders(customer_key, order_date)
INCLUDE (order_amount, quantity);

-- Partial index - only indexes subset
CREATE INDEX idx_orders_recent 
ON fact_orders(order_date, customer_key)
WHERE order_date >= '2024-01-01';

-- Check index usage
SELECT 
    indexrelname as index_name,
    idx_scan as times_used,
    idx_tup_read as rows_read
FROM pg_stat_user_indexes
WHERE schemaname = 'dwh'
ORDER BY idx_scan DESC;

-- Find missing indexes
SELECT 
    relname as table_name,
    seq_scan,
    seq_tup_read,
    idx_scan,
    CASE WHEN seq_scan > 0 
         THEN seq_tup_read / seq_scan 
    END as avg_rows_per_scan
FROM pg_stat_user_tables
WHERE seq_scan > 1000
  AND seq_tup_read / NULLIF(seq_scan, 0) > 10000
ORDER BY seq_tup_read DESC;`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'perf-query-opt',
        title: 'Query Optimization',
        description: 'Write faster, more efficient SQL.',
        category: 'performance',
        difficulty: 'advanced',
        estimatedTime: 35,
        xpReward: 200,
        prerequisites: ['perf-indexing'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'perf-qo-1',
            title: 'Query Optimization Principles',
            type: 'text',
            content: `**Key Optimization Principles:**

**1. Reduce Data Scanned** 📉
- Filter early with WHERE
- Use partitioning wisely
- Select only needed columns

**2. Minimize Data Movement** 🚚
- Avoid SELECT *
- Push predicates down
- Join smaller tables first

**3. Optimize Joins** 🔗
- Join on indexed columns
- Consider join order
- Use appropriate join types

**4. Use EXPLAIN** 🔍
- Always check execution plan
- Look for table scans
- Identify bottlenecks

**Common Anti-Patterns:**
❌ SELECT * (selects all columns)
❌ Functions on indexed columns: WHERE YEAR(date) = 2024
❌ Leading wildcards: WHERE name LIKE '%Smith'
❌ OR with different columns
❌ Implicit type conversions`,
          },
          {
            id: 'perf-qo-2',
            title: 'Before & After Examples',
            type: 'code',
            content: 'Optimizing real queries:',
            codeExample: {
              language: 'sql',
              description: 'Query Optimization Examples',
              code: `-- ❌ BAD: Function on indexed column
SELECT * FROM fact_orders
WHERE YEAR(order_date) = 2024;

-- ✅ GOOD: Sargable (Search ARGument ABLE)
SELECT * FROM fact_orders
WHERE order_date >= '2024-01-01'
  AND order_date < '2025-01-01';


-- ❌ BAD: Select all, filter late
SELECT * FROM fact_orders f
JOIN dim_customer c ON f.customer_key = c.customer_key
WHERE c.state = 'CA';

-- ✅ GOOD: Select needed columns, filter early
SELECT 
    f.order_id,
    f.order_amount,
    c.customer_name
FROM fact_orders f
JOIN dim_customer c ON f.customer_key = c.customer_key
WHERE c.state = 'CA'
  AND c.is_current = TRUE
  AND f.order_date >= '2024-01-01';


-- ❌ BAD: Correlated subquery
SELECT customer_id,
    (SELECT SUM(order_amount) 
     FROM fact_orders f 
     WHERE f.customer_key = c.customer_key) as total
FROM dim_customer c;

-- ✅ GOOD: JOIN with aggregation
SELECT c.customer_id, SUM(f.order_amount) as total
FROM dim_customer c
LEFT JOIN fact_orders f ON c.customer_key = f.customer_key
GROUP BY c.customer_id;


-- Always check the plan!
EXPLAIN ANALYZE
SELECT ...your query here...;`,
              runnable: false,
            },
          },
        ],
      },
    ],
  },
];

// Helper functions
export const getAllModules = (): LearningModule[] => {
  return LEARNING_TOPICS.flatMap(topic => topic.modules);
};

export const getModuleById = (moduleId: string): LearningModule | undefined => {
  return getAllModules().find(m => m.id === moduleId);
};

export const getTopicById = (topicId: TopicCategory): TopicConfig | undefined => {
  return LEARNING_TOPICS.find(t => t.id === topicId);
};

export const getTopicsBySkillLevel = (level: SkillLevel): TopicConfig[] => {
  return LEARNING_TOPICS.filter(t => t.skillLevel === level);
};

export const getSkillTrackById = (trackId: SkillLevel): SkillTrack | undefined => {
  return SKILL_TRACKS.find(t => t.id === trackId);
};

export const getModulesBySkillLevel = (level: SkillLevel): LearningModule[] => {
  return getTopicsBySkillLevel(level).flatMap(t => t.modules);
};
