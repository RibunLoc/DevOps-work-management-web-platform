import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { List } from '../../entities/list.entity';
import { ListShared, SharedRole } from '../../entities/list-shared.entity';
import { User } from '../../entities/user.entity';
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
    @InjectRepository(ListShared)
    private listSharedRepository: Repository<ListShared>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  // Helper method để check quyền truy cập
  private async checkListAccess(listId: number, userId: number): Promise<{ list: List; userRole: string }> {
    const list = await this.listRepository.findOne({
      where: { id: listId },
      relations: ['user', 'sharedUsers', 'sharedUsers.user']
    });

    if (!list) {
      throw new NotFoundException(`List with ID ${listId} not found`);
    }

    // Check if user is owner
    if (list.user.id === userId) {
      return { list, userRole: 'owner' };
    }

    // Check if user has shared access
    const sharedAccess = list.sharedUsers?.find(shared => shared.user.id === userId);
    if (sharedAccess) {
      return { list, userRole: sharedAccess.role };
    }

    throw new ForbiddenException('You do not have permission to access this list');
  }

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

    const list = this.listRepository.create({
      name: createListDto.name,
      icon: createListDto.icon || 'default',
      color: createListDto.color || 'blue',
      dueDate: createListDto.dueDate ? new Date(createListDto.dueDate) : undefined,
      user: { id: user.userId } as any,
      createdBy: user.userId
    });

    const savedList = await this.listRepository.save(list);

    return await this.listRepository.findOne({
      where: { id: savedList.id },
      relations: ['user', 'sharedUsers', 'sharedUsers.user'],
    });
  }

  async findAllList(user: TaskUser): Promise<{ lists: any[] }> {
    // Get owned lists
    const ownedLists = await this.listRepository.find({
      where: {
        user: { id: user.userId }
      },
      relations: ['user', 'tasks', 'sharedUsers', 'sharedUsers.user'],
      order: {
        id: 'DESC'
      }
    });

    // Get shared lists
    const sharedListsData = await this.listSharedRepository.find({
      where: {
        user: { id: user.userId }
      },
      relations: ['list', 'list.user', 'list.tasks', 'list.sharedUsers', 'list.sharedUsers.user']
    });

    const sharedLists = sharedListsData.map(shared => ({
      ...shared.list,
      userRole: shared.role
    }));

    // Combine and format lists
    const allLists = [
      ...ownedLists.map(list => ({
        ...list,
        userRole: 'owner',
        sharedUsers: list.sharedUsers?.map(shared => ({
          userId: shared.user.id,
          email: shared.user.email,
          name: shared.user.name,
          role: shared.role,
          sharedAt: shared.createdAt
        })) || []
      })),
      ...sharedLists.map(list => ({
        ...list,
        sharedUsers: list.sharedUsers?.map(shared => ({
          userId: shared.user.id,
          email: shared.user.email,
          name: shared.user.name,
          role: shared.role,
          sharedAt: shared.createdAt
        })) || []
      }))
    ];

    return { lists: allLists };
  }

  async findOneList(id: number, user: TaskUser): Promise<any> {
    const { list, userRole } = await this.checkListAccess(id, user.userId);

    return {
      ...list,
      userRole,
      sharedUsers: list.sharedUsers?.map(shared => ({
        userId: shared.user.id,
        email: shared.user.email,
        name: shared.user.name,
        role: shared.role,
        sharedAt: shared.createdAt
      })) || []
    };
  }

  async updateList(id: number, updateListDto: UpdateListDto, user: TaskUser): Promise<any> {
    const { list, userRole } = await this.checkListAccess(id, user.userId);

    // Check permissions for update
    if (userRole !== 'owner' && userRole !== SharedRole.ADMIN && userRole !== SharedRole.EDITOR) {
      throw new ForbiddenException('You do not have permission to update this list');
    }

    // Check for name conflict if name is being updated
    if (updateListDto.name && updateListDto.name !== list.name) {
      const existingList = await this.listRepository.findOne({
        where: {
          name: updateListDto.name,
          user: { id: list.user.id },
          id: Not(id)
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

    return await this.listRepository.findOne({
      where: { id: updatedList.id },
      relations: ['user', 'tasks', 'sharedUsers', 'sharedUsers.user']
    });
  }

  async removeList(id: number, user: TaskUser): Promise<{ message: string }> {
    const { list, userRole } = await this.checkListAccess(id, user.userId);

    // Only owner can delete list
    if (userRole !== 'owner') {
      throw new ForbiddenException('Only the list owner can delete this list');
    }

    // Check if list has tasks
    if (list.tasks && list.tasks.length > 0) {
      throw new ConflictException('Cannot delete list that contains tasks. Please move or delete all tasks first.');
    }

    await this.listRepository.remove(list);
    return { message: 'List deleted successfully' };
  }

  // New sharing methods
  async shareList(listId: number, email: string, role: SharedRole, user: TaskUser): Promise<{ message: string }> {
    const { list, userRole } = await this.checkListAccess(listId, user.userId);

    // Only owner and admin can share list
    if (userRole !== 'owner' && userRole !== SharedRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to share this list');
    }

    // Find user by email
    const targetUser = await this.userRepository.findOne({
      where: { email }
    });

    if (!targetUser) {
      throw new NotFoundException('User with this email not found');
    }

    // Check if user is already owner
    if (targetUser.id === list.user.id) {
      throw new ConflictException('Cannot share list with the owner');
    }

    // Check if already shared
    const existingShare = await this.listSharedRepository.findOne({
      where: {
        list: { id: listId },
        user: { id: targetUser.id }
      }
    });

    if (existingShare) {
      throw new ConflictException('List is already shared with this user');
    }

    // Create share record
    const listShared = this.listSharedRepository.create({
      list: { id: listId },
      user: { id: targetUser.id },
      role,
      sharedBy: user.userId
    });

    await this.listSharedRepository.save(listShared);

    return { message: 'List shared successfully' };
  }

  async getSharedLists(user: TaskUser): Promise<{ lists: any[] }> {
    const sharedListsData = await this.listSharedRepository.find({
      where: {
        user: { id: user.userId }
      },
      relations: ['list', 'list.user', 'list.tasks', 'list.sharedUsers', 'list.sharedUsers.user']
    });

    const lists = sharedListsData.map(shared => ({
      ...shared.list,
      userRole: shared.role,
      sharedUsers: shared.list.sharedUsers?.map(sharedUser => ({
        userId: sharedUser.user.id,
        email: sharedUser.user.email,
        name: sharedUser.user.name,
        role: sharedUser.role,
        sharedAt: sharedUser.createdAt
      })) || []
    }));

    return { lists };
  }

  async getListSharedUsers(listId: number, user: TaskUser): Promise<{ sharedUsers: any[] }> {
    const { list } = await this.checkListAccess(listId, user.userId);

    const sharedUsers = list.sharedUsers?.map(shared => ({
      userId: shared.user.id,
      email: shared.user.email,
      name: shared.user.name,
      role: shared.role,
      sharedAt: shared.createdAt
    })) || [];

    return { sharedUsers };
  }

  async updateSharedRole(listId: number, targetUserId: number, role: SharedRole, user: TaskUser): Promise<{ message: string }> {
    const { userRole } = await this.checkListAccess(listId, user.userId);

    // Only owner and admin can update roles
    if (userRole !== 'owner' && userRole !== SharedRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to update shared roles');
    }

    const sharedRecord = await this.listSharedRepository.findOne({
      where: {
        list: { id: listId },
        user: { id: targetUserId }
      }
    });

    if (!sharedRecord) {
      throw new NotFoundException('Shared user not found');
    }

    sharedRecord.role = role;
    await this.listSharedRepository.save(sharedRecord);

    return { message: 'Role updated successfully' };
  }

  async removeSharedUser(listId: number, targetUserId: number, user: TaskUser): Promise<{ message: string }> {
    const { userRole } = await this.checkListAccess(listId, user.userId);

    // Owner, admin can remove anyone; user can remove themselves
    if (userRole !== 'owner' && userRole !== SharedRole.ADMIN && user.userId !== targetUserId) {
      throw new ForbiddenException('You do not have permission to remove this user');
    }

    const sharedRecord = await this.listSharedRepository.findOne({
      where: {
        list: { id: listId },
        user: { id: targetUserId }
      }
    });

    if (!sharedRecord) {
      throw new NotFoundException('Shared user not found');
    }

    await this.listSharedRepository.remove(sharedRecord);

    return { message: 'User removed from list successfully' };
  }

  async getUsersByEmail(email: string): Promise<{ users: any[] }> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email LIKE :email', { email: `%${email}%` })
      .select(['user.id', 'user.email', 'user.name'])
      .limit(10)
      .getMany();

    return { users };
  }
}