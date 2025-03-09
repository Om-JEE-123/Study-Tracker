import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, Edit2, Check, X, Trophy } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  targetHours: number;
  currentHours: number;
  deadline?: string;
}

interface GoalTrackerProps {
  goals?: Goal[];
  onAddGoal?: (goal: Omit<Goal, "id">) => void;
  onUpdateGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
}

const GoalTracker = ({
  goals = [
    {
      id: "1",
      title: "Complete JavaScript Course",
      targetHours: 40,
      currentHours: 15,
      deadline: "2023-12-31",
    },
    {
      id: "2",
      title: "Master React Fundamentals",
      targetHours: 25,
      currentHours: 10,
      deadline: "2023-11-15",
    },
  ],
  onAddGoal = () => {},
  onUpdateGoal = () => {},
  onDeleteGoal = () => {},
}: GoalTrackerProps) => {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id">>({
    title: "",
    targetHours: 0,
    currentHours: 0,
  });

  const handleAddGoal = () => {
    onAddGoal(newGoal);
    setNewGoal({ title: "", targetHours: 0, currentHours: 0 });
    setIsAddingGoal(false);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    // Pre-fill form with current goal data
  };

  const handleSaveEdit = (goal: Goal) => {
    onUpdateGoal(goal);
    setEditingGoalId(null);
  };

  const handleCancelEdit = () => {
    setEditingGoalId(null);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">Study Goals</CardTitle>
            <CardDescription>
              Track your progress toward study time goals
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAddingGoal(true)}
            className="flex items-center gap-1"
            size="sm"
          >
            <Plus size={16} />
            <span>Add Goal</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAddingGoal ? (
          <div className="p-4 border rounded-md mb-4 bg-gray-50">
            <h4 className="font-medium mb-2">New Goal</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Title</label>
                <Input
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                  placeholder="Enter goal title"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Target Hours
                  </label>
                  <Input
                    type="number"
                    value={newGoal.targetHours}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        targetHours: Number(e.target.value),
                      })
                    }
                    min={1}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Current Hours
                  </label>
                  <Input
                    type="number"
                    value={newGoal.currentHours}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        currentHours: Number(e.target.value),
                      })
                    }
                    min={0}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Deadline (Optional)
                </label>
                <Input
                  type="date"
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, deadline: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingGoal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddGoal}
                  disabled={!newGoal.title || newGoal.targetHours <= 0}
                >
                  Save Goal
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500">
                No goals set yet. Add your first study goal!
              </p>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="border rounded-md p-4">
                {editingGoalId === goal.id ? (
                  <div className="space-y-3">
                    <Input
                      value={goal.title}
                      onChange={(e) =>
                        onUpdateGoal({ ...goal, title: e.target.value })
                      }
                      className="font-medium"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium block mb-1">
                          Target Hours
                        </label>
                        <Input
                          type="number"
                          value={goal.targetHours}
                          onChange={(e) =>
                            onUpdateGoal({
                              ...goal,
                              targetHours: Number(e.target.value),
                            })
                          }
                          min={1}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">
                          Current Hours
                        </label>
                        <Input
                          type="number"
                          value={goal.currentHours}
                          onChange={(e) =>
                            onUpdateGoal({
                              ...goal,
                              currentHours: Number(e.target.value),
                            })
                          }
                          min={0}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        <X size={16} />
                      </Button>
                      <Button size="sm" onClick={() => handleSaveEdit(goal)}>
                        <Check size={16} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{goal.title}</h4>
                        {goal.deadline && (
                          <p className="text-sm text-gray-500">
                            Deadline:{" "}
                            {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Edit2 size={16} />
                      </Button>
                    </div>
                    <div className="mb-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{goal.currentHours} hours completed</span>
                        <span>{goal.targetHours} hours goal</span>
                      </div>
                      <Progress
                        value={calculateProgress(
                          goal.currentHours,
                          goal.targetHours,
                        )}
                        className="h-2"
                      />
                    </div>
                    <div className="text-sm text-right mt-2">
                      <span className="font-medium">
                        {calculateProgress(goal.currentHours, goal.targetHours)}
                        % complete
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalTracker;
