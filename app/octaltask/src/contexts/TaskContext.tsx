import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskList, Comment, Attachment } from '@/types/task';
import { useUser } from './UserContext';
import {createList, getLists,  updateListById, deleteListById} from '@/lib/api/tasks';
import { createTask, getTasks, updateTaskById, deleteTaskById } from '@/lib/api/tasks';
import { getSubtasksByTaskId, createSubtaskByTaskId, deleteSubtaskById  } from '@/lib/api/tasks';
import { getCommentsByTaskId, createComment, deleteCommentById } from '@/lib/api/tasks';
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
    // useEffect(() => {
    //     const loadData = async () => {
    //         try {
    //             // test by using  localStorage or create initial data
    //             const storedTasks = localStorage.getItem('octalTasks');
    //             const storedLists = localStorage.getItem('octalLists');

    //             if (storedTasks) {
    //                 setTasks(JSON.parse(storedTasks));
    //             } else {
    //                 // Set default tasks for demo
    //                 const defaultTasks: Task[] = [
    //                     {
    //                         id: '1',
    //                         title: 'Complete project proposal',
    //                         completed: false,
    //                         createdAt: new Date().toISOString(),
    //                         updatedAt: new Date().toISOString(),
    //                         listId: '1',
    //                         comments: [],
    //                     },
    //                     {
    //                         id: '2',
    //                         title: 'Schedule team meeting',
    //                         completed: true,
    //                         createdAt: new Date().toISOString(),
    //                         updatedAt: new Date().toISOString(),
    //                         listId: '1',
    //                         comments: [],
    //                     },
    //                     {
    //                         id: '3',
    //                         title: 'Research new technologies',
    //                         completed: false,
    //                         createdAt: new Date().toISOString(),
    //                         updatedAt: new Date().toISOString(),
    //                         listId: '2',
    //                         dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    //                         comments: [],
    //                     },
    //                 ];
    //                 setTasks(defaultTasks);
    //                 localStorage.setItem('octalTasks', JSON.stringify(defaultTasks));
    //             }

    //             if (storedLists) {
    //                 setLists(JSON.parse(storedLists));
    //             } else {
    //                 // Set default lists for demo
    //                 const defaultLists: TaskList[] = [
    //                     {
    //                         id: '1',
    //                         name: 'Work',
    //                         color: 'blue',
    //                         ownerId: currentUser?.id || '1',
    //                     },
    //                     {
    //                         id: '2',
    //                         name: 'Personal',
    //                         color: 'green',
    //                         ownerId: currentUser?.id || '1',
    //                     },
    //                 ];
    //                 setLists(defaultLists);
    //                 localStorage.setItem('octalLists', JSON.stringify(defaultLists));
    //             }
    //         } catch (err) {
    //             setError('Failed to load data');
    //             console.error(err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadData();
    // }, [currentUser?.id]);

    useEffect(() => {
    const loadData = async () => {
        try {
            // get tasks
            const fetchedTasks = await getTasks();

            
    //         const mappedTasks = fetchedTasks.tasks.map((task: any) => ({
    //             id: task.id.toString(),
    //             title: task.title,
    //             completed: task.isCompleted,
    //             dueDate: task.dueDate   ? new Date(task.dueDate).toISOString().split('T')[0]: undefined,
    //             notes: task.description || '',
    //             isStarred: task.isStarred,
    //             listId: task.listId?.toString(),  // cần đúng tên listId
    //             subtasks: [],
    //             assignedTo: undefined,
    //             sharedWith: [],
    //             comments: [],
    //             attachments: [],
    //         }));

    //   setTasks(mappedTasks);
            
            const mappedTasks = await Promise.all(fetchedTasks.tasks.map(async (task: any) => {
                    let subtasksData: any = {};
                    let commentsData: any = {};

                    try {
                        subtasksData = await getSubtasksByTaskId(task.id);
                    } catch (err) {
                        console.error(`Failed to fetch subtasks for task ${task.id}`, err);
                    }

                    try {
                        commentsData = await getCommentsByTaskId(task.id);
                    } catch (err) {
                        console.error(`Failed to fetch comments for task ${task.id}`, err);
                    }

                    return {
                        id: task.id.toString(),
                        title: task.title,
                        completed: task.isCompleted,
                        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : undefined,
                        notes: task.description || '',
                        isStarred: task.isStarred,
                        listId: task.listId?.toString(),
                        subtasks: Array.isArray(subtasksData?.subtasks) ? subtasksData.subtasks.map((subtask: any) => ({
                            id: subtask.id.toString(),
                            title: subtask.content,
                            isCompleted: subtask.isCompleted,
                        })) : [],
                        comments: Array.isArray(commentsData?.comments) ? commentsData.comments.map((comment: any) => ({
                            id: comment.id.toString(),
                            content: comment.content,
                            taskId: task.id.toString(),
                            userId: comment.user?.userId?.toString(),
                            createdAt: comment.createdAt,
                            userName: comment.user?.email || 'Unknown',  
                            //userPhotoUrl: comment.user?.photoUrl || '',  
                        })) : [],
                        assignedTo: undefined,
                        sharedWith: [],
                        attachments: [],
                    };
                }));


            setTasks(mappedTasks);

            
            // get lists
            const fetchedLists = await getLists();
            const mappedLists = fetchedLists.lists.map((list: any) => ({
                id: list.id.toString(),
                name: list.name,
                color: list.color,
                icon: list.icon,
                ownerId: list.user?.email,
                isShared: false, // giả định, vì chưa có isShared từ API
                sharedWith: []   // giả định trống vì chưa được trả về
            }));
            setLists(mappedLists);
        } catch (err) {
            setError('Failed to load data from API');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    loadData();
}, []);


    // // Save data to localStorage whenever it changes
    // useEffect(() => {
    //     if (!loading && tasks.length > 0) {
    //         localStorage.setItem('octalTasks', JSON.stringify(tasks));
    //     }
    // }, [tasks, loading]);

    // useEffect(() => {
    //     if (!loading && lists.length > 0) {
    //         localStorage.setItem('octalLists', JSON.stringify(lists));
    //     }
    // }, [lists, loading]);

    // Task operations
    const addTask = async (taskData: Partial<Task>): Promise<Task> => {
        if (!taskData.title || !taskData.listId) {
            throw new Error('Missing task title or listId');
        }

        const createdTask = await createTask(
            taskData.title,
            taskData.listId,
            taskData.notes || '',      // use notes as description
            taskData.dueDate           // may undefined
        );

        const newTask: Task = {
            id: createdTask.id.toString(),
            title: createdTask.title,
            completed: createdTask.isCompleted || false,
            listId: createdTask.listId.toString() || null,
            dueDate: createdTask.dueDate || undefined,
            notes: createdTask.description || '',
            isStarred: false,
            assignedTo: undefined,
            subtasks: [],
            comments: [],
            sharedWith: [],
        };

        setTasks(prevTasks => [...prevTasks, newTask]);
        return newTask;
        };


    const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
        const formatDueDate = (rawDate?: string): string | undefined => {
            if (!rawDate || typeof rawDate !== 'string' || rawDate.trim() === '') return undefined;
            const isoCandidate = new Date(`${rawDate}T00:00:00.000Z`);
            return isNaN(isoCandidate.getTime()) ? undefined : isoCandidate.toISOString();
        };

        const processListId = (listId?: string | number): number | undefined => {
            if (listId === null || listId === undefined || listId === '') return undefined;
            if (typeof listId === 'number') return isNaN(listId) ? undefined : listId;
            if (typeof listId === 'string') {
            const parsed = parseInt(listId.trim(), 10);
            return isNaN(parsed) ? undefined : parsed;
            }
            return undefined;
        };

        const updatePayload = {
            title: updates.title ?? '',
            description: updates.notes ?? '',
            isCompleted: updates.completed ?? false,
            dueDate: formatDueDate(updates.dueDate),
            listId: processListId(updates.listId),
        };

        try {
        // Cập nhật task chính
        const updatedData = await updateTaskById(taskId, updatePayload);

        // Lấy task hiện tại từ state
        const currentTask = tasks.find(t => t.id === taskId);
        //const currentSubtaskIds = new Set(currentTask?.subtasks?.map(st => st.id));

        const newSubtasks = updates.subtasks ?? [];

        // ID subtasks cần giữ lại
        const incomingIds = new Set(newSubtasks.filter(st => st.id).map(st => st.id));
        const subtasksToDelete = currentTask?.subtasks?.filter(st => !incomingIds.has(st.id)) || [];
        const subtasksToCreate = newSubtasks.filter(st => !st.id);

        // 1. Xoá subtasks không còn nữa
        await Promise.all(subtasksToDelete.map(async (st) => {
            try {
                await deleteSubtaskById(st.id);
            } catch (err) {
                console.error(`Failed to delete subtask ${st.id}`, err);
            }
            }));

            // 2. Tạo subtasks mới
            const createdSubtasks = await Promise.all(
            subtasksToCreate.map(async (sub) => {
                const created = await createSubtaskByTaskId(taskId, sub.title, sub.completed);
                return {
                id: created.id.toString(),
                title: created.content,
                completed: created.isCompleted,
                };
            })
            );

        // 3. Ghép subtasks giữ lại (có id) và subtasks vừa tạo
        const finalSubtasks = [
            ...newSubtasks.filter(st => st.id), // giữ lại subtasks cũ còn tồn tại
            ...createdSubtasks // subtasks vừa tạo
            ];

        // 4. Cập nhật lại task trong state
        const updatedTask: Task = {
            id: updatedData.id.toString(),
            title: updatedData.title,
            completed: updatedData.isCompleted,
            listId: updatedData.listId,
            dueDate: updatedData.dueDate
                ? new Date(updatedData.dueDate).toISOString().split('T')[0]
                : undefined,
            notes: updatedData.description || '',
            isStarred: updatedData.isStarred ?? false,
            assignedTo: updatedData.userId || undefined,
            subtasks: finalSubtasks.map(st => ({
                    id: st.id,
                    title: st.title,
                    completed: st.completed, // đổi lại đúng định dạng của SubTask
                })),

            comments: [],
            sharedWith: [],
            attachments: [],
            };

            setTasks(prev =>
            prev.map(task => (task.id === taskId ? updatedTask : task))
            );

            return updatedTask;
        } catch (error) {
            console.error('Error updating task with subtasks:', error);
            throw error;
        }
        };

    const deleteTask = async (taskId: string): Promise<void> => {
            await deleteTaskById(taskId);
            setTasks(prev => prev.filter(task => task.id !== taskId));
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
    // const addList = async (listData: Partial<TaskList>): Promise<TaskList> => {
    //     // Commenting out the auth check for now
    //     // if (!currentUser) throw new Error('User must be logged in');

    //     const newList: TaskList = {
    //         id: Date.now().toString(),
    //         name: listData.name || 'New List',
    //         color: listData.color || 'blue',
    //         icon: listData.icon,
    //         ownerId: currentUser?.id || 'default-owner',
    //         isShared: false,
    //         sharedWith: []
    //     };

    //     setLists(prevLists => [...prevLists, newList]);
    //     return newList;
    // };

    const addList = async (listData: Partial<TaskList>): Promise<TaskList> => {
    try {
        if (!listData.name || !listData.icon || !listData.color) {
            throw new Error('Missing list information');
        }

        const createdList = await createList(listData.name, listData.icon, listData.color);

        const newList: TaskList = {
            id: createdList.id.toString(),
            name: createdList.name,
            icon: createdList.icon,
            color: createdList.color,
            ownerId: createdList.user?.email,
            isShared: false,
            sharedWith: []
        };

        setLists(prev => [...prev, newList]);
        return newList;
    } catch (error) {
        console.error('Failed to create list:', error);
        throw error;
    }
};


    // const updateList = async (listId: string, updates: Partial<TaskList>): Promise<TaskList> => {
    //     const updatedLists = lists.map(list =>
    //         list.id === listId ? { ...list, ...updates } : list
    //     );

    //     setLists(updatedLists);
    //     const updatedList = updatedLists.find(l => l.id === listId);

    //     if (!updatedList) {
    //         throw new Error('List not found');
    //     }

    //     return updatedList;
    // };

    const updateList = async (listId: string, updates: Partial<TaskList>): Promise<TaskList> => {
    try {
        const updatedData = await updateListById(listId, updates); // Gọi API PATCH

        const updatedLists = lists.map(list =>
            list.id === listId ? { ...list, ...updatedData } : list
        );

        setLists(updatedLists);

        const updatedList = updatedLists.find(l => l.id === listId);
        if (!updatedList) {
            throw new Error('List not found after update');
        }

        return updatedList;
    } catch (error) {
        console.error('Error updating list:', error);
        throw error;
    }
};


    // const deleteList = async (listId: string): Promise<void> => {
    //     setLists(lists.filter(list => list.id !== listId));
    //     // Also delete or update tasks in that list
    //     setTasks(tasks.map(task =>
    //         task.listId === listId ? { ...task, listId: undefined } : task
    //     ));
    // };

    const deleteList = async (listId: string): Promise<void> => {
    try {
        await deleteListById(listId); // Gọi API DELETE

        // Cập nhật local state
        setLists(prev => prev.filter(list => list.id !== listId));
        setTasks(prev => prev.map(task =>
            task.listId === listId ? { ...task, listId: undefined } : task
        ));
    } catch (error) {
        console.error('Error deleting list:', error);
        throw error;
    }
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
            const res = await createComment(taskId, content);

            const newComment: Comment = {
            id: res.id.toString(),
            taskId: taskId,
            userId: res.user?.userId?.toString() ?? '',
            content: res.content,
            createdAt: res.createdAt,
            userName: res.user?.email || 'Unknown',
            userPhotoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(res.user?.email || 'Unknown')}&background=random`
            };

            setTasks(prev =>
            prev.map(task =>
                task.id === taskId
                ? { ...task, comments: [...(task.comments || []), newComment] }
                : task
            )
            );

            return newComment;
        } catch (err) {
            console.error('Failed to create comment:', err);
            throw err;
        }
        };


    const deleteComment = async (commentId: string): Promise<void> => {
        try {
            await deleteCommentById(commentId);

            setTasks(prev =>
            prev.map(task => ({
                ...task,
                comments: (task.comments || []).filter(c => c.id !== commentId),
            }))
            );
        } catch (err) {
            console.error('Failed to delete comment:', err);
            throw err;
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
