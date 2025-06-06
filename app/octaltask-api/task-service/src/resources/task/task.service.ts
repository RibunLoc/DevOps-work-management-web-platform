import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';
import { Comment } from '../../entities/comment.entity';
import { Subtask } from '../../entities/subtask.entity';
import { List } from '../../entities/list.entity'; // Import List entity
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskUser } from './task.controller';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Subtask)
    private subtaskRepo: Repository<Subtask>,
    @InjectRepository(List)
    private listRepo: Repository<List>, // Inject List repository

  ) { }

  private async createDefaultList(user: TaskUser, name: string, icon: string, color: string) {
    const list = this.listRepo.create({
      name,
      icon: icon as any,
      color: color as any,
      user: { id: user.userId } as any,
      createdBy: user.userId
    });

    return await this.listRepo.save(list);
  }

  private async createDefaultTasks(listId: number, user: TaskUser, tasksData: Array<{ title: string, description: string, isCompleted: boolean }>) {
    const tasks: Task[] = [];

    for (const taskData of tasksData) {
      const task = this.taskRepo.create({
        title: taskData.title,
        description: taskData.description,
        isCompleted: taskData.isCompleted,
        isStarted: false,
        userId: user.userId,
        list: { id: listId } as any
      });

      const savedTask = await this.taskRepo.save(task);
      tasks.push(savedTask);
    }

    return tasks;
  }

  // Enhanced createDefaultUserSetup method for task.service.ts
  async createDefaultUserSetup(user: TaskUser, userName: string) {
    try {
      // Check if user already has lists to avoid duplicates
      const existingLists = await this.listRepo.find({
        where: { user: { id: user.userId } }
      });

      if (existingLists.length > 0) {
        this.logger.warn(`User ${user.userId} already has lists, skipping default setup`);
        return {
          message: 'User already has existing lists',
          lists: [],
          totalTasks: 0
        };
      }

      // Create default lists
      const personalList = await this.createDefaultList(
        user,
        'Personal',
        'personal',
        'blue'
      );

      const workList = await this.createDefaultList(
        user,
        'Work',
        'work',
        'purple'
      );

      // Create default tasks for Personal list
      const personalTasks = await this.createDefaultTasks(personalList.id, user, [
        {
          title: `Welcome to your personal space, ${userName}!`,
          description: `Hi ${userName}! This is your personal task list. Feel free to add your own tasks here and organize your personal life.`,
          isCompleted: false
        },
        {
          title: 'Set up your profile',
          description: 'Complete your profile information, upload a profile picture, and configure your preferences',
          isCompleted: false
        },
        {
          title: 'Explore the app features',
          description: 'Take some time to familiarize yourself with all the features: creating lists, setting due dates, adding comments, and more',
          isCompleted: false
        },
        {
          title: 'Try creating your first custom task',
          description: 'Practice using the app by creating a task of your own in this list',
          isCompleted: false
        }
      ]);

      // Create default tasks for Work list
      const workTasks = await this.createDefaultTasks(workList.id, user, [
        {
          title: 'Read onboarding documentation',
          description: 'Go through the company onboarding materials, employee handbook, and important policies',
          isCompleted: false
        },
        {
          title: 'Set up your workspace',
          description: 'Organize your desk, install necessary software, configure development environment, and set up accounts',
          isCompleted: false
        },
        {
          title: 'Meet your team',
          description: 'Schedule introductory meetings with your team members, manager, and key stakeholders you\'ll be working with',
          isCompleted: false
        },
        {
          title: 'Review current projects',
          description: 'Get up to speed with ongoing projects, understand your role, and identify immediate priorities',
          isCompleted: false
        },
        {
          title: 'Set up communication tools',
          description: 'Configure Slack, email signatures, calendar settings, and other communication tools used by the team',
          isCompleted: false
        }
      ]);

      return {
        message: 'Default user setup created successfully',
        lists: [
          {
            id: personalList.id,
            name: personalList.name,
            icon: personalList.icon,
            color: personalList.color,
            taskCount: personalTasks.length
          },
          {
            id: workList.id,
            name: workList.name,
            icon: workList.icon,
            color: workList.color,
            taskCount: workTasks.length
          }
        ],
        totalTasks: personalTasks.length + workTasks.length
      };

    } catch (error) {
      this.logger.error(`Failed to create default setup for user ${user.userId}:`, error.message);
      // Clean up any partially created data
      await this.cleanupPartialSetup(user.userId);
      throw error;
    }
  }

  private async cleanupPartialSetup(userId: number) {
    try {
      // Find and remove any lists that might have been created
      const partialLists = await this.listRepo.find({
        where: { user: { id: userId } },
        relations: ['tasks']
      });

      for (const list of partialLists) {
        // Remove tasks in the list
        if (list.tasks && list.tasks.length > 0) {
          await this.taskRepo.remove(list.tasks);
        }
        // Remove the list
        await this.listRepo.remove(list);
      }

    } catch (cleanupError) {
      this.logger.error(`Failed to cleanup partial setup for user ${userId}:`, cleanupError.message);
    }
  }

  private async checkUserPermission(taskUserId: number, requestingUserId: number, userRole: string): Promise<boolean> {
    return taskUserId === requestingUserId || userRole === 'admin';
  }

  // Validate if list exists and belongs to user
  private async validateListOwnership(listId: number, userId: number): Promise<List> {
    const list = await this.listRepo.findOne({
      where: {
        id: listId,
        user: { id: userId }
      },
      relations: ['user']
    });

    if (!list) {
      throw new NotFoundException('List not found or you do not have permission to access it');
    }

    return list;
  }

  #Task
  async create(createTaskDto: CreateTaskDto, user: TaskUser) {
    const list = await this.validateListOwnership(createTaskDto.listId!, user.userId);

    const task = this.taskRepo.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      isCompleted: createTaskDto.isCompleted || false,
      isStarted: createTaskDto.isStarted || false,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
      userId: user.userId,
      list: list // Assign list to task
    });
    const savedTask = await this.taskRepo.save(task);
    return {
      id: savedTask.id,
      title: savedTask.title,
      description: savedTask.description,
      isCompleted: savedTask.isCompleted,
      isStarted: savedTask.isStarted,
      dueDate: savedTask.dueDate,
      userId: savedTask.userId,
      listId: savedTask.list?.id ?? null
    };
  }

  async findAll(user: TaskUser) {
    const tasks = await this.taskRepo.find({
      where: {
        userId: user.userId,
      },
      relations: ['list'], // Để truy cập list.id
    });

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      isCompleted: task.isCompleted,
      isStarted: task.isStarted,
      dueDate: task.dueDate?.toISOString(),
      userId: task.userId,
      listId: task.list?.id ?? null,
    }));
  }


  async findOne(id: number, user: TaskUser) {
    const task = await this.taskRepo.findOne({
      where: {
        id,
        userId: user.userId
      },
      relations: ['list'],
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
        isStarted: true,
        dueDate: true,
        userId: true,
      }
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return {
      ...task,
      listId: task.list?.id ?? null,
    };
  }


  async update(id: number, updateTaskDto: UpdateTaskDto, user: TaskUser) {
    // First, find the task to ensure it exists and belongs to the user
    const task = await this.taskRepo.findOne({
      where: {
        id,
        userId: user.userId
      },
      relations: ['list']
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // If listId is provided, validate the new list ownership
    if (updateTaskDto.listId !== undefined) {
      const newList = await this.validateListOwnership(updateTaskDto.listId, user.userId);
      task.list = newList;
    }
    // If listId is not provided, keep the current list (no change)

    // Update other fields
    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.isCompleted !== undefined) {
      task.isCompleted = updateTaskDto.isCompleted;
    }
    if (updateTaskDto.isStarted !== undefined) {
      task.isStarted = updateTaskDto.isStarted;
    }
    if (updateTaskDto.dueDate !== undefined) {
      task.dueDate = updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined;
    }

    return await this.taskRepo.save(task);
  }

  async remove(id: number, user: TaskUser) {
    // First, find the task to ensure it exists and belongs to the user
    const task = await this.taskRepo.findOne({
      where: {
        id,
        userId: user.userId
      }
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Delete the task
    await this.taskRepo.remove(task);

    return { success: true };
  }

  async getAllTasksForAdmin() {
    return await this.taskRepo.find({
      relations: ['list'],
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
        isStarted: true,
        dueDate: true,
        userId: true,
        list: {
          id: true,
          name: true,
          icon: true,
          color: true
        }
      }
    });
  }

  async getTaskByIdForAdmin(id: number) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['list'],
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
        isStarted: true,
        dueDate: true,
        userId: true,
        list: {
          id: true,
          name: true,
          icon: true,
          color: true
        }
      }
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async adminUpdateTask(id: number, updateTaskDto: UpdateTaskDto) {
    // First, find the task to ensure it exists
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['list']
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // If listId is provided, validate the list exists (admin can move task to any list)
    if (updateTaskDto.listId !== undefined) {
      const newList = await this.listRepo.findOne({
        where: { id: updateTaskDto.listId }
      });

      if (!newList) {
        throw new NotFoundException('List not found');
      }

      task.list = newList;
    }

    // Update other fields
    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.isCompleted !== undefined) {
      task.isCompleted = updateTaskDto.isCompleted;
    }
    if (updateTaskDto.isStarted !== undefined) {
      task.isStarted = updateTaskDto.isStarted;
    }
    if (updateTaskDto.dueDate !== undefined) {
      task.dueDate = updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined;
    }
    return await this.taskRepo.save(task);
  }

  async adminDeleteTask(id: number) {
    const task = await this.taskRepo.findOne({
      where: { id }
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.taskRepo.remove(task);
    return { success: true };
  }

  async getAllTasksByUserId(userId: number) {
    const tasks = await this.taskRepo.find({
      where: {
        userId: userId
      },
      relations: ['list'],
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
        isStarted: true,
        dueDate: true,
        userId: true,
        list: {
          id: true,
          name: true,
          icon: true,
          color: true
        }
      }
    });

    return tasks;
  }

  async addSubtaskToTask(taskId: number, content: string, isCompleted: boolean, userInfo: { userId: number; email?: string; role?: string }) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!await this.checkUserPermission(task.userId, userInfo.userId, userInfo.role!)) {
      throw new ForbiddenException('Permission denied to subtask on this task');
    }

    const user = await this.userRepo.findOneBy({ id: userInfo.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const subtask = this.subtaskRepo.create({
      content,
      isCompleted,
      task,
      user
    });

    const savedSubtask = await this.subtaskRepo.save(subtask);

    return {
      id: savedSubtask.id,
      content: savedSubtask.content,
      isComplete: savedSubtask.isCompleted,
      createdAt: savedSubtask.createdAt.toISOString(),
      taskId: task.id,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }

    };
  }

  async getSubtasksForTask(taskId: number, userInfo: { userId: number; email?: string; role?: string }) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!await this.checkUserPermission(task.userId, userInfo.userId, userInfo.role!)) {
      throw new ForbiddenException('Permission denied to view subtasks on this task');
    }

    const subtasks = await this.subtaskRepo.find({
      where: { task: { id: taskId } },
      relations: ['user'],
      select: {
        id: true,
        content: true,
        isCompleted: true,
        createdAt: true,
        user: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      },
      order: {
        createdAt: 'DESC'
      }
    });

    return subtasks.map(subtask => ({
      id: subtask.id,
      content: subtask.content,
      isCompleted: subtask.isCompleted,
      createdAt: subtask.createdAt.toISOString(),
      taskId: task.id,
      user: {
        userId: subtask.user.id,
        email: subtask.user.email,
        name: subtask.user.name,
        role: subtask.user.role
      }
    }));
  }

  async addCommentToTask(taskId: number, content: string, userInfo: { userId: number; email?: string; role?: string }) {
    // Find the task
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if the user has permission to comment on this task
    // Users can comment on their own tasks or admins can comment on any task
    if (!await this.checkUserPermission(task.userId, userInfo.userId, userInfo.role!)) {
      throw new ForbiddenException('Permission denied to comment on this task');
    }

    // Find the user
    const user = await this.userRepo.findOneBy({ id: userInfo.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create and save the comment
    const comment = this.commentRepo.create({
      content,
      task,
      user
    });

    const savedComment = await this.commentRepo.save(comment);

    // Format the response
    return {
      id: savedComment.id,
      content: savedComment.content,
      createdAt: savedComment.createdAt.toISOString(),
      taskId: task.id,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  async getCommentsForTask(taskId: number, userInfo: { userId: number; email?: string; role?: string }) {
    // Find the task
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if the user has permission to view comments on this task
    // Users can view comments on their own tasks or admins can view comments on any task
    if (!await this.checkUserPermission(task.userId, userInfo.userId, userInfo.role!)) {
      throw new ForbiddenException('Permission denied to view comments on this task');
    }

    // Find all comments for this task
    const comments = await this.commentRepo.find({
      where: { task: { id: taskId } },
      relations: ['user'],
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      },
      order: {
        createdAt: 'DESC'
      }
    });

    // Format the response
    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      taskId: task.id,
      user: {
        userId: comment.user.id,
        email: comment.user.email,
        name: comment.user.name,
        role: comment.user.role
      }
    }));
  }
}