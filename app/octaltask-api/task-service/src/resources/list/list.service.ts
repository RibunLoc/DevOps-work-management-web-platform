// src/task/list.service.ts (Task Microservice)
import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { List } from '../../entities/list.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

interface TaskUser {
  userId: number;
  email: string;
  role: string;
}

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
  ) {}

  async createList(createListDto: CreateListDto, user: TaskUser): Promise<List | null> {
    // Check if list with same name already exists for this user
    const existingList = await this.listRepository.findOne({
      where: {
        name: createListDto.name,
        user: { id: user.userId }
      }
    });

    if (existingList) {
      throw new ConflictException('List with this name already exists');
    }

    
console.log('CreateListDto:', createListDto);
    const list = this.listRepository.create({
      name: createListDto.name,
      icon: createListDto.icon || 'default',
      color: createListDto.color || 'blue',
      dueDate: createListDto.dueDate ? new Date(createListDto.dueDate) : undefined,
      user: { id: user.userId } as any,
      createdBy: user.userId
    });

    const savedList = await this.listRepository.save(list);
    
    // Return list with user information
    return await this.listRepository.findOne({
      where: { id: savedList.id },
      relations: ['user'],
    });
  }

  async findAllList(user: TaskUser): Promise<{ lists: List[] }> {
    const lists = await this.listRepository.find({
      where: {
        user: { id: user.userId }
      },
      relations: ['user', 'tasks'],
      order: {
        id: 'DESC'
      }
    });

    return { lists };
  }

  async findOneList(id: number, user: TaskUser): Promise<List> {
    const list = await this.listRepository.findOne({
      where: { id },
      relations: ['user', 'tasks']
    });

    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }

    // Check if user owns this list
    if (list.user.id !== user.userId) {
      throw new ForbiddenException('You do not have permission to access this list');
    }

    return list;
  }

  async updateList(id: number, updateListDto: UpdateListDto, user: TaskUser): Promise<List|null> {
    const list = await this.listRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }

    // Check if user owns this list
    if (list.user.id !== user.userId) {
      throw new ForbiddenException('You do not have permission to update this list');
    }

    // Check for name conflict if name is being updated
    if (updateListDto.name && updateListDto.name !== list.name) {
      const existingList = await this.listRepository.findOne({
        where: {
          name: updateListDto.name,
          user: { id: user.userId },
          id: Not(id) // Exclude current list from check
        }
      });

      if (existingList) {
        throw new ConflictException('List with this name already exists');
      }
    }

    // Update list properties
    if (updateListDto.name !== undefined) {
      list.name = updateListDto.name;
    }
    if (updateListDto.icon !== undefined) {
      list.icon = updateListDto.icon;
    }
    if (updateListDto.color !== undefined) {
      list.color = updateListDto.color;
    }
    if (updateListDto.dueDate !== undefined) {
      list.dueDate = updateListDto.dueDate ? new Date(updateListDto.dueDate) : undefined;
    }

    const updatedList = await this.listRepository.save(list);

    // Return updated list with relations
    return await this.listRepository.findOne({
      where: { id: updatedList.id },
      relations: ['user', 'tasks']
    });
  }

  async removeList(id: number, user: TaskUser): Promise<{ message: string }> {
    const list = await this.listRepository.findOne({
      where: { id },
      relations: ['user', 'tasks']
    });

    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }

    // Check if user owns this list
    if (list.user.id !== user.userId) {
      throw new ForbiddenException('You do not have permission to delete this list');
    }

    // Check if list has tasks
    if (list.tasks && list.tasks.length > 0) {
      throw new ConflictException('Cannot delete list that contains tasks. Please move or delete all tasks first.');
    }

    await this.listRepository.remove(list);

    return { message: 'List deleted successfully' };
  }

  // Additional utility methods
  async getListWithTaskCount(user: TaskUser): Promise<Array<List & { taskCount: number; completedTaskCount: number }>> {
    const lists = await this.listRepository
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.user', 'user')
      .leftJoin('list.tasks', 'task')
      .addSelect('COUNT(task.id)', 'taskCount')
      .addSelect('SUM(CASE WHEN task.isCompleted = true THEN 1 ELSE 0 END)', 'completedTaskCount')
      .where('list.user.id = :userId', { userId: user.userId })
      .groupBy('list.id')
      .addGroupBy('user.id')
      .getRawAndEntities();

    return lists.entities.map((list, index) => ({
      ...list,
      taskCount: parseInt(lists.raw[index].taskCount) || 0,
      completedTaskCount: parseInt(lists.raw[index].completedTaskCount) || 0
    }));
  }

  async getListsByType(type: string, user: TaskUser): Promise<List[]> {
    return await this.listRepository.find({
      where: {
        icon: type as any,
        user: { id: user.userId }
      },
      relations: ['user', 'tasks'],
      order: {
        name: 'ASC'
      }
    });
  }

  async getListsByColor(color: string, user: TaskUser): Promise<List[]> {
    return await this.listRepository.find({
      where: {
        color: color as any,
        user: { id: user.userId }
      },
      relations: ['user', 'tasks'],
      order: {
        name: 'ASC'
      }
    });
  }

  async getOverdueLists(user: TaskUser): Promise<List[]> {
    const now = new Date();
    return await this.listRepository
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.user', 'user')
      .leftJoinAndSelect('list.tasks', 'tasks')
      .where('list.user.id = :userId', { userId: user.userId })
      .andWhere('list.dueDate < :now', { now })
      .orderBy('list.dueDate', 'ASC')
      .getMany();
  }
}