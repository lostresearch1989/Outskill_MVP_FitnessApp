import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, Target, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface OnboardingData {
  full_name: string;
  disability_type: string;
  mobility_notes: string;
  fitness_goals: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    full_name: '',
    disability_type: '',
    mobility_notes: '',
    fitness_goals: '',
  });

  const steps = [
    {
      title: "Welcome to AdaptFit!",
      subtitle: "Let's personalize your fitness journey",
      icon: Heart,
    },
    {
      title: "Tell us about yourself",
      subtitle: "This helps us create better recommendations",
      icon: MessageCircle,
    },
    {
      title: "Your fitness goals",
      subtitle: "What would you like to achieve?",
      icon: Target,
    }
  ];

  const disabilityOptions = [
    { value: 'wheelchair', label: 'Wheelchair User', description: 'Full-time or part-time wheelchair use' },
    { value: 'mobility_aid', label: 'Mobility Aid', description: 'Crutches, walker, cane, or similar' },
    { value: 'chronic_pain', label: 'Chronic Pain', description: 'Conditions affecting daily movement' },
    { value: 'limb_difference', label: 'Limb Difference', description: 'Amputation or limb difference' },
    { value: 'visual_impairment', label: 'Visual Impairment', description: 'Blind or low vision' },
    { value: 'neurological', label: 'Neurological', description: 'MS, cerebral palsy, spinal cord injury' },
    { value: 'other', label: 'Other', description: 'Different or multiple conditions' },
  ];

  const fitnessGoals = [
    'Maintain current fitness level',
    'Build strength and endurance',
    'Improve flexibility and mobility',
    'Manage pain through movement',
    'Prepare for daily activities',
    'Train for adaptive sports',
    'General health and wellness',
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Welcome step
      case 1: return data.full_name && data.disability_type;
      case 2: return data.fitness_goals;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8">
              {/* Step Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                  {React.createElement(steps[currentStep].icon, { size: 32, className: 'text-blue-600' })}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-600">
                  {steps[currentStep].subtitle}
                </p>
              </div>

              {/* Step Content */}
              {currentStep === 0 && (
                <div className="text-center space-y-6">
                  <p className="text-lg text-gray-700">
                    AdaptMaxFit is designed specifically for people with disabilities and chronic conditions. 
                    We'll help you discover safe, effective workouts tailored to your unique needs.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h3 className="font-semibold text-blue-900 mb-2">AI-Powered</h3>
                      <p className="text-sm text-blue-700">Personalized workout recommendations</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h3 className="font-semibold text-green-900 mb-2">Voice-First</h3>
                      <p className="text-sm text-green-700">Log activities hands-free</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <h3 className="font-semibold text-purple-900 mb-2">Accessible</h3>
                      <p className="text-sm text-purple-700">High contrast, large text options</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      What should we call you?
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={data.full_name}
                      onChange={(e) => setData({ ...data, full_name: e.target.value })}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Disability Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Which best describes your situation? (This helps us recommend appropriate exercises)
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {disabilityOptions.map((option) => (
                        <motion.label
                          key={option.value}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            data.disability_type === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <input
                            type="radio"
                            name="disability_type"
                            value={option.value}
                            checked={data.disability_type === option.value}
                            onChange={(e) => setData({ ...data, disability_type: e.target.value })}
                            className="sr-only"
                          />
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{option.label}</h4>
                              <p className="text-sm text-gray-600">{option.description}</p>
                            </div>
                            {data.disability_type === option.value && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label htmlFor="mobilityNotes" className="block text-sm font-medium text-gray-700 mb-2">
                      Any specific mobility considerations? (Optional)
                    </label>
                    <textarea
                      id="mobilityNotes"
                      value={data.mobility_notes}
                      onChange={(e) => setData({ ...data, mobility_notes: e.target.value })}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                      rows={3}
                      placeholder="e.g., Right side weakness, chronic fatigue, joint pain..."
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      What's your primary fitness goal?
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {fitnessGoals.map((goal) => (
                        <motion.label
                          key={goal}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            data.fitness_goals === goal
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <input
                            type="radio"
                            name="fitness_goals"
                            value={goal}
                            checked={data.fitness_goals === goal}
                            onChange={(e) => setData({ ...data, fitness_goals: e.target.value })}
                            className="sr-only"
                          />
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">{goal}</span>
                            {data.fitness_goals === goal && (
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  disabled={currentStep === 0}
                  className={currentStep === 0 ? 'invisible' : ''}
                >
                  <ChevronLeft size={20} className="mr-2" />
                  Back
                </Button>

                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center"
                >
                  {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
                  <ChevronRight size={20} className="ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};