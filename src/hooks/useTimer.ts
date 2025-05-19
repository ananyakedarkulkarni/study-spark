import { useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TimerMode } from '../types';

// Beep sound for timer completion
const beepSound = new Audio('https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3');

export const useTimer = () => {
  const {
    timerSettings,
    updateTimerSettings,
    timerMode,
    setTimerMode,
    timerStatus,
    setTimerStatus,
    timeRemaining,
    setTimeRemaining,
    currentRound,
    setCurrentRound
  } = useAppContext();

  const timerRef = useRef<number | null>(null);

  // Start the timer
  const startTimer = () => {
    if (timerStatus !== 'running') {
      setTimerStatus('running');
    }
  };

  // Pause the timer
  const pauseTimer = () => {
    if (timerStatus === 'running') {
      setTimerStatus('paused');
    }
  };

  // Reset the timer
  const resetTimer = () => {
    setTimerStatus('idle');
    switch (timerMode) {
      case 'focus':
        setTimeRemaining(timerSettings.focusTime * 60);
        break;
      case 'shortBreak':
        setTimeRemaining(timerSettings.shortBreakTime * 60);
        break;
      case 'longBreak':
        setTimeRemaining(timerSettings.longBreakTime * 60);
        break;
    }
  };

  // Change timer mode
  const changeMode = (mode: TimerMode) => {
    if (timerStatus === 'running') {
      pauseTimer();
    }
    setTimerMode(mode);
    setTimerStatus('idle');
  };

  // Handle timer completion
  const handleTimerComplete = () => {
    beepSound.play();
    setTimerStatus('completed');
    
    // Logic for cycling through focus and breaks
    if (timerMode === 'focus') {
      if (currentRound % timerSettings.rounds === 0) {
        // After last round in a set, take a long break
        setTimerMode('longBreak');
      } else {
        // After other focus sessions, take a short break
        setTimerMode('shortBreak');
      }
    } else {
      // After any break, go back to focus mode
      setTimerMode('focus');
      
      // Only increment round after completing a break
      if (timerMode === 'longBreak') {
        // Reset round count after a long break
        setCurrentRound(1);
      } else if (timerMode === 'shortBreak') {
        // Increment round after a short break
        setCurrentRound(prev => prev + 1);
      }
    }
  };

  // Format time for display (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    if (timerStatus === 'running' && timeRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current as number);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerStatus !== 'running' && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerStatus, timeRemaining]);

  // Effect to reset timer when mode or settings change
  useEffect(() => {
    if (timerStatus === 'idle') {
      switch (timerMode) {
        case 'focus':
          setTimeRemaining(timerSettings.focusTime * 60);
          break;
        case 'shortBreak':
          setTimeRemaining(timerSettings.shortBreakTime * 60);
          break;
        case 'longBreak':
          setTimeRemaining(timerSettings.longBreakTime * 60);
          break;
      }
    }
  }, [timerMode, timerSettings]);

  return {
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
    formattedTime: formatTime(timeRemaining),
    timerMode,
    timerStatus,
    currentRound,
    timerSettings,
    updateTimerSettings
  };
};