import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para las tablas
export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  school_name: string | null;
  role: 'admin' | 'teacher';
  created_at: Date | string;
  updated_at: Date | string;
};

export type School = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  created_by: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export type Course = {
  id: string;
  name: string;
  grade_level: string;
  school_id: string | null;
  teacher_id: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export type Student = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date | string;
  grade: string;
  profile_id: string;
  course_id: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export type Assessment = {
  id: string;
  student_id: string;
  assessment_date: Date | string;
  text_title: string;
  reading_time: number;
  words_read: number;
  reading_speed: number;
  ai_insights: any;
  created_at: Date | string;
  updated_at: Date | string;
};
