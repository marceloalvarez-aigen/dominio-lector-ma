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
  created_at: string;
  updated_at: string;
};

export type Student = {
  id: string;
  teacher_id: string;
  full_name: string;
  grade: string | null;
  created_at: string;
};

export type ReadingEvaluation = {
  id: string;
  student_id: string;
  teacher_id: string;
  audio_url: string;
  transcript: string | null;
  fluency_score: number | null;
  accuracy_score: number | null;
  created_at: string;
};
