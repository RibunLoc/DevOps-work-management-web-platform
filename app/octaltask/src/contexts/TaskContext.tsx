import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskList, Comment, Attachment } from '@/types/task';
import { useUser } from './UserContext';

interface TaskContextType {
    tasks: Task[];
    lists: TaskList[];
    loading: boolean;
    error: string | null;

    // Task operations
    addTask: (task: Partial<Task>) => Promise<Task>;
    updateTask: (taskId: string, updates: Partial<Task>) => Promise<Task>;
    deleteTask: (taskId: string) => Promise<void>;
    getTasksByList: (listId: string) => Task[];
    starTask: (taskId: string) => Promise<Task>;

    // List operations
    addList: (list: Partial<TaskList>) => Promise<TaskList>;
    updateList: (listId: string, updates: Partial<TaskList>) => Promise<TaskList>;
    deleteList: (listId: string) => Promise<void>;

    // Sharing operations
    shareTask: (task: Task, email: string, role: 'viewer' | 'editor' | 'admin') => Promise<Task>;
    updateTaskPermission: (
        task: Task,
        userId: string,
        role: 'viewer' | 'editor' | 'admin'
    ) => Promise<Task>;
    removeTaskUser: (task: Task, userId: string) => Promise<Task>;

    shareList: (
        list: TaskList,
        email: string,
        role: 'viewer' | 'editor' | 'admin'
    ) => Promise<TaskList>;
    updateListPermission: (
        list: TaskList,
        userId: string,
        role: 'viewer' | 'editor' | 'admin'
    ) => Promise<TaskList>;
    removeListUser: (list: TaskList, userId: string) => Promise<TaskList>;

    // Comments & Questions
    addComment: (taskId: string, content: string) => Promise<Comment>;
    deleteComment: (commentId: string) => Promise<void>;

    // Attachments
    addAttachment: (taskId: string, file: File) => Promise<Attachment>;
    deleteAttachment: (attachmentId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
    const { currentUser, shareWithUser, updateUserPermission, removeUserAccess } = useUser();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [lists, setLists] = useState<TaskList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load initial data from localStorage or mock API
    useEffect(() => {
        const loadData = async () => {
            try {
                // test by using  localStorage or create initial data
                const storedTasks = localStorage.getItem('octalTasks');
                const storedLists = localStorage.getItem('octalLists');

                if (storedTasks) {
                    setTasks(JSON.parse(storedTasks));
                } else {
                    // Set default tasks for demo
                    const defaultTasks: Task[] = [
                        {
                            id: '1',
                            title: 'Complete project proposal',
                            completed: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            listId: '1',
                            comments: [],
                        },
                        {
                            id: '2',
                            title: 'Schedule team meeting',
                            completed: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            listId: '1',
                            comments: [],
                        },
                        {
                            id: '3',
                            title: 'Research new technologies',
                            completed: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            listId: '2',
                            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            comments: [],
                        },
                    ];
                    setTasks(defaultTasks);
                    localStorage.setItem('octalTasks', JSON.stringify(defaultTasks));
                }

                if (storedLists) {
                    setLists(JSON.parse(storedLists));
                } else {
                    // Set default lists for demo
                    const defaultLists: TaskList[] = [
                        {
                            id: '1',
                            name: 'Work',
                            color: 'blue',
                            ownerId: currentUser?.id || '1',
                        },
                        {
                            id: '2',
                            name: 'Personal',
                            color: 'green',
                            ownerId: currentUser?.id || '1',
                        },
                    ];
                    setLists(defaultLists);
                    localStorage.setItem('octalLists', JSON.stringify(defaultLists));
                }
            } catch (err) {
                setError('Failed to load data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentUser?.id]);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        if (!loading && tasks.length > 0) {
            localStorage.setItem('octalTasks', JSON.stringify(tasks));
        }
    }, [tasks, loading]);

    useEffect(() => {
        if (!loading && lists.length > 0) {
            localStorage.setItem('octalLists', JSON.stringify(lists));
        }
    }, [lists, loading]);

    // Task operations
    const addTask = async (taskData: Partial<Task>): Promise<Task> => {
        // Commenting out the auth check for now
        // if (!currentUser) throw new Error('User must be logged in');

        const newTask: Task = {
            id: Date.now().toString(),
            title: taskData.title || 'New Task',
            completed: taskData.completed || false,
            listId: taskData.listId,
            dueDate: taskData.dueDate,
            notes: taskData.notes,
            subtasks: taskData.subtasks || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            assignedTo: taskData.assignedTo,
            sharedWith: taskData.sharedWith || [],
            comments: [],
            questions: []
        };

        setTasks(prevTasks => [...prevTasks, newTask]);
        return newTask;
    };

    const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId
                ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                : task
        );

        setTasks(updatedTasks);
        const updatedTask = updatedTasks.find(t => t.id === taskId);

        if (!updatedTask) {
            throw new Error('Task not found');
        }

        return updatedTask;
    };

    const deleteTask = async (taskId: string): Promise<void> => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const getTasksByList = (listId: string): Task[] => {
        return tasks.filter(task => task.listId === listId);
    };

    // Implement the starTask function
    const starTask = async (taskId: string): Promise<Task> => {
        const task = tasks.find(task => task.id === taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        // Toggle the isStarred status
        const updatedTask = {
            ...task,
            isStarred: !task.isStarred,
            updatedAt: new Date().toISOString()
        };

        setTasks(prevTasks =>
            prevTasks.map(t => t.id === taskId ? updatedTask : t)
        );

        return updatedTask;
    };

    // List operations
    const addList = async (listData: Partial<TaskList>): Promise<TaskList> => {
        // Commenting out the auth check for now
        // if (!currentUser) throw new Error('User must be logged in');

        const newList: TaskList = {
            id: Date.now().toString(),
            name: listData.name || 'New List',
            color: listData.color || 'blue',
            icon: listData.icon,
            ownerId: currentUser?.id || 'default-owner',
            isShared: false,
            sharedWith: []
        };

        setLists(prevLists => [...prevLists, newList]);
        return newList;
    };

    const updateList = async (listId: string, updates: Partial<TaskList>): Promise<TaskList> => {
        const updatedLists = lists.map(list =>
            list.id === listId ? { ...list, ...updates } : list
        );

        setLists(updatedLists);
        const updatedList = updatedLists.find(l => l.id === listId);

        if (!updatedList) {
            throw new Error('List not found');
        }

        return updatedList;
    };

    const deleteList = async (listId: string): Promise<void> => {
        setLists(lists.filter(list => list.id !== listId));
        // Also delete or update tasks in that list
        setTasks(tasks.map(task =>
            task.listId === listId ? { ...task, listId: undefined } : task
        ));
    };

    // Sharing operations
    const shareTask = async (task: Task, email: string, role: 'viewer' | 'editor' | 'admin'): Promise<Task> => {
        try {
            const sharedUser = await shareWithUser(task.id, 'task', email, role);

            const updatedTask = {
                ...task,
                sharedWith: [...(task.sharedWith || []), sharedUser],
                updatedAt: new Date().toISOString()
            };

            setTasks(prevTasks =>
                prevTasks.map(t => t.id === task.id ? updatedTask : t)
            );

            return updatedTask;
        } catch (error) {
            console.error('Error sharing task:', error);
            throw error;
        }
    };

    const updateTaskPermission = async (task: Task, userId: string, role: 'viewer' | 'editor' | 'admin'): Promise<Task> => {
        try {
            await updateUserPermission(task.id, 'task', userId, role);

            const updatedTask = {
                ...task,
                sharedWith: (task.sharedWith || []).map(user =>
                    user.id === userId ? { ...user, role } : user
                ),
                updatedAt: new Date().toISOString()
            };

            setTasks(prevTasks =>
                prevTasks.map(t => t.id === task.id ? updatedTask : t)
            );

            return updatedTask;
        } catch (error) {
            console.error('Error updating task permissions:', error);
            throw error;
        }
    };

    const removeTaskUser = async (task: Task, userId: string): Promise<Task> => {
        try {
            await removeUserAccess(task.id, 'task', userId);

            const updatedTask = {
                ...task,
                sharedWith: (task.sharedWith || []).filter(user => user.id !== userId),
                updatedAt: new Date().toISOString()
            };

            setTasks(prevTasks =>
                prevTasks.map(t => t.id === task.id ? updatedTask : t)
            );

            return updatedTask;
        } catch (error) {
            console.error('Error removing user from task:', error);
            throw error;
        }
    };

    // List sharing operations (similar pattern to task sharing)
    const shareList = async (list: TaskList, email: string, role: 'viewer' | 'editor' | 'admin'): Promise<TaskList> => {
        try {
            const sharedUser = await shareWithUser(list.id, 'list', email, role);

            const updatedList = {
                ...list,
                isShared: true,
                sharedWith: [...(list.sharedWith || []), sharedUser]
            };

            setLists(prevLists =>
                prevLists.map(l => l.id === list.id ? updatedList : l)
            );

            return updatedList;
        } catch (error) {
            console.error('Error sharing list:', error);
            throw error;
        }
    };

    const updateListPermission = async (list: TaskList, userId: string, role: 'viewer' | 'editor' | 'admin'): Promise<TaskList> => {
        try {
            await updateUserPermission(list.id, 'list', userId, role);

            const updatedList = {
                ...list,
                sharedWith: (list.sharedWith || []).map(user =>
                    user.id === userId ? { ...user, role } : user
                )
            };

            setLists(prevLists =>
                prevLists.map(l => l.id === list.id ? updatedList : l)
            );

            return updatedList;
        } catch (error) {
            console.error('Error updating list permissions:', error);
            throw error;
        }
    };

    const removeListUser = async (list: TaskList, userId: string): Promise<TaskList> => {
        try {
            await removeUserAccess(list.id, 'list', userId);

            const updatedList = {
                ...list,
                sharedWith: (list.sharedWith || []).filter(user => user.id !== userId),
                isShared: (list.sharedWith || []).filter(user => user.id !== userId).length > 0
            };

            setLists(prevLists =>
                prevLists.map(l => l.id === list.id ? updatedList : l)
            );

            return updatedList;
        } catch (error) {
            console.error('Error removing user from list:', error);
            throw error;
        }
    };

    // Comments & Questions operations
    const addComment = async (taskId: string, content: string): Promise<Comment> => {
        try {
            // In a real app, this would make an API call
            const task = tasks.find(t => t.id === taskId);
            if (!task) {
                throw new Error("Task not found");
            }

            const newComment: Comment = {
                id: `comment-${Date.now()}`,
                taskId,
                userId: currentUser?.id || 'anonymous',
                userName: currentUser?.name || 'Anonymous User',
                userPhotoUrl: currentUser?.photoUrl,
                content,
                createdAt: new Date().toISOString()
            };

            // Update the task with the new comment
            const updatedTask = {
                ...task,
                comments: [...(task.comments || []), newComment]
            };

            // Update the tasks array
            const updatedTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
            setTasks(updatedTasks);

            // Save to localStorage immediately
            localStorage.setItem('octalTasks', JSON.stringify(updatedTasks));

            return newComment;
        } catch (error) {
            console.error("Error adding comment:", error);
            throw error;
        }
    };

    const deleteComment = async (commentId: string): Promise<void> => {
        try {
            // Find the task containing this comment
            const taskWithComment = tasks.find(task =>
                task.comments && task.comments.some(comment => comment.id === commentId)
            );

            if (!taskWithComment) {
                console.error(`No task found with comment ID: ${commentId}`);
                return;
            }

            // Update that specific task's comments
            const updatedTasks = tasks.map(task => {
                if (task.id === taskWithComment.id) {
                    return {
                        ...task,
                        comments: (task.comments || []).filter(comment => comment.id !== commentId)
                    };
                }
                return task;
            });

            // Update state
            setTasks(updatedTasks);

            // Save to localStorage immediately
            localStorage.setItem('octalTasks', JSON.stringify(updatedTasks));
            console.log(`Comment ${commentId} deleted successfully`);
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    };

    const addAttachment = async (taskId: string, file: File): Promise<Attachment> => {
      try {
        // Find the task
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
          throw new Error('Task not found');
        }

        // Attach small files only
        const reader = new FileReader();
        const fileDataPromise = new Promise<string>(resolve => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const fileData = await fileDataPromise;

        const newAttachment: Attachment = {
          id: `attachment-${Date.now()}`,
          taskId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          url: fileData,
          uploadedAt: new Date().toISOString(),
          uploadedBy: currentUser?.id || 'anonymous',
        };

        // Update the task with the new attachment
        const updatedTask = {
          ...task,
          attachments: [...(task.attachments || []), newAttachment],
        };

        // Update the tasks array
        const updatedTasks = tasks.map(t => (t.id === taskId ? updatedTask : t));
        setTasks(updatedTasks);

        // Save to localStorage immediately
        localStorage.setItem('octalTasks', JSON.stringify(updatedTasks));

        return newAttachment;
      } catch (error) {
        console.error('Error adding attachment:', error);
        throw error;
      }
    }


    const deleteAttachment = async (attachmentId: string): Promise<void> => {
      try {
        const taskWithAttachment = tasks.find(
          task =>
            task.attachments && task.attachments.some(attachment => attachment.id === attachmentId)
        );

        if (!taskWithAttachment) {
          console.error(`No task found with attachment ID: ${attachmentId}`);
          return;
        }

        const updatedTasks = tasks.map(task => {
          if (task.id === taskWithAttachment.id) {
            return {
              ...task,
              attachments: (task.attachments || []).filter(
                attachment => attachment.id !== attachmentId
              ),
            };
          }
          return task;
        });

        setTasks(updatedTasks);

        localStorage.setItem('octalTasks', JSON.stringify(updatedTasks));
        console.log(`Attachment ${attachmentId} deleted successfully`);
      } catch (error) {
        console.error('Error deleting attachment:', error);
        throw error;
      }

    }


    return (
        <TaskContext.Provider
            value={{
                tasks,
                lists,
                loading,
                error,

                // Task operations
                addTask,
                updateTask,
                deleteTask,
                getTasksByList,
                starTask,

                // List operations
                addList,
                updateList,
                deleteList,

                // Sharing operations
                shareTask,
                updateTaskPermission,
                removeTaskUser,

                shareList,
                updateListPermission,
                removeListUser,

                // Comments & Questions
                addComment,
                deleteComment,

                // Attachments
                addAttachment,
                deleteAttachment
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTask() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
}
