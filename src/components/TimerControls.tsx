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
        <CardTitle className="text-xl font-bold">Timer Controls</CardTitle>
        <CardDescription>
          Choose a timer mode and configure settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={mode}
          onValueChange={(value) => onModeChange(value as any)}
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger
              value="pomodoro"
              className="flex items-center gap-1 relative z-10"
            >
              <Timer className="h-4 w-4" />
              <span>Pomodoro</span>
            </TabsTrigger>
            <TabsTrigger
              value="stopwatch"
              className="flex items-center gap-1 relative z-10"
            >
              <Clock className="h-4 w-4" />
              <span>Stopwatch</span>
            </TabsTrigger>
            <TabsTrigger
              value="countdown"
              className="flex items-center gap-1 relative z-10"
            >
              <Timer className="h-4 w-4" />
              <span>Countdown</span>
            </TabsTrigger>
          </TabsList>

          {/* Pomodoro Settings */}
          <TabsContent value="pomodoro">
            <div className="space-y-4">
              <div className="text-center py-6 bg-gray-50 rounded-md mb-4">
                <div className="text-4xl font-mono font-bold">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {isRunning ? "Work Session" : "Ready to Start"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Work Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={pomodoroSettings.workDuration}
                    onChange={(e) =>
                      handlePomodoroSettingsChange(
                        "workDuration",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Break Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={pomodoroSettings.breakDuration}
                    onChange={(e) =>
                      handlePomodoroSettingsChange(
                        "breakDuration",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Long Break Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    min={5}
                    max={60}
                    value={pomodoroSettings.longBreakDuration}
                    onChange={(e) =>
                      handlePomodoroSettingsChange(
                        "longBreakDuration",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Long Break After (sessions)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={pomodoroSettings.longBreakInterval}
                    onChange={(e) =>
                      handlePomodoroSettingsChange(
                        "longBreakInterval",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Stopwatch Settings */}
          <TabsContent value="stopwatch">
            <div className="space-y-4">
              <div className="text-center py-6 bg-gray-50 rounded-md mb-4">
                <div className="text-4xl font-mono font-bold">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {isRunning ? "Running" : "Ready"}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">
                    Auto-pause when idle
                  </label>
                  <Switch
                    checked={generalSettings.autoPause}
                    onCheckedChange={(checked) =>
                      handleGeneralSettingsChange("autoPause", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Countdown Settings */}
          <TabsContent value="countdown">
            <div className="space-y-4">
              <div className="text-center py-6 bg-gray-50 rounded-md mb-4">
                <div className="text-4xl font-mono font-bold">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {isRunning ? "Counting Down" : "Set Time and Start"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Hours
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={countdownSettings.hours}
                    onChange={(e) =>
                      handleCountdownSettingsChange(
                        "hours",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Minutes
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={countdownSettings.minutes}
                    onChange={(e) =>
                      handleCountdownSettingsChange(
                        "minutes",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Seconds
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={countdownSettings.seconds}
                    onChange={(e) =>
                      handleCountdownSettingsChange(
                        "seconds",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Common Controls */}
        <div className="flex justify-center space-x-4 mt-6">
          {!isRunning ? (
            <Button
              onClick={onStart}
              className="flex items-center gap-2"
              size="lg"
            >
              <Play className="h-4 w-4" />
              <span>Start</span>
            </Button>
          ) : (
            <Button
              onClick={onPause}
              variant="outline"
              className="flex items-center gap-2"
              size="lg"
            >
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </Button>
          )}
          <Button
            onClick={onReset}
            variant="outline"
            className="flex items-center gap-2"
            size="lg"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>

        {/* General Settings */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>General Settings</span>
            </h3>
          </div>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm">Sound Notifications</label>
              <Switch
                checked={generalSettings.soundEnabled}
                onCheckedChange={(checked) =>
                  handleGeneralSettingsChange("soundEnabled", checked)
                }
              />
            </div>
            {generalSettings.soundEnabled && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Volume</label>
                  <span className="text-xs text-gray-500">
                    {generalSettings.soundVolume}%
                  </span>
                </div>
                <Slider
                  value={[generalSettings.soundVolume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    handleGeneralSettingsChange("soundVolume", value[0])
                  }
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <label className="text-sm">Auto-pause when idle</label>
              <Switch
                checked={generalSettings.autoPause}
                onCheckedChange={(checked) =>
                  handleGeneralSettingsChange("autoPause", checked)
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerControls;
