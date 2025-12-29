import { TopicConfig } from '../learning-modules';

export const BEGINNER_TOPICS: TopicConfig[] = [
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
        estimatedTime: 20,
        xpReward: 100,
        prerequisites: [],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-what-1',
            title: 'Introduction to Data Modeling',
            type: 'text',
            content: `**Data modeling** is the process of creating a visual representation of data and the relationships between different data elements. Think of it as creating a blueprint before building a house - you need to plan the structure before construction begins.

**Why Data Modeling Matters in Data Engineering:**

- **Clarity**: Helps teams understand how data flows through systems
- **Quality**: Reduces data inconsistencies and errors
- **Performance**: Well-designed models enable faster queries
- **Communication**: Creates a common language between business and technical teams
- **Scalability**: Good models grow with your business needs
- **Cost Efficiency**: Prevents expensive rework and migrations

**Real-World Analogy:**
Imagine organizing a massive library with millions of books. Without a system (data model), books would be scattered randomly - finding anything would be nearly impossible. With a well-designed catalog system, you can organize by genre, author, publication date, or subject - making it easy to find exactly what you need in seconds.

**The Cost of Poor Data Modeling:**
Companies spend an estimated 20-30% of their data engineering time fixing issues that stem from poor data modeling decisions made early in projects. Getting it right from the start saves enormous amounts of time and money.

**Key Takeaway:** Data modeling is the foundation of every successful data warehouse, analytics system, and data pipeline. Master this, and you'll have a significant advantage in data engineering interviews.`,
          },
          {
            id: 'dm-what-2',
            title: 'Types of Data Models',
            type: 'text',
            content: `There are three main types of data models, each serving a different purpose and audience:

**1. Conceptual Model** 📝
- **Purpose**: High-level business view of data
- **Audience**: Business stakeholders, executives, product managers
- **Contains**: Main entities and their relationships (no technical details)
- **Tools**: Whiteboard, Lucidchart, draw.io
- **Example**: "Customers place Orders for Products through Stores"

**When to use:** Early project phases, stakeholder alignment, requirements gathering

**2. Logical Model** 🔍
- **Purpose**: Detailed structure without database-specific details
- **Audience**: Data architects, analysts, developers
- **Contains**: All entities, attributes, relationships, primary/foreign keys, data types
- **Tools**: ERwin, ER/Studio, dbdiagram.io
- **Example**: Customer(CustomerID PK, Name, Email) → Order(OrderID PK, CustomerID FK, OrderDate)

**When to use:** Design phase, documentation, cross-platform discussions

**3. Physical Model** ⚙️
- **Purpose**: Database-specific implementation
- **Audience**: Database developers, DBAs, data engineers
- **Contains**: Tables, columns, data types, indexes, partitions, constraints
- **Tools**: SQL DDL, database-specific tools
- **Example**: CREATE TABLE customers (customer_id INT PRIMARY KEY AUTO_INCREMENT...)

**When to use:** Implementation, optimization, maintenance

**The Golden Rule:** Always start with conceptual, refine to logical, then implement as physical. This prevents costly mistakes and ensures alignment between business needs and technical implementation!

**Interview Tip:** Be ready to explain how you would approach modeling a new business domain - starting from understanding requirements (conceptual) through to implementation (physical).`,
          },
          {
            id: 'dm-what-3',
            title: 'OLTP vs OLAP Systems',
            type: 'text',
            content: `Understanding the difference between transactional and analytical systems is **crucial** for data engineers. These two paradigms require fundamentally different design approaches.

**OLTP (Online Transaction Processing)** 💳

Purpose: Day-to-day business operations
Examples: E-commerce orders, banking transactions, inventory updates, user registrations

**Key Characteristics:**
- Many concurrent users (thousands)
- Short, fast transactions (milliseconds)
- Current data (real-time or near real-time)
- Highly normalized schema (3NF or higher)
- Optimized for WRITE operations
- Small queries affecting few rows
- High transaction volume

**OLAP (Online Analytical Processing)** 📊

Purpose: Business intelligence, reporting, analytics
Examples: Sales dashboards, trend analysis, financial reporting, customer segmentation

**Key Characteristics:**
- Fewer users (analysts, data scientists)
- Complex, long-running queries (seconds to minutes)
- Historical data (years of history)
- Denormalized schema (Star/Snowflake)
- Optimized for READ operations
- Large queries scanning millions of rows
- Lower transaction volume, higher data volume

**Side-by-Side Comparison:**

| Aspect | OLTP | OLAP |
|--------|------|------|
| Data | Current state | Historical trends |
| Users | Many (1000s) | Few (10-100) |
| Queries | Simple, frequent | Complex, infrequent |
| Schema | Normalized (3NF) | Denormalized (Star) |
| Size | GBs to TBs | TBs to PBs |
| Updates | Frequent | Batch/periodic |
| Response | Milliseconds | Seconds to minutes |

**Why This Matters:**

❌ **Common Mistake:** Running analytical queries directly on OLTP databases
- Impacts production performance
- Slows down customer-facing applications
- Can cause system outages

✅ **Best Practice:** Extract data from OLTP → Transform → Load into OLAP system
- Production systems stay fast
- Analytics have dedicated resources
- Historical data preserved

**Interview Question:** "Why wouldn't you run analytical queries directly on your production database?"

**Answer:** Production OLTP databases are optimized for transactional workloads with normalized schemas. Running complex analytical queries would:
1. Consume resources needed for customer operations
2. Require expensive JOINs across normalized tables
3. Lock tables during long-running queries
4. Not have historical data (only current state)
5. Potentially cause service degradation or outages`,
          },
          {
            id: 'dm-what-4',
            title: 'Entity-Relationship Basics',
            type: 'text',
            content: `**Entity-Relationship (ER) modeling** is the foundation of data modeling. Understanding entities, attributes, and relationships is essential for any data engineer.

**Entities** 📦
An entity represents a real-world object or concept that we want to store data about.

Examples:
- Customer
- Product
- Order
- Employee
- Transaction

**Attributes** 📝
Attributes are properties or characteristics of an entity.

Example for Customer entity:
- customer_id (identifier)
- first_name
- last_name
- email
- phone
- created_date

**Relationships** 🔗
Relationships describe how entities are connected to each other.

**Types of Relationships:**

**1. One-to-One (1:1)**
- One entity relates to exactly one other entity
- Example: Employee ↔ Employee_Badge
- Rare in practice, often merged into single table

**2. One-to-Many (1:N)**
- One entity relates to multiple instances of another
- Example: Customer → Orders (one customer, many orders)
- Most common relationship type
- Implemented via foreign key on the "many" side

**3. Many-to-Many (M:N)**
- Multiple entities relate to multiple other entities
- Example: Students ↔ Courses (students take many courses, courses have many students)
- Requires a junction/bridge table to implement

**Cardinality Notation:**
- **1** = Exactly one
- **0..1** = Zero or one (optional)
- **1..*** = One or more (required)
- **0..*** = Zero or more (optional)

**Real-World Example: E-Commerce**

Entities: Customer, Product, Order, Order_Item, Category

Relationships:
- Customer (1) → Orders (N): One customer places many orders
- Order (1) → Order_Items (N): One order has many line items
- Product (1) → Order_Items (N): One product in many order items
- Category (1) → Products (N): One category has many products
- Product (M) ↔ Category (N): Products can be in multiple categories (junction table)

**Pro Tip:** When interviewing, always clarify cardinality. "Can a customer have zero orders?" "Can a product be in multiple categories?" These details significantly impact your design.`,
          },
        ],
      },
      {
        id: 'dm-normalization',
        title: 'Database Normalization',
        description: 'Master the art of organizing data to reduce redundancy and improve integrity.',
        category: 'data-modeling',
        difficulty: 'beginner',
        estimatedTime: 30,
        xpReward: 150,
        prerequisites: ['dm-what-is-data-modeling'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-norm-1',
            title: 'Why Normalize Data?',
            type: 'text',
            content: `**Normalization** is the process of organizing data to minimize redundancy and dependency. It's one of the most important concepts in relational database design.

**The Problem Without Normalization:**

Imagine storing customer orders like this (unnormalized):

| OrderID | CustomerName | CustomerEmail | CustomerPhone | Product | Price | Qty |
|---------|--------------|---------------|---------------|---------|-------|-----|
| 1 | John Smith | john@email.com | 555-0100 | Laptop | 999 | 1 |
| 2 | John Smith | john@email.com | 555-0100 | Mouse | 29 | 2 |
| 3 | Jane Doe | jane@email.com | 555-0200 | Laptop | 999 | 1 |
| 4 | John Smith | john@email.com | 555-0100 | Keyboard | 79 | 1 |

**Issues with this design:**

**1. Data Redundancy** 💾
- John's info (name, email, phone) repeated 3 times
- Laptop price repeated twice
- Wastes storage space
- More data to maintain

**2. Update Anomaly** ✏️
- If John changes his email, must update multiple rows
- Easy to miss some rows → inconsistent data
- "Which email is correct?"

**3. Delete Anomaly** 🗑️
- If we delete Jane's only order, we lose her customer info entirely
- Can't have customers without orders

**4. Insert Anomaly** ➕
- Can't add a new customer until they place an order
- Can't add a new product until someone buys it

**Goals of Normalization:**

✅ Eliminate duplicate data
✅ Ensure data consistency
✅ Reduce storage space
✅ Simplify data maintenance
✅ Improve data integrity
✅ Make updates atomic and reliable

**When NOT to Normalize (Preview):**
While normalization is great for OLTP systems, analytical systems often benefit from denormalization. We'll cover this in the next module!`,
          },
          {
            id: 'dm-norm-2',
            title: 'First Normal Form (1NF)',
            type: 'text',
            content: `**First Normal Form (1NF)** is the foundation of normalization. A table is in 1NF if it meets these criteria:

**Rules for 1NF:**

**1. Atomic Values** ⚛️
Each column contains only atomic (indivisible) values. No lists, arrays, or composite values.

❌ **Bad Example:**
| CustomerID | Name | PhoneNumbers |
|------------|------|--------------|
| 1 | John | 555-0100, 555-0101 |

✅ **Good Example:**
| CustomerID | Name | PhoneNumber |
|------------|------|-------------|
| 1 | John | 555-0100 |
| 1 | John | 555-0101 |

Or better yet, a separate Phone table.

**2. Unique Rows** 🔑
Each row must be uniquely identifiable (has a primary key).

❌ **Bad:** No way to distinguish duplicate rows
✅ **Good:** customer_id, order_id, or composite key

**3. No Repeating Groups** 🚫
No columns like phone1, phone2, phone3 or item1_name, item1_price, item2_name, item2_price.

❌ **Bad Example:**
| OrderID | Item1 | Price1 | Item2 | Price2 | Item3 | Price3 |
|---------|-------|--------|-------|--------|-------|--------|
| 1 | Laptop | 999 | Mouse | 29 | NULL | NULL |

✅ **Good Example:**
| OrderID | ItemID | ItemName | Price |
|---------|--------|----------|-------|
| 1 | 101 | Laptop | 999 |
| 1 | 102 | Mouse | 29 |

**Real-World Example - Address Field:**

❌ **Violates 1NF:**
| CustomerID | Address |
|------------|---------|
| 1 | 123 Main St, New York, NY, 10001 |

✅ **1NF Compliant:**
| CustomerID | Street | City | State | ZipCode |
|------------|--------|------|-------|---------|
| 1 | 123 Main St | New York | NY | 10001 |

**Why does atomicity matter?**
- Can query/filter by city: WHERE city = 'New York'
- Can aggregate: COUNT(*) GROUP BY state
- Can validate: CHECK zip_code matches state
- Can index individual columns for performance`,
          },
          {
            id: 'dm-norm-3',
            title: 'Second Normal Form (2NF)',
            type: 'text',
            content: `**Second Normal Form (2NF)** builds on 1NF by eliminating partial dependencies.

**Requirements for 2NF:**
1. Must be in 1NF ✅
2. All non-key columns must depend on the **entire** primary key

**What is a Partial Dependency?**
When a non-key column depends on only PART of a composite primary key.

**Example - Order Items Table (Violates 2NF):**

Primary Key: (OrderID, ProductID) - composite key

| OrderID | ProductID | ProductName | ProductCategory | Quantity | UnitPrice |
|---------|-----------|-------------|-----------------|----------|-----------|
| 1 | 101 | Laptop | Electronics | 1 | 999 |
| 1 | 102 | Mouse | Electronics | 2 | 29 |
| 2 | 101 | Laptop | Electronics | 1 | 999 |

**Dependency Analysis:**
- Quantity → depends on (OrderID, ProductID) ✅ Full dependency
- UnitPrice → depends on (OrderID, ProductID) ✅ Full dependency
- ProductName → depends on ProductID only ❌ **Partial dependency!**
- ProductCategory → depends on ProductID only ❌ **Partial dependency!**

**The Problem:**
- ProductName repeated every time that product is ordered
- If we rename "Laptop" to "MacBook Pro", must update many rows
- Inconsistency risk if some rows updated, others missed

**Solution - Split into Two Tables:**

**Order_Items Table:**
| OrderID | ProductID | Quantity | UnitPrice |
|---------|-----------|----------|-----------|
| 1 | 101 | 1 | 999 |
| 1 | 102 | 2 | 29 |
| 2 | 101 | 1 | 999 |

**Products Table:**
| ProductID | ProductName | ProductCategory |
|-----------|-------------|-----------------|
| 101 | Laptop | Electronics |
| 102 | Mouse | Electronics |

Now ProductName is in ONE place - update it once, reflected everywhere!

**Key Insight:** 2NF only applies to tables with **composite** primary keys. If your table has a single-column primary key, it automatically satisfies 2NF (assuming it's already in 1NF).`,
          },
          {
            id: 'dm-norm-4',
            title: 'Third Normal Form (3NF)',
            type: 'text',
            content: `**Third Normal Form (3NF)** eliminates transitive dependencies - when a non-key column depends on another non-key column.

**Requirements for 3NF:**
1. Must be in 2NF ✅
2. No transitive dependencies - non-key columns depend **only** on the primary key

**What is a Transitive Dependency?**
When A → B → C (A determines B, and B determines C)
The dependency A → C is "transitive" through B.

**Example - Employee Table (Violates 3NF):**

| EmployeeID | Name | DepartmentID | DepartmentName | DepartmentManager |
|------------|------|--------------|----------------|-------------------|
| 1 | Alice | 10 | Engineering | Bob |
| 2 | Carol | 10 | Engineering | Bob |
| 3 | Dave | 20 | Marketing | Eve |

Primary Key: EmployeeID

**Dependency Analysis:**
- Name → depends on EmployeeID ✅
- DepartmentID → depends on EmployeeID ✅
- DepartmentName → depends on DepartmentID ❌ **Transitive!**
- DepartmentManager → depends on DepartmentID ❌ **Transitive!**

**The Chain:** EmployeeID → DepartmentID → DepartmentName

**Problems:**
- DepartmentName repeated for every employee in that department
- If department renamed, must update many employee rows
- If manager changes, must update many rows

**Solution - Split Tables:**

**Employees Table:**
| EmployeeID | Name | DepartmentID |
|------------|------|--------------|
| 1 | Alice | 10 |
| 2 | Carol | 10 |
| 3 | Dave | 20 |

**Departments Table:**
| DepartmentID | DepartmentName | DepartmentManager |
|--------------|----------------|-------------------|
| 10 | Engineering | Bob |
| 20 | Marketing | Eve |

**The Memory Trick:**
"The key, the whole key, and nothing but the key, so help me Codd!"

- **The key**: Each column depends on a key (1NF)
- **The whole key**: Depends on entire key, not partial (2NF)
- **Nothing but the key**: No transitive dependencies (3NF)

(Edgar Codd invented the relational database model!)

**Interview Tip:** 3NF is the standard for most OLTP databases. When someone says "normalize your data," they usually mean "at least to 3NF."`,
          },
          {
            id: 'dm-norm-5',
            title: 'Normalization Example',
            type: 'code',
            content: 'Let\'s normalize a complete e-commerce order system from scratch:',
            codeExample: {
              language: 'sql',
              description: 'From Unnormalized to 3NF',
              code: `-- ====================================================
-- UNNORMALIZED TABLE (The "Before" - Don't do this!)
-- ====================================================
-- All data crammed into one messy table
CREATE TABLE orders_unnormalized (
    order_id INT,
    order_date DATE,
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_city VARCHAR(50),
    customer_state VARCHAR(50),
    product1_name VARCHAR(100),
    product1_category VARCHAR(50),
    product1_price DECIMAL(10,2),
    product1_qty INT,
    product2_name VARCHAR(100),     -- Repeating group!
    product2_category VARCHAR(50),
    product2_price DECIMAL(10,2),
    product2_qty INT
    -- What if order has 10 products? 100 columns?!
);

-- ====================================================
-- STEP 1: First Normal Form (1NF)
-- ====================================================
-- Remove repeating groups, ensure atomic values
CREATE TABLE orders_1nf (
    order_id INT,
    order_date DATE,
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_city VARCHAR(50),
    customer_state VARCHAR(50),
    product_name VARCHAR(100),
    product_category VARCHAR(50),
    product_price DECIMAL(10,2),
    product_qty INT,
    PRIMARY KEY (order_id, product_name) -- Composite key
);
-- Better! But still lots of redundancy...

-- ====================================================
-- STEP 2: Second Normal Form (2NF)
-- ====================================================
-- Remove partial dependencies (non-key depends on part of key)
-- Product info depends only on product, not order+product

CREATE TABLE orders_2nf (
    order_id INT PRIMARY KEY,
    order_date DATE NOT NULL,
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_city VARCHAR(50),
    customer_state VARCHAR(50)
);

CREATE TABLE products_2nf (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_category VARCHAR(50),
    product_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE order_items_2nf (
    order_id INT REFERENCES orders_2nf(order_id),
    product_id INT REFERENCES products_2nf(product_id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL, -- Price at time of order
    PRIMARY KEY (order_id, product_id)
);

-- ====================================================
-- STEP 3: Third Normal Form (3NF)
-- ====================================================
-- Remove transitive dependencies
-- customer_city depends on customer, not order
-- customer_state depends on city (or zip), not customer directly

-- Final normalized schema:

-- Customers table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(50),
    state VARCHAR(50)
);

-- Products table (with category normalized out)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT REFERENCES categories(category_id),
    price DECIMAL(10,2) NOT NULL
);

-- Orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(customer_id),
    order_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Order Items (junction table)
CREATE TABLE order_items (
    order_id INT REFERENCES orders(order_id),
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL, -- Snapshot of price
    PRIMARY KEY (order_id, product_id)
);

-- ====================================================
-- BENEFITS OF 3NF:
-- ====================================================
-- 1. Update customer email in ONE place
-- 2. Change product price in ONE place
-- 3. Rename category in ONE place
-- 4. Add customers without orders (no insert anomaly)
-- 5. Delete orders without losing customers (no delete anomaly)
-- 6. Consistent data guaranteed by constraints`,
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
        estimatedTime: 25,
        xpReward: 125,
        prerequisites: ['dm-normalization'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-denorm-1',
            title: 'Why Denormalize?',
            type: 'text',
            content: `While normalization is excellent for OLTP systems, analytical workloads often benefit from **denormalization** - the intentional introduction of redundancy.

**The Problem with Normalized Data for Analytics:**

To get a simple sales report from our perfectly normalized 3NF schema, you might need:

SELECT 
    c.name as customer,
    cat.category_name,
    p.name as product,
    oi.quantity,
    oi.unit_price
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN categories cat ON p.category_id = cat.category_id
WHERE o.order_date >= '2024-01-01';

That's **5 JOINs** for one report! 😰

**Performance Impact:**
- Each JOIN requires comparing rows across tables
- More JOINs = exponentially more comparisons
- Complex queries can take minutes instead of seconds
- BI tools struggle with many-table joins

**Benefits of Denormalization:**

1. **Faster Queries**: Fewer JOINs = faster execution
2. **Simpler SQL**: Analysts can write easier queries
3. **Better BI Tools**: Work better with flat, wide tables
4. **Aggregation Performance**: Pre-computed values available
5. **Reduced I/O**: One table read vs multiple

**When to Denormalize:**

✅ Data warehouses and analytical databases
✅ Read-heavy workloads (100:1 read:write ratio)
✅ Reporting and dashboards
✅ Historical data that doesn't change
✅ When query performance is critical

**When NOT to Denormalize:**

❌ Transactional systems (OLTP)
❌ Data that changes frequently
❌ When data integrity is paramount
❌ When storage costs are a major concern
❌ Real-time applications with frequent updates`,
          },
          {
            id: 'dm-denorm-2',
            title: 'Denormalization Techniques',
            type: 'text',
            content: `**Common Denormalization Strategies:**

**1. Adding Redundant Columns** 📊
Instead of joining to get customer_name, store it directly in the fact table.

Before: fact_sales.customer_key → dim_customer.customer_name
After: fact_sales.customer_name (redundant copy)

**2. Pre-Computed Aggregates** 📈
Store calculated values instead of computing every time.

Before: SUM(line_items.amount) per order
After: orders.total_amount (pre-calculated)

**3. Flattening Hierarchies** 📁
Store all levels instead of recursive joins.

Before: product → subcategory → category → department
After: product_name, subcategory_name, category_name, department_name (all in one row)

**4. Combining Tables** 🔗
Merge frequently-joined tables into one.

Before: orders + order_details (two tables)
After: order_facts (single denormalized table)

**5. Adding Derived Columns** 🧮
Store calculated fields that are expensive to compute.

- age (from birth_date)
- day_of_week (from date)
- customer_tier (from purchase_history)
- profit_margin (from price - cost)

**Trade-offs to Consider:**

| Aspect | Normalized | Denormalized |
|--------|------------|--------------|
| Storage | Less | More |
| Query Speed | Slower | Faster |
| Data Updates | Easier (one place) | Harder (multiple places) |
| Data Integrity | Higher | Lower (requires processes) |
| Schema Complexity | Complex (many tables) | Simple (few tables) |
| ETL Complexity | Simple loads | Complex transforms |

**The Key Insight:**
In data warehouses, we denormalize during the ETL process, transforming normalized OLTP data into denormalized OLAP structures. The trade-off is acceptable because:
1. Data is loaded in batches (not real-time)
2. Updates are rare (historical data)
3. Read performance is critical`,
          },
          {
            id: 'dm-denorm-3',
            title: 'Denormalization Example',
            type: 'code',
            content: 'Creating a denormalized analytics table:',
            codeExample: {
              language: 'sql',
              description: 'Building a Denormalized Fact Table',
              code: `-- ====================================================
-- NORMALIZED SOURCE TABLES (OLTP)
-- ====================================================
-- These exist in your production database

-- SELECT from normalized = many JOINs needed
SELECT 
    o.order_id,
    o.order_date,
    c.customer_id,
    c.name as customer_name,
    c.city as customer_city,
    c.state as customer_state,
    p.product_id,
    p.name as product_name,
    cat.category_name,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) as line_total
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN categories cat ON p.category_id = cat.category_id;
-- 4 JOINs for basic order data!

-- ====================================================
-- DENORMALIZED ANALYTICS TABLE (OLAP)
-- ====================================================
-- Create a single, flat table for analytics

CREATE TABLE sales_analytics (
    -- Keys
    sale_id BIGSERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    
    -- Date attributes (denormalized from date dimension)
    order_date DATE NOT NULL,
    order_year INT NOT NULL,
    order_quarter INT NOT NULL,
    order_month INT NOT NULL,
    order_month_name VARCHAR(20),
    order_day_of_week VARCHAR(20),
    is_weekend BOOLEAN,
    
    -- Customer attributes (denormalized)
    customer_id INT NOT NULL,
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    customer_city VARCHAR(50),
    customer_state VARCHAR(50),
    customer_segment VARCHAR(30),  -- Gold, Silver, Bronze
    customer_lifetime_value DECIMAL(12,2),
    
    -- Product attributes (denormalized)
    product_id INT NOT NULL,
    product_name VARCHAR(100),
    product_category VARCHAR(50),
    product_subcategory VARCHAR(50),
    product_brand VARCHAR(50),
    
    -- Measures
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Pre-computed metrics
    line_total DECIMAL(12,2) NOT NULL,
    line_cost DECIMAL(12,2),
    line_profit DECIMAL(12,2),
    profit_margin DECIMAL(5,2),
    
    -- Metadata
    loaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_system VARCHAR(50)
);

-- Create indexes for common query patterns
CREATE INDEX idx_sales_date ON sales_analytics(order_date);
CREATE INDEX idx_sales_customer ON sales_analytics(customer_id);
CREATE INDEX idx_sales_product ON sales_analytics(product_id);
CREATE INDEX idx_sales_category ON sales_analytics(product_category);

-- ====================================================
-- NOW ANALYTICS ARE SIMPLE!
-- ====================================================

-- Sales by category - NO JOINS!
SELECT 
    product_category,
    order_year,
    order_quarter,
    COUNT(*) as num_orders,
    SUM(quantity) as total_units,
    SUM(line_total) as total_revenue,
    SUM(line_profit) as total_profit,
    AVG(profit_margin) as avg_margin
FROM sales_analytics
WHERE order_year = 2024
GROUP BY product_category, order_year, order_quarter
ORDER BY total_revenue DESC;

-- Customer segmentation - NO JOINS!
SELECT 
    customer_segment,
    customer_state,
    COUNT(DISTINCT customer_id) as customers,
    SUM(line_total) as total_spend,
    AVG(line_total) as avg_order_value
FROM sales_analytics
WHERE order_date >= '2024-01-01'
GROUP BY customer_segment, customer_state;

-- Much simpler and 10-100x faster than joining normalized tables!`,
              runnable: false,
            },
          },
        ],
      },
      {
        id: 'dm-star-schema',
        title: 'Star Schema Design',
        description: 'The most popular dimensional modeling pattern for data warehouses.',
        category: 'data-modeling',
        difficulty: 'beginner',
        estimatedTime: 35,
        xpReward: 200,
        prerequisites: ['dm-denormalization'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-star-1',
            title: 'Introduction to Star Schema',
            type: 'text',
            content: `**Star Schema** is the most widely used dimensional modeling pattern for data warehouses. Created by Ralph Kimball, it's called "star" because when visualized, it looks like a star!

**Structure:**
- **Center**: One FACT table (the star's body) 
- **Points**: Multiple DIMENSION tables (the star's points)

**Visual Representation:**

                    dim_date
                       |
    dim_product ---- FACT_SALES ---- dim_customer
                       |
                    dim_store

**Fact Table** (Center) 📊

The fact table is the heart of the star schema:
- Contains **quantitative data** (measures) that can be analyzed
- Examples: sales_amount, quantity, revenue, cost, profit
- References dimension tables via **foreign keys**
- Usually **very large** (millions to billions of rows)
- **Narrow** (relatively few columns - mostly keys and measures)
- Rows represent **business events** or transactions

**Dimension Tables** (Points) 📦

Dimension tables provide context to facts:
- Contains **descriptive attributes** (textual/categorical)
- Examples: customer_name, product_category, date, store_location
- Provides the "**who, what, when, where, why**" of your data
- Usually **smaller** (thousands to millions of rows)
- **Wide** (many descriptive columns)
- Rows represent **business entities**

**Why Star Schema is So Popular:**

✅ Simple to understand - business users can navigate it
✅ Excellent query performance - minimal JOINs
✅ Works great with BI tools - Tableau, Power BI, Looker love it
✅ Easy to navigate - predictable structure
✅ Flexible - can answer many different questions
✅ Industry standard - everyone knows it

**Interview Tip:** Be able to draw a star schema on a whiteboard and explain each component. This is a very common interview question!`,
          },
          {
            id: 'dm-star-2',
            title: 'Fact Tables Deep Dive',
            type: 'text',
            content: `**Types of Fact Tables:**

Understanding the different types of fact tables is crucial for proper dimensional modeling.

**1. Transaction Facts** 💰
- One row per **event/transaction**
- Most detailed grain (atomic level)
- Example: Each individual sale, click, or transfer

| sale_id | date_key | product_key | customer_key | quantity | amount |
|---------|----------|-------------|--------------|----------|--------|
| 1001 | 20240115 | 5001 | 3001 | 2 | 49.98 |
| 1002 | 20240115 | 5002 | 3001 | 1 | 29.99 |

**Use when:** You need maximum detail and flexibility

**2. Periodic Snapshot Facts** 📸
- One row per **time period per entity**
- Captures state at regular intervals
- Example: Daily inventory, monthly balances, weekly pipeline

| date_key | product_key | store_key | qty_on_hand | qty_sold_wtd |
|----------|-------------|-----------|-------------|--------------|
| 20240115 | 5001 | 7001 | 150 | 23 |
| 20240116 | 5001 | 7001 | 142 | 31 |

**Use when:** Tracking state over time, cumulative metrics

**3. Accumulating Snapshot Facts** 🔄
- One row per **entity lifecycle**
- Row is updated as process progresses through milestones
- Example: Order fulfillment, claim processing, hiring pipeline

| order_key | order_date | ship_date | deliver_date | paid_date |
|-----------|------------|-----------|--------------|-----------|
| 9001 | 2024-01-10 | 2024-01-12 | 2024-01-15 | NULL |
| 9002 | 2024-01-11 | 2024-01-13 | NULL | NULL |

**Use when:** Tracking process workflows with multiple stages

**4. Factless Facts** 🔗
- Contains **no measures**, only keys
- Tracks events or coverage/eligibility
- Example: Student attendance, promotion eligibility, coverage

| date_key | student_key | class_key | (no measures) |

**Use when:** Recording that something happened (or didn't)

**Measure Types (Additivity):**

**Additive Measures** ➕
- Can sum across **all** dimensions
- Examples: revenue, quantity, cost
- Most common and useful type

**Semi-Additive Measures** ➕➖
- Can sum across **some** dimensions, not all
- Example: Account balance - can sum across accounts, NOT across time
- Typically use AVG or LAST across time

**Non-Additive Measures** 🚫
- Cannot be summed meaningfully
- Examples: ratios, percentages, unit prices
- Must aggregate underlying values first, then calculate`,
          },
          {
            id: 'dm-star-3',
            title: 'Dimension Tables Deep Dive',
            type: 'text',
            content: `**Anatomy of a Well-Designed Dimension Table:**

**Essential Components:**

**1. Surrogate Key** (Primary Key) 🔢
- System-generated integer
- Never changes, never reused
- Example: customer_key (1, 2, 3...)
- NOT the business key!

**2. Natural Key** (Business Key) 🏢
- Identifier from source system
- May change or be recycled
- Example: customer_id ('CUST001')
- Keep for lookups and auditing

**3. Descriptive Attributes** 📝
- The "meat" of the dimension
- Used in WHERE, GROUP BY, labels
- Example: customer_name, city, segment

**Common Dimension Tables:**

**Date Dimension** 📅 (Required in EVERY data warehouse)

Essential attributes:
- date_key (YYYYMMDD format - 20240115)
- full_date (2024-01-15)
- day_name (Monday, Tuesday...)
- day_of_week (1-7)
- day_of_month (1-31)
- week_of_year (1-52)
- month_num, month_name
- quarter (1-4)
- year
- is_weekend, is_holiday
- fiscal_year, fiscal_quarter

💡 **Pro Tip:** Pre-populate your date dimension for 20+ years. It's small and prevents issues.

**Customer Dimension** 👤

Essential attributes:
- customer_key, customer_id
- first_name, last_name, full_name
- email, phone
- address, city, state, country, postal_code
- customer_segment (Gold, Silver, Bronze)
- acquisition_source (Organic, Paid, Referral)
- acquisition_date
- SCD columns (effective_date, expiration_date, is_current)

**Product Dimension** 📦

Essential attributes:
- product_key, sku, product_id
- product_name, description
- brand
- category, subcategory (hierarchy)
- unit_cost, unit_price
- weight, dimensions
- is_active
- introduction_date, discontinue_date

**Best Practices for Dimensions:**

✅ Make dimensions **wide** - add many useful attributes
✅ Include **hierarchies** (Category → Subcategory → Product)
✅ Add **derived attributes** (age_group, price_tier, customer_tenure)
✅ Use **consistent naming** (customer_key, product_key)
✅ Include **descriptive text** for reporting labels
✅ Support **SCD Type 2** for historical tracking`,
          },
          {
            id: 'dm-star-4',
            title: 'Complete Star Schema Example',
            type: 'code',
            content: 'Building a production-ready star schema for e-commerce analytics:',
            codeExample: {
              language: 'sql',
              description: 'E-Commerce Star Schema',
              code: `-- ====================================================
-- DIMENSION: Date (Critical for ANY data warehouse)
-- ====================================================
CREATE TABLE dim_date (
    date_key INT PRIMARY KEY,          -- YYYYMMDD format
    full_date DATE NOT NULL UNIQUE,
    
    -- Day attributes
    day_name VARCHAR(10) NOT NULL,     -- Monday, Tuesday...
    day_of_week INT NOT NULL,          -- 1-7 (Mon=1)
    day_of_month INT NOT NULL,         -- 1-31
    day_of_year INT NOT NULL,          -- 1-366
    is_weekend BOOLEAN NOT NULL,
    is_holiday BOOLEAN DEFAULT FALSE,
    
    -- Week attributes
    week_of_year INT NOT NULL,
    week_start_date DATE,
    
    -- Month attributes
    month_num INT NOT NULL,
    month_name VARCHAR(10) NOT NULL,
    month_short VARCHAR(3) NOT NULL,   -- Jan, Feb...
    
    -- Quarter/Year
    quarter INT NOT NULL,
    quarter_name VARCHAR(2) NOT NULL,  -- Q1, Q2...
    year INT NOT NULL,
    year_month VARCHAR(7) NOT NULL,    -- 2024-01
    
    -- Fiscal calendar (adjust to your company)
    fiscal_year INT,
    fiscal_quarter INT
);

-- ====================================================
-- DIMENSION: Customer
-- ====================================================
CREATE TABLE dim_customer (
    customer_key SERIAL PRIMARY KEY,
    
    -- Business identifier
    customer_id VARCHAR(20) NOT NULL,
    
    -- Demographics
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    full_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    
    -- Location (flattened hierarchy)
    address_line1 VARCHAR(200),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'USA',
    postal_code VARCHAR(20),
    
    -- Business attributes
    customer_segment VARCHAR(30),       -- Gold, Silver, Bronze
    acquisition_source VARCHAR(50),     -- Organic, Paid, Referral
    acquisition_date DATE,
    lifetime_value DECIMAL(12,2),
    
    -- SCD Type 2 columns
    effective_date DATE NOT NULL,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1
);

-- ====================================================
-- DIMENSION: Product
-- ====================================================
CREATE TABLE dim_product (
    product_key SERIAL PRIMARY KEY,
    
    -- Business identifiers
    product_id VARCHAR(20) NOT NULL,
    sku VARCHAR(50),
    
    -- Product info
    product_name VARCHAR(200) NOT NULL,
    product_description TEXT,
    
    -- Hierarchy (flattened)
    brand VARCHAR(100),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    department VARCHAR(100),
    
    -- Pricing
    unit_cost DECIMAL(10,2),
    unit_price DECIMAL(10,2),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    introduction_date DATE,
    discontinue_date DATE
);

-- ====================================================
-- DIMENSION: Store/Location
-- ====================================================
CREATE TABLE dim_store (
    store_key SERIAL PRIMARY KEY,
    store_id VARCHAR(20) NOT NULL,
    store_name VARCHAR(100),
    store_type VARCHAR(50),            -- Retail, Outlet, Flagship
    
    -- Location
    address VARCHAR(200),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(20),
    region VARCHAR(50),
    
    -- Operations
    open_date DATE,
    close_date DATE,
    square_footage INT,
    is_active BOOLEAN DEFAULT TRUE
);

-- ====================================================
-- FACT: Sales (The center of our star)
-- ====================================================
CREATE TABLE fact_sales (
    sale_key BIGSERIAL PRIMARY KEY,
    
    -- Foreign keys to dimensions
    date_key INT NOT NULL REFERENCES dim_date(date_key),
    customer_key INT REFERENCES dim_customer(customer_key),
    product_key INT NOT NULL REFERENCES dim_product(product_key),
    store_key INT REFERENCES dim_store(store_key),
    
    -- Degenerate dimension (no separate table needed)
    order_number VARCHAR(20),
    line_number INT,
    
    -- Measures (all additive)
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2),
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Pre-calculated measures
    gross_sales DECIMAL(12,2) NOT NULL,
    net_sales DECIMAL(12,2) NOT NULL,
    cost_amount DECIMAL(12,2),
    profit_amount DECIMAL(12,2)
);

-- Performance indexes
CREATE INDEX idx_fact_sales_date ON fact_sales(date_key);
CREATE INDEX idx_fact_sales_customer ON fact_sales(customer_key);
CREATE INDEX idx_fact_sales_product ON fact_sales(product_key);
CREATE INDEX idx_fact_sales_store ON fact_sales(store_key);

-- ====================================================
-- SAMPLE ANALYTICAL QUERY
-- ====================================================
SELECT 
    d.year,
    d.quarter_name,
    c.customer_segment,
    p.category,
    p.brand,
    s.region,
    
    -- Aggregations
    COUNT(DISTINCT f.order_number) as num_orders,
    COUNT(DISTINCT f.customer_key) as unique_customers,
    SUM(f.quantity) as total_units,
    SUM(f.gross_sales) as gross_revenue,
    SUM(f.discount_amount) as total_discounts,
    SUM(f.net_sales) as net_revenue,
    SUM(f.profit_amount) as total_profit,
    
    -- Calculated metrics
    ROUND(SUM(f.profit_amount) / NULLIF(SUM(f.net_sales), 0) * 100, 2) as profit_margin_pct
    
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_customer c ON f.customer_key = c.customer_key
JOIN dim_product p ON f.product_key = p.product_key
JOIN dim_store s ON f.store_key = s.store_key

WHERE d.year = 2024
  AND c.is_current = TRUE
  
GROUP BY d.year, d.quarter_name, c.customer_segment, 
         p.category, p.brand, s.region
ORDER BY net_revenue DESC;`,
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
            content: `**Snowflake Schema** normalizes dimension tables into multiple related tables, creating a snowflake-like shape when visualized.

**Visual Comparison:**

**Star Schema:**

              dim_product
                   |
    dim_date ---- FACT ---- dim_customer
                   |
              dim_store

**Snowflake Schema:**

    dim_brand -- dim_category
             \\     /
           dim_product
                |
    dim_date -- FACT -- dim_customer -- dim_geography
                |
           dim_store -- dim_region -- dim_country

**What Gets Normalized:**

In snowflake, dimension hierarchies are split into separate tables:

**Star (denormalized):**
dim_product contains: product_name, category, subcategory, brand

**Snowflake (normalized):**
- dim_product: product_name, category_key, brand_key
- dim_category: category_key, category_name, subcategory
- dim_brand: brand_key, brand_name

**Trade-offs:**

| Aspect | Star | Snowflake |
|--------|------|-----------|
| Query Complexity | Simple (few JOINs) | Complex (more JOINs) |
| Query Performance | Faster | Slower |
| Storage | More (redundant) | Less (normalized) |
| ETL Complexity | Simpler | More complex |
| Dimension Updates | May need many updates | Single place |
| BI Tool Support | Excellent | Good |
| User-Friendly | Very | Moderate |

**When to Use Snowflake Schema:**

✅ Storage costs are significant (very large dimensions)
✅ Dimension hierarchies change frequently
✅ Data governance requires single source of truth
✅ Power users who understand complex models
✅ When you need drill-through capabilities

**When to Stick with Star Schema:**

✅ Query performance is top priority
✅ Self-service BI for business users
✅ Standard reporting use cases
✅ Simpler maintenance preferred
✅ **When in doubt, start with star!**`,
          },
          {
            id: 'dm-snow-2',
            title: 'Hybrid Approach',
            type: 'text',
            content: `**Hybrid Approach (Most Common in Practice):**

In real-world data warehouses, pure star or pure snowflake schemas are rare. Most implementations use a **hybrid** approach:

**Strategy:**
- Use **star schema** for most dimensions
- Use **snowflake** only for very large or complex hierarchies

**Example Hybrid Design:**

**Keep Denormalized (Star):**
- dim_date - Relatively small, queried constantly
- dim_customer - Manageable size, need quick access
- dim_store - Small number of locations

**Normalize (Snowflake):**
- dim_product → dim_category → dim_department
  - Millions of products
  - Category hierarchy changes during reorgs
  - Need to report at multiple levels

**Real-World Considerations:**

**1. Product Dimensions Often Snowflake**
- Retail: 100K+ products, complex hierarchies
- Categories restructured seasonally
- New brands acquired frequently

**2. Geographic Dimensions Often Snowflake**
- Country → Region → State → City
- International operations
- Regulatory requirements vary by geography

**3. Time Dimensions Stay Star**
- Fixed structure (always 12 months, 4 quarters)
- Small size (20 years = 7,300 rows)
- Queried on every report

**4. Customer Dimensions: Depends**
- B2C: Often star (simple attributes)
- B2B: Often snowflake (company → division → department)

**Interview Answer:**
"I typically start with a star schema for simplicity and performance, then selectively normalize dimensions that are very large or have frequently changing hierarchies. The key is balancing query performance against storage costs and maintenance complexity."`,
          },
        ],
      },
      {
        id: 'dm-keys',
        title: 'Keys in Data Warehousing',
        description: 'Master surrogate, natural, and business keys.',
        category: 'data-modeling',
        difficulty: 'beginner',
        estimatedTime: 25,
        xpReward: 150,
        prerequisites: ['dm-star-schema'],
        completed: false,
        progress: 0,
        sections: [
          {
            id: 'dm-keys-1',
            title: 'Types of Keys',
            type: 'text',
            content: `**Understanding Different Key Types:**

Keys are fundamental to data modeling. Using the right key strategy is critical for data warehouse success.

**1. Natural Key (Business Key)** 🏢

A meaningful identifier that comes from the business domain.

**Examples:**
- Social Security Number
- Email address
- Product SKU
- Employee ID (from HR system)
- Invoice number

**Pros:**
- Business meaning - users understand it
- No lookup needed to understand data
- Exists in source systems

**Cons:**
- Can change (email updates, company rebranding)
- May be recycled (employee ID reused)
- Can be composite (harder to JOIN)
- May contain sensitive data (SSN)

**2. Surrogate Key** 🔢

A system-generated, meaningless identifier created by the data warehouse.

**Examples:**
- customer_key: 1, 2, 3, 4...
- product_key: 10001, 10002...
- Auto-incrementing integers or UUIDs

**Pros:**
- Immutable - never changes
- Simple - single integer column
- Efficient JOINs - integer comparison fast
- Supports SCD Type 2 (multiple versions)
- No sensitive data exposure

**Cons:**
- No business meaning
- Requires lookup to find natural key
- Additional column in every table

**3. Primary Key** 🔑

Uniquely identifies each row in a table. Can be either natural or surrogate.

**4. Foreign Key** 🔗

References the primary key of another table. Creates relationships.

**5. Composite Key** 🧩

Multiple columns together form a unique identifier.

Example: (order_id, product_id) in order_items table

**Data Warehouse Best Practice:**

| Table Type | Key Strategy |
|------------|--------------|
| Fact Tables | Surrogate key (optional), plus FKs to dimensions |
| Dimension Tables | Surrogate key (PK) + Natural key (for lookups) |
| Staging Tables | Natural keys from source |`,
          },
          {
            id: 'dm-keys-2',
            title: 'Why Surrogate Keys Matter',
            type: 'text',
            content: `**The Case for Surrogate Keys in Data Warehouses:**

**Problem Scenario 1: Email as Key**

Using customer email as primary key...

Day 1: john@oldcompany.com places orders
Day 30: John changes to john@newcompany.com

**Without surrogate key:**
- Old orders linked to john@oldcompany.com
- New orders linked to john@newcompany.com
- System thinks these are two different customers!
- Customer history is broken

**With surrogate key:**
- customer_key = 5001 (never changes)
- Email is just an attribute (can change)
- All orders link to customer_key = 5001
- Complete customer history preserved

**Problem Scenario 2: Product SKU Reuse**

Company discontinues SKU 'ABC123' for a laptop
Later, 'ABC123' is reused for headphones

**Without surrogate key:**
- Historical laptop sales mixed with new headphone sales
- Analytics completely wrong
- No way to distinguish products

**With surrogate key:**
- product_key = 2001 (laptop, discontinued)
- product_key = 5555 (headphones, same SKU)
- Historical accuracy maintained

**Problem Scenario 3: Source System Changes**

Company acquires another company with overlapping customer IDs

**Without surrogate key:**
- Customer ID 1000 from System A
- Customer ID 1000 from System B
- Collision! Which one is which?

**With surrogate key:**
- Generate new surrogate keys for all records
- Keep source_system + source_id for traceability
- No collisions possible

**The Golden Rule:**
Always use surrogate keys for dimension tables, but keep natural keys for lookups and auditing.`,
          },
          {
            id: 'dm-keys-3',
            title: 'Key Implementation',
            type: 'code',
            content: 'Implementing proper key strategy:',
            codeExample: {
              language: 'sql',
              description: 'Surrogate Key Implementation',
              code: `-- ====================================================
-- DIMENSION TABLE WITH PROPER KEY STRATEGY
-- ====================================================

CREATE TABLE dim_customer (
    -- Surrogate key (Primary Key)
    -- System-generated, never changes, never reused
    customer_key SERIAL PRIMARY KEY,
    
    -- Natural/Business key (for lookups from source)
    -- What the source system calls this customer
    customer_id VARCHAR(20) NOT NULL,
    source_system VARCHAR(50) NOT NULL,  -- Handle multiple sources
    
    -- Attributes (can all change without breaking history)
    email VARCHAR(100),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    city VARCHAR(50),
    state VARCHAR(50),
    
    -- SCD Type 2 columns (surrogate key enables this!)
    effective_date DATE NOT NULL,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    
    -- Unique constraint: one current record per business key
    CONSTRAINT uq_customer_current 
        UNIQUE (customer_id, source_system, is_current)
);

-- Index for efficient lookups by natural key
CREATE INDEX idx_customer_natural 
ON dim_customer(customer_id, source_system, is_current);

-- ====================================================
-- ETL LOOKUP FUNCTION
-- ====================================================
-- Use this during fact table loading to get surrogate key

CREATE OR REPLACE FUNCTION get_customer_key(
    p_customer_id VARCHAR,
    p_source VARCHAR DEFAULT 'PRIMARY'
)
RETURNS INT AS $$
DECLARE
    v_key INT;
BEGIN
    SELECT customer_key INTO v_key
    FROM dim_customer 
    WHERE customer_id = p_customer_id 
      AND source_system = p_source
      AND is_current = TRUE;
    
    -- Return -1 for unknown (map to "Unknown Customer" row)
    RETURN COALESCE(v_key, -1);
END;
$$ LANGUAGE plpgsql STABLE;

-- ====================================================
-- FACT TABLE: References Surrogate Keys
-- ====================================================

CREATE TABLE fact_sales (
    sale_key BIGSERIAL PRIMARY KEY,
    
    -- Foreign keys are SURROGATE keys, not natural keys!
    date_key INT NOT NULL REFERENCES dim_date(date_key),
    customer_key INT NOT NULL REFERENCES dim_customer(customer_key),
    product_key INT NOT NULL REFERENCES dim_product(product_key),
    
    -- Degenerate dimension (natural key with no dimension)
    order_number VARCHAR(20),  -- Keep for traceability
    
    -- Measures
    quantity INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL
);

-- ====================================================
-- SPECIAL ROW: Handle Unknown/Missing Dimension Values
-- ====================================================

-- Insert "unknown" record with key = -1
INSERT INTO dim_customer (
    customer_key, customer_id, source_system,
    email, first_name, last_name,
    effective_date, is_current
) VALUES (
    -1, 'UNKNOWN', 'SYSTEM',
    'unknown@unknown.com', 'Unknown', 'Customer',
    '1900-01-01', TRUE
);

-- Now facts with missing customers map to key -1
-- Instead of NULL or breaking the load`,
              runnable: false,
            },
          },
        ],
      },
    ],
  },
];

