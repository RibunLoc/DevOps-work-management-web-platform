export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  //userPhotoUrl?: string;
  content: string;
  createdAt: string;
}

export interface SharedUser {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role: 'viewer' | 'editor' | 'admin';
}

export interface Attachment {
  id: string;
  taskId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  notes?: string;
  isStarred?: boolean;
  listId?: string;  // For organizing into lists
  // position?: number; // For ordering tasks in a list
  subtasks?: SubTask[]; // For adding subtasks
  // createdAt: string;
  // updatedAt: string;
  assignedTo?: string; // UserID of person assigned to task
  sharedWith?: SharedUser[]; // Users that have access to this task
  comments?: Comment[]; // Comments on the task
  attachments?: Attachment[]; // Files attached to the task
  questions?: any[]; // hoặc cụ thể hơn nếu bạn biết kiểu
}

export interface TaskList {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  isShared?: boolean;
  ownerId?: string;
  sharedWith?: SharedUser[]; // Users that have access to this list
}

