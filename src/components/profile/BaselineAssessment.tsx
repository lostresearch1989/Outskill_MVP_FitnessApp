import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, User, Activity, Heart, Scale } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BaselineData } from '../../types';
import { calculateHealthMetrics } from '../../lib/ai-simulation';

interface BaselineAssessmentProps {
  onSave: (baseline: BaselineData) => void;
  onCancel: () => void;
  existingBaseline?: BaselineData;
}

export const BaselineAssessment: React.FC<BaselineAssessmentProps> = ({ 
  onSave, 
  onCancel, 
  existingBaseline 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<BaselineData>>(existingBaseline || {
    height_cm: 0,
    weight_kg: 0,
    age: 0,
    sex: 'prefer_not_to_say',
    mobility_level: 'moderate',
    pain_level: 5,
    energy_level: 5,
  });

  const steps = [
    { title: 'Basic Information', icon: User },
    { title: 'Physical Metrics', icon: Scale },
    { title: 'Health Status', icon: Heart },
    { title: 'Current State', icon: Activity },
  ];

  const handleSave = () => {
    const baseline: BaselineData = {
      ...data,
      created_at: existingBaseline?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as BaselineData;
    
    onSave(baseline);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.age && data.sex;
      case 1: return data.height_cm && data.weight_kg;
      case 2: return data.mobility_level && data.pain_level !== undefined && data.energy_level !== undefined;
      case 3: return true;
      default: return false;
    }
  };

  const healthMetrics = data.height_cm && data.weight_kg ? 
    calculateHealthMetrics(data as BaselineData) : null;

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
              {existingBaseline ? 'Update' : 'Create'} Baseline Assessment
            </h2>
            <p className="text-gray-600">Help us understand your current state</p>
          </div>
        </div>
      </div>

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
      <Card className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            {React.createElement(steps[currentStep].icon, { size: 32, className: 'text-blue-600' })}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {steps[currentStep].title}
          </h3>
        </div>

        {/* Step 0: Basic Information */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  id="age"
                  type="number"
                  min="13"
                  max="120"
                  value={data.age || ''}
                  onChange={(e) => setData({ ...data, age: parseInt(e.target.value) || 0 })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Sex *
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        data.sex === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sex"
                        value={option.value}
                        checked={data.sex === option.value}
                        onChange={(e) => setData({ ...data, sex: e.target.value as any })}
                        className="sr-only"
                      />
                      <span className="font-medium text-gray-900">{option.label}</span>
                      {data.sex === option.value && (
                        <div className="ml-auto w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Physical Metrics */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm) *
                </label>
                <input
                  id="height"
                  type="number"
                  min="100"
                  max="250"
                  value={data.height_cm || ''}
                  onChange={(e) => setData({ ...data, height_cm: parseInt(e.target.value) || 0 })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  placeholder="e.g., 170"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  id="weight"
                  type="number"
                  min="30"
                  max="300"
                  step="0.1"
                  value={data.weight_kg || ''}
                  onChange={(e) => setData({ ...data, weight_kg: parseFloat(e.target.value) || 0 })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  placeholder="e.g., 70.5"
                />
              </div>
            </div>

            {/* Optional metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700 mb-2">
                  Body Fat Percentage (optional)
                </label>
                <input
                  id="bodyFat"
                  type="number"
                  min="5"
                  max="50"
                  step="0.1"
                  value={data.body_fat_percentage || ''}
                  onChange={(e) => setData({ ...data, body_fat_percentage: parseFloat(e.target.value) || undefined })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  placeholder="e.g., 20.5"
                />
              </div>

              <div>
                <label htmlFor="restingHR" className="block text-sm font-medium text-gray-700 mb-2">
                  Resting Heart Rate (optional)
                </label>
                <input
                  id="restingHR"
                  type="number"
                  min="40"
                  max="120"
                  value={data.resting_heart_rate || ''}
                  onChange={(e) => setData({ ...data, resting_heart_rate: parseInt(e.target.value) || undefined })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  placeholder="e.g., 72"
                />
              </div>
            </div>

            {/* BMI Display */}
            {healthMetrics && (
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">Health Metrics</h4>
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-sm text-blue-700">BMI: </span>
                    <span className={`font-semibold ${healthMetrics.bmiColor}`}>
                      {healthMetrics.bmi}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-blue-700">Category: </span>
                    <span className={`font-semibold ${healthMetrics.bmiColor}`}>
                      {healthMetrics.bmiCategory}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Health Status */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Current Mobility Level *
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'limited', label: 'Limited', description: 'Significant mobility restrictions' },
                  { value: 'moderate', label: 'Moderate', description: 'Some mobility limitations' },
                  { value: 'good', label: 'Good', description: 'Minor mobility issues' },
                  { value: 'excellent', label: 'Excellent', description: 'No significant mobility restrictions' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      data.mobility_level === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mobility_level"
                      value={option.value}
                      checked={data.mobility_level === option.value}
                      onChange={(e) => setData({ ...data, mobility_level: e.target.value as any })}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{option.label}</h4>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      {data.mobility_level === option.value && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="painLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Pain Level (1-10) *
                </label>
                <input
                  id="painLevel"
                  type="range"
                  min="1"
                  max="10"
                  value={data.pain_level || 5}
                  onChange={(e) => setData({ ...data, pain_level: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>No pain (1)</span>
                  <span className="font-medium text-gray-900">{data.pain_level}</span>
                  <span>Severe (10)</span>
                </div>
              </div>

              <div>
                <label htmlFor="energyLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Energy Level (1-10) *
                </label>
                <input
                  id="energyLevel"
                  type="range"
                  min="1"
                  max="10"
                  value={data.energy_level || 5}
                  onChange={(e) => setData({ ...data, energy_level: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Very low (1)</span>
                  <span className="font-medium text-gray-900">{data.energy_level}</span>
                  <span>Very high (10)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Additional Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications (optional)
              </label>
              <textarea
                id="medications"
                value={data.current_medications || ''}
                onChange={(e) => setData({ ...data, current_medications: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                rows={3}
                placeholder="List any medications that might affect your exercise routine..."
              />
            </div>

            <div>
              <label htmlFor="conditions" className="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions (optional)
              </label>
              <textarea
                id="conditions"
                value={data.medical_conditions || ''}
                onChange={(e) => setData({ ...data, medical_conditions: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                rows={3}
                placeholder="Any medical conditions we should be aware of..."
              />
            </div>

            <div>
              <label htmlFor="limitations" className="block text-sm font-medium text-gray-700 mb-2">
                Activity Limitations (optional)
              </label>
              <textarea
                id="limitations"
                value={data.activity_limitations || ''}
                onChange={(e) => setData({ ...data, activity_limitations: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                rows={3}
                placeholder="Any specific activities you cannot or should not do..."
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            variant="outline"
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'invisible' : ''}
          >
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!canProceed()}
              className="flex items-center"
            >
              <Save size={20} className="mr-2" />
              {existingBaseline ? 'Update' : 'Save'} Baseline
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};