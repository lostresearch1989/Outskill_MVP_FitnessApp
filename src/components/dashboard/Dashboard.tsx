import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flame, TrendingUp, Heart, Plus, Award, MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ParallaxSection } from '../ui/ParallaxSection';
import { generateMotivationalMessage, generateGentleNudge } from '../../lib/ai-simulation';
import { Activity, StreakData } from '../../types';

interface DashboardProps {
  userProfile: any;
  activities: Activity[];
  onLogActivity: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  userProfile, 
  activities, 
  onLogActivity 
}) => {
  const [streakData, setStreakData] = useState<StreakData>({
    current_streak: 0,
    longest_streak: 0,
    total_activities: 0,
  });

  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [gentleNudge, setGentleNudge] = useState('');

  useEffect(() => {
    // Calculate streak data
    const today = new Date();
    const sortedActivities = [...activities].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    let currentStreak = 0;
    let checkDate = new Date(today);

    // Calculate current streak
    for (const activity of sortedActivities) {
      const activityDate = new Date(activity.created_at);
      const daysDiff = Math.floor((checkDate.getTime() - activityDate.getTime()) / (1000 * 3600 * 24));
      
      if (daysDiff <= currentStreak + 1) {
        currentStreak++;
        checkDate = activityDate;
      } else {
        break;
      }
    }

    // Calculate longest streak (simplified)
    const longestStreak = Math.max(currentStreak, Math.floor(activities.length / 3));

    const newStreakData = {
      current_streak: currentStreak,
      longest_streak: longestStreak,
      total_activities: activities.length,
      last_activity_date: sortedActivities[0]?.created_at,
    };

    setStreakData(newStreakData);

    // Generate motivational content
    setMotivationalMessage(generateMotivationalMessage(activities, currentStreak));
    
    // Generate gentle nudge if needed
    const lastActivityDays = sortedActivities[0] 
      ? Math.floor((today.getTime() - new Date(sortedActivities[0].created_at).getTime()) / (1000 * 3600 * 24))
      : 7;
    setGentleNudge(generateGentleNudge(lastActivityDays));

  }, [activities]);

  const thisWeekActivities = activities.filter(activity => {
    const activityDate = new Date(activity.created_at);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return activityDate >= weekStart;
  });

  const averageMood = activities.length > 0 
    ? activities.reduce((sum, activity) => {
        const moodValues = { struggling: 1, tired: 2, okay: 3, good: 4, great: 5 };
        return sum + moodValues[activity.mood];
      }, 0) / activities.length
    : 0;

  const getMoodEmoji = (mood: number) => {
    if (mood >= 4.5) return '😊';
    if (mood >= 3.5) return '🙂';
    if (mood >= 2.5) return '😐';
    if (mood >= 1.5) return '😔';
    return '😞';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <ParallaxSection className="text-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userProfile?.full_name || 'Friend'}! 👋
          </h1>
          
          {motivationalMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-2xl border border-blue-100"
            >
              <div className="flex items-start space-x-3">
                <MessageSquare className="text-blue-500 mt-1" size={20} />
                <p className="text-blue-900 font-medium">{motivationalMessage}</p>
              </div>
            </motion.div>
          )}

          {gentleNudge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100"
            >
              <div className="flex items-start space-x-3">
                <Heart className="text-purple-500 mt-1" size={20} />
                <p className="text-purple-900 font-medium">{gentleNudge}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </ParallaxSection>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mx-auto mb-3">
              <Flame className="text-orange-500" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{streakData.current_streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3">
              <Calendar className="text-green-500" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{thisWeekActivities.length}</div>
            <div className="text-sm text-gray-600">This Week</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3">
              <TrendingUp className="text-blue-500" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{streakData.total_activities}</div>
            <div className="text-sm text-gray-600">Total Activities</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3">
              <Heart className="text-purple-500" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {getMoodEmoji(averageMood)}
            </div>
            <div className="text-sm text-gray-600">Avg Mood</div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <ParallaxSection>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={onLogActivity}
                size="lg"
                className="justify-start h-auto p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Log New Activity</div>
                    <div className="text-sm opacity-90">Voice or text logging</div>
                  </div>
                </div>
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="justify-start h-auto p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Award size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">View Achievements</div>
                    <div className="text-sm opacity-90">See your progress</div>
                  </div>
                </div>
              </Button>
            </div>
          </Card>
        </motion.div>
      </ParallaxSection>

      {/* Recent Activities Preview */}
      {activities.length > 0 && (
        <ParallaxSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {activities.slice(0, 3).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{activity.exercise_type}</div>
                      <div className="text-sm text-gray-600">
                        {activity.duration} min • {activity.intensity} intensity • Feeling {activity.mood}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </ParallaxSection>
      )}
    </div>
  );
};