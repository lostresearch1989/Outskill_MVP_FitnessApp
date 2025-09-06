import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';

interface VoiceLoginInputProps {
  onEmailCapture: (email: string) => void;
  onPasswordCapture: (password: string) => void;
  onSubmit: () => void;
  isListening: boolean;
  onToggleListening: () => void;
  currentField: 'email' | 'password' | 'none';
  email: string;
  password: string;
  showPassword: boolean;
  onTogglePasswordVisibility: () => void;
}

export const VoiceLoginInput: React.FC<VoiceLoginInputProps> = ({
  onEmailCapture,
  onPasswordCapture,
  onSubmit,
  isListening,
  onToggleListening,
  currentField,
  email,
  password,
  showPassword,
  onTogglePasswordVisibility,
}) => {
  const [voiceInstructions, setVoiceInstructions] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(result);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        // Fallback to demo simulation
        simulateVoiceCommand();
      };
      
      recognitionInstance.onend = () => {
        if (isListening) {
          // Restart listening if we're still in listening mode
          setTimeout(() => {
            if (isListening) {
              try {
                recognitionInstance.start();
              } catch (error) {
                console.error('Failed to restart recognition:', error);
              }
            }
          }, 100);
        }
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    
    if (command.includes('email')) {
      // Simulate email capture
      setTimeout(() => {
        onEmailCapture('demo@adaptmaxfit.com');
      }, 1000);
    } else if (command.includes('password')) {
      // Simulate password capture
      setTimeout(() => {
        onPasswordCapture('demo123');
      }, 1000);
    } else if (command.includes('login') || command.includes('sign in')) {
      onSubmit();
    } else if (command.includes('show password')) {
      onTogglePasswordVisibility();
    } else if (command.includes('clear email')) {
      onEmailCapture('');
    } else if (command.includes('clear password')) {
      onPasswordCapture('');
    }
  };

  const simulateVoiceCommand = () => {
    // Fallback simulation
    setTimeout(() => {
      const commands = ['email', 'password', 'login'];
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      handleVoiceCommand(randomCommand);
    }, 2000);
  };

  useEffect(() => {
    if (isListening) {
      setVoiceInstructions('Say "email", "password", "login", or other commands...');
      
      if (recognition) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
          simulateVoiceCommand();
        }
      } else {
        simulateVoiceCommand();
      }
    } else {
      setVoiceInstructions('');
      if (recognition) {
        recognition.stop();
      }
    }
  }, [isListening, recognition]);

  const getVoiceCommands = () => {
    return [
      { command: '"Email"', description: 'Start entering your email address' },
      { command: '"Password"', description: 'Start entering your password' },
      { command: '"Show password"', description: 'Toggle password visibility' },
      { command: '"Login" or "Sign in"', description: 'Submit the login form' },
      { command: '"Clear email"', description: 'Clear the email field' },
      { command: '"Clear password"', description: 'Clear the password field' },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Voice Control Button */}
      <div className="text-center">
        <motion.div
          animate={isListening ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
        >
          <Button
            onClick={onToggleListening}
            variant={isListening ? 'danger' : 'primary'}
            size="xl"
            className={`rounded-full w-20 h-20 p-0 ${
              isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            ariaLabel={isListening ? "Stop voice input" : "Start voice input"}
          >
            {isListening ? <MicOff size={28} /> : <Mic size={28} />}
          </Button>
        </motion.div>
        
        <p className="mt-3 text-sm text-gray-600">
          {isListening ? 'Voice control active - Tap to stop' : 'Tap for voice control'}
        </p>
      </div>

      {/* Voice Instructions */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
            <Volume2 size={20} />
            <span className="text-lg font-medium">{voiceInstructions}</span>
          </div>
          
          {currentField !== 'none' && (
            <div className="mt-4 flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [20, 40, 20],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 bg-blue-500 rounded-full"
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Current Field Indicator */}
      {isListening && currentField !== 'none' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-xl border-2 ${
            currentField === 'email' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-green-500 bg-green-50'
          }`}
        >
          <div className="text-center">
            <h4 className={`font-semibold ${
              currentField === 'email' ? 'text-blue-900' : 'text-green-900'
            }`}>
              Now capturing: {currentField === 'email' ? 'Email Address' : 'Password'}
            </h4>
            <p className={`text-sm ${
              currentField === 'email' ? 'text-blue-700' : 'text-green-700'
            }`}>
              Speak clearly and say "done" when finished
            </p>
          </div>
        </motion.div>
      )}

      {/* Voice Commands Help */}
      {isListening && currentField === 'none' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-4"
        >
          <h4 className="font-semibold text-gray-900 mb-3 text-center">Voice Commands</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {getVoiceCommands().map((cmd, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs">
                  {cmd.command}
                </span>
                <span className="text-gray-700 flex-1">{cmd.description}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Form Fields with Voice Status */}
      <div className="space-y-4">
        {/* Email Field */}
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
            {currentField === 'email' && isListening && (
              <span className="ml-2 text-blue-600 text-xs">🎤 Listening...</span>
            )}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className={`w-full pl-4 pr-4 py-4 border-2 rounded-xl transition-all duration-200 ${
              currentField === 'email' && isListening
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
            }`}
            placeholder="Voice will fill this automatically"
          />
          {email && (
            <div className="absolute right-3 top-11 text-green-500">
              ✓
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
            {currentField === 'password' && isListening && (
              <span className="ml-2 text-green-600 text-xs">🎤 Listening...</span>
            )}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              readOnly
              className={`w-full pl-4 pr-12 py-4 border-2 rounded-xl transition-all duration-200 ${
                currentField === 'password' && isListening
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
              placeholder="Voice will fill this automatically"
            />
            <button
              type="button"
              onClick={onTogglePasswordVisibility}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {password && (
            <div className="absolute right-12 top-11 text-green-500">
              ✓
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={onSubmit}
        className="w-full"
        size="lg"
        disabled={!email || !password}
      >
        {isListening ? '🎤 Say "Login" or click here' : 'Sign In'}
      </Button>

      {/* Voice Tips */}
      <div className="text-center text-sm text-gray-600">
        <p>💡 <strong>Voice Tip:</strong> Speak clearly and pause between words for better recognition</p>
      </div>
    </div>
  );
};