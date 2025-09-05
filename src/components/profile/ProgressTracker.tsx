import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Calendar, Scale, Activity, Heart } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BaselineData, ProgressEntry, PersonalizedPlan } from '../../types';
import { generateProgressInsights } from '../../lib/ai-simulation';

interface ProgressTrackerProps {
  baseline: BaselineData;
  progressEntries: ProgressEntry[];
  plan?: PersonalizedPlan;
  onAddEntry: (entry: Partial<ProgressEntry>) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  baseline,
  progressEntries,
  plan,
  onAddEntry
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<ProgressEntry>>({
    entry_date: new Date().toISOString().split('T')[0],
  });

  const insights = generateProgressInsights(baseline, progressEntries, plan!);
  const latestEntry = progressEntries[0];

  const handleSaveEntry = () => {
    onAddEntry({
      ...newEntry,
      created_at: new Date().toISOString(),
    });
    setNewEntry({ entry_date: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
  };

  const getProgressChange = (current: number | undefined, baseline: number) => {
    if (!current) return null;
    const change = current - baseline;
    const percentage = ((change / baseline) * 100);
    return {
      value: change,
      percentage: percentage,
      isPositive: change > 0
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progress Tracker</h2>
          <p className="text-gray-600">Monitor your journey and celebrate improvements</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus size={20} className="mr-2" />
          Log Progress
        </Button>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">AI Progress Insights</h3>
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <p key={index} className="text-gray-700">{insight}</p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Progress Overview */}
      {latestEntry && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Weight Progress */}
          {latestEntry.weight_kg && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Scale size={20} className="text-blue-500" />
                {(() => {
                  const change = getProgressChange(latestEntry.weight_kg, baseline.weight_kg);
                  return change && (
                    <span className={`text-sm font-medium ${
                      change.isPositive ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {change.isPositive ? '+' : ''}{change.value.toFixed(1)}kg
                    </span>
                  );
                })()}
              </div>
              <div className="text-2xl font-bold text-gray-900">{latestEntry.weight_kg}kg</div>
              <div className="text-sm text-gray-600">Weight</div>
            </Card>
          )}

          {/* Pain Level */}
          {latestEntry.pain_level !== undefined && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Heart size={20} className="text-red-500" />
                {(() => {
                  const change = baseline.pain_level - latestEntry.pain_level!;
                  return change !== 0 && (
                    <span className={`text-sm font-medium ${
                      change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {change > 0 ? '-' : '+'}{Math.abs(change)}
                    </span>
                  );
                })()}
              </div>
              <div className="text-2xl font-bold text-gray-900">{latestEntry.pain_level}/10</div>
              <div className="text-sm text-gray-600">Pain Level</div>
            </Card>
          )}

          {/* Energy Level */}
          {latestEntry.energy_level !== undefined && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity size={20} className="text-green-500" />
                {(() => {
                  const change = latestEntry.energy_level! - baseline.energy_level;
                  return change !== 0 && (
                    <span className={`text-sm font-medium ${
                      change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {change > 0 ? '+' : ''}{change}
                    </span>
                  );
                })()}
              </div>
              <div className="text-2xl font-bold text-gray-900">{latestEntry.energy_level}/10</div>
              <div className="text-sm text-gray-600">Energy Level</div>
            </Card>
          )}

          {/* Mobility Score */}
          {latestEntry.mobility_score !== undefined && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp size={20} className="text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{latestEntry.mobility_score}/10</div>
              <div className="text-sm text-gray-600">Mobility Score</div>
            </Card>
          )}
        </div>
      )}

      {/* Progress History */}
      {progressEntries.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress History</h3>
          <div className="space-y-4">
            {progressEntries.slice(0, 5).map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {entry.weight_kg && `Weight: ${entry.weight_kg}kg`}
                      {entry.pain_level !== undefined && ` • Pain: ${entry.pain_level}/10`}
                      {entry.energy_level !== undefined && ` • Energy: ${entry.energy_level}/10`}
                    </div>
                  </div>
                </div>
                {entry.notes && (
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    "{entry.notes}"
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Add Progress Entry Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Log Progress Entry</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="entryDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    id="entryDate"
                    type="date"
                    value={newEntry.entry_date || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, entry_date: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={newEntry.weight_kg || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, weight_kg: parseFloat(e.target.value) || undefined })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      placeholder={`Baseline: ${baseline.weight_kg}kg`}
                    />
                  </div>

                  <div>
                    <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700 mb-2">
                      Body Fat %
                    </label>
                    <input
                      id="bodyFat"
                      type="number"
                      step="0.1"
                      value={newEntry.body_fat_percentage || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, body_fat_percentage: parseFloat(e.target.value) || undefined })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="painLevel" className="block text-sm font-medium text-gray-700 mb-2">
                      Pain Level (1-10)
                    </label>
                    <input
                      id="painLevel"
                      type="range"
                      min="1"
                      max="10"
                      value={newEntry.pain_level || 5}
                      onChange={(e) => setNewEntry({ ...newEntry, pain_level: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">
                      {newEntry.pain_level || 5}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="energyLevel" className="block text-sm font-medium text-gray-700 mb-2">
                      Energy Level (1-10)
                    </label>
                    <input
                      id="energyLevel"
                      type="range"
                      min="1"
                      max="10"
                      value={newEntry.energy_level || 5}
                      onChange={(e) => setNewEntry({ ...newEntry, energy_level: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">
                      {newEntry.energy_level || 5}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mobilityScore" className="block text-sm font-medium text-gray-700 mb-2">
                      Mobility Score (1-10)
                    </label>
                    <input
                      id="mobilityScore"
                      type="range"
                      min="1"
                      max="10"
                      value={newEntry.mobility_score || 5}
                      onChange={(e) => setNewEntry({ ...newEntry, mobility_score: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">
                      {newEntry.mobility_score || 5}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={newEntry.notes || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                    rows={3}
                    placeholder="How are you feeling? Any observations about your progress..."
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <Button onClick={handleSaveEntry} className="flex-1">
                  Save Entry
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {progressEntries.length === 0 && !showAddForm && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Start Tracking Your Progress
          </h3>
          <p className="text-gray-600 mb-6">
            Log your first progress entry to see how you're improving over time
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus size={20} className="mr-2" />
            Log First Entry
          </Button>
        </Card>
      )}
    </div>
  );
};