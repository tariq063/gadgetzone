-- ============================================================
--  Run this SQL in your Supabase project
--  Go to: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id                BIGSERIAL PRIMARY KEY,
  order_id          TEXT UNIQUE NOT NULL,
  customer_name     TEXT NOT NULL,
  customer_phone    TEXT NOT NULL,
  customer_email    TEXT,
  address           TEXT NOT NULL,
  city              TEXT NOT NULL,
  postal_code       TEXT,
  items             JSONB NOT NULL,
  subtotal          NUMERIC(10,2) NOT NULL,
  delivery_charge   NUMERIC(10,2) NOT NULL DEFAULT 80,
  total             NUMERIC(10,2) NOT NULL,
  payment_method    TEXT NOT NULL DEFAULT 'cod',
  payment_status    TEXT NOT NULL DEFAULT 'pending',
  bkash_number      TEXT,
  transaction_id    TEXT,
  status            TEXT NOT NULL DEFAULT 'new',
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Allow public (your website) to INSERT orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert from website"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow read own order by order_id"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Allow update payment status"
  ON orders FOR UPDATE
  USING (true);

-- ============================================================
--  To VIEW your orders in Supabase:
--  Dashboard → Table Editor → orders
--
--  Order statuses:
--    new           → just placed
--    confirmed     → payment verified
--    processing    → being packed
--    shipped       → out for delivery
--    delivered     → delivered
--    cancelled     → cancelled
--
--  Payment statuses:
--    pending               → COD (pay on delivery)
--    awaiting_verification → bKash sent, waiting manual check
--    paid                  → card payment successful
-- ============================================================
