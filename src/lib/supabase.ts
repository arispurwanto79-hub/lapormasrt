import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type ReportStatus = 'menunggu' | 'diproses' | 'selesai';
export type ReportPriority = 'rendah' | 'sedang' | 'tinggi' | 'urgent';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  created_at: string;
}

export interface Report {
  id: string;
  ticket_number: string;
  name: string;
  phone: string;
  address: string;
  rt: string;
  category_id: string | null;
  title: string;
  description: string;
  photo_url: string | null;
  location: string | null;
  priority: ReportPriority;
  status: ReportStatus;
  officer_note: string | null;
  officer_name: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  category?: Category | null;
}

export interface ActivityLog {
  id: string;
  action: string;
  detail: string | null;
  admin_email: string | null;
  created_at: string;
}
