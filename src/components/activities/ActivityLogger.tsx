import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { VoiceInput } from '../ui/VoiceInput';
import { parseActivityText } from '../../lib/ai-simulation';
import { Activity } from '../../types';

interface ActivityLoggerProps {
  onSave: (activity: Partial<Activity>) => void;
  onCancel: () => void;
}

export const ActivityLogger: React.FC<ActivityLoggerProps> = ({ onSave, onCancel }) => {
  const [rawInput, setRawInput] = useState('');
  const [parsedActivity, setParsedActivity] = useState<Partial<Activity> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranscript = async (text: string) => {
    setRawInput(text);
    
    if (text.trim()) {
      setIsProcessing(true);
      
      // Simulate AI processing delay
      setTimeout(() => {
        const parsed = parseActivityText(text);
        setParsedActivity(parsed);
        setIsProcessing(false);
      }, 1500);
    } else {
      setParsedActivity(null);
    }
  };

  const handleSave = () => {
    if (parsedActivity) {
      onSave({
        ...parsedActivity,
        created_at: new Date().toISOString(),
      });
    }
  };

  const intensityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  };

  const moodEmojis = {
    struggling: '😞',
    tired: '😔',
    okay: '😐',
    good: '🙂',
    great: '😊',
  };

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
            <h2 className="text-2xl font-bold text-gray-900">Log Activity</h2>
            <p className="text-gray-600">Tell us about your workout or activity</p>
          </div>
        </div>
      </div>

      {/* Voice Input */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          How did your activity go?
        </h3>
        <VoiceInput
          onTranscript={handleTranscript}
          placeholder="E.g., 'Did 20 minutes of wheelchair cardio, felt great!' or 'Gentle stretching for 15 minutes, moderate intensity'"
        />
      </Card>

      {/* AI Processing Indicator */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                ))}
              </div>
              <span className="text-blue-600 font-medium">AI is processing your activity...</span>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Parsed Activity Preview */}
      {parsedActivity && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Activity Summary</h3>
              <span className="text-sm text-green-600 font-medium">✨ AI Parsed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Exercise Type */}
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="text-sm font-medium text-blue-700 mb-1">Exercise Type</div>
                <div className="text-lg font-semibold text-blue-900 capitalize">
                  {parsedActivity.exercise_type}
                </div>
              </div>

              {/* Duration */}
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="text-sm font-medium text-green-700 mb-1">Duration</div>
                <div className="text-lg font-semibold text-green-900">
                  {parsedActivity.duration} min
                </div>
              </div>

              {/* Intensity */}
              <div className={`p-4 rounded-xl border-2 ${intensityColors[parsedActivity.intensity!]}`}>
                <div className="text-sm font-medium mb-1">Intensity</div>
                <div className="text-lg font-semibold capitalize">
                  {parsedActivity.intensity}
                </div>
              </div>

              {/* Mood */}
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="text-sm font-medium text-purple-700 mb-1">Mood</div>
                <div className="text-lg font-semibold text-purple-900">
                  {moodEmojis[parsedActivity.mood!]} {parsedActivity.mood}
                </div>
              </div>
            </div>

            {/* Original Input */}
            {parsedActivity.notes && (
              <div className="p-4 bg-gray-50 rounded-xl mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">Original Input</div>
                <div className="text-gray-900 italic">"{parsedActivity.notes}"</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button onClick={handleSave} size="lg" className="flex-1">
                <Save size={20} className="mr-2" />
                Save Activity
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setRawInput('');
                  setParsedActivity(null);
                }}
                size="lg"
              >
                Edit
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Tips */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Tips for better logging</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Voice Examples:</h4>
            <ul className="space-y-1">
              <li>"15 minutes of wheelchair basketball practice"</li>
              <li>"Physical therapy session, feeling tired"</li>
              <li>"Gentle yoga for 20 minutes, felt great"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Include:</h4>
            <ul className="space-y-1">
              <li>• Type of exercise or activity</li>
              <li>• How long you did it</li>
              <li>• How you felt (optional)</li>
              <li>• Intensity level (optional)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};