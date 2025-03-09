import React, { useState, useEffect } from "react";
import MainInterface from "./MainInterface";
import FloatingWidget from "./FloatingWidget";

const Home: React.FC = () => {
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("timer");
  const [timerState, setTimerState] = useState({
    isRunning: false,
    currentTime: 1500, // 25 minutes in seconds
    mode: "pomodoro",
  });

  // Timer functionality is handled here to ensure synchronization
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (timerState.isRunning) {
      intervalId = setInterval(() => {
        setTimerState((prev) => {
          // For pomodoro and countdown, decrease time
          if (
            (prev.mode === "pomodoro" || prev.mode === "countdown") &&
            prev.currentTime > 0
          ) {
            return { ...prev, currentTime: prev.currentTime - 1 };
          }
          // For stopwatch, increase time
          else if (prev.mode === "stopwatch") {
            return { ...prev, currentTime: prev.currentTime + 1 };
          }
          // If pomodoro or countdown reaches 0, stop the timer
          else if (
            (prev.mode === "pomodoro" || prev.mode === "countdown") &&
            prev.currentTime <= 0
          ) {
            return { ...prev, isRunning: false };
          }
          return prev;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerState.isRunning, timerState.mode]);

  // These handlers now just pass through to MainInterface
  const handleTimerStart = () => {
    setTimerState((prev) => ({ ...prev, isRunning: true }));
  };

  const handleTimerPause = () => {
    setTimerState((prev) => ({ ...prev, isRunning: false }));
  };

  const handleTimerReset = () => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      currentTime: prev.mode === "pomodoro" ? 1500 : 0,
    }));
  };

  const handleModeChange = (mode: "pomodoro" | "stopwatch" | "countdown") => {
    setTimerState({
      isRunning: false,
      currentTime: mode === "pomodoro" ? 1500 : 0,
      mode,
    });
  };

  const toggleWidget = () => {
    setIsWidgetVisible(!isWidgetVisible);
  };

  const handleOpenSettings = () => {
    setActiveTab("settings");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainInterface
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isWidgetVisible={isWidgetVisible}
        onToggleWidget={toggleWidget}
        timerState={timerState}
        setTimerState={setTimerState}
        onTimerStart={handleTimerStart}
        onTimerPause={handleTimerPause}
        onTimerReset={handleTimerReset}
        onModeChange={handleModeChange}
      />

      {isWidgetVisible && (
        <FloatingWidget
          isRunning={timerState.isRunning}
          currentTime={timerState.currentTime}
          mode={timerState.mode as any}
          onStart={handleTimerStart}
          onPause={handleTimerPause}
          onReset={handleTimerReset}
          onOpenSettings={handleOpenSettings}
        />
      )}
    </div>
  );
};

export default Home;
