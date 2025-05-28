import { Controller, Post, Body, HttpCode, HttpStatus, ValidationPipe, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
// Import your existing JwtGuard
// import { JwtGuard } from './guards/jwt.guard'; // Update path as needed

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login', description: 'Authenticate a user with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns JWT access token on successful login',
    schema: {
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid email or password' })
  @ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Authentication service unavailable' })
  async login(@Body(ValidationPipe) body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration', description: 'Register a new user with email, password and name' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'User successfully created',
    schema: {
      properties: {
        message: { type: 'string', example: 'User created successfully' },
        user: { 
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', example: 'user' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Password must be at least 8 characters long' })
  @ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Authentication service unavailable' })
  async signup(@Body(ValidationPipe) body: SignupDto) {
    const something = await this.authService.signup(body.email, body.password, body.name);
   // console.log('User created:', something);
    return something;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset', description: 'Request a password reset link via email' })
  @ApiBody({ 
    schema: {
      properties: {
        email: { type: 'string', format: 'email', example: 'user@example.com' }
      },
      required: ['email']
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Reset email sent',
    schema: {
      properties: {
        message: { type: 'string', example: 'Reset email sent' }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Authentication service unavailable' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password', description: 'Reset password using the token received via email' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Password successfully reset',
    schema: {
      properties: {
        message: { type: 'string', example: 'Password successfully reset' }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid or expired token' })
  @ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Authentication service unavailable' })
  async resetPassword(@Body(ValidationPipe) body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Get('me')
  @UseGuards(JwtGuard) // Use your existing JwtGuard
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user', description: 'Get current authenticated user information' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns current user information',
    schema: {
      properties: {
        user: { 
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', example: 'user' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid or expired token' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Authentication service unavailable' })
  async getMe(@Request() req: any) {
    // Your JwtGuard should populate req.user with user info including user ID
    const userId = req.user.sub || req.user.id; // Adjust based on your JWT payload structure
    return this.authService.getUserById(userId);
  }
}