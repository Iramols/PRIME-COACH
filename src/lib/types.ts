export type Client = {
  id: string;
  coach_id: string;
  name: string;
  age: number | null;
  weight_kg: number | null;
  height_cm: number | null;
  gender: string | null;
  goal: string | null;
  activity_level: string | null;
  updated_at: string;
  created_at: string;
};

export type Note = {
  id: string;
  client_id: string;
  log_date: string;
  nutrition: string | null;
  training: string | null;
  remarks: string | null;
  created_at: string;
};

export type Result = {
  id: string;
  client_id: string;
  log_date: string;
  weight_kg: number | null;
  fat_pct: number | null;
  waist_cm: number | null;
  visceral_fat: number | null;
  muscle_mass_kg: number | null;
  muscle_mass_pct: number | null;
  created_at: string;
};

export type TestResult = {
  id: string;
  client_id: string;
  log_date: string;
  col1: string | null;
  col2: string | null;
  col3: string | null;
  created_at: string;
};
