import React, { useState, useEffect } from "react";
import MainInterface from "./MainInterface";
import FloatingWidget from "./FloatingWidget";

const Home: React.FC = () => {
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("timer");
  // If the user clicks on the tasks tab, redirect to timer tab
  useEffect(() => {
    if (activeTab === "tasks") {
      setActiveTab("timer");
    }
  }, [activeTab]);
  const [timerState, setTimerState] = useState({
    isRunning: false,
    currentTime: 0, // Start at 0 for stopwatch
    mode: "stopwatch",
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

  // Effect to check for midnight reset
  useEffect(() => {
    const checkMidnightReset = () => {
      const now = new Date();
      const lastResetDate = localStorage.getItem("lastResetDate");
      const today = now.toDateString();

      // If it's a new day and we haven't reset yet
      if (lastResetDate !== today && now.getHours() === 0) {
        // Reset timer
        setTimerState({
          isRunning: false,
          currentTime: 0, // Always reset to 0 for stopwatch
          mode: "stopwatch",
        });

        // Mark as reset for today
        localStorage.setItem("lastResetDate", today);
      }
    };

    // Check on component mount and every minute
    checkMidnightReset();
    const intervalId = setInterval(checkMidnightReset, 60000);

    return () => clearInterval(intervalId);
  }, [timerState.mode]);

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
      currentTime: 0, // Always reset to 0 for stopwatch
    }));

    // Reset ALL categories' time in localStorage, not just active ones
    const savedCategories = localStorage.getItem("studyCategories");
    if (savedCategories) {
      const categories = JSON.parse(savedCategories);
      const updatedCategories = categories.map((cat) => ({
        ...cat,
        timeSpent: 0,
        isActive: false,
      }));
      localStorage.setItem(
        "studyCategories",
        JSON.stringify(updatedCategories),
      );
    }
  };

  // No longer need mode change since we only use stopwatch
  const handleModeChange = () => {
    // Keep stopwatch mode only
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
