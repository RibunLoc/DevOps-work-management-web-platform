import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>
  ) {}

  async getComment(id: number, userInfo: { userId: number; role?: string }) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user', 'task']
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== userInfo.userId && userInfo.role !== 'admin') {
      throw new ForbiddenException('Permission denied to view this comment');
    }

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      user: {
        userId: comment.user.id,
        email: comment.user.email,
        name: comment.user.name,
        role: comment.user.role
      }
    };
  }

  async updateComment(id: number, updateData: { content: string }, userInfo: { userId: number }) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user']
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== userInfo.userId) {
      throw new ForbiddenException('Permission denied to update this comment');
    }

    comment.content = updateData.content;
    const updatedComment = await this.commentRepo.save(comment);

    return {
      id: updatedComment.id,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt.toISOString(),
      user: {
        userId: comment.user.id,
        email: comment.user.email,
        name: comment.user.name,
        role: comment.user.role
      }
    };
  }

  async deleteComment(id: number, user: { userId: number }) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user']
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== user.userId) {
      throw new ForbiddenException('Permission denied to delete this comment');
    }

    await this.commentRepo.remove(comment);
    return { message: 'Comment deleted successfully' };
  }
}