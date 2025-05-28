import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { SubtaskService } from './subtask.service';
import { status } from '@grpc/grpc-js';

@Controller()
export class SubtaskController {
  constructor(private readonly subtaskService: SubtaskService) {}

  @GrpcMethod('TaskService', 'GetSubtask')
  async getSubtask(data: { subtaskId: number; user: any }) {
    try {
      if (!data.subtaskId || typeof data.subtaskId !== 'number') {
        throw new RpcException({
          code: status.INVALID_ARGUMENT, // INVALID_ARGUMENT
          message: 'Invalid subtask ID format'
        });
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT, // INVALID_ARGUMENT
          message: 'User information missing from request'
        });
      }

      return await this.subtaskService.getSubtask(data.subtaskId, data.user);
    } catch (error) {
      // Handle NestJS exceptions properly
      if (error.name === 'NotFoundException') {
        throw new RpcException({
          code: status.NOT_FOUND, // NOT_FOUND
          message: error.message
        });
      }
      
      if (error.name === 'ForbiddenException') {
        throw new RpcException({
          code: status.PERMISSION_DENIED, // PERMISSION_DENIED
          message: error.message
        });
      }

      // If it's already an RpcException, re-throw it
      if (error instanceof RpcException) {
        throw error;
      }

      // For any other errors
      throw new RpcException({
        code: status.UNKNOWN, // UNKNOWN
        message: error.message || 'Failed to get subtask'
      });
    }
  }

  @GrpcMethod('TaskService', 'UpdateSubtask')
  async updateSubtask(data: { subtaskId: number; content: string; isCompleted: boolean; user: any }) {
    try {
      if (!data.subtaskId || typeof data.subtaskId !== 'number') {
        throw new RpcException({
          code: status.INVALID_ARGUMENT, // INVALID_ARGUMENT
          message: 'Invalid subtask ID format'
        });
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT, // INVALID_ARGUMENT
          message: 'User information missing from request'
        });
      }

      return await this.subtaskService.updateSubtask(
        data.subtaskId,
        { content: data.content, isCompleted: data.isCompleted },
        data.user
      );
    } catch (error) {
      // Handle NestJS exceptions properly
      if (error.name === 'NotFoundException') {
        throw new RpcException({
          code: status.NOT_FOUND, // NOT_FOUND
          message: error.message
        });
      }
      
      if (error.name === 'ForbiddenException') {
        throw new RpcException({
          code: status.PERMISSION_DENIED, // PERMISSION_DENIED
          message: error.message
        });
      }

      // If it's already an RpcException, re-throw it
      if (error instanceof RpcException) {
        throw error;
      }

      // For any other errors
      throw new RpcException({
        code: status.UNKNOWN, // UNKNOWN
        message: error.message || 'Failed to update subtask'
      });
    }
  }

  @GrpcMethod('TaskService', 'DeleteSubtask')
  async deleteSubtask(data: { subtaskId: number; user: any }) {
    try {
      if (!data.subtaskId || typeof data.subtaskId !== 'number') {
        throw new RpcException({
          code: status.INVALID_ARGUMENT, // INVALID_ARGUMENT
          message: 'Invalid subtask ID format'
        });
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT, // INVALID_ARGUMENT
          message: 'User information missing from request'
        });
      }

      return await this.subtaskService.deleteSubtask(data.subtaskId, data.user);
    } catch (error) {
      // Handle NestJS exceptions properly
      if (error.name === 'NotFoundException') {
        throw new RpcException({
          code: status.NOT_FOUND, // NOT_FOUND
          message: error.message
        });
      }
      
      if (error.name === 'ForbiddenException') {
        throw new RpcException({
          code: status.PERMISSION_DENIED, // PERMISSION_DENIED
          message: error.message
        });
      }

      // If it's already an RpcException, re-throw it
      if (error instanceof RpcException) {
        throw error;
      }

      // For any other errors
      throw new RpcException({
        code: status.UNKNOWN, // UNKNOWN
        message: error.message || 'Failed to delete subtask'
      });
    }
  }
}