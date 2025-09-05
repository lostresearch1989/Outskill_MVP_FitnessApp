import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  largeText: boolean;
  voiceEnabled: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleVoiceEnabled: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const saved = localStorage.getItem('accessibility-preferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setHighContrast(prefs.highContrast || false);
      setLargeText(prefs.largeText || false);
      setVoiceEnabled(prefs.voiceEnabled || false);
    }
  }, []);

  useEffect(() => {
    // Save preferences to localStorage
    localStorage.setItem('accessibility-preferences', JSON.stringify({
      highContrast,
      largeText,
      voiceEnabled,
    }));

    // Apply CSS classes to body
    document.body.classList.toggle('high-contrast', highContrast);
    document.body.classList.toggle('large-text', largeText);
  }, [highContrast, largeText, voiceEnabled]);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleLargeText = () => setLargeText(!largeText);
  const toggleVoiceEnabled = () => setVoiceEnabled(!voiceEnabled);

  const value = {
    highContrast,
    largeText,
    voiceEnabled,
    toggleHighContrast,
    toggleLargeText,
    toggleVoiceEnabled,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};