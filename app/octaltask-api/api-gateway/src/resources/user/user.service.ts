import { Injectable, OnModuleInit, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

interface UserGrpcService {
  getCurrentUser(data: any): any;
  updateCurrentUser(data: any): any;
  changePassword(data: any): any;
  deleteCurrentUser(data: any): any;
  getAllUsers(data: any): any;
  getUserById(data: any): any;
  updateUserById(data: any): any;
  deleteUserById(data: any): any;
}

@Injectable()
export class UserService implements OnModuleInit {
  private userGrpcService: UserGrpcService;

  constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) { }

  onModuleInit() {
    this.userGrpcService = this.client.getService<UserGrpcService>('UserService');
  }

  async getCurrentUser(user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role
      };

      const response = await firstValueFrom(
        this.userGrpcService.getCurrentUser({ user: userData }).pipe(
          catchError(error => {
            if (error.details === 'User not found') {
              throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            throw new HttpException(error.details || 'Failed to retrieve user', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('User service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async updateCurrentUser(dto: UpdateUserDto, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const response = await firstValueFrom(
        this.userGrpcService.updateCurrentUser({ ...dto, user: userData }).pipe(
          catchError(error => {
            if (error.details === 'User not found') {
              throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            if (error.details === 'Email already exists') {
              throw new HttpException('Email already exists', HttpStatus.CONFLICT);
            }
            throw new HttpException(error.details || 'Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('User service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async changePassword(dto: ChangePasswordDto, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const response = await firstValueFrom(
        this.userGrpcService.changePassword({
          currentPassword: dto.currentPassword,
          newPassword: dto.newPassword,
          user: userData
        }).pipe(
          catchError(error => {
            if (error.details === 'User not found') {
              throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            if (error.details === 'Invalid current password') {
              throw new HttpException('Invalid current password', HttpStatus.UNAUTHORIZED);
            }
            throw new HttpException(error.details || 'Failed to change password', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('User service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async deleteCurrentUser(user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      const response = await firstValueFrom(
        this.userGrpcService.deleteCurrentUser({ user: userData }).pipe(
          catchError(error => {
            if (error.details === 'User not found') {
              throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            throw new HttpException(error.details || 'Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('User service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getAllUsers() {
    try {
      const response = await firstValueFrom(
        this.userGrpcService.getAllUsers({}).pipe(
          catchError(error => {
            throw new HttpException(error.details || 'Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('User service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getUserById(id: number) {
    try {
      const response = await firstValueFrom(
        this.userGrpcService.getUserById({ id }).pipe(
          catchError(error => {
            if (error.details === 'User not found') {
              throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            throw new HttpException(error.details || 'Failed to retrieve user', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('User service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async updateUserById(id: number, dto: AdminUpdateUserDto) {
    try {
      const response = await firstValueFrom(
        this.userGrpcService.updateUserById({ id, ...dto }).pipe(
          catchError(error => {
            if (error.details === 'User not found') {
              throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            if (error.details === 'Email already exists') {
              throw new HttpException('Email already exists', HttpStatus.CONFLICT);
            }
            throw new HttpException(error.details || 'Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('User service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async deleteUserById(id: number) {
    try {
      const response = await firstValueFrom(
        this.userGrpcService.deleteUserById({ id }).pipe(
          catchError(error => {
            if (error.details === 'User not found') {
              throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            throw new HttpException(error.details || 'Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('User service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}