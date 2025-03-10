import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, Clock, Calendar, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface Category {
  id: string;
  name: string;
  color?: string;
  timeSpent?: number; // in seconds
  isActive?: boolean;
}

interface Session {
  id: string;
  categoryId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  duration: number; // in seconds
  date: string; // YYYY-MM-DD
}

interface SessionsManagerProps {
  categories?: Category[];
  sessions?: Session[];
  onAddSession?: (session: Omit<Session, "id">) => void;
  onDeleteSession?: (sessionId: string) => void;
}

const SessionsManager: React.FC<SessionsManagerProps> = ({
  categories = [],
  sessions = [],
  onAddSession = () => {},
  onDeleteSession = () => {},
}) => {
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [newSession, setNewSession] = useState<Omit<Session, "id">>(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    return {
      categoryId: "",
      startTime: formatTimeForInput(oneHourAgo),
      endTime: formatTimeForInput(now),
      duration: 3600, // 1 hour in seconds
      date: formatDateForInput(now),
    };
  });
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  // Helper function to format date for input field
  function formatDateForInput(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  // Helper function to format time for input field (HH:MM)
  function formatTimeForInput(date: Date): string {
    return date.toTimeString().substring(0, 5);
  }

  // Calculate duration when start or end time changes
  const calculateDuration = (
    startTime: string,
    endTime: string,
    date: string,
  ) => {
    const startDate = new Date(`${date}T${startTime}:00`);
    const endDate = new Date(`${date}T${endTime}:00`);

    // If end time is earlier than start time, assume it's the next day
    let durationMs = endDate.getTime() - startDate.getTime();
    if (durationMs < 0) {
      // Add 24 hours
      durationMs += 24 * 60 * 60 * 1000;
    }

    return Math.floor(durationMs / 1000); // Convert to seconds
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startTime = e.target.value;
    const duration = calculateDuration(
      startTime,
      newSession.endTime,
      newSession.date,
    );
    setNewSession({ ...newSession, startTime, duration });
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endTime = e.target.value;
    const duration = calculateDuration(
      newSession.startTime,
      endTime,
      newSession.date,
    );
    setNewSession({ ...newSession, endTime, duration });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    const duration = calculateDuration(
      newSession.startTime,
      newSession.endTime,
      date,
    );
    setNewSession({ ...newSession, date, duration });
  };

  const handleAddSession = () => {
    if (newSession.categoryId && newSession.duration > 0) {
      onAddSession(newSession);

      // Reset form with current time
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      setNewSession({
        categoryId: "",
        startTime: formatTimeForInput(oneHourAgo),
        endTime: formatTimeForInput(now),
        duration: 3600,
        date: formatDateForInput(now),
      });

      setIsAddingSession(false);
    }
  };

  // Format time display (HH:MM:SS)
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Format datetime for display
  const formatDateTime = (timeString: string, dateString: string) => {
    const date = new Date(`${dateString}T${timeString}:00`);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Group sessions by date
  const sessionsByDate = sessions.reduce(
    (acc, session) => {
      if (!acc[session.date]) {
        acc[session.date] = [];
      }
      acc[session.date].push(session);
      return acc;
    },
    {} as Record<string, Session[]>,
  );

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(sessionsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <Card className="w-full h-full bg-white dark:bg-gray-900">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">Manual Sessions</CardTitle>
            <CardDescription>
              Add study sessions you forgot to track with the timer
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAddingSession(true)}
            className="flex items-center gap-1"
            size="sm"
          >
            <Plus size={16} />
            <span>Add Session</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAddingSession && (
          <div className="p-4 border rounded-md mb-6 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-medium mb-3">Add New Study Session</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Subject
                </label>
                <Select
                  value={newSession.categoryId}
                  onValueChange={(value) =>
                    setNewSession({ ...newSession, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Date</label>
                <Input
                  type="date"
                  value={newSession.date}
                  onChange={handleDateChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Start Time
                  </label>
                  <Input
                    type="time"
                    value={newSession.startTime}
                    onChange={handleStartTimeChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    End Time
                  </label>
                  <Input
                    type="time"
                    value={newSession.endTime}
                    onChange={handleEndTimeChange}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Duration
                </label>
                <div className="text-lg font-mono font-bold py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                  {formatTime(newSession.duration)}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingSession(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSession}
                  disabled={!newSession.categoryId || newSession.duration <= 0}
                >
                  Add Session
                </Button>
              </div>
            </div>
          </div>
        )}

        {sortedDates.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p>No manual sessions added yet</p>
            <p className="text-sm mt-1">
              Add sessions you forgot to track with the timer
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date) => (
              <div key={date} className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-gray-500" />
                  <h3 className="font-medium">
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                </div>

                <div className="space-y-2">
                  {sessionsByDate[date].map((session) => {
                    const category = categories.find(
                      (c) => c.id === session.categoryId,
                    );
                    return (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 rounded-md border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                            style={{
                              backgroundColor: category?.color || "#888",
                            }}
                          >
                            <Clock size={16} />
                          </div>
                          <div>
                            <div className="font-medium">
                              {category?.name || "Unknown Subject"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDateTime(session.startTime, session.date)}{" "}
                              - {formatDateTime(session.endTime, session.date)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono">
                            {formatTime(session.duration)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => setSessionToDelete(session.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Session Confirmation Dialog */}
        {sessionToDelete && (
          <AlertDialog
            open={!!sessionToDelete}
            onOpenChange={(open) => !open && setSessionToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Session</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this session? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => {
                    if (sessionToDelete) {
                      onDeleteSession(sessionToDelete);
                    }
                    setSessionToDelete(null);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionsManager;
