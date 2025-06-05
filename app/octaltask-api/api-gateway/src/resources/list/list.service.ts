import { Injectable, Inject, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

type ListType = 'personal' | 'work' | 'home' | 'study' | 'default';
type ListColor = 'blue' | 'green' | 'red' | 'purple' | 'amber';

interface TaskUser {
  userId: number;
  email: string;
  role: string;
}

export enum SharedRole {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  ADMIN = 'admin',
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

  // Sharing methods
  ShareList(data: {
    listId: number;
    email: string;
    role: string;
    user: TaskUser;
  }): Promise<any>;

  GetSharedLists(data: { user: TaskUser }): Promise<any>;

  GetListSharedUsers(data: { id: number; user: TaskUser }): Promise<any>;

  UpdateSharedRole(data: {
    listId: number;
    userId: number;
    role: string;
    user: TaskUser;
  }): Promise<any>;

  RemoveSharedUser(data: {
    listId: number;
    userId: number;
    user: TaskUser;
  }): Promise<any>;

  GetUsersByEmail(data: { email: string }): Promise<any>;
}

@Injectable()
export class ListService {
  private listService: ListServiceClient;

  constructor(@Inject('TASK_PACKAGE') private client: ClientGrpc) {
    this.listService = this.client.getService<ListServiceClient>('TaskService');
  }

  async create(createListDto: CreateListDto, user: TaskUser) {
    try {
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

  // New sharing methods
  async shareList(listId: number, email: string, role: SharedRole, user: TaskUser) {
    try {
      return await firstValueFrom(
        this.listService.ShareList({
          listId,
          email,
          role,
          user,
        }) as any
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        if (error.message.includes('List')) {
          throw new NotFoundException(`List with ID ${listId} not found`);
        } else if (error.message.includes('User')) {
          throw new NotFoundException('User with this email not found');
        }
        throw new NotFoundException(error.message);
      }
      if (error.message.includes('permission')) {
        throw new ForbiddenException('You do not have permission to share this list');
      }
      if (error.message.includes('already shared') || error.message.includes('already exists')) {
        throw new ConflictException('List is already shared with this user');
      }
      if (error.message.includes('owner')) {
        throw new ConflictException('Cannot share list with the owner');
      }
      throw error;
    }
  }

  async getSharedLists(user: TaskUser) {
    try {
      return await firstValueFrom(
        this.listService.GetSharedLists({ user }) as any
      );
    } catch (error) {
      throw error;
    }
  }

  async getListSharedUsers(listId: number, user: TaskUser) {
    try {
      return await firstValueFrom(
        this.listService.GetListSharedUsers({ id: listId, user }) as any
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(`List with ID ${listId} not found`);
      }
      if (error.message.includes('permission')) {
        throw new ForbiddenException('You do not have permission to access this list');
      }
      throw error;
    }
  }

  async updateSharedRole(listId: number, userId: number, role: SharedRole, user: TaskUser) {
    try {
      return await firstValueFrom(
        this.listService.UpdateSharedRole({
          listId,
          userId,
          role,
          user,
        }) as any
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        if (error.message.includes('List')) {
          throw new NotFoundException(`List with ID ${listId} not found`);
        } else if (error.message.includes('Shared user')) {
          throw new NotFoundException('Shared user not found');
        }
        throw new NotFoundException(error.message);
      }
      if (error.message.includes('permission')) {
        throw new ForbiddenException('You do not have permission to update shared roles');
      }
      throw error;
    }
  }

  async removeSharedUser(listId: number, userId: number, user: TaskUser) {
    try {
      return await firstValueFrom(
        this.listService.RemoveSharedUser({
          listId,
          userId,
          user,
        }) as any
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        if (error.message.includes('List')) {
          throw new NotFoundException(`List with ID ${listId} not found`);
        } else if (error.message.includes('Shared user')) {
          throw new NotFoundException('Shared user not found');
        }
        throw new NotFoundException(error.message);
      }
      if (error.message.includes('permission')) {
        throw new ForbiddenException('You do not have permission to remove this user');
      }
      throw error;
    }
  }

  async getUsersByEmail(email: string) {
    try {
      return await firstValueFrom(
        this.listService.GetUsersByEmail({ email }) as any
      );
    } catch (error) {
      throw error;
    }
  }
}