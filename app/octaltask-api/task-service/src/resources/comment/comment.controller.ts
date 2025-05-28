import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { CommentService } from './comment.service';
import { status } from '@grpc/grpc-js';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @GrpcMethod('TaskService', 'GetComment')
  async getComment(data: { commentId: number; user: any }) {
    try {
      if (!data.commentId || typeof data.commentId !== 'number') {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid comment ID format'
        });
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'User information missing from request'
        });
      }

      return await this.commentService.getComment(data.commentId, data.user);
    } catch (error) {
      // Handle different types of errors from the service
      if (error.message === 'Comment not found') {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Comment not found'
        });
      }
      
      if (error.message === 'Permission denied to view this comment') {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'Permission denied to view this comment'
        });
      }

      // Handle RpcException that might have been thrown above
      if (error.code) {
        throw error;
      }

      // Generic error fallback
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || 'Failed to get comment'
      });
    }
  }

  @GrpcMethod('TaskService', 'UpdateComment')
  async updateComment(data: { commentId: number; content: string; user: any }) {
    try {
      if (!data.commentId || typeof data.commentId !== 'number') {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid comment ID format'
        });
      }

      if (!data.content) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Comment content is required'
        });
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'User information missing from request'
        });
      }

      return await this.commentService.updateComment(
        data.commentId,
        { content: data.content },
        data.user
      );
    } catch (error) {
      // Handle different types of errors from the service
      if (error.message === 'Comment not found') {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Comment not found'
        });
      }
      
      if (error.message === 'Permission denied to update this comment') {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'Permission denied to update this comment'
        });
      }

      // Handle RpcException that might have been thrown above
      if (error.code) {
        throw error;
      }

      // Generic error fallback
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || 'Failed to update comment'
      });
    }
  }

  @GrpcMethod('TaskService', 'DeleteComment')
  async deleteComment(data: { commentId: number; user: any }) {
    try {
      if (!data.commentId || typeof data.commentId !== 'number') {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid comment ID format'
        });
      }

      if (!data.user || !data.user.userId) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'User information missing from request'
        });
      }

      return await this.commentService.deleteComment(data.commentId, data.user);
    } catch (error) {
      // Handle different types of errors from the service
      if (error.message === 'Comment not found') {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Comment not found'
        });
      }
      
      if (error.message === 'Permission denied to delete this comment') {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'Permission denied to delete this comment'
        });
      }

      // Handle RpcException that might have been thrown above
      if (error.code) {
        throw error;
      }

      // Generic error fallback
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || 'Failed to delete comment'
      });
    }
  }
}