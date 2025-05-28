import { useTheme } from '@/contexts/ThemeContext';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/button';

interface EmptyTaskStateProps {
  onAddTask: () => void;
  listName?: string;
}

export function EmptyTaskState({ onAddTask, listName }: EmptyTaskStateProps) {
  const { darkMode } = useTheme();

    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="mb-6">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <circle
              cx="60"
              cy="60"
              r="45"
              fill={darkMode ? '#1e3a8a20' : '#EBF5FF'}
              className="dark:fill-blue-900/20"
            />
            {listName ? (
              // List illustration
              <>
                <rect
                  x="38"
                  y="40"
                  width="45"
                  height="8"
                  rx="2"
                  fill={darkMode ? '#60a5fa' : '#3b82f6'}
                  className="dark:fill-blue-400"
                />
                <rect
                  x="38"
                  y="56"
                  width="45"
                  height="8"
                  rx="2"
                  fill={darkMode ? '#60a5fa30' : '#bfdbfe'}
                  className="dark:fill-blue-400/30"
                />
                <rect
                  x="38"
                  y="72"
                  width="45"
                  height="8"
                  rx="2"
                  fill={darkMode ? '#60a5fa30' : '#bfdbfe'}
                  className="dark:fill-blue-400/30"
                />
                <circle
                  cx="30"
                  cy="44"
                  r="3"
                  fill={darkMode ? '#60a5fa' : '#3b82f6'}
                  className="dark:fill-blue-400"
                />
                <circle
                  cx="30"
                  cy="60"
                  r="3"
                  fill={darkMode ? '#60a5fa30' : '#bfdbfe'}
                  className="dark:fill-blue-400/30"
                />
                <circle
                  cx="30"
                  cy="76"
                  r="3"
                  fill={darkMode ? '#60a5fa30' : '#bfdbfe'}
                  className="dark:fill-blue-400/30"
                />
              </>
            ) : (
              // Checkbox illustration
              <>
                <path
                  d="M43 59L55 71L80 46"
                  stroke={darkMode ? '#60a5fa' : '#3b82f6'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dark:stroke-blue-400"
                />
                <rect
                  x="37"
                  y="37"
                  width="48"
                  height="48"
                  rx="24"
                  stroke={darkMode ? '#60a5fa' : '#3b82f6'}
                  strokeWidth="4"
                  className="dark:stroke-blue-400"
                  fill="none"
                />
              </>
            )}
          </svg>
        </div>

        <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-100">
          {listName ? `No tasks in ${listName}` : 'No tasks yet'}
        </h3>

        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto text-sm">
          {listName
            ? `Tasks you add to ${listName} will appear here.`
            : 'Add your first task to get started and stay organized.'}
        </p>

        <Button
          onClick={onAddTask}
          variant="default"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 text-white dark:text-white rounded-full h-10 px-5 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add a task</span>
        </Button>
      </div>
    );
}
