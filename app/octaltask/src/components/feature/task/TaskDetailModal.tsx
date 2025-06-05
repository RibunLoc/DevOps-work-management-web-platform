import { Task, TaskList, Attachment } from '@/types/task';
import { format } from 'date-fns';
import {
    Calendar,
    ListTodo,
    MessageSquare,
    Plus,
    MessageSquareShare,
    X,
    Paperclip,
    FileText,
    Download,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import { ShareModal } from './ShareModal';
import { TaskComments } from './TaskComments';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


interface SubTask {
    id: string;
    title: string;
    completed: boolean;
}

interface Comment {
    id: string;
    content: string;
    taskId: string;
    userName: string;
    userId: string;
    authorPhoto?: string;
    createdAt: string;
}

interface TaskDetailModalProps {
    task: Task;
    lists?: TaskList[];
    currentUserId: string;
    currentUserName: string;
    currentUserPhoto?: string;
    onClose: () => void;
    onSave: (updatedTask: Task) => void;
    onDelete?: (taskId: string) => void;
    onShareTask?: (task: Task, email: string, role: 'viewer' | 'editor' | 'admin') => void;
    onUpdatePermission?: (task: Task, userId: string, role: 'viewer' | 'editor' | 'admin') => void;
    onRemoveUser?: (task: Task, userId: string) => void;
    onAddComment?: (taskId: string, content: string) => void;
    onDeleteComment?: (commentId: string) => void;
    onAddAttachment?: (taskId: string, file: File) => Promise<Attachment>;
    onDeleteAttachment?: (attachmentId: string) => void;
}

export function TaskDetailModal({
    task,
    lists = [],
    currentUserId,
    currentUserName,
    currentUserPhoto,
    onClose,
    onSave,
    onDelete,
    onShareTask,
    onUpdatePermission,
    onRemoveUser,
    onAddComment,
    onDeleteComment,
    onAddAttachment,
    onDeleteAttachment
}: TaskDetailModalProps) {
    const [editedTask, setEditedTask] = useState<Task>({ ...task });
    const [subtasks, setSubtasks] = useState<SubTask[]>(task.subtasks || []);
    // Removed separate comments state - will use editedTask.comments instead
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [showListSelector, setShowListSelector] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (editedTask.title.trim()) {
            console.log('Saving task with dueDate:', editedTask.dueDate); // Debug log
            
            onSave({
                ...editedTask,
                subtasks: subtasks.map(st => ({
                    id: st.id?.startsWith('temp-') ? '' : st.id || '',
                    title: st.title,
                    completed: st.completed
                })),
                comments: (editedTask.comments || []).map(comment => ({
                    id: comment.id?.startsWith('temp-') ? '' : comment.id || '',
                    content: comment.content,
                    userId: comment.userId,
                    userName: comment.userName,
                    taskId: comment.taskId,
                    authorPhoto: comment.userPhotoUrl,
                    createdAt: comment.createdAt
                }))
            });
            onClose();
        }
    };

    const addSubtask = () => {
        if (newSubtaskTitle.trim()) {
            const newSubtask: SubTask = {
                id: `temp-${Date.now()}`, // gắn tiền tố tạm
                title: newSubtaskTitle,
                completed: false
            };
            setSubtasks([...subtasks, newSubtask]);
            setNewSubtaskTitle('');
        }
    };

    const toggleSubtaskCompletion = (subtaskId: string) => {
        setSubtasks(
            subtasks.map(subtask =>
                subtask.id === subtaskId
                    ? { ...subtask, completed: !subtask.completed }
                    : subtask
            )
        );
    };

    const deleteSubtask = (subtaskId: string) => {
        setSubtasks(subtasks.filter(subtask => subtask.id !== subtaskId));
    };

    // Fixed Comment handlers - update editedTask.comments directly
    const handleAddComment = async (taskId: string, content: string) => {
        if (!content.trim()) return;

        // Tạo comment mới với id tạm thời
        const newComment: Comment = {
            id: `temp-${Date.now()}`,
            content: content.trim(),
            userId: currentUserId,
            userName: currentUserName,
            authorPhoto: currentUserPhoto,
            taskId: taskId,
            createdAt: new Date().toISOString()
        };

        // Cập nhật editedTask.comments ngay lập tức để UI update
        setEditedTask(prev => ({
            ...prev,
            comments: [...(prev.comments || []), newComment]
        }));

        // Gọi API để lưu vào database (nếu có)
        if (onAddComment) {
            try {
                await onAddComment(taskId, content.trim());
            } catch (error) {
                console.error('Error adding comment:', error);
                // Nếu lỗi, rollback state
                setEditedTask(prev => ({
                    ...prev,
                    comments: (prev.comments || []).filter(c => c.id !== newComment.id)
                }));
            }
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        // Cập nhật editedTask.comments ngay lập tức để UI update
        setEditedTask(prev => ({
            ...prev,
            comments: (prev.comments || []).filter(comment => comment.id !== commentId)
        }));

        // Gọi API để xóa khỏi database (nếu có và không phải comment tạm)
        if (onDeleteComment && !commentId.startsWith('temp-')) {
            try {
                await onDeleteComment(commentId);
            } catch (error) {
                console.error('Error deleting comment:', error);
                // Nếu lỗi, có thể rollback state (cần lưu trạng thái trước đó)
            }
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(task.id);
            onClose();
        }
    };

    const getListName = (listId?: string) => {
        if (!listId) return 'No list';
        const list = lists.find(l => l.id === listId);
        return list ? list.name : 'Unknown list';
    };

    const getListColor = (listId?: string) => {
        if (!listId) return 'text-gray-600';
        const list = lists.find(l => l.id === listId);
        if (!list || !list.color) return 'text-gray-600';

        switch (list.color) {
            case 'blue': return 'text-blue-600';
            case 'green': return 'text-green-600';
            case 'red': return 'text-red-600';
            case 'purple': return 'text-purple-600';
            case 'amber': return 'text-amber-600';
            default: return 'text-gray-600';
        }
    };

    const getListBgColor = (listId?: string) => {
        if (!listId) return 'bg-gray-50'; // Default if no listId
        const list = lists.find(l => l.id === listId);
        if (!list || !list.color) return 'bg-gray-50'; // Default if no color found

        switch (list.color) {
            case 'blue':
                return 'bg-blue-200';
            case 'green':
                return 'bg-green-200';
            case 'red':
                return 'bg-red-200';
            case 'purple':
                return 'bg-purple-200';
            case 'amber':
                return 'bg-amber-200';
            default:
                return 'bg-gray-200'; // Fallback default color
        }
    };

    const isShared = editedTask.sharedWith && editedTask.sharedWith.length > 0;

    // Calculate completion percentage for subtasks
    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter(s => s.completed).length;
    const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

    const handleAttachFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0 || !onAddAttachment) return;

        setIsUploading(true);
        try {
            const file = files[0];
            const attachment = await onAddAttachment(task.id, file);

            // Update the edited task with the new attachment
            setEditedTask({
                ...editedTask,
                attachments: [...(editedTask.attachments || []), attachment]
            });
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteAttachment = (attachmentId: string) => {
        if (!onDeleteAttachment) return;

        onDeleteAttachment(attachmentId);

        // Update the edited task
        setEditedTask({
            ...editedTask,
            attachments: editedTask.attachments?.filter(a => a.id !== attachmentId) || []
        });
    };

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
        onClick={onClose}
      >
        <div
          className="max-w-4xl w-full mx-4 h-[calc(100vh-80px)] max-h-[700px] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col h-full overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
            {/* Header with color accent */}
            <div className={`h-2 ${getListBgColor(editedTask.listId)}`}></div>

            <div className="flex flex-col flex-grow p-5 overflow-hidden">
              {/* Task title section */}
              <div className="pb-3 mb-4 border-b border-gray-100 dark:border-gray-700">
                <Input
                  value={editedTask.title}
                  onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
                  placeholder="Task name"
                  className="w-full h-auto px-0 pb-2 -mt-1 text-xl font-medium border-0 focus-visible:ring-0"
                />

                <div className="flex flex-wrap gap-2 mt-4">
                  {/* List selector */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`text-xs rounded-full h-7 px-3 border-gray-200 ${getListColor(
                        editedTask.listId
                      )}`}
                      onClick={() => setShowListSelector(!showListSelector)}
                    >
                      <ListTodo className="h-3 w-3 mr-1.5" />
                      {getListName(editedTask.listId)}
                    </Button>

                    {showListSelector && (
                      <div className="absolute left-0 z-10 w-48 mt-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg top-full dark:bg-gray-800 dark:border-gray-700">
                        <div className="py-1">
                          <button
                            className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              setEditedTask({ ...editedTask, listId: undefined });
                              setShowListSelector(false);
                            }}
                          >
                            No list
                          </button>
                          {lists.map(list => (
                            <button
                              key={list.id}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                editedTask.listId === list.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                              }`}
                              onClick={() => {
                                setEditedTask({ ...editedTask, listId: list.id });
                                setShowListSelector(false);
                              }}
                            >
                              {list.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date picker button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3 text-xs border-gray-200 rounded-full h-7"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setEditedTask({ ...editedTask, dueDate: today });
                    }}
                  >
                    <Calendar className="h-3 w-3 mr-1.5 cursor-pointer" />
                    {editedTask.dueDate
                      ? format(new Date(editedTask.dueDate), 'MMM d, yyyy')
                      : 'Add due date'}
                  </Button>

                  {/* Assign task to people */}
                  {onShareTask && (
                    <Button
                      variant={isShared ? 'outline' : 'default'}
                      size="sm"
                      className={`text-sm rounded-full h-7 p-2 ml-auto ${
                        isShared
                          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 dark:border-blue-800'
                          : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90'
                      }`}
                      onClick={() => setShowShareModal(true)}
                    >
                      <MessageSquareShare className="h-4 w-4 mr-1.5" />
                      {isShared ? `Assigned (${editedTask.sharedWith?.length})` : 'Assign'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Main content area with flex layout */}
              <div className="flex flex-col flex-grow overflow-hidden md:flex-row md:gap-6">
                {/* Left column - Task details */}
                <div className="flex flex-col mb-4 overflow-hidden md:w-1/2 md:max-w-md md:mb-0">
                  <div className="flex flex-col h-full gap-4">
                    {/* Due date */}
                    <div className="flex items-center gap-4 p-4 transition-all bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-md focus-within:shadow-md">
                      <div className="flex items-center justify-center p-2 rounded-full bg-gray-50 dark:bg-gray-700">
                        <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-grow">
                        <div className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          Due Date
                        </div>
                        <Input
                          type="date"
                          value={editedTask.dueDate || ''}
                          onChange={e => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                          className="h-10 p-2 text-sm text-gray-900 placeholder-gray-400 transition-all bg-transparent border-0 rounded-lg cursor-pointer dark:text-white dark:placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col flex-grow gap-2 p-3 overflow-hidden bg-white border border-gray-100 rounded-lg dark:border-gray-700 dark:bg-gray-800/90">
                      <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                        <span>Notes</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-6 h-6 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={handleAttachFile}
                              disabled={isUploading}
                              aria-label="Attach a file"
                            >
                              <Paperclip className="h-3.5 w-3.5 text-gray-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            sideOffset={10}
                            className="z-[200] px-3 py-2 text-xs font-medium bg-gray-800 text-white border border-gray-200 rounded-md shadow-lg dark:bg-blue-100 dark:text-black"
                          >
                            Attach files
                          </TooltipContent>
                        </Tooltip>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                      <textarea
                        className="flex-grow w-full p-0 text-sm border-0 resize-none focus:ring-0 focus:outline-none dark:bg-transparent"
                        value={editedTask.notes || ''}
                        onChange={e => setEditedTask({ ...editedTask, notes: e.target.value })}
                        placeholder="Add notes here..."
                      />

                      {/* Attachments */}
                      {editedTask.attachments && editedTask.attachments.length > 0 && (
                        <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
                          <div className="mb-2 text-xs font-medium text-gray-500">Attachments</div>
                          <div className="space-y-2 overflow-y-auto max-h-40">
                            {editedTask.attachments.map(attachment => (
                              <div
                                key={attachment.id}
                                className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800 group"
                              >
                                <div className="flex items-center flex-1 min-w-0 gap-2">
                                  <FileText className="flex-shrink-0 w-4 h-4 text-blue-500" />
                                  <div className="flex-1 truncate">
                                    <div className="text-xs font-medium truncate">
                                      {attachment.fileName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {(attachment.fileSize / 1024).toFixed(1)} KB
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-6 h-6 p-0 text-gray-500 rounded-full hover:text-blue-900 hover:bg-gray-100 dark:hover:text-gray-300"
                                    onClick={() => {
                                      const a = document.createElement('a');
                                      a.href = attachment.url;
                                      a.download = attachment.fileName;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                    }}
                                    aria-label={`Download ${attachment.fileName}`}
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-6 h-6 p-0 text-gray-500 rounded-full hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleDeleteAttachment(attachment.id)}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right column - Subtasks & Comments */}
                <div className="flex flex-col h-full gap-4 overflow-hidden md:w-1/2">
                  {/* Subtasks */}
                  <div className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-lg dark:border-gray-700 dark:bg-gray-800/90">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-medium text-gray-500">Subtasks</div>
                      {totalSubtasks > 0 && (
                        <span className="text-xs text-gray-500">
                          {completedSubtasks}/{totalSubtasks}
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    {totalSubtasks > 0 && (
                      <div className="w-full h-1 mb-2 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${subtaskProgress}%` }}
                        ></div>
                      </div>
                    )}

                    {/* Subtasks list */}
                    <div className="space-y-1 mb-2 max-h-[100px] overflow-y-auto scrollbar-thin">
                      {subtasks.map(subtask => (
                        <div
                          key={subtask.id}
                          className="flex items-center gap-2 group py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md"
                        >
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={() => toggleSubtaskCompletion(subtask.id)}
                            className="h-4 w-4 rounded-sm border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-500"
                          />
                          <span
                            className={`text-sm flex-grow ${
                              subtask.completed
                                ? 'line-through text-gray-400 dark:text-gray-500'
                                : ''
                            }`}
                          >
                            {subtask.title}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                            onClick={() => deleteSubtask(subtask.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}

                      {subtasks.length === 0 && (
                        <div className="py-2 text-sm text-center text-gray-400 dark:text-gray-500">
                          No subtasks yet
                        </div>
                      )}
                    </div>

                    {/* Add subtask */}
                    <div className="flex gap-2 mt-1">
                      <Input
                        placeholder="Add a subtask"
                        value={newSubtaskTitle}
                        onChange={e => setNewSubtaskTitle(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addSubtask()}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={addSubtask}
                        disabled={!newSubtaskTitle.trim()}
                        className="rounded-full shrink-0 h-9 w-9 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Comments section */}
                  {onAddComment && (
                    <div className="rounded-lg bg-white border border-gray-100 dark:border-gray-700 dark:bg-gray-800/90 p-3 flex flex-col gap-2 flex-grow overflow-hidden max-h-[280px]">
                      <div className="flex items-center mb-1 text-xs font-medium text-gray-500">
                        <MessageSquare className="h-3 w-3 mr-1.5" />
                        Comments
                      </div>

                      <div className="flex-grow overflow-y-auto scrollbar-thin">
                        <TaskComments
                          task={editedTask} // Pass editedTask instead of original task
                          currentUserId={currentUserId}
                          currentUserName={currentUserName}
                          currentUserPhoto={currentUserPhoto}
                          onAddComment={handleAddComment}
                          onDeleteComment={handleDeleteComment || (() => {})}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer with actions */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {onDelete && (
                <Button
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
              <div className="flex gap-3 ml-auto">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-200 h-9"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="text-white bg-blue-600 hover:bg-blue-700 h-9"
                  disabled={!editedTask.title.trim()}
                  size="sm"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          className="absolute flex items-center justify-center w-8 h-8 text-gray-600 transition-colors bg-white rounded-full shadow-md top-4 right-4 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>

        {showShareModal && onShareTask && onUpdatePermission && onRemoveUser && (
          <ShareModal
            item={editedTask}
            itemType="task"
            onClose={() => setShowShareModal(false)}
            onShare={(task, email, role) => {
              onShareTask(task as Task, email, role);
            }}
            onUpdatePermission={(task, userId, role) => {
              onUpdatePermission(task as Task, userId, role);
            }}
            onRemoveUser={(task, userId) => {
              onRemoveUser(task as Task, userId);
            }}
          />
        )}
      </div>
    );
}