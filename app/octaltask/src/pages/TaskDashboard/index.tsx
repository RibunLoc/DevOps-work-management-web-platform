import { Logo } from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { CreateListModal } from '@/components/feature/list/CreateListModal';
import { ShareListModal } from '@/components/feature/list/ShareListModal';
import { TaskDetailModal } from '@/components/feature/task/TaskDetailModal';
import { TaskList } from '@/components/feature/task/TaskList';
import { TaskListHeader } from '@/components/feature/task/TaskListHeader';
import { TaskListSidebar } from '@/components/layout/TaskListSidebar';
import { UserMenu } from '@/components/layout/UserMenu';
import { useTask } from '@/contexts/TaskContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { Task, TaskList as TaskListType } from '@/types/task';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FilterOption = 'all' | 'today' | 'important';

export default function TaskDashboard() {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const { currentUser, logout } = useUser();
    const {
        tasks,
        lists,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        shareTask,
        updateTaskPermission,
        removeTaskUser,
        addComment,
        deleteComment,
        addList,
        deleteList,
        updateList,
        shareList,
        updateListPermission,
        removeListUser,
        starTask,
        addAttachment,
        deleteAttachment
    } = useTask();

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showTaskDetail, setShowTaskDetail] = useState(false);
    const [activeListId, setActiveListId] = useState<string | null>(null);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);
    const [sortOption, setSortOption] = useState<
        'date-desc' | 'date-asc' | 'alpha-asc' | 'alpha-desc'
    >('date-desc');
    const [currentFilter, setCurrentFilter] = useState<FilterOption>('all');
    const [showCreateListModal, setShowCreateListModal] = useState(false);
    const [selectedListForShare, setSelectedListForShare] = useState<TaskListType | null>(null);

    // Toggle sidebar function for both mobile and desktop
    const toggleSidebar = () => {
        // On mobile screens
        if (window.innerWidth < 768) {
            setShowMobileSidebar(!showMobileSidebar);
        }
        // On desktop screens
        else {
            setShowDesktopSidebar(!showDesktopSidebar);
        }
    };

    // When filter changes, sync sidebar selection
    useEffect(() => {
        if (currentFilter === 'today' && activeListId !== 'today') {
            setActiveListId('today');
        } else if (currentFilter === 'important' && activeListId !== 'important') {
            setActiveListId('important');
        } else if (currentFilter === 'all' && activeListId !== null) {
            setActiveListId(null);
        }
    }, [currentFilter]);

    // When sidebar selection changes, sync filter
    useEffect(() => {
        if (activeListId === 'today' && currentFilter !== 'today') {
            setCurrentFilter('today');
        } else if (currentFilter === 'important' && activeListId !== 'important') {
            setActiveListId('important');
        } else if (activeListId === null && currentFilter !== 'all') {
            setCurrentFilter('all');
        }
    }, [activeListId]);

    // Filter tasks based on active list or filter
    const filteredTasks = tasks.filter(task => {
        if (activeListId === null) {
            return true; // Show all tasks
        } else if (activeListId === 'today') {
            // Filter for today's tasks
            const today = new Date().toISOString().split('T')[0];
            return task.dueDate === today;
        } else if (activeListId === 'important') {
            return task.isStarred === true;
        }
        else {
            return task.listId === activeListId;
        }
    });

    // Count tasks for metrics - count ALL tasks before hiding completed ones
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(task => task.completed).length;
    //   const pendingTasks = totalTasks - completedTasks;

    // Sort tasks based on option
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortOption === 'date-desc') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        } else if (sortOption === 'date-asc') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortOption === 'alpha-asc') {
            return a.title.localeCompare(b.title);
        } else {
            return b.title.localeCompare(a.title);
        }
    });

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setShowTaskDetail(true);
    };

    const handleAddTask = async (task: Partial<Task>) => {
        try {
            // Handle adding tasks in the Today filter
            if (activeListId === 'today') {
                // Set today's date for tasks added in Today view
                const today = new Date().toISOString().split('T')[0];
                await addTask({
                    ...task,
                    dueDate: today,
                });
            }
            else if (activeListId === 'important') {
                await addTask({
                    ...task,
                    isStarred: true,
                });
            }
            else {
                await addTask({
                    ...task,
                    listId: activeListId === null ? undefined : activeListId,
                });
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
        try {
            await updateTask(taskId, updates);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleSaveTask = async (updatedTask: Task) => {
        try {
            await updateTask(updatedTask.id, updatedTask);
            setSelectedTask(null);
            setShowTaskDetail(false);
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTask(taskId);
            setSelectedTask(null);
            setShowTaskDetail(false);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleCreateList = (name: string, color?: string, icon?: string) => {
        try {
            addList({
                name,
                color: color || 'blue',
                icon,
            });
            setShowCreateListModal(false);
        } catch (error) {
            console.error('Error creating list:', error);
        }
    };

    const handleUpdateList = (listId: string, name: string, color: string, icon: string) => {
        try {
            updateList(listId, {
                name,
                color,
                icon,
            });
        } catch (error) {
            console.error('Error updating list:', error);
        }
    };

    const handleDeleteList = (listId: string) => {
        try {
            deleteList(listId);
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    };

    const handleFilterChange = (filter: FilterOption) => {
        setCurrentFilter(filter);
    };

    // Handle sidebar list selection
    const handleSelectList = (listId: string | null) => {
        setActiveListId(listId);

        // Close mobile sidebar if it's open
        if (showMobileSidebar) {
            setShowMobileSidebar(false);
        }

        // Update current filter based on selection
        if (listId === null) {
            setCurrentFilter('all');
        } else if (listId === 'today') {
            setCurrentFilter('today');
        } else if (listId === 'important') {
            setCurrentFilter('important')
        }

        else {
            // If a custom list is selected, we keep the same filter
            // and just change the active list
        }
    };

    const handleShareTask = async (
        task: Task,
        email: string,
        role: 'viewer' | 'editor' | 'admin'
    ) => {
        try {
            const updatedTask = await shareTask(task, email, role);
            setSelectedTask(updatedTask);
        } catch (error) {
            console.error('Error sharing task:', error);
        }
    };

    const handleUpdatePermission = async (
        task: Task,
        userId: string,
        role: 'viewer' | 'editor' | 'admin'
    ) => {
        try {
            const updatedTask = await updateTaskPermission(task, userId, role);
            setSelectedTask(updatedTask);
        } catch (error) {
            console.error('Error updating permission:', error);
        }
    };

    const handleRemoveUser = async (task: Task, userId: string) => {
        try {
            const updatedTask = await removeTaskUser(task, userId);
            setSelectedTask(updatedTask);
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    const handleAddComment = async (taskId: string, content: string) => {
        try {
            await addComment(taskId, content);
            // Update the selected task if it's the one being commented on
            if (selectedTask && selectedTask.id === taskId) {
                const updatedTask = tasks.find(t => t.id === taskId);
                if (updatedTask) {
                    setSelectedTask(updatedTask);
                }
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(commentId);
            // Refresh selected task if needed
            if (selectedTask) {
                const updatedTask = tasks.find(t => t.id === selectedTask.id);
                if (updatedTask) {
                    setSelectedTask(updatedTask);
                }
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Get the taskList ID in the correct format for the component
    const getTaskListId = (): string | undefined => {
        if (!activeListId) return undefined;
        if (activeListId === 'today' || activeListId === 'important') return undefined;
        return activeListId;
    };

    // Add handler for sharing the current list
    const handleShareCurrentList = () => {
        if (!activeListId || activeListId === 'today' || activeListId === 'important') return;

        const listToShare = lists.find(list => list.id === activeListId);
        if (listToShare) {
            setSelectedListForShare(listToShare);
        }
    };

    const handleStarTask = async (taskId: string) => {
        try {
            await starTask(taskId);
        } catch (error) {
            console.error('Error starring task:', error);
        }
    };

    const handleAddAttachment = async (taskId: string, file: File) => {
        try {
            return await addAttachment(taskId, file);
        } catch (error) {
            console.error('Error adding attachment:', error);
            throw error;
        }
    };

    const handleDeleteAttachment = async (attachmentId: string) => {
        try {
            await deleteAttachment(attachmentId);
        } catch (error) {
            console.error('Error deleting attachment:', error);
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Loading tasks...</p>
                </div>
            </div>
        );
    }


    // Handle error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="top-0 bg-white border-b border-gray-200  dark:bg-gray-800 dark:border-gray-700">
                <div className="px-4 py-2.5 flex justify-between items-center">
                    <div className="flex items-center gap-3 ">
                        <button
                            className="text-gray-500 dark:text-gray-400 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                            onClick={toggleSidebar}
                            aria-label="Toggle sidebar"
                        >
                            {showMobileSidebar || showDesktopSidebar ? (
                                <X className="w-5 h-5 transition-all duration-200" />
                            ) : (
                                <Menu className="w-5 h-5 transition-all duration-200" />
                            )}
                        </button>

                        <Logo
                            size="md"
                            color={darkMode ? 'blueDark' : 'blueLight'}
                            className="font-sans"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        {currentUser && <UserMenu user={currentUser} onLogout={handleLogout} />}
                    </div>
                </div>
            </header>

            <div className={`flex ${showTaskDetail ? 'relative' : ''}`}>
                {/* Mobile Sidebar */}
                {showMobileSidebar && (
                    <div
                        className={` md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out ${showMobileSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        onClick={() => setShowMobileSidebar(false)}
                    >
                        <div
                            className={` bg-white dark:bg-gray-800 h-full w-64 p-4 overflow-auto transform transition-transform duration-300 ease-in-out ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
                                }`}
                            onClick={e => e.stopPropagation()}
                        >
                            <TaskListSidebar
                                lists={lists}
                                activeListId={activeListId}
                                onSelectList={handleSelectList}
                                onCreateList={handleCreateList}
                                onDeleteList={handleDeleteList}
                                onUpdateList={handleUpdateList}
                            />
                        </div>
                    </div>
                )}

                {/* Desktop Sidebar */}
                <div
                    className={`hidden md:block w-0 transition-all duration-300 ease-in-out ${showDesktopSidebar ? 'w-64' : 'w-0'
                        }  shrink-0 overflow-hidden border-r pt-3 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`}
                >
                    <div className="sticky top-0 h-screen overflow-y-hidden">
                        <TaskListSidebar
                            lists={lists}
                            activeListId={activeListId}
                            onSelectList={handleSelectList}
                            onCreateList={handleCreateList}
                            onDeleteList={handleDeleteList}
                            onUpdateList={handleUpdateList}
                        />
                    </div>
                </div>

                <main
                    className={`flex-1 p-5 md:p-8 overflow-y-auto overflow-x-hidden max-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out ${showDesktopSidebar ? '' : 'md:px-20'
                        }`}
                >
                    <div className="max-w-3xl mx-auto">
                        <TaskListHeader
                            title={
                                activeListId === null
                                    ? 'All Tasks'
                                    : activeListId === 'today'
                                        ? 'Today'
                                        : activeListId === 'important'
                                            ? 'Important'
                                            : lists.find(l => l.id === activeListId)?.name || 'Tasks'
                            }
                            totalTasks={totalTasks}
                            completedTasks={completedTasks}
                            currentFilter={currentFilter}
                            onFilterChange={handleFilterChange}
                            onSortChange={option => {
                                setSortOption(option);
                            }}
                            onShare={
                                activeListId && activeListId !== 'today' && activeListId !== 'important'
                                    ? handleShareCurrentList
                                    : undefined
                            }
                            isShared={
                                activeListId && activeListId !== 'today' && activeListId !== 'important'
                                    ? lists.find(l => l.id === activeListId)?.isShared || false
                                    : false
                            }
                        />

                        {/* Task list with conditional rendering when modal is open */}
                        <div>
                            <TaskList
                                tasks={sortedTasks}
                                listId={getTaskListId()}
                                listName={
                                    activeListId === null
                                        ? 'All Tasks'
                                        : lists.find(l => l.id === activeListId)?.name
                                }
                                onEditTask={handleEditTask}
                                onAddTask={handleAddTask}
                                onUpdateTask={handleUpdateTask}
                                onDeleteTask={handleDeleteTask}
                                onStarTask={handleStarTask}
                            />
                        </div>
                    </div>
                </main>
            </div>

            {showTaskDetail && selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    lists={lists}
                    currentUserId={currentUser?.id || ''}
                    currentUserName={currentUser?.name || 'User'}
                    currentUserPhoto={currentUser?.photoUrl}
                    onClose={() => {
                        setShowTaskDetail(false);
                        setSelectedTask(null);
                    }}
                    onSave={handleSaveTask}
                    onDelete={handleDeleteTask}
                    onShareTask={handleShareTask}
                    onUpdatePermission={handleUpdatePermission}
                    onRemoveUser={handleRemoveUser}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                    onAddAttachment={handleAddAttachment}
                    onDeleteAttachment={handleDeleteAttachment}
                />
            )}

            {showCreateListModal && (
                <CreateListModal
                    onClose={() => setShowCreateListModal(false)}
                    onCreateList={handleCreateList}
                />
            )}

            {selectedListForShare && (
                <ShareListModal
                    list={selectedListForShare}
                    onClose={() => setSelectedListForShare(null)}
                    onShare={shareList}
                    onUpdatePermission={updateListPermission}
                    onRemoveUser={removeListUser}
                />
            )}


        </div>
    );
}
