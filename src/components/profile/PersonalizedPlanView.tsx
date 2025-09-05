import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, CheckCircle, Circle, TrendingUp, Calendar, Award } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PersonalizedPlan, PlanMilestone } from '../../types';

interface PersonalizedPlanViewProps {
  plan: PersonalizedPlan;
  onUpdateMilestone: (milestoneIndex: number, completed: boolean) => void;
  currentWeek: number;
}

export const PersonalizedPlanView: React.FC<PersonalizedPlanViewProps> = ({
  plan,
  onUpdateMilestone,
  currentWeek
}) => {
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);

  const completedMilestones = plan.milestones.filter(m => m.completed).length;
  const progressPercentage = (completedMilestones / plan.milestones.length) * 100;

  const getWeeklyProgress = () => {
    const weeksElapsed = Math.min(currentWeek, plan.timeline_weeks);
    const expectedProgress = (weeksElapsed / plan.timeline_weeks) * 100;
    return {
      current: progressPercentage,
      expected: expectedProgress,
      isAhead: progressPercentage > expectedProgress
    };
  };

  const weeklyProgress = getWeeklyProgress();

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.plan_name}</h2>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Target size={16} />
                <span className="capitalize">{plan.primary_goal.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{plan.timeline_weeks} weeks</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>Week {currentWeek} of {plan.timeline_weeks}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{completedMilestones} of {plan.milestones.length} milestones</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-blue-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Weekly Progress Indicator */}
        <div className={`p-3 rounded-xl ${
          weeklyProgress.isAhead ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'
        }`}>
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} />
            <span className="font-medium">
              {weeklyProgress.isAhead ? 'Ahead of schedule!' : 'On track'}
            </span>
            <span className="text-sm">
              ({Math.round(weeklyProgress.current)}% vs {Math.round(weeklyProgress.expected)}% expected)
            </span>
          </div>
        </div>
      </Card>

      {/* Weekly Targets */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-900">{plan.weekly_targets.activity_sessions}</div>
            <div className="text-sm text-blue-700">Sessions per week</div>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-900">{plan.weekly_targets.total_minutes}</div>
            <div className="text-sm text-green-700">Minutes per week</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="text-sm text-purple-700 mb-1">Intensity Mix</div>
            <div className="text-xs text-purple-600">
              {plan.weekly_targets.intensity_distribution.low}% Low • {' '}
              {plan.weekly_targets.intensity_distribution.moderate}% Moderate • {' '}
              {plan.weekly_targets.intensity_distribution.high}% High
            </div>
          </div>
        </div>
      </Card>

      {/* Milestones */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h3>
        <div className="space-y-4">
          {plan.milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-2 rounded-xl transition-all duration-200 ${
                milestone.completed 
                  ? 'border-green-200 bg-green-50' 
                  : currentWeek >= milestone.week
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <button
                      onClick={() => onUpdateMilestone(index, !milestone.completed)}
                      className={`mt-1 transition-colors ${
                        milestone.completed ? 'text-green-600' : 'text-gray-400 hover:text-blue-600'
                      }`}
                      disabled={currentWeek < milestone.week}
                    >
                      {milestone.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-semibold ${
                          milestone.completed ? 'text-green-900' : 'text-gray-900'
                        }`}>
                          {milestone.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          currentWeek >= milestone.week 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          Week {milestone.week}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-2 ${
                        milestone.completed ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {milestone.description}
                      </p>

                      {/* Target Metrics */}
                      {milestone.target_metrics && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {milestone.target_metrics.weight_change_kg && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                              Weight: {milestone.target_metrics.weight_change_kg > 0 ? '+' : ''}
                              {milestone.target_metrics.weight_change_kg.toFixed(1)}kg
                            </span>
                          )}
                          {milestone.target_metrics.activity_minutes && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                              {milestone.target_metrics.activity_minutes} total minutes
                            </span>
                          )}
                          {milestone.target_metrics.mobility_improvement && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                              {milestone.target_metrics.mobility_improvement}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    {milestone.completed && milestone.completed_at && (
                      <div className="text-xs text-green-600">
                        ✓ {new Date(milestone.completed_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
        <div className="space-y-3">
          {plan.recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl"
            >
              <Award size={16} className="text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-blue-900">{recommendation}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};