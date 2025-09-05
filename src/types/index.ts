export interface User {
  id: string;
  email: string;
  full_name: string;
  disability_type?: string;
  mobility_notes?: string;
  fitness_goals?: string;
  baseline_data?: BaselineData;
  fitness_targets?: FitnessTargets;
  accessibility_preferences?: {
    high_contrast: boolean;
    large_text: boolean;
    voice_enabled: boolean;
  };
  created_at: string;
}

export interface BaselineData {
  height_cm: number;
  weight_kg: number;
  age: number;
  sex: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  resting_heart_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  mobility_level: 'limited' | 'moderate' | 'good' | 'excellent';
  pain_level: number; // 1-10 scale
  energy_level: number; // 1-10 scale
  current_medications?: string;
  medical_conditions?: string;
  previous_injuries?: string;
  activity_limitations?: string;
  created_at: string;
  updated_at: string;
}

export interface FitnessTargets {
  primary_goal: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'fat_loss' | 'mobility_improvement' | 'pain_management' | 'endurance_building' | 'strength_building' | 'general_wellness';
  target_weight_kg?: number;
  target_body_fat_percentage?: number;
  target_muscle_mass_kg?: number;
  mobility_goals?: string;
  timeline_weeks: number;
  weekly_activity_target: number; // sessions per week
  specific_goals?: string;
  created_at: string;
  updated_at: string;
}

export interface PersonalizedPlan {
  id: string;
  user_id: string;
  plan_name: string;
  description: string;
  primary_goal: string;
  timeline_weeks: number;
  weekly_targets: {
    activity_sessions: number;
    total_minutes: number;
    intensity_distribution: {
      low: number;
      moderate: number;
      high: number;
    };
  };
  milestones: PlanMilestone[];
  recommendations: string[];
  created_at: string;
  updated_at: string;
}

export interface PlanMilestone {
  week: number;
  title: string;
  description: string;
  target_metrics: {
    weight_change_kg?: number;
    activity_minutes?: number;
    mobility_improvement?: string;
  };
  completed: boolean;
  completed_at?: string;
}

export interface ProgressEntry {
  id: string;
  user_id: string;
  entry_date: string;
  weight_kg?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  mobility_score?: number; // 1-10 scale
  pain_level?: number; // 1-10 scale
  energy_level?: number; // 1-10 scale
  measurements?: {
    chest_cm?: number;
    waist_cm?: number;
    hips_cm?: number;
    arms_cm?: number;
    thighs_cm?: number;
  };
  notes?: string;
  photos?: string[]; // URLs to progress photos
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  exercise_type: string;
  duration: number;
  intensity: 'low' | 'moderate' | 'high';
  mood: 'great' | 'good' | 'okay' | 'tired' | 'struggling';
  notes?: string;
  created_at: string;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  disability_adaptations: string[];
  duration_minutes: number;
  equipment_needed: string[];
}

export interface Exercise {
  name: string;
  description: string;
  duration_or_reps: string;
  modifications: string[];
  safety_notes: string[];
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_activities: number;
  last_activity_date?: string;
}