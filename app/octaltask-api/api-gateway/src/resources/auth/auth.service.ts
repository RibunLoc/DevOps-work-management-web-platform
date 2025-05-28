import { Injectable, OnModuleInit, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

interface AuthGrpcService {
  login(data: LoginDto): any;
  signup(data: SignupDto): any;
  requestPasswordReset(data: { email: string }): any;
  resetPassword(data: ResetPasswordDto): any;
  getUserById(data: { userId: number }): any;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private authGrpcService: AuthGrpcService;

  constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authGrpcService = this.client.getService<AuthGrpcService>('AuthService');
  }

  async login(email: string, password: string) {
    try {
      const loginDto: LoginDto = { email, password };
      const response = await firstValueFrom(
        this.authGrpcService.login(loginDto).pipe(
          catchError(error => {
            // Map gRPC errors to appropriate HTTP exceptions
            if (error.details === 'Invalid credentials') {
              throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
            }
            throw new HttpException(error.details || 'Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      // Rethrow HTTP exceptions to be handled by NestJS exception filter
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Authentication service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async signup(email: string, password: string, name: string) {
    try {
      const signupDto: SignupDto = { email, password, name };
      const response = await firstValueFrom(
        this.authGrpcService.signup(signupDto).pipe(
          catchError(error => {
            if (error.details === 'Email already exists') {
              throw new HttpException('Email already exists', HttpStatus.CONFLICT);
            }
            if (error.details && error.details.includes('password')) {
              throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
            }
            throw new HttpException(error.details || 'Signup failed', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Authentication service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async requestPasswordReset(email: string) {
    try {
      const response = await firstValueFrom(
        this.authGrpcService.requestPasswordReset({ email }).pipe(
          catchError(error => {
            if (error.details === 'User not found') {
              throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            throw new HttpException(error.details || 'Password reset request failed', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Authentication service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const resetPasswordDto: ResetPasswordDto = { token, newPassword };
      const response = await firstValueFrom(
        this.authGrpcService.resetPassword(resetPasswordDto).pipe(
          catchError(error => {
            if (error.details === 'Invalid or expired token') {
              throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException(error.details || 'Password reset failed', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Authentication service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getUserById(userId: number) {
    try {
      const response = await firstValueFrom(
        this.authGrpcService.getUserById({ userId }).pipe(
          catchError(error => {
            if (error.details === 'User not found') {
              throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            throw new HttpException(error.details || 'Failed to get user information', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Authentication service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}