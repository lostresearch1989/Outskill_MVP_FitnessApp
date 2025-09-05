import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Zap, Heart, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Activity } from '../../types';

interface ActivityListProps {
  activities: Activity[];
  onAddActivity: () => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities, onAddActivity }) => {
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = new Date(activity.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  const sortedDates = Object.keys(groupedActivities).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const intensityColors = {
    low: 'text-green-600 bg-green-100',
    moderate: 'text-yellow-600 bg-yellow-100',
    high: 'text-red-600 bg-red-100',
  };

  const moodEmojis = {
    struggling: '😞',
    tired: '😔',
    okay: '😐',
    good: '🙂',
    great: '😊',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Plus size={40} className="text-blue-500" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No activities yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your fitness journey by logging your first activity!
            </p>
            
            <Button onClick={onAddActivity} size="lg">
              <Plus size={20} className="mr-2" />
              Log Your First Activity
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity History</h2>
          <p className="text-gray-600">{activities.length} activities logged</p>
        </div>
        <Button onClick={onAddActivity}>
          <Plus size={20} className="mr-2" />
          Add Activity
        </Button>
      </div>

      {/* Activity Groups by Date */}
      <div className="space-y-8">
        {sortedDates.map((dateString, dateIndex) => (
          <motion.div
            key={dateString}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dateIndex * 0.1 }}
          >
            {/* Date Header */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {formatDate(dateString)}
                </h3>
              </div>
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-500">
                {groupedActivities[dateString].length} activities
              </span>
            </div>

            {/* Activities for this date */}
            <div className="grid grid-cols-1 gap-4">
              {groupedActivities[dateString].map((activity, activityIndex) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (dateIndex * 0.1) + (activityIndex * 0.05) }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 capitalize mb-2">
                          {activity.exercise_type}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock size={16} />
                            <span>{activity.duration} minutes</span>
                          </div>
                          
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${intensityColors[activity.intensity]}`}>
                            <Zap size={14} />
                            <span className="capitalize font-medium">{activity.intensity}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Heart size={16} />
                            <span>
                              {moodEmojis[activity.mood]} {activity.mood}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        {new Date(activity.created_at).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    {activity.notes && (
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-sm text-gray-700 italic">
                          "{activity.notes}"
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More Placeholder */}
      {activities.length >= 10 && (
        <div className="text-center py-8">
          <Button variant="outline" size="lg">
            Load More Activities
          </Button>
        </div>
      )}
    </div>
  );
};