import { Controller, Get, Patch, Put, Delete, Body, Param, Request, UseGuards, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../../guards/jwt.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiBearerAuth, ApiUnauthorizedResponse, ApiConflictResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserUserResponseDto, UsersListResponseDto, UserMessageResponseDto, UserErrorResponseDto } from './dto/response.dto';

@ApiTags('Users')
@ApiBearerAuth('accessToken')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // User endpoints (authenticated users)
  @Get('me')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current user profile retrieved successfully',
    type: UserUserResponseDto
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UserErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: UserErrorResponseDto
  })
  async getCurrentUser(@Request() req) {
    return this.userService.getCurrentUser(req.user);
  }

  @Patch('me')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile updated successfully',
    type: UserUserResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: UserErrorResponseDto
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UserErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: UserErrorResponseDto
  })
  @ApiConflictResponse({
    description: 'Email already exists',
    type: UserErrorResponseDto
  })
  async updateCurrentUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Request() req
  ) {
    return this.userService.updateCurrentUser(updateUserDto, req.user);
  }

  @Put('me/password')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current user password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully',
    type: UserMessageResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: UserErrorResponseDto
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid current password',
    type: UserErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: UserErrorResponseDto
  })
  async changePassword(
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @Request() req
  ) {
    return this.userService.changePassword(changePasswordDto, req.user);
  }

  @Delete('me')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User account deleted successfully',
    type: UserMessageResponseDto
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UserErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: UserErrorResponseDto
  })
  async deleteCurrentUser(@Request() req) {
    return this.userService.deleteCurrentUser(req.user);
  }

  // Admin endpoints
  @Get()
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all users retrieved successfully',
    type: UsersListResponseDto
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UserErrorResponseDto
  })
  @ApiForbiddenResponse({
    description: 'Forbidden (Admin access required)',
    type: UserErrorResponseDto
  })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully',
    type: UserUserResponseDto
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UserErrorResponseDto
  })
  @ApiForbiddenResponse({
    description: 'Forbidden (Admin access required)',
    type: UserErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: UserErrorResponseDto
  })
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(parseInt(id, 10));
  }

  @Patch(':id')
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: AdminUpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: UserUserResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: UserErrorResponseDto
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UserErrorResponseDto
  })
  @ApiForbiddenResponse({
    description: 'Forbidden (Admin access required)',
    type: UserErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: UserErrorResponseDto
  })
  @ApiConflictResponse({
    description: 'Email already exists',
    type: UserErrorResponseDto
  })
  async updateUserById(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: AdminUpdateUserDto
  ) {
    return this.userService.updateUserById(parseInt(id, 10), updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
    type: UserMessageResponseDto
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UserErrorResponseDto
  })
  @ApiForbiddenResponse({
    description: 'Forbidden (Admin access required)',
    type: UserErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: UserErrorResponseDto
  })
  async deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUserById(parseInt(id, 10));
  }
}