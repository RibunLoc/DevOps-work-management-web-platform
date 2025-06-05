import { Controller } from '@nestjs/common';
import { ListService } from './list.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ListColor, ListType } from 'src/entities/list.entity';
import { CreateListDto } from 'src/resources/list/dto/create-list.dto';
import { TaskUser } from '../task/task.controller'
import { UpdateListDto } from 'src/resources/list/dto/update-list.dto';
import { SharedRole } from 'src/entities/list-shared.entity';

@Controller('list')
export class ListController {
    constructor(private readonly listService: ListService) { }

    @GrpcMethod('TaskService', 'CreateList')
    async createList(data: { name: string; icon: ListType; color: ListColor; dueDate?: string; user: TaskUser; }) {

        try {
            if (!data.name) {
                throw new RpcException('Name is required');
            }
            const createListDto: CreateListDto = {
                name: data.name,
                icon: data.icon,
                color: data.color,
                dueDate: data.dueDate
            };
            return await this.listService.createList(createListDto, data.user);
        }
        catch (error) {
            throw new RpcException(error.message || 'Failed to create list');
        }
    }

    @GrpcMethod('TaskService', 'GetAllLists')
    async getAllLists(data: { user: TaskUser }) {
        try {
            if (!data.user || !data.user.userId) {
                throw new RpcException('User information missing from request');
            }
            const result = await this.listService.findAllList(data.user);
            // Fix: Return lists, not tasks
            return { lists: result.lists };
        }
        catch (error) {
            throw new RpcException(error.message || 'Failed to retrieve lists');
        }
    }

    @GrpcMethod('TaskService', 'GetListById')
    async getListById(data: { id: number; user: TaskUser }) {
        try {
            if (!data || typeof data.id !== 'number') {
                throw new RpcException('Invalid list ID format');
            }
            if (!data.user || !data.user.userId) {
                throw new RpcException('User information missing from request');
            }
            return await this.listService.findOneList(data.id, data.user);
        }
        catch (error) {
            throw new RpcException(error.message || 'Failed to retrieve list');
        }
    }

    @GrpcMethod('TaskService', 'UpdateList')
    async updateList(data: {
        id: number;
        name?: string;
        icon?: ListType;
        color?: ListColor;
        user: TaskUser;
        dueDate?: string;
    }) {
        try {
            if (!data || typeof data.id !== 'number') {
                throw new RpcException('Invalid list data format');
            }
            if (!data.user || !data.user.userId) {
                throw new RpcException('User information missing from request');
            }
            const { id, user, ...updateData } = data;
            const updateListDto: UpdateListDto = {
                name: updateData.name,
                icon: updateData.icon,
                color: updateData.color,
                dueDate: updateData.dueDate
            };
            return await this.listService.updateList(id, updateListDto, user);
        }
        catch (error) {
            throw new RpcException(error.message || 'Failed to update list');
        }
    }

    @GrpcMethod('TaskService', 'DeleteList')
    async deleteList(data: { id: number; user: TaskUser }) {
        try {
            if (!data || typeof data.id !== 'number') {
                throw new RpcException('Invalid list ID format');
            }
            if (!data.user || !data.user.userId) {
                throw new RpcException('User information missing from request');
            }
            await this.listService.removeList(data.id, data.user);
            return { message: 'List deleted successfully' };
        }
        catch (error) {
            throw new RpcException(error.message || 'Failed to delete list');
        }
    }

    // ====================== SHARING METHODS ======================

    @GrpcMethod('TaskService', 'ShareList')
    async shareList(data: {
        listId: number;
        email: string;
        role: string;
        user: TaskUser;
    }) {

        try {
            if (!data || typeof data.listId !== 'number') {
                throw new RpcException('Invalid list ID format');
            }
            if (!data.email) {
                throw new RpcException('Email is required');
            }
            if (!data.role || !Object.values(SharedRole).includes(data.role as SharedRole)) {
                throw new RpcException('Invalid role. Must be viewer, editor, or admin');
            }
            if (!data.user || !data.user.userId) {
                throw new RpcException('User information missing from request');
            }

            return await this.listService.shareList(
                data.listId,
                data.email,
                data.role as SharedRole,
                data.user
            );
        }
        catch (error) {
            throw new RpcException(error.message || 'Failed to share list');
        }
    }

    @GrpcMethod('TaskService', 'GetSharedLists')
    async getSharedLists(data: { user: TaskUser }) {
        try {
            if (!data.user || !data.user.userId) {
                throw new RpcException('User information missing from request');
            }
            return await this.listService.getSharedLists(data.user);
        }
        catch (error) {
            throw new RpcException(error.message || 'Failed to retrieve shared lists');
        }
    }

    @GrpcMethod('TaskService', 'GetListSharedUsers')
    async getListSharedUsers(data: { id: number; user: TaskUser }) {
        try {
            if (!data || typeof data.id !== 'number') {
                throw new RpcException('Invalid list ID format');
            }
            if (!data.user || !data.user.userId) {
                throw new RpcException('User information missing from request');
            }
            return await this.listService.getListSharedUsers(data.id, data.user);
        }
        catch (error) {
            throw new RpcException(error.message || 'Failed to retrieve shared users');
        }
    }

    @GrpcMethod('TaskService', 'UpdateSharedRole')
    async updateSharedRole(data: {
        listId: number;
        userId: number;
        role: string;
        user: TaskUser;
    }) {
        try {
            if (!data || typeof data.listId !== 'number') {
                throw new RpcException('Invalid list ID format');
            }
            if (!data || typeof data.userId !== 'number') {
                throw new RpcException('Invalid user ID format');
            }
            if (!data.role || !Object.values(SharedRole).includes(data.role as SharedRole)) {
                throw new RpcException('Invalid role. Must be viewer, editor, or admin');
            }
            if (!data.user || !data.user.userId) {
                throw new RpcException('User information missing from request');
            }

            return await this.listService.updateSharedRole(
                data.listId,
                data.userId,
                data.role as SharedRole,
                data.user
            );
        }
        catch (error) {
            throw new RpcException(error.message || 'Failed to update shared role');
        }
    }

    @GrpcMethod('TaskService', 'RemoveSharedUser')
    async removeSharedUser(data: {
        listId: number;
        userId: number;
        user: TaskUser;
    }) {
        try {
            if (!data || typeof data.listId !== 'number') {
                throw new RpcException('Invalid list ID format');
            }
            if (!data || typeof data.userId !== 'number') {
                throw new RpcException('Invalid user ID format');
            }
            if (!data.user || !data.user.userId) {
                throw new RpcException('User information missing from request');
            }

            return await this.listService.removeSharedUser(
                data.listId,
                data.userId,
                data.user
            );
        }
        catch (error) {
            throw new RpcException(error.message || 'Failed to remove shared user');
        }
    }

    @GrpcMethod('TaskService', 'GetUsersByEmail')
    async getUsersByEmail(data: { email: string }) {
        try {
            if (!data.email) {
                throw new RpcException('Email is required');
            }
            return await this.listService.getUsersByEmail(data.email);
        }
        catch (error) {
            throw new RpcException(error.message || 'Failed to search users');
        }
    }
}