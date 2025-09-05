import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Target, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FitnessTargets, BaselineData } from '../../types';

interface GoalSettingProps {
  onSave: (targets: FitnessTargets) => void;
  onCancel: () => void;
  baseline: BaselineData;
  existingTargets?: FitnessTargets;
}

export const GoalSetting: React.FC<GoalSettingProps> = ({ 
  onSave, 
  onCancel, 
  baseline,
  existingTargets 
}) => {
  const [data, setData] = useState<Partial<FitnessTargets>>(existingTargets || {
    primary_goal: 'general_wellness',
    timeline_weeks: 12,
    weekly_activity_target: 3,
  });

  const goalOptions = [
    {
      value: 'weight_loss',
      label: 'Weight Loss',
      description: 'Reduce body weight safely and sustainably',
      icon: '⚖️'
    },
    {
      value: 'weight_gain',
      label: 'Weight Gain',
      description: 'Increase body weight in a healthy way',
      icon: '📈'
    },
    {
      value: 'muscle_gain',
      label: 'Muscle Building',
      description: 'Build lean muscle mass and strength',
      icon: '💪'
    },
    {
      value: 'fat_loss',
      label: 'Fat Loss',
      description: 'Reduce body fat while maintaining muscle',
      icon: '🔥'
    },
    {
      value: 'mobility_improvement',
      label: 'Mobility Enhancement',
      description: 'Improve range of motion and flexibility',
      icon: '🤸'
    },
    {
      value: 'pain_management',
      label: 'Pain Management',
      description: 'Use movement to manage chronic pain',
      icon: '🌿'
    },
    {
      value: 'endurance_building',
      label: 'Endurance Building',
      description: 'Improve cardiovascular fitness',
      icon: '🏃'
    },
    {
      value: 'strength_building',
      label: 'Strength Building',
      description: 'Increase overall physical strength',
      icon: '🏋️'
    },
    {
      value: 'general_wellness',
      label: 'General Wellness',
      description: 'Overall health and well-being',
      icon: '✨'
    }
  ];

  const handleSave = () => {
    const targets: FitnessTargets = {
      ...data,
      created_at: existingTargets?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as FitnessTargets;
    
    onSave(targets);
  };

  const canSave = () => {
    return data.primary_goal && data.timeline_weeks && data.weekly_activity_target;
  };

  const showWeightTarget = data.primary_goal === 'weight_loss' || data.primary_goal === 'weight_gain';
  const showBodyFatTarget = data.primary_goal === 'fat_loss';
  const showMobilityGoals = data.primary_goal === 'mobility_improvement';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="p-2"
            ariaLabel="Go back"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {existingTargets ? 'Update' : 'Set'} Fitness Goals
            </h2>
            <p className="text-gray-600">Define what you want to achieve</p>
          </div>
        </div>
      </div>

      <Card className="p-8">
        <div className="space-y-8">
          {/* Primary Goal Selection */}
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                <Target size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                What's your primary fitness goal?
              </h3>
              <p className="text-gray-600">
                Choose the main objective you want to focus on
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goalOptions.map((goal) => (
                <motion.label
                  key={goal.value}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    data.primary_goal === goal.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="primary_goal"
                    value={goal.value}
                    checked={data.primary_goal === goal.value}
                    onChange={(e) => setData({ ...data, primary_goal: e.target.value as any })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">{goal.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-1">{goal.label}</h4>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                  {data.primary_goal === goal.value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </motion.label>
              ))}
            </div>
          </div>

          {/* Specific Targets */}
          {data.primary_goal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                  <TrendingUp size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Set Your Specific Targets
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weight Target */}
                {showWeightTarget && (
                  <div>
                    <label htmlFor="targetWeight" className="block text-sm font-medium text-gray-700 mb-2">
                      Target Weight (kg)
                    </label>
                    <input
                      id="targetWeight"
                      type="number"
                      min="30"
                      max="300"
                      step="0.1"
                      value={data.target_weight_kg || ''}
                      onChange={(e) => setData({ ...data, target_weight_kg: parseFloat(e.target.value) || undefined })}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      placeholder={`Current: ${baseline.weight_kg}kg`}
                    />
                    {data.target_weight_kg && baseline.weight_kg && (
                      <p className="text-sm text-gray-600 mt-1">
                        Change: {data.target_weight_kg > baseline.weight_kg ? '+' : ''}
                        {(data.target_weight_kg - baseline.weight_kg).toFixed(1)}kg
                      </p>
                    )}
                  </div>
                )}

                {/* Body Fat Target */}
                {showBodyFatTarget && (
                  <div>
                    <label htmlFor="targetBodyFat" className="block text-sm font-medium text-gray-700 mb-2">
                      Target Body Fat Percentage
                    </label>
                    <input
                      id="targetBodyFat"
                      type="number"
                      min="5"
                      max="50"
                      step="0.1"
                      value={data.target_body_fat_percentage || ''}
                      onChange={(e) => setData({ ...data, target_body_fat_percentage: parseFloat(e.target.value) || undefined })}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      placeholder={baseline.body_fat_percentage ? `Current: ${baseline.body_fat_percentage}%` : 'e.g., 20'}
                    />
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline (weeks) *
                  </label>
                  <select
                    id="timeline"
                    value={data.timeline_weeks || ''}
                    onChange={(e) => setData({ ...data, timeline_weeks: parseInt(e.target.value) })}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  >
                    <option value="">Select timeline</option>
                    <option value="4">4 weeks (1 month)</option>
                    <option value="8">8 weeks (2 months)</option>
                    <option value="12">12 weeks (3 months)</option>
                    <option value="16">16 weeks (4 months)</option>
                    <option value="24">24 weeks (6 months)</option>
                    <option value="52">52 weeks (1 year)</option>
                  </select>
                </div>

                {/* Weekly Activity Target */}
                <div>
                  <label htmlFor="weeklyTarget" className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Activity Sessions *
                  </label>
                  <select
                    id="weeklyTarget"
                    value={data.weekly_activity_target || ''}
                    onChange={(e) => setData({ ...data, weekly_activity_target: parseInt(e.target.value) })}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  >
                    <option value="">Select frequency</option>
                    <option value="2">2 sessions per week</option>
                    <option value="3">3 sessions per week</option>
                    <option value="4">4 sessions per week</option>
                    <option value="5">5 sessions per week</option>
                    <option value="6">6 sessions per week</option>
                    <option value="7">Daily (7 sessions per week)</option>
                  </select>
                </div>
              </div>

              {/* Mobility Goals */}
              {showMobilityGoals && (
                <div>
                  <label htmlFor="mobilityGoals" className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Mobility Goals
                  </label>
                  <textarea
                    id="mobilityGoals"
                    value={data.mobility_goals || ''}
                    onChange={(e) => setData({ ...data, mobility_goals: e.target.value })}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                    rows={3}
                    placeholder="e.g., Improve shoulder range of motion, reduce morning stiffness, walk longer distances..."
                  />
                </div>
              )}

              {/* Additional Goals */}
              <div>
                <label htmlFor="specificGoals" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Goals (optional)
                </label>
                <textarea
                  id="specificGoals"
                  value={data.specific_goals || ''}
                  onChange={(e) => setData({ ...data, specific_goals: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Any other specific goals or milestones you want to achieve..."
                />
              </div>
            </motion.div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!canSave()}
              size="lg"
              className="flex items-center"
            >
              <Save size={20} className="mr-2" />
              {existingTargets ? 'Update' : 'Set'} Goals
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};