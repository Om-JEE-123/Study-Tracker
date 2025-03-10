import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Play, Pause, RotateCcw, Clock, Timer, Settings } from "lucide-react";

interface TimerControlsProps {
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onModeChange?: (mode: "pomodoro" | "stopwatch" | "countdown") => void;
  onSettingsChange?: (settings: any) => void;
  isRunning?: boolean;
  currentTime?: number;
  mode?: "pomodoro" | "stopwatch" | "countdown";
}

const TimerControls: React.FC<TimerControlsProps> = ({
  onStart = () => {},
  onPause = () => {},
  onReset = () => {},
  onModeChange = () => {},
  onSettingsChange = () => {},
  isRunning = false,
  currentTime = 0,
  mode = "pomodoro",
}) => {
  // State for timer settings
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
  });

  const [countdownSettings, setCountdownSettings] = useState({
    hours: 0,
    minutes: 25,
    seconds: 0,
  });

  const [generalSettings, setGeneralSettings] = useState({
    autoPause: true,
    soundEnabled: true,
    soundVolume: 50,
  });

  // Format time display (MM:SS or HH:MM:SS)
  const formatTime = (timeInSeconds: number) => {
    // Ensure timeInSeconds is a number and not negative
    const time = Math.max(0, Number(timeInSeconds) || 0);

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle pomodoro settings change
  const handlePomodoroSettingsChange = (setting: string, value: number) => {
    const newSettings = { ...pomodoroSettings, [setting]: value };
    setPomodoroSettings(newSettings);
    onSettingsChange({ pomodoro: newSettings });
  };

  // Handle countdown settings change
  const handleCountdownSettingsChange = (setting: string, value: number) => {
    const newSettings = { ...countdownSettings, [setting]: value };
    setCountdownSettings(newSettings);
    onSettingsChange({ countdown: newSettings });
  };

  // Handle general settings change
  const handleGeneralSettingsChange = (
    setting: string,
    value: boolean | number,
  ) => {
    const newSettings = { ...generalSettings, [setting]: value };
    setGeneralSettings(newSettings);
    onSettingsChange({ general: newSettings });
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <h4 className="text-xl font-semibold tracking-tight">
          {" "}
          Today's total time:
        </h4>
      </CardHeader>
      <CardContent>
        {/* Only using stopwatch mode */}
        {/* Only Stopwatch Settings */}
        <div className="space-y-4">
          <div className="text-center py-6 bg-gray-50 rounded-md mb-4">
            <div className="text-4xl font-mono font-bold">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>
        {/* End of stopwatch settings */}
        {/* Common Controls */}

        {/* General Settings */}
      </CardContent>
    </Card>
  );
};

export default TimerControls;
