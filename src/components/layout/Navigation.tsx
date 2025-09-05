import React from 'react';
import { motion } from 'framer-motion';
import { Home, Activity, Target, User, Settings, Moon, Sun, Type, Mic } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { highContrast, largeText, voiceEnabled, toggleHighContrast, toggleLargeText, toggleVoiceEnabled } = useAccessibility();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'workouts', label: 'Workouts', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="bg-white shadow-lg rounded-t-3xl">
      {/* Accessibility Controls */}
      <div className="px-6 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Accessibility</span>
          <div className="flex space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleHighContrast}
              className={`p-2 rounded-lg transition-colors ${
                highContrast 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Toggle high contrast mode"
            >
              {highContrast ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleLargeText}
              className={`p-2 rounded-lg transition-colors ${
                largeText 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Toggle large text mode"
            >
              <Type size={16} />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoiceEnabled}
              className={`p-2 rounded-lg transition-colors ${
                voiceEnabled 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Toggle voice features"
            >
              <Mic size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-4 gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 min-h-[80px] ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-label={`Navigate to ${item.label}`}
              >
                <Icon size={24} />
                <span className="text-sm font-medium mt-2">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};