/*
# LAPOR MAS RT - Database Schema

Sistem Pengaduan, Aspirasi, dan Saran Warga Dusun Gabusan RT 22

## 1. New Tables

- `categories`: Kategori pengaduan (Jalan, Air, Kebersihan, Keamanan, dll)
  - id, name, slug, description, icon, created_at
- `reports`: Laporan/pengaduan warga
  - id, ticket_number, name, phone, address, rt, category_id, title, description, photo_url, location, priority, status, officer_note, officer_name, created_at, updated_at, completed_at
- `activity_log`: Log aktivitas admin
  - id, action, detail, admin_email, created_at

## 2. Security

- RLS enabled on all tables.
- categories: public read (anon + authenticated), admin write via service role.
- reports: public read/insert/update (warga submit dan cek tiket), update via service role for admin.
- activity_log: authenticated only (admin).

## 3. Notes

- Ticket number format: LPR-YYYY-#### generated via DB function.
- Status enum: 'menunggu', 'diproses', 'selesai'.
- Priority enum: 'rendah', 'sedang', 'tinggi', 'urgent'.
- Admin auth via Supabase email/password (separate auth.users).
*/

CREATE TYPE report_status AS ENUM ('menunggu', 'diproses', 'selesai');
CREATE TYPE report_priority AS ENUM ('rendah', 'sedang', 'tinggi', 'urgent');

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text DEFAULT 'Tag',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  rt text NOT NULL DEFAULT '22',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  photo_url text,
  location text,
  priority report_priority NOT NULL DEFAULT 'sedang',
  status report_status NOT NULL DEFAULT 'menunggu',
  officer_note text,
  officer_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  detail text,
  admin_email text,
  created_at timestamptz DEFAULT now()
);

-- Function to generate next ticket number (LPR-YYYY-####)
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS text AS $$
DECLARE
  current_year int := EXTRACT(YEAR FROM now());
  next_seq int;
  ticket text;
BEGIN
  SELECT COALESCE(MAX(seq_num), 0) + 1 INTO next_seq
  FROM (
    SELECT CAST(
      SUBSTRING(ticket_number FROM 'LPR-[0-9]{4}-([0-9]{4})$') AS int
    ) AS seq_num
    FROM reports
    WHERE ticket_number LIKE 'LPR-' || current_year || '-%'
  ) sub;

  ticket := 'LPR-' || current_year || '-' || lpad(next_seq::text, 4, '0');
  RETURN ticket;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at on reports
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  IF NEW.status = 'selesai' AND OLD.status <> 'selesai' THEN
    NEW.completed_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reports_updated_at ON reports;
CREATE TRIGGER reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Categories: public read
DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- Reports: public can read and insert (warga); admin (authenticated) can update/delete
DROP POLICY IF EXISTS "anon_select_reports" ON reports;
CREATE POLICY "anon_select_reports" ON reports FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reports" ON reports;
CREATE POLICY "anon_insert_reports" ON reports FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_reports" ON reports;
CREATE POLICY "auth_update_reports" ON reports FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_reports" ON reports;
CREATE POLICY "auth_delete_reports" ON reports FOR DELETE
  TO authenticated USING (true);

-- Activity log: authenticated only
DROP POLICY IF EXISTS "auth_select_activity" ON activity_log;
CREATE POLICY "auth_select_activity" ON activity_log FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_activity" ON activity_log;
CREATE POLICY "auth_insert_activity" ON activity_log FOR INSERT
  TO authenticated WITH CHECK (true);

-- Seed categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Jalan & Infrastruktur', 'jalan-infrastruktur', 'Kerusakan jalan, trotoar, drainage', 'Construction'),
  ('Air & Sanitasi', 'air-sanitasi', 'Pipa air, saluran, sanitasi', 'Droplets'),
  ('Kebersihan & Sampah', 'kebersihan-sampah', 'Sampah, kebersihan lingkungan', 'Trash2'),
  ('Keamanan & Ketertiban', 'keamanan-ketertiban', 'Keamanan, gangguan ketertiban', 'Shield'),
  ('Penerangan & Listrik', 'penerangan-listrik', 'Lampu jalan, listrik', 'Lightbulb'),
  ('Lain-lain', 'lain-lain', 'Aspirasi, saran, kritik lainnya', 'MessageSquare')
ON CONFLICT (slug) DO NOTHING;

-- Seed sample reports
INSERT INTO reports (ticket_number, name, phone, address, rt, category_id, title, description, priority, status, officer_note, officer_name)
SELECT 'LPR-2026-0001', 'Budi Santoso', '081234567890', 'Jl. Gabusan No. 12', '22',
  c.id, 'Lampu jalan mati', 'Lampu penerangan jalan di depan rumah No. 12 mati sudah 3 hari.',
  'sedang', 'menunggu', null, null
FROM categories c WHERE c.slug = 'penerangan-listrik'
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO reports (ticket_number, name, phone, address, rt, category_id, title, description, priority, status, officer_note, officer_name)
SELECT 'LPR-2026-0002', 'Siti Aminah', '081234567891', 'Jl. Gabusan No. 45', '22',
  c.id, 'Saluran air tersumbat', 'Saluran air depan rumah No. 45 tersumbat causing genangan.',
  'tinggi', 'diproses', 'Sudah dikoordinasikan dengan petugas kebersihan.', 'Pak RT'
FROM categories c WHERE c.slug = 'air-sanitasi'
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO reports (ticket_number, name, phone, address, rt, category_id, title, description, priority, status, officer_note, officer_name)
SELECT 'LPR-2026-0003', 'Ahmad Wijaya', '081234567892', 'Jl. Gabusan No. 78', '22',
  c.id, 'Sampah menumpuk', 'Ada tumpukan sampah di area kosong depan No. 78.',
  'sedang', 'selesai', 'Sudah diangkut oleh petugas kebersihan RT.', 'Pak RT'
FROM categories c WHERE c.slug = 'kebersihan-sampah'
ON CONFLICT (ticket_number) DO NOTHING;
