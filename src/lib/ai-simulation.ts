import { Activity, Workout } from '../types';
import { BaselineData, FitnessTargets, PersonalizedPlan, PlanMilestone, ProgressEntry } from '../types';

// Simulated AI responses for workout recommendations
export const generateAdaptiveWorkouts = (disabilityType?: string, fitnessGoals?: string): Workout[] => {
  const baseWorkouts: Record<string, Workout[]> = {
    wheelchair: [
      {
        id: '1',
        title: 'Upper Body Power Session',
        description: 'Build strength in shoulders, arms, and core with wheelchair-friendly exercises.',
        difficulty_level: 'intermediate',
        duration_minutes: 30,
        disability_adaptations: ['All exercises designed for seated position', 'Focus on unilateral movements', 'Core stability emphasis'],
        equipment_needed: ['Resistance bands', 'Light dumbbells'],
        exercises: [
          {
            name: 'Seated Shoulder Press',
            description: 'Press resistance band or weights overhead while maintaining proper posture.',
            duration_or_reps: '3 sets of 12 reps',
            modifications: ['Use lighter resistance for beginners', 'Unilateral option available'],
            safety_notes: ['Keep core engaged', 'Don\'t arch back excessively']
          },
          {
            name: 'Wheelchair Boxing',
            description: 'Shadow boxing movements to build cardio and coordination.',
            duration_or_reps: '3 minutes with 30-second breaks',
            modifications: ['Start with 1 minute intervals', 'Add resistance bands for extra challenge'],
            safety_notes: ['Stay hydrated', 'Watch for shoulder fatigue']
          }
        ]
      }
    ],
    mobility_aid: [
      {
        id: '2',
        title: 'Gentle Strength & Balance',
        description: 'Low-impact exercises focusing on stability and functional strength.',
        difficulty_level: 'beginner',
        duration_minutes: 20,
        disability_adaptations: ['Chair support available for all exercises', 'No jumping or high impact', 'Balance assistance'],
        equipment_needed: ['Sturdy chair', 'Light resistance bands'],
        exercises: [
          {
            name: 'Assisted Squats',
            description: 'Squats with chair support for safety and stability.',
            duration_or_reps: '2 sets of 8-10 reps',
            modifications: ['Full chair sitting if needed', 'Hold chair back for support'],
            safety_notes: ['Move slowly', 'Keep feet flat on ground']
          }
        ]
      }
    ],
    chronic_pain: [
      {
        id: '3',
        title: 'Gentle Movement Therapy',
        description: 'Low-intensity exercises designed to manage pain and improve mobility.',
        difficulty_level: 'beginner',
        duration_minutes: 15,
        disability_adaptations: ['All movements optional', 'Pain-responsive modifications', 'Gentle stretching focus'],
        equipment_needed: ['Yoga mat', 'Pillow for support'],
        exercises: [
          {
            name: 'Gentle Neck Rolls',
            description: 'Slow, controlled neck movements to release tension.',
            duration_or_reps: '5 rolls each direction',
            modifications: ['Stop if any pain occurs', 'Smaller range of motion'],
            safety_notes: ['Never force movement', 'Breathe deeply throughout']
          }
        ]
      }
    ]
  };

  return baseWorkouts[disabilityType || 'mobility_aid'] || baseWorkouts.mobility_aid;
};

// Simulated natural language processing for activity logging
export const parseActivityText = (input: string): Partial<Activity> => {
  const text = input.toLowerCase();
  
  // Extract duration
  const durationMatch = text.match(/(\d+)\s*(min|minute|minutes|hour|hours)/);
  let duration = 0;
  if (durationMatch) {
    duration = parseInt(durationMatch[1]);
    if (durationMatch[2].includes('hour')) {
      duration *= 60;
    }
  }

  // Extract exercise type
  let exercise_type = 'general activity';
  if (text.includes('wheelchair') || text.includes('rolling')) exercise_type = 'wheelchair mobility';
  if (text.includes('swim') || text.includes('pool')) exercise_type = 'swimming';
  if (text.includes('physical therapy') || text.includes('pt')) exercise_type = 'physical therapy';
  if (text.includes('stretch') || text.includes('yoga')) exercise_type = 'stretching';
  if (text.includes('walk') || text.includes('walking')) exercise_type = 'walking';
  if (text.includes('cardio') || text.includes('bike') || text.includes('cycling')) exercise_type = 'cardio';
  if (text.includes('strength') || text.includes('weight') || text.includes('resistance')) exercise_type = 'strength training';

  // Extract intensity
  let intensity: 'low' | 'moderate' | 'high' = 'moderate';
  if (text.includes('easy') || text.includes('gentle') || text.includes('light')) intensity = 'low';
  if (text.includes('hard') || text.includes('intense') || text.includes('challenging')) intensity = 'high';

  // Extract mood indicators
  let mood: Activity['mood'] = 'okay';
  if (text.includes('great') || text.includes('amazing') || text.includes('fantastic')) mood = 'great';
  if (text.includes('good') || text.includes('nice') || text.includes('solid')) mood = 'good';
  if (text.includes('tired') || text.includes('exhausted') || text.includes('worn out')) mood = 'tired';
  if (text.includes('struggling') || text.includes('difficult') || text.includes('tough')) mood = 'struggling';

  return {
    exercise_type,
    duration: duration || 15, // Default 15 minutes if not specified
    intensity,
    mood,
    notes: input
  };
};

// Generate motivational messages
export const generateMotivationalMessage = (activities: Activity[], streak: number): string => {
  const messages = [
    `🌟 ${streak} days strong! Your consistency is building real strength and resilience.`,
    `💪 You've logged ${activities.length} activities this week. Every movement counts!`,
    `🎉 Your dedication to your health journey is truly inspiring. Keep moving forward!`,
    `✨ Progress isn't always linear, but you're showing up for yourself. That's what matters.`,
    `🏆 ${streak}-day streak! You're proving that adaptive fitness is powerful fitness.`,
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

// Generate gentle nudges
export const generateGentleNudge = (lastActivityDays: number): string => {
  if (lastActivityDays <= 1) return '';
  
  const nudges = [
    "💙 No pressure, but a gentle movement session might feel good today.",
    "🌱 Small steps lead to big changes. Even 5 minutes counts!",
    "☀️ Your body might be ready for some gentle activity. Listen to what feels right.",
    "🎯 Remember, consistency over intensity. A short session is still a win!",
    "💜 Taking care of yourself includes movement that feels good for you.",
  ];
  
  return nudges[Math.floor(Math.random() * nudges.length)];
};

// Generate personalized fitness plan based on baseline and targets
export const generatePersonalizedPlan = (
  baseline: BaselineData,
  targets: FitnessTargets,
  disabilityType?: string
): PersonalizedPlan => {
  const bmi = baseline.weight_kg / Math.pow(baseline.height_cm / 100, 2);
  const isOverweight = bmi > 25;
  const isUnderweight = bmi < 18.5;

  // Calculate realistic timeline adjustments based on disability
  const timelineMultiplier = disabilityType === 'chronic_pain' ? 1.5 : 
                            disabilityType === 'wheelchair' ? 1.2 : 1.0;
  const adjustedTimeline = Math.ceil(targets.timeline_weeks * timelineMultiplier);

  // Generate plan based on primary goal
  let planName = '';
  let description = '';
  let weeklyTargets = {
    activity_sessions: 3,
    total_minutes: 150,
    intensity_distribution: { low: 60, moderate: 30, high: 10 }
  };
  let recommendations: string[] = [];
  let milestones: PlanMilestone[] = [];

  switch (targets.primary_goal) {
    case 'weight_loss':
      planName = 'Adaptive Weight Loss Journey';
      description = `A ${adjustedTimeline}-week plan designed to help you lose weight safely while accommodating your mobility needs.`;
      weeklyTargets = {
        activity_sessions: Math.min(5, targets.weekly_activity_target),
        total_minutes: 200,
        intensity_distribution: { low: 40, moderate: 50, high: 10 }
      };
      recommendations = [
        'Focus on low-impact cardio exercises adapted to your abilities',
        'Combine movement with gentle strength training',
        'Monitor portion sizes and stay hydrated',
        'Track your mood and energy levels alongside weight',
        'Celebrate non-scale victories like improved mobility'
      ];
      break;

    case 'muscle_gain':
      planName = 'Adaptive Strength Building Program';
      description = `Build lean muscle mass over ${adjustedTimeline} weeks with exercises tailored to your physical capabilities.`;
      weeklyTargets = {
        activity_sessions: 4,
        total_minutes: 180,
        intensity_distribution: { low: 30, moderate: 50, high: 20 }
      };
      recommendations = [
        'Progressive resistance training using adaptive equipment',
        'Focus on compound movements when possible',
        'Ensure adequate protein intake for muscle recovery',
        'Allow proper rest between strength sessions',
        'Track strength improvements alongside muscle measurements'
      ];
      break;

    case 'mobility_improvement':
      planName = 'Enhanced Mobility & Flexibility Plan';
      description = `Improve your range of motion and functional mobility over ${adjustedTimeline} weeks.`;
      weeklyTargets = {
        activity_sessions: 5,
        total_minutes: 175,
        intensity_distribution: { low: 70, moderate: 25, high: 5 }
      };
      recommendations = [
        'Daily gentle stretching and range-of-motion exercises',
        'Focus on functional movements for daily activities',
        'Use heat therapy before exercises when appropriate',
        'Track pain levels and adjust intensity accordingly',
        'Celebrate small improvements in daily tasks'
      ];
      break;

    case 'pain_management':
      planName = 'Gentle Movement for Pain Relief';
      description = `A gentle ${adjustedTimeline}-week approach to managing pain through therapeutic movement.`;
      weeklyTargets = {
        activity_sessions: 4,
        total_minutes: 120,
        intensity_distribution: { low: 80, moderate: 15, high: 5 }
      };
      recommendations = [
        'Start with very gentle movements and progress slowly',
        'Focus on breathing and relaxation techniques',
        'Use warm water exercises when possible',
        'Track pain levels before and after activities',
        'Work with healthcare providers to adjust the plan'
      ];
      break;

    default:
      planName = 'Personalized Wellness Journey';
      description = `A comprehensive ${adjustedTimeline}-week plan for overall health and wellness.`;
      recommendations = [
        'Balance different types of activities throughout the week',
        'Listen to your body and adjust intensity as needed',
        'Focus on consistency over intensity',
        'Track multiple health metrics for a complete picture',
        'Celebrate all forms of progress, big and small'
      ];
  }

  // Generate milestones
  const totalWeeks = adjustedTimeline;
  const milestoneWeeks = [
    Math.floor(totalWeeks * 0.25),
    Math.floor(totalWeeks * 0.5),
    Math.floor(totalWeeks * 0.75),
    totalWeeks
  ];

  milestones = milestoneWeeks.map((week, index) => {
    const milestoneNames = ['First Quarter Check-in', 'Halfway Point', 'Three-Quarter Mark', 'Goal Achievement'];
    return {
      week,
      title: milestoneNames[index],
      description: `Review progress and adjust plan as needed at week ${week}`,
      target_metrics: {
        activity_minutes: weeklyTargets.total_minutes * week,
        weight_change_kg: targets.target_weight_kg ? 
          (targets.target_weight_kg - baseline.weight_kg) * (week / totalWeeks) : undefined,
        mobility_improvement: targets.primary_goal === 'mobility_improvement' ? 
          `${Math.floor((week / totalWeeks) * 100)}% improvement target` : undefined
      },
      completed: false
    };
  });

  return {
    id: Date.now().toString(),
    user_id: 'current_user',
    plan_name: planName,
    description,
    primary_goal: targets.primary_goal,
    timeline_weeks: adjustedTimeline,
    weekly_targets: weeklyTargets,
    milestones,
    recommendations,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Calculate BMI and health insights
export const calculateHealthMetrics = (baseline: BaselineData) => {
  const bmi = baseline.weight_kg / Math.pow(baseline.height_cm / 100, 2);
  
  let bmiCategory = '';
  let bmiColor = '';
  
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-blue-600';
  } else if (bmi < 25) {
    bmiCategory = 'Normal weight';
    bmiColor = 'text-green-600';
  } else if (bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-yellow-600';
  } else {
    bmiCategory = 'Obese';
    bmiColor = 'text-red-600';
  }

  const insights = [];
  
  if (baseline.pain_level > 6) {
    insights.push('Consider focusing on gentle, low-impact activities to manage pain levels');
  }
  
  if (baseline.energy_level < 4) {
    insights.push('Start with shorter, more frequent activity sessions to build energy');
  }
  
  if (baseline.mobility_level === 'limited') {
    insights.push('Prioritize range-of-motion and flexibility exercises');
  }

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bmiColor,
    insights
  };
};

// Generate progress insights
export const generateProgressInsights = (
  baseline: BaselineData,
  progressEntries: ProgressEntry[],
  plan: PersonalizedPlan
): string[] => {
  if (progressEntries.length === 0) {
    return ['Start logging your progress to see personalized insights!'];
  }

  const latest = progressEntries[0];
  const insights = [];

  // Weight progress
  if (latest.weight_kg && baseline.weight_kg) {
    const weightChange = latest.weight_kg - baseline.weight_kg;
    if (Math.abs(weightChange) > 0.5) {
      const direction = weightChange > 0 ? 'gained' : 'lost';
      insights.push(`You've ${direction} ${Math.abs(weightChange).toFixed(1)}kg since starting your journey`);
    }
  }

  // Pain level improvement
  if (latest.pain_level && baseline.pain_level) {
    const painChange = baseline.pain_level - latest.pain_level;
    if (painChange > 1) {
      insights.push(`Great news! Your pain level has decreased by ${painChange} points`);
    } else if (painChange < -1) {
      insights.push(`Your pain level has increased. Consider adjusting your activity intensity`);
    }
  }

  // Energy level improvement
  if (latest.energy_level && baseline.energy_level) {
    const energyChange = latest.energy_level - baseline.energy_level;
    if (energyChange > 1) {
      insights.push(`Your energy levels have improved by ${energyChange} points - keep it up!`);
    }
  }

  // Mobility progress
  if (latest.mobility_score && baseline.mobility_level) {
    const mobilityLevels = { limited: 3, moderate: 5, good: 7, excellent: 9 };
    const baselineMobility = mobilityLevels[baseline.mobility_level];
    if (latest.mobility_score > baselineMobility) {
      insights.push(`Your mobility has improved! Current score: ${latest.mobility_score}/10`);
    }
  }

  if (insights.length === 0) {
    insights.push('Keep logging your progress to track improvements over time');
  }

  return insights;
};