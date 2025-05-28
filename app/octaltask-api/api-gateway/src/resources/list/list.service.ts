// src/task/list.service.ts
import { Injectable, Inject, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListType, ListColor } from '../../entities/list.entity';

interface TaskUser {
  userId: number;
  email: string;
  role: string;
}

interface ListServiceClient {
  CreateList(data: {
    name: string;
    icon: ListType;
    color: ListColor;
    dueDate?: string;
    user: TaskUser;
  }): Promise<any>;

  GetAllLists(data: { user: TaskUser }): Promise<any>;
  GetListById(data: { id: number; user: TaskUser }): Promise<any>;
  UpdateList(data: {
    id: number;
    name?: string;
    icon?: ListType;
    color?: ListColor;
    dueDate?: string;
    user: TaskUser;
  }): Promise<any>;
  DeleteList(data: { id: number; user: TaskUser }): Promise<any>;
}

@Injectable()
export class ListService {
  private listService: ListServiceClient;

  constructor(@Inject('TASK_PACKAGE') private client: ClientGrpc) {
    this.listService = this.client.getService<ListServiceClient>('TaskService');
  }

  async create(createListDto: CreateListDto, user: TaskUser) {
    try {
        console.log('CreateListDto:', createListDto,user);
      return await firstValueFrom(
        this.listService.CreateList({
          name: createListDto.name,
          icon: createListDto.icon || 'default',
          color: createListDto.color || 'blue',
          dueDate: createListDto.dueDate,
          user,
        }) as any
      );
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException('List with this name already exists');
      }
      throw error;
    }
  }

  async findAll(user: TaskUser) {
    try {
      const response = await firstValueFrom(
        this.listService.GetAllLists({ user }) as any
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number, user: TaskUser) {
    try {
      const list = await firstValueFrom(
        this.listService.GetListById({ id, user }) as any
      );
      return list;
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(`List with ID ${id} not found`);
      }
      if (error.message.includes('permission')) {
        throw new ForbiddenException('You do not have permission to access this list');
      }
      throw error;
    }
  }

  async update(id: number, updateListDto: UpdateListDto, user: TaskUser) {
    try {
      return await firstValueFrom(
        this.listService.UpdateList({
          id,
          name: updateListDto.name,
          icon: updateListDto.icon,
          color: updateListDto.color,
          dueDate: updateListDto.dueDate,
          user,
        }) as any
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(`List with ID ${id} not found`);
      }
      if (error.message.includes('permission')) {
        throw new ForbiddenException('You do not have permission to update this list');
      }
      throw error;
    }
  }

  async remove(id: number, user: TaskUser) {
    try {
      return await firstValueFrom(
        this.listService.DeleteList({ id, user }) as any
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(`List with ID ${id} not found`);
      }
      if (error.message.includes('permission')) {
        throw new ForbiddenException('You do not have permission to delete this list');
      }
      throw error;
    }
  }
}