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

  // We don't need timer functionality here since it's handled in MainInterface
  // This component just passes the timer state to MainInterface and FloatingWidget

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
