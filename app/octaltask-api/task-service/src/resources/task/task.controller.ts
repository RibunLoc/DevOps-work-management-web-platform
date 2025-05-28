import { Controller } from '@nestjs/common';
import { TaskService } from './task.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export interface TaskUser {
  userId: number;
  email: string;
  role: string;
}

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @GrpcMethod('TaskService', 'CreateTask')
  async createTask(data: {
    title: string;
    description?: string;
    isCompleted?: boolean;
    dueDate?: string;
    user: TaskUser
  }) {
    try {
      if (!data.title) {
        throw new RpcException('Title is required');
      }

      const createTaskDto: CreateTaskDto = {
        title: data.title,
        description: data.description,
        isCompleted: data.isCompleted,
        dueDate: data.dueDate
      };

      return await this.taskService.create(createTaskDto, data.user);
    } catch (error) {
      throw new RpcException(error.message || 'Failed to create task');
    }
  }

  @GrpcMethod('TaskService', 'GetAllTasks')
  async getAllTasks(data: { user: TaskUser }) {
    try {
      if (!data.user || !data.user.userId) {
        throw new RpcException('User information missing from request');
      }

      const tasks = await this.taskService.findAll(data.user);
      return { tasks };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to retrieve tasks');
    }
  }

  @GrpcMethod('TaskService', 'GetTaskById')
  async getTaskById(data: {
    id: number;
    user: TaskUser
  }) {
    try {
      if (!data || typeof data.id !== 'number') {
        throw new RpcException('Invalid task ID format');
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException('User information missing from request');
      }

      return await this.taskService.findOne(data.id, data.user);
    } catch (error) {
      throw new RpcException(error.message || 'Failed to retrieve task');
    }
  }

  @GrpcMethod('TaskService', 'UpdateTask')
  async updateTask(data: {
    id: number;
    title?: string;
    description?: string;
    isCompleted?: boolean;
    dueDate?: string;
    user: TaskUser
  }) {
    try {
      if (!data || typeof data.id !== 'number') {
        throw new RpcException('Invalid task data format');
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException('User information missing from request');
      }

      const { id, user, ...updateData } = data;
      const updateTaskDto: UpdateTaskDto = {
        title: updateData.title,
        description: updateData.description,
        isCompleted: updateData.isCompleted,
        dueDate: updateData.dueDate
      };

      return await this.taskService.update(id, updateTaskDto, user);
    } catch (error) {
      throw new RpcException(error.message || 'Failed to update task');
    }
  }

  @GrpcMethod('TaskService', 'DeleteTask')
  async deleteTask(data: {
    id: number;
    user: TaskUser
  }) {
    try {
      if (!data || typeof data.id !== 'number') {
        throw new RpcException('Invalid task ID format');
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException('User information missing from request');
      }

      await this.taskService.remove(data.id, data.user);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to delete task');
    }
  }

  @GrpcMethod('TaskService', 'GetAllTasksForAdmin')
  async getAllTasksForAdmin() {
    try {
      const tasks = await this.taskService.getAllTasksForAdmin();
      return { tasks };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to retrieve tasks');
    }
  }

  @GrpcMethod('TaskService', 'GetTaskByIdForAdmin')
  async getTaskByIdForAdmin(data: { id: number }) {
    try {
      if (!data || typeof data.id !== 'number') {
        throw new RpcException('Invalid task ID format');
      }

      return await this.taskService.getTaskByIdForAdmin(data.id);
    } catch (error) {
      throw new RpcException(error.message || 'Failed to retrieve task');
    }
  }

  @GrpcMethod('TaskService', 'AdminUpdateTask')
  async adminUpdateTask(data: {
    id: number;
    title?: string;
    description?: string;
    isCompleted?: boolean;
    dueDate?: string
  }) {
    try {
      if (!data || typeof data.id !== 'number') {
        throw new RpcException('Invalid task data format');
      }

      const { id, ...updateData } = data;
      const updateTaskDto: UpdateTaskDto = {
        title: updateData.title,
        description: updateData.description,
        isCompleted: updateData.isCompleted,
        dueDate: updateData.dueDate
      };

      return await this.taskService.adminUpdateTask(id, updateTaskDto);
    } catch (error) {
      throw new RpcException(error.message || 'Failed to update task');
    }
  }

  @GrpcMethod('TaskService', 'AdminDeleteTask')
  async adminDeleteTask(data: { id: number }) {
    try {
      if (!data || typeof data.id !== 'number') {
        throw new RpcException('Invalid task ID format');
      }

      await this.taskService.adminDeleteTask(data.id);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to delete task');
    }
  }

  @GrpcMethod('TaskService', 'GetAllTasksByUserId')
  async getAllTasksByUserId(data: { userId: number }) {
    try {
      if (!data || typeof data.userId !== 'number') {
        throw new RpcException('Invalid user ID format');
      }

      const tasks = await this.taskService.getAllTasksByUserId(data.userId);
      return { tasks };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to retrieve tasks');
    }
  }

  @GrpcMethod('TaskService', 'AddCommentToTask') // OKAY
  async addCommentToTask(data: {
    taskId: number;
    content: string;
    user: { userId: number; email: string; role: string }
  }) {
    try {
      if (!data.taskId || typeof data.taskId !== 'number') {
        throw new RpcException('Invalid task ID format');
      }

      if (!data.content) {
        throw new RpcException('Comment content is required');
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException('User information missing from request');
      }

      return await this.taskService.addCommentToTask(data.taskId, data.content, data.user);
    } catch (error) {
      throw new RpcException(error.message || 'Failed to add comment');
    }
  }

  @GrpcMethod('TaskService', 'GetCommentsForTask') // OKAY
  async getCommentsForTask(data: {
    taskId: number;
    user: { userId: number; email: string; role: string }
  }) {
    try {
      if (!data.taskId || typeof data.taskId !== 'number') {
        throw new RpcException('Invalid task ID format');
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException('User information missing from request');
      }

      const comments = await this.taskService.getCommentsForTask(data.taskId, data.user);
      return { comments };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to retrieve comments');
    }
  }
  
  @GrpcMethod('TaskService', 'AddSubtaskToTask') // OKAY
  async addSubtaskToTask(data: {
    taskId: number;
    content: string;
    isCompleted: boolean;
    user: { userId: number; email: string; role: string }
  }) {
    try {
      if (!data.taskId || typeof data.taskId !== 'number') {
        throw new RpcException('Invalid task ID format');
      }

      if (!data.content) {
        throw new RpcException('Subtask content is required');
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException('User information missing from request');
      }

      return await this.taskService.addSubtaskToTask(data.taskId, data.content,data.isCompleted, data.user);
    } catch (error) {
      throw new RpcException(error.message || 'Failed to add Subtask');
    }
  }

  @GrpcMethod('TaskService', 'GetSubtasksForTask') // OKAY
  async getSubtasksForTask(data: {
    taskId: number;
    user: { userId: number; email: string; role: string }
  }) {
    try {
      if (!data.taskId || typeof data.taskId !== 'number') {
        throw new RpcException('Invalid task ID format');
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException('User information missing from request');
      }

      const subtasks = await this.taskService.getSubtasksForTask(data.taskId, data.user);
      return { subtasks };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to retrieve Subtask');
    }
  }
}