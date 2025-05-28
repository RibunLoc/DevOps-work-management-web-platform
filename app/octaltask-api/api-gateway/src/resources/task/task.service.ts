import { Injectable, OnModuleInit, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';

interface TaskGrpcService {
  createTask(data: any): any;
  getAllTasks(data: any): any;
  getTaskById(data: any): any;
  updateTask(data: any): any;
  deleteTask(data: any): any;
  getAllTasksForAdmin(data: any): any;
  getTaskByIdForAdmin(data: any): any;
  adminUpdateTask(data: any): any;
  adminDeleteTask(data: any): any;
  getAllTasksByUserId(data: any): any;
  addCommentToTask(data: any): any;
  getCommentsForTask(data: any): any;
  addSubtaskToTask(data: any): any;
  getSubtasksForTask(data: any): any;
}

@Injectable()
export class TaskService implements OnModuleInit {
  private taskGrpcService: TaskGrpcService;

  constructor(@Inject('TASK_PACKAGE') private readonly client: ClientGrpc) { }

  onModuleInit() {
    this.taskGrpcService = this.client.getService<TaskGrpcService>('TaskService');
  }

  async create(dto: CreateTaskDto, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const response = await firstValueFrom(
        this.taskGrpcService.createTask({ ...dto, user: userData }).pipe(
          catchError(error => {
            if (error.details === 'Task with this title already exists') {
              throw new HttpException('Task with this title already exists', HttpStatus.CONFLICT);
            }
            throw new HttpException(error.details || 'Failed to create task', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async findAll(user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const response = await firstValueFrom(
        this.taskGrpcService.getAllTasks({ user: userData }).pipe(
          catchError(error => {
            throw new HttpException(error.details || 'Failed to retrieve tasks', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async findOne(id: number, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const response = await firstValueFrom(
        this.taskGrpcService.getTaskById({ id, user: userData }).pipe(
          catchError(error => {
            if (error.details === 'Task not found') {
              throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            if (error.details === 'Permission denied') {
              throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
            }
            throw new HttpException(error.details || 'Failed to retrieve task', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async update(id: number, dto: UpdateTaskDto, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const response = await firstValueFrom(
        this.taskGrpcService.updateTask({ id, ...dto, user: userData }).pipe(
          catchError(error => {
            if (error.details === 'Task not found') {
              throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            if (error.details === 'Permission denied') {
              throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
            }
            throw new HttpException(error.details || 'Failed to update task', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async remove(id: number, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const response = await firstValueFrom(
        this.taskGrpcService.deleteTask({ id, user: userData }).pipe(
          catchError(error => {
            if (error.details === 'Task not found') {
              throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            if (error.details === 'Permission denied') {
              throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
            }
            throw new HttpException(error.details || 'Failed to delete task', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getAllTasksForAdmin() {
    try {
      const response = await firstValueFrom(
        this.taskGrpcService.getAllTasksForAdmin({}).pipe(
          catchError(error => {
            throw new HttpException(error.details || 'Failed to retrieve tasks', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getTaskByIdForAdmin(id: number) {
    try {
      const response = await firstValueFrom(
        this.taskGrpcService.getTaskByIdForAdmin({ id }).pipe(
          catchError(error => {
            if (error.details === 'Task not found') {
              throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            throw new HttpException(error.details || 'Failed to retrieve task', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async adminUpdateTask(id: number, dto: UpdateTaskDto) {
    try {
      const response = await firstValueFrom(
        this.taskGrpcService.adminUpdateTask({ id, ...dto }).pipe(
          catchError(error => {
            if (error.details === 'Task not found') {
              throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            throw new HttpException(error.details || 'Failed to update task', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async adminDeleteTask(id: number) {
    try {
      const response = await firstValueFrom(
        this.taskGrpcService.adminDeleteTask({ id }).pipe(
          catchError(error => {
            if (error.details === 'Task not found') {
              throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            throw new HttpException(error.details || 'Failed to delete task', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getAllTasksByUserId(userId: number) {
    try {
      const response = await firstValueFrom(
        this.taskGrpcService.getAllTasksByUserId({ userId }).pipe(
          catchError(error => {
            if (error.details === 'User not found') {
              throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            throw new HttpException(error.details || 'Failed to retrieve tasks', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async addCommentToTask(taskId: number, dto: CreateCommentDto, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const response = await firstValueFrom(
        this.taskGrpcService.addCommentToTask({
          taskId,
          content: dto.content,
          user: userData
        }).pipe(
          catchError(error => {
            if (error.details === 'Task not found') {
              throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            if (error.details === 'Permission denied to comment on this task') {
              throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
            }
            throw new HttpException(error.details || 'Failed to add comment', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getCommentsForTask(taskId: number, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const response = await firstValueFrom(
        this.taskGrpcService.getCommentsForTask({
          taskId,
          user: userData
        }).pipe(
          catchError(error => {
            if (error.details === 'Task not found') {
              throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            if (error.details === 'Permission denied to view comments on this task') {
              throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
            }
            throw new HttpException(error.details || 'Failed to retrieve comments', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async addSubtaskToTask(taskId: number, dto: CreateSubtaskDto, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const response = await firstValueFrom(
        this.taskGrpcService.addSubtaskToTask({
          taskId,
          content: dto.content,
          isCompleted: dto.isCompleted,
          user: userData
        }).pipe(
          catchError(error => {
            if (error.details === 'Task not found') {
              throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            if (error.details === 'Permission denied to Subtask on this task') {
              throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
            }
            throw new HttpException(error.details || 'Failed to add Subtask', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getSubtasksForTask(taskId: number, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const response = await firstValueFrom(
        this.taskGrpcService.getSubtasksForTask({
          taskId,
          user: userData
        }).pipe(
          catchError(error => {
            if (error.details === 'Task not found') {
              throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            if (error.details === 'Permission denied to view Subtasks on this task') {
              throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
            }
            throw new HttpException(error.details || 'Failed to retrieve Subtasks', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}