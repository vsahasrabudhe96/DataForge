'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Play,
  Code,
  Database,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { clsx } from 'clsx';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false, loading: () => <div className="h-[400px] bg-[#0d1117] animate-pulse rounded-xl" /> }
);

const sampleQueries = [
  {
    title: 'SCD Type 2 Merge',
    category: 'SCD',
    sql: `-- SCD Type 2: Expire old records and insert new versions
MERGE INTO dim_customer AS target
USING staging_customer AS source
ON target.customer_id = source.customer_id 
   AND target.is_current = TRUE

-- When matched and values changed, expire the old record
WHEN MATCHED AND (
    target.city != source.city OR
    target.state != source.state
) THEN UPDATE SET
    expiration_date = CURRENT_DATE - 1,
    is_current = FALSE

-- New records and changed records get inserted as new versions
WHEN NOT MATCHED THEN INSERT (
    customer_id, first_name, last_name, city, state,
    effective_date, expiration_date, is_current
) VALUES (
    source.customer_id, source.first_name, source.last_name,
    source.city, source.state,
    CURRENT_DATE, '9999-12-31', TRUE
);`,
  },
  {
    title: 'Incremental Load with Watermark',
    category: 'Loading',
    sql: `-- Incremental load using high watermark pattern
DECLARE @last_watermark TIMESTAMP;
DECLARE @current_watermark TIMESTAMP = CURRENT_TIMESTAMP;

-- Get the last successful load timestamp
SELECT @last_watermark = watermark_value::TIMESTAMP
FROM etl.load_watermarks
WHERE table_name = 'fact_orders';

-- Load only records changed since last watermark
INSERT INTO dwh.fact_orders (
    order_id, date_key, customer_key, product_key,
    quantity, amount
)
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
    AND c.is_current = TRUE
JOIN dwh.dim_product p ON o.product_id = p.product_id 
    AND p.is_current = TRUE
WHERE o.updated_at > @last_watermark
  AND o.updated_at <= @current_watermark;

-- Update watermark on success
UPDATE etl.load_watermarks
SET watermark_value = @current_watermark::VARCHAR,
    last_load_timestamp = CURRENT_TIMESTAMP
WHERE table_name = 'fact_orders';`,
  },
  {
    title: 'Fact Table with Keys',
    category: 'Modeling',
    sql: `-- Create a sales fact table with surrogate keys
CREATE TABLE fact_sales (
    -- Surrogate key (optional but recommended)
    sale_sk BIGSERIAL PRIMARY KEY,
    
    -- Foreign keys to dimension tables
    date_key INT NOT NULL REFERENCES dim_date(date_key),
    product_key INT NOT NULL REFERENCES dim_product(product_key),
    customer_key INT NOT NULL REFERENCES dim_customer(customer_key),
    store_key INT NOT NULL REFERENCES dim_store(store_key),
    
    -- Degenerate dimension (no separate table needed)
    order_number VARCHAR(20) NOT NULL,
    
    -- Measures (additive facts)
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    sales_amount DECIMAL(12,2) NOT NULL,
    cost_amount DECIMAL(12,2) NOT NULL,
    
    -- Derived measure
    profit_amount DECIMAL(12,2) GENERATED ALWAYS AS 
        (sales_amount - cost_amount) STORED,
    
    -- Audit column
    etl_load_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common query patterns
CREATE INDEX idx_fact_sales_date ON fact_sales(date_key);
CREATE INDEX idx_fact_sales_product ON fact_sales(product_key);
CREATE INDEX idx_fact_sales_customer ON fact_sales(customer_key);`,
  },
  {
    title: 'Delta Lake Operations',
    category: 'Lakehouse',
    sql: `-- Delta Lake: MERGE with MATCHED/NOT MATCHED
MERGE INTO sales_delta AS target
USING staging_sales AS source
ON target.order_id = source.order_id

WHEN MATCHED AND source.operation = 'D' THEN
    DELETE

WHEN MATCHED THEN
    UPDATE SET 
        target.amount = source.amount,
        target.quantity = source.quantity,
        target.status = source.status,
        target.updated_at = current_timestamp()

WHEN NOT MATCHED THEN
    INSERT (order_id, customer_id, amount, quantity, status, created_at)
    VALUES (source.order_id, source.customer_id, source.amount, 
            source.quantity, source.status, current_timestamp());

-- Time travel: Query previous version
SELECT * FROM sales_delta VERSION AS OF 5;

-- Time travel: Query by timestamp  
SELECT * FROM sales_delta TIMESTAMP AS OF '2024-01-15 10:00:00';

-- Optimize with Z-Ordering for faster queries
OPTIMIZE sales_delta ZORDER BY (customer_id, order_date);`,
  },
  {
    title: 'Data Quality Checks',
    category: 'Quality',
    sql: `-- Comprehensive data quality validation
WITH quality_checks AS (
    -- Completeness: Check for required fields
    SELECT 
        'completeness' AS check_type,
        'email' AS field,
        COUNT(*) AS total_rows,
        SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) AS issues
    FROM dim_customer
    
    UNION ALL
    
    -- Uniqueness: Check for duplicates
    SELECT 
        'uniqueness',
        'customer_id',
        COUNT(*),
        COUNT(*) - COUNT(DISTINCT customer_id)
    FROM dim_customer
    WHERE is_current = TRUE
    
    UNION ALL
    
    -- Validity: Check data ranges
    SELECT 
        'validity',
        'order_amount',
        COUNT(*),
        SUM(CASE WHEN order_amount < 0 THEN 1 ELSE 0 END)
    FROM fact_orders
    
    UNION ALL
    
    -- Referential integrity: Orphan records
    SELECT 
        'referential',
        'customer_key',
        COUNT(*),
        SUM(CASE WHEN c.customer_key IS NULL THEN 1 ELSE 0 END)
    FROM fact_orders f
    LEFT JOIN dim_customer c ON f.customer_key = c.customer_key
)
SELECT 
    check_type,
    field,
    total_rows,
    issues,
    ROUND(100.0 * issues / NULLIF(total_rows, 0), 2) AS issue_pct
FROM quality_checks
WHERE issues > 0;`,
  },
  {
    title: 'Query Performance Analysis',
    category: 'Performance',
    sql: `-- Analyze query execution plan
EXPLAIN ANALYZE
SELECT 
    d.calendar_year,
    d.calendar_month,
    c.customer_segment,
    p.category_name,
    COUNT(DISTINCT f.order_id) AS order_count,
    SUM(f.sales_amount) AS total_sales,
    AVG(f.sales_amount) AS avg_order_value
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_customer c ON f.customer_key = c.customer_key
JOIN dim_product p ON f.product_key = p.product_key
WHERE d.calendar_year = 2024
  AND c.is_current = TRUE
GROUP BY 
    d.calendar_year,
    d.calendar_month,
    c.customer_segment,
    p.category_name
HAVING SUM(f.sales_amount) > 10000
ORDER BY total_sales DESC;

-- Find tables needing indexes (PostgreSQL)
SELECT 
    schemaname,
    relname AS table_name,
    seq_scan,
    idx_scan,
    CASE WHEN seq_scan > 0 
         THEN ROUND(100.0 * idx_scan / (seq_scan + idx_scan), 2)
         ELSE 100 
    END AS idx_usage_pct
FROM pg_stat_user_tables
WHERE seq_scan > 100
ORDER BY seq_scan DESC;`,
  },
];

export default function SandboxPage() {
  const [code, setCode] = useState(sampleQueries[0].sql);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeQuery, setActiveQuery] = useState(0);
  const [showSamples, setShowSamples] = useState(true);

  const handleRun = () => {
    setIsRunning(true);
    // Simulate query execution
    setTimeout(() => {
      setOutput(`-- Query executed successfully at ${new Date().toLocaleTimeString()}
-- Rows affected: 1,234
-- Execution time: 0.042s

-- Note: This is a sandbox environment.
-- In production, this would connect to your actual database.

-- Sample output:
┌─────────────────────────────────────────────────────────────┐
│ Query parsed and validated successfully                     │
│ No syntax errors detected                                   │
│ Estimated cost: 125.5 (based on mock statistics)           │
└─────────────────────────────────────────────────────────────┘`);
      setIsRunning(false);
    }, 500);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = (index: number) => {
    setActiveQuery(index);
    setCode(sampleQueries[index].sql);
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="green" size="md">
              <Code className="w-4 h-4" />
              SQL Sandbox
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Practice SQL Queries
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            Write and test SQL queries in an interactive environment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRun}
            isLoading={isRunning}
            leftIcon={<Play className="w-4 h-4" />}
          >
            Run Query
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sample Queries Sidebar */}
        <div className="lg:col-span-1">
          <Card variant="default" padding="none" className="overflow-hidden">
            <button
              onClick={() => setShowSamples(!showSamples)}
              className="w-full px-4 py-3 flex items-center justify-between bg-[var(--background-tertiary)] border-b border-[var(--card-border)]"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--accent-cyan)]" />
                <span className="font-medium text-[var(--foreground)]">Sample Queries</span>
              </div>
              <ChevronDown className={clsx(
                'w-4 h-4 text-[var(--foreground-muted)] transition-transform',
                showSamples && 'rotate-180'
              )} />
            </button>
            
            {showSamples && (
              <div className="p-2 space-y-1">
                {sampleQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => loadSample(index)}
                    className={clsx(
                      'w-full px-3 py-2 rounded-lg text-left transition-all',
                      activeQuery === index
                        ? 'bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30'
                        : 'hover:bg-[var(--background-tertiary)]'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={clsx(
                        'text-sm font-medium',
                        activeQuery === index 
                          ? 'text-[var(--accent-cyan)]' 
                          : 'text-[var(--foreground)]'
                      )}>
                        {query.title}
                      </span>
                    </div>
                    <Badge variant="default" size="sm">
                      {query.category}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Tips */}
          <Card variant="highlight" padding="md" className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-yellow)]" />
              <span className="text-sm font-medium text-[var(--foreground)]">Pro Tips</span>
            </div>
            <ul className="text-xs text-[var(--foreground-muted)] space-y-1.5">
              <li>• Use EXPLAIN ANALYZE to debug performance</li>
              <li>• Always include date filters for large tables</li>
              <li>• Index columns used in WHERE and JOIN</li>
              <li>• Use CTEs for better readability</li>
            </ul>
          </Card>
        </div>

        {/* Editor and Output */}
        <div className="lg:col-span-3 space-y-4">
          {/* Editor */}
          <Card variant="default" padding="none" className="overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--background-tertiary)] border-b border-[var(--card-border)]">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[var(--accent-cyan)]" />
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Query Editor
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="cyan" size="sm">PostgreSQL</Badge>
              </div>
            </div>
            <MonacoEditor
              height="400px"
              language="sql"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'var(--font-mono), monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 2,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </Card>

          {/* Output */}
          <Card variant="default" padding="none" className="overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--background-tertiary)] border-b border-[var(--card-border)]">
              <span className="text-sm font-medium text-[var(--foreground)]">
                Output
              </span>
              {output && (
                <Badge variant="green" size="sm">
                  <Check className="w-3 h-3" />
                  Success
                </Badge>
              )}
            </div>
            <div className="p-4 min-h-[150px] font-mono text-sm">
              {output ? (
                <pre className="text-[var(--foreground-muted)] whitespace-pre-wrap">
                  {output}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-[100px] text-[var(--foreground-muted)]">
                  <p>Run a query to see results here</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

