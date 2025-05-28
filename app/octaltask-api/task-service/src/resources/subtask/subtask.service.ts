import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subtask } from '../../entities/subtask.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class SubtaskService {
  constructor(
    @InjectRepository(Subtask)
    private subtaskRepo: Repository<Subtask>,
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async getSubtask(id: number, userInfo: { userId: number; role?: string }) {
    const subtask = await this.subtaskRepo.findOne({
      where: { id },
      relations: ['user', 'task']
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    if (subtask.user.id !== userInfo.userId && userInfo.role !== 'admin') {
      throw new ForbiddenException('Permission denied to view this subtask');
    }

    return {
      id: subtask.id,
      content: subtask.content,
      isCompleted: subtask.isCompleted,
      createdAt: subtask.createdAt.toISOString(),
      user: {
        userId: subtask.user.id,
        email: subtask.user.email,
        name: subtask.user.name,
        role: subtask.user.role
      }
    };
  }

  async updateSubtask(id: number, updateData: { content?: string; isCompleted?: boolean }, userInfo: { userId: number }) {
    const subtask = await this.subtaskRepo.findOne({
      where: { id },
      relations: ['user']
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    if (subtask.user.id !== userInfo.userId) {
      throw new ForbiddenException('Permission denied to update this subtask');
    }

    if (updateData.content !== undefined) {
      subtask.content = updateData.content;
    }
    if (updateData.isCompleted !== undefined) {
      subtask.isCompleted = updateData.isCompleted;
    }

    const updatedSubtask = await this.subtaskRepo.save(subtask);

    return {
      id: updatedSubtask.id,
      content: updatedSubtask.content,
      isCompleted: updatedSubtask.isCompleted,
      createdAt: updatedSubtask.createdAt.toISOString(),
      user: {
        userId: subtask.user.id,
        email: subtask.user.email,
        name: subtask.user.name,
        role: subtask.user.role
      }
    };
  }

  async deleteSubtask(id: number, user: { userId: number }) {
    const subtask = await this.subtaskRepo.findOne({
      where: { id },
      relations: ['user']
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    if (subtask.user.id !== user.userId) {
      throw new ForbiddenException('Permission denied to delete this subtask');
    }

    await this.subtaskRepo.remove(subtask);
    return { message: 'Subtask deleted successfully' };
  }
}