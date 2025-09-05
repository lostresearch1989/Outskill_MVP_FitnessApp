import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Clock, Zap, Users, ChevronDown, ChevronUp, Play, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ParallaxSection } from '../ui/ParallaxSection';
import { generateAdaptiveWorkouts } from '../../lib/ai-simulation';
import { Workout } from '../../types';

interface WorkoutRecommendationsProps {
  userProfile: any;
}

export const WorkoutRecommendations: React.FC<WorkoutRecommendationsProps> = ({ userProfile }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    const recommendations = generateAdaptiveWorkouts(
      userProfile?.disability_type,
      userProfile?.fitness_goals
    );
    setWorkouts(recommendations);
  }, [userProfile]);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-red-100 text-red-800 border-red-200',
  };

  const filteredWorkouts = selectedDifficulty === 'all' 
    ? workouts 
    : workouts.filter(workout => workout.difficulty_level === selectedDifficulty);

  return (
    <div className="space-y-6">
      {/* Header */}
      <ParallaxSection className="text-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Target size={32} className="text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Your Adaptive Workouts
          </h1>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            AI-powered workout recommendations tailored specifically for your abilities and goals. 
            Each workout includes safety modifications and adaptive techniques.
          </p>
        </motion.div>
      </ParallaxSection>

      {/* Filter Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter by Difficulty</h3>
          <span className="text-sm text-gray-500">
            {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
              className="capitalize"
            >
              {difficulty === 'all' ? 'All Levels' : difficulty}
            </Button>
          ))}
        </div>
      </Card>

      {/* Workout Cards */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                {/* Workout Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {workout.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {workout.description}
                      </p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      difficultyColors[workout.difficulty_level]
                    }`}>
                      {workout.difficulty_level}
                    </div>
                  </div>

                  {/* Workout Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock size={18} className="text-blue-500" />
                      <span className="text-sm text-gray-700">{workout.duration_minutes} min</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Target size={18} className="text-green-500" />
                      <span className="text-sm text-gray-700">{workout.exercises.length} exercises</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Zap size={18} className="text-yellow-500" />
                      <span className="text-sm text-gray-700 capitalize">{workout.difficulty_level}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users size={18} className="text-purple-500" />
                      <span className="text-sm text-gray-700">Adaptive</span>
                    </div>
                  </div>

                  {/* Adaptations Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Adaptations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {workout.disability_adaptations.slice(0, 3).map((adaptation, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                        >
                          {adaptation}
                        </span>
                      ))}
                      {workout.disability_adaptations.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          +{workout.disability_adaptations.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Button size="lg" className="flex-1">
                      <Play size={20} className="mr-2" />
                      Start Workout
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setExpandedWorkout(
                        expandedWorkout === workout.id ? null : workout.id
                      )}
                    >
                      Details
                      {expandedWorkout === workout.id ? 
                        <ChevronUp size={20} className="ml-2" /> : 
                        <ChevronDown size={20} className="ml-2" />
                      }
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedWorkout === workout.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-6 space-y-6">
                        {/* Equipment Needed */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Equipment Needed</h4>
                          <div className="flex flex-wrap gap-2">
                            {workout.equipment_needed.map((equipment, i) => (
                              <span 
                                key={i}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg"
                              >
                                {equipment}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* All Adaptations */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Disability Adaptations</h4>
                          <div className="space-y-2">
                            {workout.disability_adaptations.map((adaptation, i) => (
                              <div key={i} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                <AlertCircle size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                                <span className="text-blue-900">{adaptation}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Exercise Details */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Exercise Breakdown</h4>
                          <div className="space-y-4">
                            {workout.exercises.map((exercise, i) => (
                              <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                <h5 className="font-semibold text-gray-900 mb-2">{exercise.name}</h5>
                                <p className="text-gray-700 mb-3">{exercise.description}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-900">Duration/Reps: </span>
                                    <span className="text-gray-700">{exercise.duration_or_reps}</span>
                                  </div>
                                </div>

                                {exercise.modifications.length > 0 && (
                                  <div className="mt-3">
                                    <span className="font-medium text-gray-900 text-sm">Modifications: </span>
                                    <ul className="text-sm text-gray-700 mt-1">
                                      {exercise.modifications.map((mod, j) => (
                                        <li key={j} className="ml-4">• {mod}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {exercise.safety_notes.length > 0 && (
                                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-start space-x-2">
                                      <AlertCircle size={16} className="text-yellow-600 mt-1 flex-shrink-0" />
                                      <div>
                                        <span className="font-medium text-yellow-900 text-sm">Safety Notes: </span>
                                        <ul className="text-sm text-yellow-800 mt-1">
                                          {exercise.safety_notes.map((note, j) => (
                                            <li key={j} className="ml-4">• {note}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredWorkouts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Card className="p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No workouts found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filter or check back later for new recommendations.
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
};