import {
    ArrowUpDown,
    Calendar,
    CheckSquare,
    Share2,
    Star
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/button';

type SortOption = 'date-asc' | 'date-desc' | 'alpha-asc' | 'alpha-desc';
type FilterOption = 'all' | 'today' | 'important';

interface TaskListHeaderProps {
    title: string;
    onSortChange?: (option: SortOption) => void;
    onFilterChange?: (filter: FilterOption) => void;
    currentFilter: FilterOption;
    totalTasks: number;
    completedTasks: number;
    onShare?: () => void;
    isShared?: boolean;
}

export function TaskListHeader({
    title,
    onSortChange,
    onFilterChange,
    currentFilter = 'all',
    totalTasks,
    completedTasks,
    onShare,
    isShared = false
}: TaskListHeaderProps) {
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [currentSort, setCurrentSort] = useState<SortOption>('date-desc');
    const sortMenuRef = useRef<HTMLDivElement>(null);

    const handleSortChange = (option: SortOption) => {
        setCurrentSort(option);
        if (onSortChange) {
            onSortChange(currentSort);
        }
        setSortMenuOpen(false);
    };

    const handleFilterChange = (filter: FilterOption) => {
        if (onFilterChange) {
            onFilterChange(filter);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setSortMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calculate completion percentage
    const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <h1 className="text-xl font-medium text-gray-800 dark:text-gray-100">{title}</h1>

                <div className="flex items-center gap-4">
                    {/* Task progress indicator */}
                    <div className="items-center hidden gap-2 sm:flex">
                        <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full dark:bg-blue-400"
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {completedTasks}/{totalTasks}
                        </span>
                    </div>

                    {/* Share button */}
                    {onShare && (
                        <Button
                            onClick={onShare}
                            className={`h-9 px-4 rounded-full text-sm font-medium flex items-center ${isShared
                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                                : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                                }`}
                        >
                            <Share2 className="h-4 w-4 mr-1.5" />
                            {isShared ? 'Shared' : 'Share'}
                        </Button>
                    )}

                    {/* Sort dropdown */}
                    <div ref={sortMenuRef} className='relative'>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="z-0 px-3 text-gray-600 border-gray-200 rounded-full shadow-none h-9 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                            onClick={() => setSortMenuOpen(!sortMenuOpen)}
                        >
                            <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
                            <span className="text-xs">Sort</span>
                        </Button>

                        {sortMenuOpen && (
                            <div className="absolute right-0 z-30 w-48 mt-1 overflow-hidden bg-white border border-gray-100 rounded-lg shadow-lg top-full dark:bg-gray-800 dark:border-gray-700">
                                <div className="py-1">
                                    <button
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
                                        onClick={() => handleSortChange('date-desc')}
                                    >
                                        Date (newest first)
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
                                        onClick={() => handleSortChange('date-asc')}
                                    >
                                        Date (oldest first)
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
                                        onClick={() => handleSortChange('alpha-asc')}
                                    >
                                        Name (A-Z)
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
                                        onClick={() => handleSortChange('alpha-desc')}
                                    >
                                        Name (Z-A)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <Button
                    variant={currentFilter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-full px-4 h-8 text-xs ${currentFilter === 'all'
                        ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/40 dark:text-blue-300 shadow-none'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    onClick={() => handleFilterChange('all')}
                >
                    <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
                    All Tasks
                </Button>
                <Button
                    variant={currentFilter === 'today' ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-full px-4 h-8 text-xs ${currentFilter === 'today'
                        ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/40 dark:text-blue-300 shadow-none'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    onClick={() => handleFilterChange('today')}
                >
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    Today
                </Button>
                <Button
                    variant={currentFilter === 'important' ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-full px-4 h-8 text-xs ${currentFilter === 'important'
                        ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/40 dark:text-blue-300 shadow-none'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    onClick={() => handleFilterChange('important')}
                >
                    <Star className="h-3.5 w-3.5 mr-1.5" />
                    Important
                </Button>
            </div>
        </div>
    );
}
