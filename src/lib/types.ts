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
  photo_path: string | null;
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
  photo_path: string | null;
  created_at: string;
};

export type LenigheidTest = {
  id: string;
  client_id: string;
  log_date: string;
  sit_reach_cm: number | null;
  shoulder_stretch_cm: number | null;
  straight_leg_bend_cm: number | null;
  photo_path: string | null;
  created_at: string;
};

export type MaxAerobeTest = {
  id: string;
  client_id: string;
  log_date: string;
  six_min_loop_m: number | null;
  shuttle_run_m: number | null;
  cooper_test_m: number | null;
  one_mile_time: string | null;
  photo_path: string | null;
  created_at: string;
};

export type SubMaxAerobeTest = {
  id: string;
  client_id: string;
  log_date: string;
  astrand_vo2max_lmin: number | null;
  six_min_walk_m: number | null;
  photo_path: string | null;
  created_at: string;
};

export type AnaerobeTest = {
  id: string;
  client_id: string;
  log_date: string;
  quebec_10s_watt: number | null;
  vertical_jump_cm: number | null;
  wingate_watt: number | null;
  photo_path: string | null;
  created_at: string;
};

export type KrachtTest = {
  id: string;
  client_id: string;
  log_date: string;
  reverse_pushup_cm: number | null;
  grip_strength_kg: number | null;
  pushups_30s: number | null;
  leg_raise_time: string | null;
  wall_sit_sec: number | null;
  standing_long_jump_cm: number | null;
  situps_per_min: number | null;
  plank_time: string | null;
  one_rm_kg: number | null;
  one_rm_estimate_kg: number | null;
  photo_path: string | null;
  created_at: string;
};

export type SnelheidTest = {
  id: string;
  client_id: string;
  log_date: string;
  ten_x_5m_loop_sec: number | null;
  fast_feet_sec: number | null;
  t_test_sec: number | null;
  photo_path: string | null;
  created_at: string;
};

export type CoordinatieTest = {
  id: string;
  client_id: string;
  log_date: string;
  indian_hop_test: number | null;
  hexagon_obstacle_test: number | null;
  photo_path: string | null;
  created_at: string;
};

export type VetpercentageTest = {
  id: string;
  client_id: string;
  log_date: string;
  triceps_skinfold_mm: number | null;
  biceps_skinfold_mm: number | null;
  subscapular_skinfold_mm: number | null;
  suprailiac_skinfold_mm: number | null;
  photo_path: string | null;
  created_at: string;
};
