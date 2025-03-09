import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import TimerControls from "./TimerControls";
import TaskManager from "./TaskManager";
import AnalyticsDashboard from "./AnalyticsDashboard";
import SettingsPanel from "./SettingsPanel";
import WidgetSettings from "./WidgetSettings";
import ThemeToggle from "./ThemeToggle";

// Helper function to format time
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

interface MainInterfaceProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isWidgetVisible?: boolean;
  onToggleWidget?: () => void;
  timerState?: {
    isRunning: boolean;
    currentTime: number;
    mode: string;
  };
  setTimerState?: React.Dispatch<
    React.SetStateAction<{
      isRunning: boolean;
      currentTime: number;
      mode: string;
    }>
  >;
  onTimerStart?: () => void;
  onTimerPause?: () => void;
  onTimerReset?: () => void;
  onModeChange?: (mode: "pomodoro" | "stopwatch" | "countdown") => void;
}

const MainInterface: React.FC<MainInterfaceProps> = ({
  activeTab = "timer",
  onTabChange = () => {},
  isWidgetVisible = true,
  onToggleWidget = () => {},
  timerState: externalTimerState,
  setTimerState: externalSetTimerState,
  onTimerStart = () => {},
  onTimerPause = () => {},
  onTimerReset = () => {},
  onModeChange = () => {},
}) => {
  // Use the external timer state if provided, otherwise create a local one
  const [localTimerState, setLocalTimerState] = useState({
    isRunning: false,
    currentTime: 1500, // 25 minutes in seconds
    mode: "pomodoro",
  });

  // Use either the external or local timer state
  const timerState = externalTimerState || localTimerState;
  const setTimerState = externalSetTimerState || setLocalTimerState;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tasks, setTasks] = useState<
    Array<{
      id: string;
      name: string;
      categoryId: string;
      status: "completed" | "inProgress" | "incomplete";
    }>
  >([]);
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      color: string;
      timeSpent: number;
      isActive: boolean;
    }>
  >(() => {
    // Load categories from localStorage if available
    const savedCategories = localStorage.getItem("studyCategories");
    return savedCategories ? JSON.parse(savedCategories) : [];
  });
  const [tags, setTags] = useState([
    { id: "1", name: "Important", color: "#ef4444" },
    { id: "2", name: "Urgent", color: "#f97316" },
    { id: "3", name: "Focus", color: "#8b5cf6" },
    { id: "4", name: "Deep Work", color: "#0ea5e9" },
    { id: "5", name: "Quick Task", color: "#10b981" },
  ]);

  // Effect to reset tasks at midnight
  useEffect(() => {
    // Function to check if it's midnight and reset tasks
    const resetTasksAtMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setTasks([]);
      }
    };

    // Check every minute
    const intervalId = setInterval(resetTasksAtMidnight, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Add timer effect to MainInterface as well
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (timerState.isRunning) {
      intervalId = setInterval(() => {
        // Also update the active category's time
        if (selectedCategory) {
          const updatedCategories = categories.map((cat) =>
            cat.id === selectedCategory && cat.isActive
              ? { ...cat, timeSpent: cat.timeSpent + 1 }
              : cat,
          );
          setCategories(updatedCategories);
          localStorage.setItem(
            "studyCategories",
            JSON.stringify(updatedCategories),
          );
        }
      }, 1000);
    } else {
      // When timer is paused, also update the active category status
      if (selectedCategory) {
        const updatedCategories = categories.map((cat) =>
          cat.id === selectedCategory ? { ...cat, isActive: false } : cat,
        );
        setCategories(updatedCategories);
        localStorage.setItem(
          "studyCategories",
          JSON.stringify(updatedCategories),
        );
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerState.isRunning, selectedCategory, categories]);

  const handleTimerStart = () => {
    // Call the external handler if provided
    if (externalSetTimerState) {
      onTimerStart();
    } else {
      setTimerState((prev) => ({ ...prev, isRunning: true }));
    }

    // When timer is started, also update the active category status
    if (selectedCategory) {
      const updatedCategories = categories.map((cat) =>
        cat.id === selectedCategory ? { ...cat, isActive: true } : cat,
      );
      setCategories(updatedCategories);
      localStorage.setItem(
        "studyCategories",
        JSON.stringify(updatedCategories),
      );
    }
  };

  const handleTimerPause = () => {
    // Call the external handler if provided
    if (externalSetTimerState) {
      onTimerPause();
    } else {
      setTimerState((prev) => ({ ...prev, isRunning: false }));
    }

    // When timer is paused, also update the active category status
    if (selectedCategory) {
      const updatedCategories = categories.map((cat) =>
        cat.id === selectedCategory ? { ...cat, isActive: false } : cat,
      );
      setCategories(updatedCategories);
      localStorage.setItem(
        "studyCategories",
        JSON.stringify(updatedCategories),
      );
    }
  };

  const handleTimerReset = () => {
    // Call the external handler if provided
    if (externalSetTimerState) {
      onTimerReset();
    } else {
      setTimerState((prev) => ({
        ...prev,
        isRunning: false,
        currentTime: prev.mode === "pomodoro" ? 1500 : 0,
      }));
    }

    // When timer is reset, also update the active category status
    if (selectedCategory) {
      const updatedCategories = categories.map((cat) =>
        cat.id === selectedCategory ? { ...cat, isActive: false } : cat,
      );
      setCategories(updatedCategories);
      localStorage.setItem(
        "studyCategories",
        JSON.stringify(updatedCategories),
      );
    }
  };

  const handleModeChange = (mode: "pomodoro" | "stopwatch" | "countdown") => {
    // Call the external handler if provided
    if (externalSetTimerState) {
      onModeChange(mode);
    } else {
      setTimerState({
        isRunning: false,
        currentTime: mode === "pomodoro" ? 1500 : 0,
        mode,
      });
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    // Check if the category is already selected and active
    const category = categories.find((cat) => cat.id === categoryId);
    const isAlreadyActive = category?.isActive;

    // If clicking the same active category, pause it instead of resetting
    if (selectedCategory === categoryId && isAlreadyActive) {
      // Pause the timer
      if (externalSetTimerState) {
        onTimerPause();
      } else {
        setTimerState((prev) => ({ ...prev, isRunning: false }));
      }

      // Update category status
      const updatedCategories = categories.map((cat) =>
        cat.id === categoryId ? { ...cat, isActive: false } : cat,
      );
      setCategories(updatedCategories);
      localStorage.setItem(
        "studyCategories",
        JSON.stringify(updatedCategories),
      );
      return;
    }

    // If we're switching from one active category to another, first deactivate the current one
    if (selectedCategory && selectedCategory !== categoryId) {
      const updatedCategories = categories.map((cat) =>
        cat.id === selectedCategory ? { ...cat, isActive: false } : cat,
      );
      setCategories(updatedCategories);
      localStorage.setItem(
        "studyCategories",
        JSON.stringify(updatedCategories),
      );
    }

    // Start timer for the selected category
    const updatedCategories = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, isActive: true } : cat,
    );
    setCategories(updatedCategories);
    localStorage.setItem("studyCategories", JSON.stringify(updatedCategories));
    setSelectedCategory(categoryId);

    // Start the timer when a category is selected
    if (timerState.mode === "stopwatch") {
      // Always resume the timer, never reset it
      if (externalSetTimerState) {
        onTimerStart();
      } else {
        setTimerState((prev) => ({
          ...prev,
          isRunning: true,
        }));
      }
    }
  };

  const handleTagsSelect = (tagIds: string[]) => {
    setSelectedTags(tagIds);
  };

  const handleCreateCategory = (
    category: Omit<{ id: string; name: string; color?: string }, "id">,
  ) => {
    const newCategory = {
      ...category,
      id: `category-${Date.now()}`,
      timeSpent: 0,
      isActive: false,
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem("studyCategories", JSON.stringify(updatedCategories));
  };

  const handleUpdateCategory = (updatedCategory: {
    id: string;
    name: string;
    color?: string;
    timeSpent?: number;
    isActive?: boolean;
  }) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === updatedCategory.id
        ? {
            ...cat,
            ...updatedCategory,
            timeSpent: updatedCategory.timeSpent ?? cat.timeSpent,
            isActive: updatedCategory.isActive ?? cat.isActive,
          }
        : cat,
    );
    setCategories(updatedCategories);
    localStorage.setItem("studyCategories", JSON.stringify(updatedCategories));
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
    setCategories(updatedCategories);
    localStorage.setItem("studyCategories", JSON.stringify(updatedCategories));
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }
  };

  const handleCreateTag = (
    tag: Omit<{ id: string; name: string; color?: string }, "id">,
  ) => {
    const newTag = {
      ...tag,
      id: `tag-${Date.now()}`,
    };
    setTags([...tags, newTag]);
  };

  const handleUpdateTag = (updatedTag: {
    id: string;
    name: string;
    color?: string;
  }) => {
    setTags(tags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag)));
  };

  const handleDeleteTag = (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  const handleCreateTask = (
    task: Omit<
      { id: string; name: string; categoryId: string; status: string },
      "id"
    >,
  ) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (updatedTask: {
    id: string;
    name: string;
    categoryId: string;
    status: string;
  }) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="w-full h-full bg-white p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Study Time Tracker</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={onToggleWidget}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isWidgetVisible ? "Hide" : "Show"} Floating Widget
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="timer" className="relative z-10">
            Timer
          </TabsTrigger>
          <TabsTrigger value="tasks" className="relative z-10">
            Tasks
          </TabsTrigger>
          <TabsTrigger value="analytics" className="relative z-10">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="relative z-10">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TimerControls
              isRunning={timerState.isRunning}
              currentTime={timerState.currentTime}
              mode={timerState.mode as any}
              onStart={handleTimerStart}
              onPause={handleTimerPause}
              onReset={handleTimerReset}
              onModeChange={handleModeChange}
            />
            <TaskManager
              categories={categories}
              tags={tags}
              tasks={tasks}
              onSelectCategory={handleCategorySelect}
              onSelectTags={handleTagsSelect}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onCreateTag={handleCreateTag}
              onUpdateTag={handleUpdateTag}
              onDeleteTag={handleDeleteTag}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onStartTimer={handleCategorySelect}
            />
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <TaskManager
            categories={categories}
            tags={tags}
            tasks={tasks}
            onSelectCategory={handleCategorySelect}
            onSelectTags={handleTagsSelect}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onCreateTag={handleCreateTag}
            onUpdateTag={handleUpdateTag}
            onDeleteTag={handleDeleteTag}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onStartTimer={handleCategorySelect}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingsPanel />
            {isWidgetVisible && (
              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex justify-center items-center h-full">
                    <div className="relative">
                      <div className="absolute -top-6 left-0 right-0 flex justify-center">
                        <span className="text-xs text-gray-500">
                          Widget Preview
                        </span>
                      </div>
                      <div
                        className="border border-gray-200 shadow-md rounded-md bg-white overflow-hidden"
                        style={{ width: "200px", height: "100px" }}
                      >
                        <div className="p-3 text-center text-sm">
                          <div className="font-mono font-bold">
                            {timerState.mode === "stopwatch"
                              ? formatTime(timerState.currentTime)
                              : "25:00"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {timerState.mode === "stopwatch"
                              ? "Stopwatch"
                              : "Pomodoro Timer"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <WidgetSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MainInterface;
