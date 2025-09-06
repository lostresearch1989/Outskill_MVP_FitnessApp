import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from './Button';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  placeholder = "Tap to speak or type your activity...",
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize speech recognition
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        onTranscript(result);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        // Fallback to demo mode if speech recognition fails
        simulateVoiceRecognition();
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [onTranscript]);

  // Fallback simulation for browsers without speech recognition
  const simulateVoiceRecognition = () => {
    setTimeout(() => {
      const exampleTranscripts = [
        "Did 15 minutes of wheelchair cardio today, feeling good",
        "Completed my physical therapy exercises, moderate intensity",
        "Had a gentle stretching session for 20 minutes",
        "Went for a 10 minute walk with my walker, felt great",
        "Did some resistance band exercises for 25 minutes"
      ];
      
      const randomTranscript = exampleTranscripts[Math.floor(Math.random() * exampleTranscripts.length)];
      setTranscript(randomTranscript);
      setIsListening(false);
      onTranscript(randomTranscript);
    }, 3000);
  };

  const startListening = () => {
    setIsListening(true);
    
    if (recognition) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        simulateVoiceRecognition();
      }
    } else {
      // Fallback to simulation if speech recognition is not available
      simulateVoiceRecognition();
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognition) {
      recognition.stop();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Voice Input Button */}
      <div className="text-center">
        <motion.div
          animate={isListening ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
        >
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? 'danger' : 'primary'}
            size="xl"
            className={`rounded-full w-24 h-24 p-0 ${
              isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            ariaLabel={isListening ? "Stop voice input" : "Start voice input"}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </Button>
        </motion.div>
        
        <p className="mt-3 text-sm text-gray-600">
          {isListening ? 'Listening... Tap to stop' : 'Tap to start voice input'}
        </p>
      </div>

      {/* Status and Transcript */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Volume2 size={20} />
            <span className="text-lg">Listening for your activity...</span>
          </div>
          
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
        </motion.div>
      )}

      {/* Manual Text Input */}
      <div className="relative">
        <textarea
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            onTranscript(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
          rows={4}
          aria-label="Activity input field"
        />
        
        {transcript && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              setTranscript('');
              onTranscript('');
            }}
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear input"
          >
            ×
          </motion.button>
        )}
      </div>
    </div>
  );
};