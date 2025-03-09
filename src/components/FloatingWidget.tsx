import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Settings,
  Minimize2,
  X,
  Maximize2,
  GripHorizontal,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import WidgetSettings from "./WidgetSettings";

interface FloatingWidgetProps {
  isRunning?: boolean;
  currentTime?: number;
  mode?: "pomodoro" | "stopwatch" | "countdown";
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onOpenSettings?: () => void;
}

const FloatingWidget: React.FC<FloatingWidgetProps> = ({
  isRunning = false,
  currentTime = 1500, // 25 minutes in seconds
  mode = "pomodoro",
  onStart = () => {},
  onPause = () => {},
  onReset = () => {},
  onOpenSettings = () => {},
}) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [opacity, setOpacity] = useState(0.8);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [size, setSize] = useState({ width: 200, height: 100 });

  const widgetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

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

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragRef.current && dragRef.current.contains(e.target as Node)) {
      setIsDragging(true);
      const rect = widgetRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Handle settings change
  const handleSettingsChange = (settings: any) => {
    setOpacity(settings.opacity || opacity);
    setSize(settings.size || size);
    // Apply other settings as needed
  };

  // Get status text based on mode and running state
  const getStatusText = () => {
    if (!isRunning) return "Ready";

    switch (mode) {
      case "pomodoro":
        return "Focus Time";
      case "stopwatch":
        return "Tracking";
      case "countdown":
        return "Counting Down";
      default:
        return "Running";
    }
  };

  return (
    <div
      ref={widgetRef}
      className="fixed z-50 shadow-lg rounded-lg overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: opacity,
        width: isMinimized ? "120px" : `${size.width}px`,
        height: isMinimized ? "40px" : `${size.height}px`,
        transition: "opacity 0.3s, width 0.2s, height 0.2s",
        cursor: isDragging ? "grabbing" : "auto",
      }}
    >
      <Card className="w-full h-full bg-white border-0">
        <div
          ref={dragRef}
          className="bg-gray-100 h-8 flex items-center justify-between px-2 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center">
            <GripHorizontal size={14} className="text-gray-500 mr-2" />
            <span className="text-xs font-medium">
              {isMinimized ? "Timer" : "Study Timer"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? (
                      <Maximize2 size={12} />
                    ) : (
                      <Minimize2 size={12} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isMinimized ? "Expand" : "Minimize"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!isMinimized && (
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Settings size={12} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <WidgetSettings
                    opacity={opacity}
                    size={size}
                    onSettingsChange={handleSettingsChange}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <CardContent className="p-3">
          {isMinimized ? (
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono font-bold">
                {formatTime(currentTime)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={isRunning ? onPause : onStart}
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {mode === "stopwatch"
                    ? isRunning
                      ? "Tracking..."
                      : "Paused"
                    : getStatusText()}
                </div>
              </div>

              <div className="flex justify-center space-x-2 mt-2">
                <Button
                  variant={isRunning ? "outline" : "default"}
                  size="sm"
                  onClick={isRunning ? onPause : onStart}
                  className="text-xs h-7 px-3"
                >
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReset}
                  className="text-xs h-7 px-3"
                >
                  Reset
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FloatingWidget;
