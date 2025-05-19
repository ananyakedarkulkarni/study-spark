import React, { useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import { TimerMode, TimerSettings } from '../types';
import { Play, Pause, RotateCcw, Clock, Settings, X } from 'lucide-react';

interface TimerControlsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  status: string;
}

const TimerControls: React.FC<TimerControlsProps> = ({ onStart, onPause, onReset, status }) => {
  return (
    <div className="flex space-x-2">
      {status === 'running' ? (
        <button 
          onClick={onPause}
          className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
          aria-label="Pause Timer"
        >
          <Pause size={16} />
        </button>
      ) : (
        <button 
          onClick={onStart}
          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
          aria-label="Start Timer"
        >
          <Play size={16} />
        </button>
      )}
      <button 
        onClick={onReset}
        className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-600 transition-colors"
        aria-label="Reset Timer"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
};

interface ModeButtonsProps {
  activeMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

const ModeButtons: React.FC<ModeButtonsProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="flex space-x-2 text-xs">
      <button
        onClick={() => onModeChange('focus')}
        className={`px-2 py-1 rounded-md transition-colors ${
          activeMode === 'focus' 
            ? 'bg-blue-600 text-white' 
            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        }`}
      >
        Focus
      </button>
      <button
        onClick={() => onModeChange('shortBreak')}
        className={`px-2 py-1 rounded-md transition-colors ${
          activeMode === 'shortBreak' 
            ? 'bg-green-600 text-white' 
            : 'bg-green-100 text-green-800 hover:bg-green-200'
        }`}
      >
        Short Break
      </button>
      <button
        onClick={() => onModeChange('longBreak')}
        className={`px-2 py-1 rounded-md transition-colors ${
          activeMode === 'longBreak' 
            ? 'bg-purple-600 text-white' 
            : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
        }`}
      >
        Long Break
      </button>
    </div>
  );
};

interface TimerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
}

const TimerSettingsModal: React.FC<TimerSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSave 
}) => {
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Timer Settings</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Focus Time (minutes)
              </label>
              <input
                type="number"
                name="focusTime"
                min="1"
                max="60"
                value={localSettings.focusTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Short Break (minutes)
              </label>
              <input
                type="number"
                name="shortBreakTime"
                min="1"
                max="30"
                value={localSettings.shortBreakTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Long Break (minutes)
              </label>
              <input
                type="number"
                name="longBreakTime"
                min="1"
                max="60"
                value={localSettings.longBreakTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rounds before Long Break
              </label>
              <input
                type="number"
                name="rounds"
                min="1"
                max="10"
                value={localSettings.rounds}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CompletionPopupProps {
  isVisible: boolean;
  mode: TimerMode;
  onClose: () => void;
}

const CompletionPopup: React.FC<CompletionPopupProps> = ({ isVisible, mode, onClose }) => {
  if (!isVisible) return null;
  
  const message = mode === 'focus' 
    ? "Focus session completed! Take a break."
    : "Break time over! Ready to focus again?";
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <div className="flex flex-col items-center">
          <Clock size={48} className="text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold">{message}</h3>
          <button
            onClick={onClose}
            className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const StudyTimer: React.FC = () => {
  const {
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
    formattedTime,
    timerMode,
    timerStatus,
    currentRound,
    timerSettings,
    updateTimerSettings
  } = useTimer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Get appropriate background color based on current mode
  const getBackgroundColor = () => {
    switch (timerMode) {
      case 'focus':
        return 'bg-blue-600';
      case 'shortBreak':
        return 'bg-green-600';
      case 'longBreak':
        return 'bg-purple-600';
      default:
        return 'bg-blue-600';
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div 
        className={`fixed bottom-4 right-4 ${getBackgroundColor()} text-white rounded-lg shadow-lg transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <div className="p-3">
          <div className="flex justify-between items-center">
            <button
              onClick={toggleExpand}
              className="flex items-center space-x-2"
            >
              <Clock size={20} />
              <span className="font-semibold text-sm">
                {isExpanded ? `Round ${currentRound}/${timerSettings.rounds}` : ''}
              </span>
            </button>
            
            <span className="text-xl font-mono font-bold">{formattedTime}</span>
            
            {isExpanded && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Timer Settings"
              >
                <Settings size={18} />
              </button>
            )}
          </div>
          
          {isExpanded && (
            <div className="mt-3 space-y-3">
              <ModeButtons 
                activeMode={timerMode} 
                onModeChange={changeMode} 
              />
              
              <TimerControls 
                onStart={startTimer}
                onPause={pauseTimer}
                onReset={resetTimer}
                status={timerStatus}
              />
            </div>
          )}
        </div>
      </div>
      
      <TimerSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={timerSettings}
        onSave={updateTimerSettings}
      />
      
      <CompletionPopup 
        isVisible={timerStatus === 'completed'}
        mode={timerMode}
        onClose={() => {
          resetTimer();
          startTimer();
        }}
      />
    </>
  );
};

export default StudyTimer;