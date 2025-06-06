import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @GrpcMethod('UserService', 'GetCurrentUser')
  async getCurrentUser(data: { user: any }) {
    try {
      const user = await this.userService.getCurrentUser(data.user.userId);
      return { user };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to get current user');
    }
  }

  @GrpcMethod('UserService', 'UpdateCurrentUser')
  async updateCurrentUser(data: { email?: string; name?: string; user: any }) {
    try {
      const updateData: UpdateUserDto = {};
      if (data.email) updateData.email = data.email;
      if (data.name) updateData.name = data.name;

      const user = await this.userService.updateCurrentUser(data.user.userId, updateData);
      return { user };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to update current user');
    }
  }

  @GrpcMethod('UserService', 'ChangePassword')
  async changePassword(data: { currentPassword: string; newPassword: string; user: any }) {
    try {
      if (data.newPassword.length < 8) {
        throw new RpcException('Password must be at least 8 characters long');
      }

      const changePasswordData: ChangePasswordDto = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      };

      const result = await this.userService.changePassword(data.user.userId, changePasswordData);
      return result;
    } catch (error) {
      throw new RpcException(error.message || 'Failed to change password');
    }
  }

  @GrpcMethod('UserService', 'DeleteCurrentUser')
  async deleteCurrentUser(data: { user: any }) {
    try {
      const result = await this.userService.deleteCurrentUser(data.user.userId);
      return result;
    } catch (error) {
      throw new RpcException(error.message || 'Failed to delete current user');
    }
  }

  @GrpcMethod('UserService', 'GetAllUsers')
  async getAllUsers() {
    try {
      const users = await this.userService.getAllUsers();
      return { users };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to get all users');
    }
  }

  @GrpcMethod('UserService', 'GetUserById')
  async getUserById(data: { id: number }) {
    try {
      const user = await this.userService.getUserById(data.id);
      return { user };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to get user by ID');
    }
  }

  @GrpcMethod('UserService', 'UpdateUserById')
  async updateUserById(data: { id: number; email?: string; name?: string; role?: string }) {
    try {
      const updateData: AdminUpdateUserDto = {};
      if (data.email) updateData.email = data.email;
      if (data.name) updateData.name = data.name;
      if (data.role) updateData.role = data.role;

      const user = await this.userService.updateUserById(data.id, updateData);
      return { user };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to update user by ID');
    }
  }

  @GrpcMethod('UserService', 'DeleteUserById')
  async deleteUserById(data: { id: number }) {
    try {
      const result = await this.userService.deleteUserById(data.id);
      return result;
    } catch (error) {
      throw new RpcException(error.message || 'Failed to delete user by ID');
    }
  }
}