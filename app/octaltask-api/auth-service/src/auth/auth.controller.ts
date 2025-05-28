import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  async login(loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      return await this.authService.login(user);
    } catch (error) {
      throw new RpcException(error.message || 'Login failed');
    }
  }

  @GrpcMethod('AuthService', 'Signup')
  async signup(signupDto: SignupDto) {
    try {
      // Password validation
      if (signupDto.password.length < 8) {
        throw new RpcException('Password must be at least 8 characters long');
      }
      
      const result = await this.authService.signup(signupDto);
      return { message: 'User created successfully', user: result };
    } catch (error) {
      throw new RpcException(error.message || 'Signup failed');
    }
  }

  @GrpcMethod('AuthService', 'RequestPasswordReset')
  async requestPasswordReset(data: { email: string }) {
    try {
      return await this.authService.requestPasswordReset(data.email);
    } catch (error) {
      throw new RpcException(error.message || 'Password reset request failed');
    }
  }

  @GrpcMethod('AuthService', 'ResetPassword')
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      // Password validation
      if (resetPasswordDto.newPassword.length < 8) {
        throw new RpcException('Password must be at least 8 characters long');
      }
      
      return await this.authService.resetPassword(resetPasswordDto);
    } catch (error) {
      throw new RpcException(error.message || 'Password reset failed');
    }
  }

  @GrpcMethod('AuthService', 'GetUserById')
  async getUserById(data: { userId: number }) {
    try {
      const user = await this.authService.getUserById(data.userId);
      return { user };
    } catch (error) {
      throw new RpcException(error.message || 'Failed to get user information');
    }
  }
}