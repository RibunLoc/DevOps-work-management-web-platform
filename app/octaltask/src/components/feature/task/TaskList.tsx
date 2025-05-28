import { Task } from '@/types/task';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Edit2, Plus, Trash2, Star, GripVertical } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import { EmptyTaskState } from './EmptyTaskState';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


interface TaskListProps {
    tasks?: Task[];
    listId?: string;
    listName?: string;
    onEditTask?: (task: Task) => void;
    onAddTask?: (task: Partial<Task>) => void;
    onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask?: (taskId: string) => void;
    onStarTask?: (taskId: string) => void;
    onReorderTasks?: (startIndex: number, endIndex: number) => void;
}


const formatDueDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
        return dateString;
    }
};

const isTaskDue = (dateString: string) => {
    try {
        const dueDate = new Date(dateString);
        return dueDate < new Date();
    } catch (e) {
        return false;
    }
};

export function TaskList({
    tasks: propTasks,
    listId,
    listName,
    onEditTask,
    onAddTask,
    onUpdateTask,
    onDeleteTask,
    onStarTask
}: TaskListProps) {
    const [localTasks, setLocalTasks] = useState<Task[]>([]);
    const tasks = propTasks || localTasks;

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const addTask = () => {
        if (!newTaskTitle.trim()) return;

        const newTaskBase = {
            title: newTaskTitle.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            listId: listId || 'default'
        };

        if (onAddTask) {
            onAddTask(newTaskBase);
        } else {
            // For local state - ensure all required Task fields are present
            const newTaskWithId: Task = {
                ...newTaskBase,
                id: Math.random().toString(36).substr(2, 9),
                notes: '',
                position: 0,
            };
            setLocalTasks([newTaskWithId, ...localTasks]);
        }

        setNewTaskTitle('');
    };

    const toggleTaskCompletion = (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newCompletedState = !task.completed;

        if (onUpdateTask) {
            onUpdateTask(taskId, {
                completed: newCompletedState,
                updatedAt: new Date().toISOString()
            });
        } else {
            setLocalTasks(localTasks.map(t =>
                t.id === taskId ? {
                    ...t,
                    completed: newCompletedState,
                    updatedAt: new Date().toISOString()
                } : t
            ));
        }
    };
    const toggleTaskStar = (taskId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (onStarTask) {
            onStarTask(taskId);
        } else {
            setLocalTasks(
                localTasks.map(task =>
                    task.id === taskId
                        ? {
                            ...task,
                            isStarred: !task.isStarred,
                            updatedAt: new Date().toISOString(),
                        }
                        : task
                )
            );
        }
    };
    const deleteTask = (taskId: string) => {
        if (onDeleteTask) {
            onDeleteTask(taskId);
        } else {
            setLocalTasks(localTasks.filter(task => task.id !== taskId));
        }
    };

    const handleEditClick = (task: Task) => {
        if (onEditTask) {
            onEditTask(task);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };

    // Show empty state when there are no tasks
    if (tasks.length === 0) {
        return (
          <div className="mt-4">
            <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add a new task..."
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                    className="flex-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent rounded-lg shadow-sm transition-all"
                  />

                  <Button
                    size="sm"
                    onClick={addTask}
                    disabled={!newTaskTitle.trim()}
                    className="ml-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <EmptyTaskState onAddTask={focusInput} />
          </div>
        );
    }

    return (
      <DndProvider backend={HTML5Backend}>
        <div className="mt-6 space-y-3">
          <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md p-3">
            <div className="flex items-center">
              <Input
                placeholder="Add a new task..."
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                className="flex-1 border-0 focus:ring-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 h-10 pl-3 pr-3 rounded-lg shadow-sm focus:outline-none transition-all"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={addTask}
                disabled={!newTaskTitle.trim()}
                className="rounded-full h-8 w-8 p-0 ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md ${
                  activeTaskId === task.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
                onMouseEnter={() => setActiveTaskId(task.id)}
                onMouseLeave={() => setActiveTaskId(null)}
              >
                <div className="flex items-center gap-3">
                  <div className="cursor-grab text-gray-400 dark:text-gray-600">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="h-5 w-5 rounded-full border-2 border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => handleEditClick(task)}>
                    <p
                      className={`font-medium ${
                        task.completed
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <div
                        className={`text-xs flex items-center mt-1 ${
                          isTaskDue(task.dueDate) && !task.completed
                            ? 'text-red-500'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDueDate(task.dueDate)}
                      </div>
                    )}
                    {task.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        {task.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(task)}
                      className={`h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        activeTaskId === task.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Edit2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className={`h-8 w-8 p-0 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 ${
                        activeTaskId === task.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400  " />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => toggleTaskStar(task.id, e)}
                      className="h-8 w-8 p-0 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-500"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          task.isStarred
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DndProvider>
    );
}
