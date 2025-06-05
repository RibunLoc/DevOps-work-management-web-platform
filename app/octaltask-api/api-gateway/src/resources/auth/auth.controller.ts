import { Controller, Post, Body, HttpCode, HttpStatus, ValidationPipe, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { LoginResponseDto, SignupResponseDto, ResetPasswordResponseDto, ForgotPasswordResponseDto, AuthUserResponseDto, AuthErrorResponseDto } from './dto/response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login', description: 'Authenticate user and return JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto, description: 'Successfully logged in' })
  @ApiBadRequestResponse({ type: AuthErrorResponseDto, description: 'Validation error' })
  @ApiUnauthorizedResponse({ type: AuthErrorResponseDto, description: 'Invalid credentials' })
  async login(@Body(ValidationPipe) body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration', description: 'Create a new user account' })
  @ApiBody({ type: SignupDto })
  @ApiCreatedResponse({ type: SignupResponseDto, description: 'User created successfully' })
  @ApiBadRequestResponse({ type: AuthErrorResponseDto, description: 'Validation error' })
  @ApiConflictResponse({ type: AuthErrorResponseDto, description: 'Email already exists' })
  async signup(@Body(ValidationPipe) body: SignupDto) {
    const something = await this.authService.signup(body.email, body.password, body.name);
    return something;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset', description: 'Send password reset email' })
  @ApiOkResponse({ type: ForgotPasswordResponseDto, description: 'Reset email sent if user exists' })
  @ApiNotFoundResponse({ type: AuthErrorResponseDto, description: 'User not found' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password', description: 'Reset user password using valid token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ type: ResetPasswordResponseDto, description: 'Password successfully reset' })
  @ApiBadRequestResponse({ type: AuthErrorResponseDto, description: 'Invalid or expired token' })
  async resetPassword(@Body(ValidationPipe) body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info', description: 'Get authenticated user information' })
  @ApiOkResponse({ type: AuthUserResponseDto, description: 'Current user information' })
  @ApiUnauthorizedResponse({ type: AuthErrorResponseDto, description: 'Unauthorized' })
  @ApiNotFoundResponse({ type: AuthErrorResponseDto, description: 'User not found' })
  async getMe(@Request() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.authService.getUserById(userId);
  }
}