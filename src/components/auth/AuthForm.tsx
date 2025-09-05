import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Heart, Mic } from 'lucide-react';
import { Button } from '../ui/Button';
import { VoiceLoginInput } from '../ui/VoiceLoginInput';
import { useAuth } from '../../contexts/AuthContext';

export const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useVoiceMode, setUseVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentVoiceField, setCurrentVoiceField] = useState<'email' | 'password' | 'none'>('none');

  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        // Check for rate limit error
        if (error.message.includes('over_email_send_rate_limit') || 
            error.message.includes('rate limit') ||
            error.message.includes('50 seconds')) {
          setError('Too many requests. Please wait 50 seconds before trying again for security purposes.');
        } else if (error.message.includes('email_not_confirmed') || 
                   error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in. Check your spam folder if you don\'t see it.');
        } else {
          setError(error.message);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      
      // Check for rate limit in caught errors too
      if (errorMessage.includes('over_email_send_rate_limit') || 
          errorMessage.includes('rate limit') ||
          errorMessage.includes('50 seconds')) {
        setError('Too many requests. Please wait 50 seconds before trying again for security purposes.');
      } else if (errorMessage.includes('email_not_confirmed') || 
                 errorMessage.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before signing in. Check your spam folder if you don\'t see it.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Simulated voice recognition functions
  const startVoiceRecognition = () => {
    setIsListening(true);
    setCurrentVoiceField('none');
    
    // Simulate voice command recognition
    setTimeout(() => {
      // This would be replaced with actual speech recognition
      simulateVoiceCommand();
    }, 2000);
  };

  const stopVoiceRecognition = () => {
    setIsListening(false);
    setCurrentVoiceField('none');
  };

  const simulateVoiceCommand = () => {
    // Simulate different voice commands for demo
    const commands = ['email', 'password', 'login'];
    const randomCommand = commands[Math.floor(Math.random() * commands.length)];
    
    switch (randomCommand) {
      case 'email':
        setCurrentVoiceField('email');
        setTimeout(() => {
          setEmail('demo@example.com');
          setCurrentVoiceField('none');
        }, 3000);
        break;
      case 'password':
        setCurrentVoiceField('password');
        setTimeout(() => {
          setPassword('demopassword123');
          setCurrentVoiceField('none');
        }, 3000);
        break;
      case 'login':
        if (email && password) {
          handleSubmit(new Event('submit') as any);
        }
        setIsListening(false);
        break;
    }
  };

  const handleVoiceEmailCapture = (capturedEmail: string) => {
    setEmail(capturedEmail);
  };

  const handleVoicePasswordCapture = (capturedPassword: string) => {
    setPassword(capturedPassword);
  };

  const handleVoiceSubmit = () => {
    if (email && password) {
      handleSubmit(new Event('submit') as any);
    }
    setIsListening(false);
  };

  const toggleVoiceListening = () => {
    if (isListening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo and Welcome */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6"
          >
            <Heart size={40} className="text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to AdaptFit
          </h1>
          <p className="text-gray-600">
            Personalized fitness for everyone, everywhere
          </p>
          
          {/* Voice Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUseVoiceMode(!useVoiceMode)}
            className={`mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              useVoiceMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Mic size={16} className="inline mr-2" />
            {useVoiceMode ? 'Voice Mode Active' : 'Enable Voice Mode'}
          </motion.button>
        </div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {useVoiceMode ? (
              /* Voice Input Mode */
              <VoiceLoginInput
                onEmailCapture={handleVoiceEmailCapture}
                onPasswordCapture={handleVoicePasswordCapture}
                onSubmit={handleVoiceSubmit}
                isListening={isListening}
                onToggleListening={toggleVoiceListening}
                currentField={currentVoiceField}
                email={email}
                password={password}
                showPassword={showPassword}
                onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
              />
            ) : (
              /* Traditional Input Mode */
              <>
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </Button>
              </>
            )}

            {/* Error Message */}
            {error && !useVoiceMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Toggle Mode */}
            {!useVoiceMode && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                </button>
              </div>
            )}
          </form>
        </motion.div>

        {/* Accessibility Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-sm text-gray-600"
        >
          <p>✨ Designed with accessibility in mind</p>
          <p>
            {useVoiceMode ? '🎤 Voice control active' : 'Voice control available'}, 
            high contrast, and more accessibility features
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};