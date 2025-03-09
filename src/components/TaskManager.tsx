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
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Plus,
  Tag,
  Folder,
  X,
  Search,
  Edit,
  Trash2,
  Check,
  Play,
  Triangle,
  Clock,
  BookOpen,
  Pause,
} from "lucide-react";
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
import { Checkbox } from "./ui/checkbox";

interface Category {
  id: string;
  name: string;
  color?: string;
  timeSpent?: number; // in seconds
  isActive?: boolean;
}

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface Task {
  id: string;
  name: string;
  categoryId: string;
  status: "completed" | "inProgress" | "incomplete";
  tagIds?: string[];
}

interface TaskManagerProps {
  categories?: Category[];
  tags?: Tag[];
  tasks?: Task[];
  onCreateCategory?: (category: Omit<Category, "id">) => void;
  onCreateTag?: (tag: Omit<Tag, "id">) => void;
  onCreateTask?: (task: Omit<Task, "id">) => void;
  onSelectCategory?: (categoryId: string) => void;
  onSelectTags?: (tagIds: string[]) => void;
  onUpdateCategory?: (category: Category) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onUpdateTag?: (tag: Tag) => void;
  onDeleteTag?: (tagId: string) => void;
  onUpdateTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onStartTimer?: (categoryId: string) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  categories = [],
  tags = [
    { id: "1", name: "Important", color: "#ef4444" },
    { id: "2", name: "Urgent", color: "#f97316" },
    { id: "3", name: "Focus", color: "#8b5cf6" },
    { id: "4", name: "Deep Work", color: "#0ea5e9" },
    { id: "5", name: "Quick Task", color: "#10b981" },
  ],
  tasks = [],
  onCreateCategory = () => {},
  onCreateTag = () => {},
  onCreateTask = () => {},
  onSelectCategory = () => {},
  onSelectTags = () => {},
  onUpdateCategory = () => {},
  onDeleteCategory = () => {},
  onUpdateTag = () => {},
  onDeleteTag = () => {},
  onUpdateTask = () => {},
  onDeleteTask = () => {},
  onStartTimer = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("subjects");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#4f46e5",
  });
  const [newTag, setNewTag] = useState({ name: "", color: "#8b5cf6" });
  const [newTask, setNewTask] = useState({
    name: "",
    categoryId: "",
    status: "incomplete",
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);
  const [editedTag, setEditedTag] = useState<Tag | null>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Filter categories, tags, and tasks based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group tasks by category
  const tasksByCategory = tasks.reduce(
    (acc, task) => {
      if (!acc[task.categoryId]) {
        acc[task.categoryId] = [];
      }
      acc[task.categoryId].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
  );

  const handleCategorySelect = (categoryId: string) => {
    // Start timer for the selected category
    onStartTimer(categoryId);

    // Update local state
    if (selectedCategory === categoryId) {
      // Don't deselect the category when clicking the same one
      // This allows the parent component to handle pause/resume logic
      setSelectedCategory(categoryId);
      onSelectCategory(categoryId);
    } else {
      setSelectedCategory(categoryId);
      onSelectCategory(categoryId);
    }
  };

  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      const updatedTags = selectedTags.filter((id) => id !== tagId);
      setSelectedTags(updatedTags);
      onSelectTags(updatedTags);
    } else {
      const updatedTags = [...selectedTags, tagId];
      setSelectedTags(updatedTags);
      onSelectTags(updatedTags);
    }
  };

  const handleCreateCategory = () => {
    if (newCategory.name.trim()) {
      onCreateCategory(newCategory);
      setNewCategory({ name: "", color: "#4f46e5" });
      setIsCreatingCategory(false);
    }
  };

  const handleCreateTag = () => {
    if (newTag.name.trim()) {
      onCreateTag(newTag);
      setNewTag({ name: "", color: "#8b5cf6" });
      setIsCreatingTag(false);
    }
  };

  const handleCreateTask = () => {
    if (newTask.name.trim() && newTask.categoryId) {
      onCreateTask({
        name: newTask.name,
        categoryId: newTask.categoryId,
        status: "incomplete",
      });
      setNewTask({ name: "", categoryId: "", status: "incomplete" });
      setIsCreatingTask(false);
      console.log("Task created:", newTask);
    } else {
      console.log("Cannot create task - missing name or category", newTask);
    }
  };

  const handleTaskStatusChange = (
    taskId: string,
    status: "completed" | "inProgress" | "incomplete",
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      onUpdateTask({ ...task, status });
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

  const colorOptions = [
    { value: "#4f46e5", label: "Indigo" },
    { value: "#0891b2", label: "Cyan" },
    { value: "#16a34a", label: "Green" },
    { value: "#ca8a04", label: "Yellow" },
    { value: "#dc2626", label: "Red" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#f97316", label: "Orange" },
    { value: "#0ea5e9", label: "Blue" },
    { value: "#10b981", label: "Emerald" },
  ];

  return (
    <Card className="w-full h-full bg-white dark:bg-gray-900">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">Task Management</CardTitle>
            <CardDescription>
              Organize your study sessions with subjects and tasks
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search subjects, tasks or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Tabs
          defaultValue="subjects"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="subjects">
              <BookOpen className="mr-2 h-4 w-4" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <Clock className="mr-2 h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="tags">
              <Tag className="mr-2 h-4 w-4" />
              Tags
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => setIsCreatingCategory(true)}
                className="flex items-center gap-1"
                size="sm"
              >
                <Plus size={16} />
                <span>New Subject</span>
              </Button>
            </div>

            {isCreatingCategory && (
              <div className="p-4 border rounded-md mb-4 bg-gray-50 dark:bg-gray-800">
                <h4 className="font-medium mb-2">Create New Subject</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Subject Name
                    </label>
                    <Input
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      placeholder="Enter subject name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Color
                    </label>
                    <Select
                      value={newCategory.color}
                      onValueChange={(value) =>
                        setNewCategory({ ...newCategory, color: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: color.value }}
                              />
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatingCategory(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateCategory}
                      disabled={!newCategory.name.trim()}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? (
                    <p>No subjects found matching "{searchQuery}"</p>
                  ) : (
                    <p>No subjects created yet</p>
                  )}
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <div key={category.id} className="mb-4">
                    <div
                      className={`flex items-center justify-between p-3 rounded-md border transition-colors ${category.isActive ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    >
                      <div
                        className="flex items-center flex-1 cursor-pointer"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <div
                          className="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.isActive ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          {editingCategoryId === category.id ? (
                            <Input
                              value={editedCategory?.name || category.name}
                              onChange={(e) =>
                                setEditedCategory({
                                  ...category,
                                  name: e.target.value,
                                })
                              }
                              className="h-7 py-1 px-2 w-full max-w-[150px]"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="font-medium">{category.name}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono">
                          {formatTime(category.timeSpent || 0)}
                        </span>
                        {editingCategoryId === category.id ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              if (editedCategory) {
                                onUpdateCategory(editedCategory);
                              }
                              setEditingCategoryId(null);
                              setEditedCategory(null);
                            }}
                          >
                            <Check size={14} />
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategoryId(category.id);
                                setEditedCategory(category);
                              }}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCategoryToDelete(category.id);
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Tasks for this category */}
                    {tasksByCategory[category.id] &&
                      tasksByCategory[category.id].length > 0 && (
                        <div className="ml-8 mt-2 space-y-2">
                          {tasksByCategory[category.id].map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-2 border-l-2 pl-4"
                              style={{ borderColor: category.color }}
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                  {task.status === "completed" ? (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                      onClick={() =>
                                        handleTaskStatusChange(
                                          task.id,
                                          "incomplete",
                                        )
                                      }
                                    >
                                      <Check size={12} />
                                    </Button>
                                  ) : task.status === "inProgress" ? (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                                      onClick={() =>
                                        handleTaskStatusChange(
                                          task.id,
                                          "completed",
                                        )
                                      }
                                    >
                                      <Triangle size={12} />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800"
                                      onClick={() =>
                                        handleTaskStatusChange(
                                          task.id,
                                          "inProgress",
                                        )
                                      }
                                    >
                                      <div className="h-3 w-3 rounded-full border border-gray-400 dark:border-gray-500"></div>
                                    </Button>
                                  )}
                                  <span
                                    className={`text-sm ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
                                  >
                                    {task.name}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-red-500"
                                onClick={() => setTaskToDelete(task.id)}
                              >
                                <X size={12} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Add task button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-8 mt-2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => {
                        setNewTask({ ...newTask, categoryId: category.id });
                        setIsCreatingTask(true);
                      }}
                    >
                      <Plus size={14} className="mr-1" />
                      Add Task
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Create Task Dialog */}
            {isCreatingTask && (
              <div className="p-4 border rounded-md mb-4 bg-gray-50 dark:bg-gray-800">
                <h4 className="font-medium mb-2">Add New Task</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Task Name
                    </label>
                    <Input
                      value={newTask.name}
                      onChange={(e) =>
                        setNewTask({ ...newTask, name: e.target.value })
                      }
                      placeholder="Enter task name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Subject
                    </label>
                    <Select
                      value={newTask.categoryId}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, categoryId: value })
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
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatingTask(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTask}
                      disabled={!newTask.name.trim() || !newTask.categoryId}
                    >
                      Add Task
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">All Tasks</h3>
              <Button
                onClick={() => setIsCreatingTask(true)}
                className="flex items-center gap-1"
                size="sm"
              >
                <Plus size={16} />
                <span>New Task</span>
              </Button>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? (
                  <p>No tasks found matching "{searchQuery}"</p>
                ) : (
                  <p>No tasks created yet</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTasks.map((task) => {
                  const category = categories.find(
                    (c) => c.id === task.categoryId,
                  );
                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-md border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        {task.status === "completed" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                            onClick={() =>
                              handleTaskStatusChange(task.id, "incomplete")
                            }
                          >
                            <Check size={12} />
                          </Button>
                        ) : task.status === "inProgress" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                            onClick={() =>
                              handleTaskStatusChange(task.id, "completed")
                            }
                          >
                            <Triangle size={12} />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800"
                            onClick={() =>
                              handleTaskStatusChange(task.id, "inProgress")
                            }
                          >
                            <div className="h-3 w-3 rounded-full border border-gray-400 dark:border-gray-500"></div>
                          </Button>
                        )}
                        <div>
                          <span
                            className={`${task.status === "completed" ? "line-through text-gray-500" : ""}`}
                          >
                            {task.name}
                          </span>
                          {category && (
                            <div className="flex items-center mt-1">
                              <div
                                className="w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-xs text-gray-500">
                                {category.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-red-500"
                        onClick={() => setTaskToDelete(task.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tags" className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => setIsCreatingTag(true)}
                className="flex items-center gap-1"
                size="sm"
              >
                <Plus size={16} />
                <span>New Tag</span>
              </Button>
            </div>

            {isCreatingTag && (
              <div className="p-4 border rounded-md mb-4 bg-gray-50">
                <h4 className="font-medium mb-2">Create New Tag</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Tag Name
                    </label>
                    <Input
                      value={newTag.name}
                      onChange={(e) =>
                        setNewTag({ ...newTag, name: e.target.value })
                      }
                      placeholder="Enter tag name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Color
                    </label>
                    <Select
                      value={newTag.color}
                      onValueChange={(value) =>
                        setNewTag({ ...newTag, color: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: color.value }}
                              />
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatingTag(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTag}
                      disabled={!newTag.name.trim()}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {filteredTags.length === 0 ? (
                <div className="text-center py-8 text-gray-500 w-full">
                  {searchQuery ? (
                    <p>No tags found matching "{searchQuery}"</p>
                  ) : (
                    <p>No tags created yet</p>
                  )}
                </div>
              ) : (
                filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors ${selectedTags.includes(tag.id) ? "bg-gray-100 border-gray-300" : "hover:bg-gray-50"}`}
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleTagSelect(tag.id)}
                    >
                      <div
                        className="w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: tag.color }}
                      />
                      {editingTagId === tag.id ? (
                        <Input
                          value={editedTag?.name || tag.name}
                          onChange={(e) =>
                            setEditedTag({ ...tag, name: e.target.value })
                          }
                          className="h-6 py-0 px-1 w-full max-w-[100px] text-sm"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="text-sm">{tag.name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {editingTagId === tag.id ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0"
                          onClick={() => {
                            if (editedTag) {
                              onUpdateTag(editedTag);
                            }
                            setEditingTagId(null);
                            setEditedTag(null);
                          }}
                        >
                          <Check size={10} />
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTagId(tag.id);
                              setEditedTag(tag);
                            }}
                          >
                            <Edit size={10} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTagToDelete(tag.id);
                            }}
                          >
                            <Trash2 size={10} />
                          </Button>
                        </>
                      )}
                      {selectedTags.includes(tag.id) && !editingTagId && (
                        <X
                          size={14}
                          className="ml-1 text-gray-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagSelect(tag.id);
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedTags.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Selected Tags:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTags([]);
                      onSelectTags([]);
                    }}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    return (
                      tag && (
                        <Badge
                          key={tag.id}
                          className="flex items-center gap-1 px-2 py-1"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                            borderColor: `${tag.color}40`,
                          }}
                          variant="outline"
                        >
                          {tag.name}
                          <X
                            size={12}
                            className="cursor-pointer"
                            onClick={() => handleTagSelect(tag.id)}
                          />
                        </Badge>
                      )
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Delete Category Confirmation Dialog */}
        {categoryToDelete && (
          <AlertDialog
            open={!!categoryToDelete}
            onOpenChange={(open) => !open && setCategoryToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this subject? All associated
                  tasks will also be deleted. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => {
                    if (categoryToDelete) {
                      onDeleteCategory(categoryToDelete);
                      if (selectedCategory === categoryToDelete) {
                        setSelectedCategory(null);
                      }
                    }
                    setCategoryToDelete(null);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Delete Tag Confirmation Dialog */}
        {tagToDelete && (
          <AlertDialog
            open={!!tagToDelete}
            onOpenChange={(open) => !open && setTagToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this tag? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => {
                    if (tagToDelete) {
                      onDeleteTag(tagToDelete);
                      setSelectedTags(
                        selectedTags.filter((id) => id !== tagToDelete),
                      );
                    }
                    setTagToDelete(null);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Delete Task Confirmation Dialog */}
        {taskToDelete && (
          <AlertDialog
            open={!!taskToDelete}
            onOpenChange={(open) => !open && setTaskToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => {
                    if (taskToDelete) {
                      onDeleteTask(taskToDelete);
                    }
                    setTaskToDelete(null);
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

export default TaskManager;
