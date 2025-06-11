import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode, HttpStatus, ValidationPipe, Query } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ShareListDto } from './dto/share-list.dto';
import { UpdateSharedRoleDto } from './dto/update-shared-role.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiBadRequestResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ListResponseDto, SharedListsResponseDto, SharedUsersResponseDto, ListMessageResponseDto, UsersSearchResponseDto, ListErrorResponseDto } from './dto/response.dto';

@ApiTags('Lists')
@ApiBearerAuth('accessToken')
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) { }

  @Post()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new list' })
  @ApiBody({ type: CreateListDto })
  @ApiCreatedResponse({ type: ListResponseDto, description: 'List created successfully' })
  @ApiBadRequestResponse({ type: ListErrorResponseDto, description: 'Invalid input data' })
  @ApiConflictResponse({ type: ListErrorResponseDto, description: 'List with this name already exists' })
  async create(@Body(ValidationPipe) createListDto: CreateListDto, @Request() req) {
    const something = await this.listService.create(createListDto, req.user);
    return something;
  }

  @Get()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all lists for current user' })
  @ApiOkResponse({ type: [ListResponseDto], description: 'Lists retrieved successfully' })
  async findAll(@Request() req) {
    return this.listService.findAll(req.user);
  }

  @Get('shared')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all lists shared with current user' })
  @ApiOkResponse({ type: SharedListsResponseDto, description: 'Shared lists retrieved successfully' })
  async getSharedLists(@Request() req) {
    return this.listService.getSharedLists(req.user);
  }

  @Get('users/search')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search users by email' })
  @ApiQuery({ name: 'email', required: true, description: 'Email to search for' })
  @ApiOkResponse({ type: UsersSearchResponseDto, description: 'Users found' })
  @ApiBadRequestResponse({ type: ListErrorResponseDto, description: 'Email is required' })
  async searchUsers(@Query('email') email: string) {
    return this.listService.getUsersByEmail(email);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific list by ID' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiOkResponse({ type: ListResponseDto, description: 'List retrieved successfully' })
  @ApiNotFoundResponse({ type: ListErrorResponseDto, description: 'List not found' })
  @ApiForbiddenResponse({ type: ListErrorResponseDto, description: 'No permission to access this list' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.listService.findOne(parseInt(id, 10), req.user);
  }

  @Get(':id/shared-users')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users a list is shared with' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiOkResponse({ type: SharedUsersResponseDto, description: 'Shared users retrieved successfully' })
  @ApiNotFoundResponse({ type: ListErrorResponseDto, description: 'List not found' })
  @ApiForbiddenResponse({ type: ListErrorResponseDto, description: 'No permission to access this list' })
  async getListSharedUsers(@Param('id') id: string, @Request() req) {
    return this.listService.getListSharedUsers(parseInt(id, 10), req.user);
  }

  @Post(':id/share')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Share a list with another user' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiBody({ type: ShareListDto })
  @ApiCreatedResponse({ type: ListMessageResponseDto, description: 'List shared successfully' })
  @ApiNotFoundResponse({ type: ListErrorResponseDto, description: 'List or user not found' })
  @ApiForbiddenResponse({ type: ListErrorResponseDto, description: 'No permission to share this list' })
  @ApiConflictResponse({ type: ListErrorResponseDto, description: 'List already shared with this user or cannot share with owner' })
  async shareList(
    @Param('id') id: string,
    @Body(ValidationPipe) shareListDto: ShareListDto,
    @Request() req
  ) {
    return this.listService.shareList(parseInt(id, 10), shareListDto.email, shareListDto.role, req.user);
  }

  @Patch(':id/shared-users/:userId/role')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update role of a shared user' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiParam({ name: 'userId', description: 'User ID to update role for' })
  @ApiBody({ type: UpdateSharedRoleDto })
  @ApiOkResponse({ type: ListMessageResponseDto, description: 'Role updated successfully' })
  @ApiNotFoundResponse({ type: ListErrorResponseDto, description: 'List or shared user not found' })
  @ApiForbiddenResponse({ type: ListErrorResponseDto, description: 'No permission to update roles' })
  async updateSharedRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body(ValidationPipe) updateSharedRoleDto: UpdateSharedRoleDto,
    @Request() req
  ) {
    return this.listService.updateSharedRole(
      parseInt(id, 10),
      parseInt(userId, 10),
      updateSharedRoleDto.role,
      req.user
    );
  }

  @Delete(':id/shared-users/:userId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a user from shared list' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiParam({ name: 'userId', description: 'User ID to remove' })
  @ApiOkResponse({ type: ListMessageResponseDto, description: 'User removed successfully' })
  @ApiNotFoundResponse({ type: ListErrorResponseDto, description: 'List or shared user not found' })
  @ApiForbiddenResponse({ type: ListErrorResponseDto, description: 'No permission to remove this user' })
  async removeSharedUser(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Request() req
  ) {
    return this.listService.removeSharedUser(parseInt(id, 10), parseInt(userId, 10), req.user);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a list' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiBody({ type: UpdateListDto })
  @ApiOkResponse({ type: ListResponseDto, description: 'List updated successfully' })
  @ApiNotFoundResponse({ type: ListErrorResponseDto, description: 'List not found' })
  @ApiForbiddenResponse({ type: ListErrorResponseDto, description: 'No permission to update this list' })
  @ApiConflictResponse({ type: ListErrorResponseDto, description: 'List with this name already exists' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateListDto: UpdateListDto,
    @Request() req
  ) {
    return this.listService.update(parseInt(id, 10), updateListDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a list' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiOkResponse({ type: ListMessageResponseDto, description: 'List deleted successfully' })
  @ApiNotFoundResponse({ type: ListErrorResponseDto, description: 'List not found' })
  @ApiForbiddenResponse({ type: ListErrorResponseDto, description: 'No permission to delete this list' })
  @ApiConflictResponse({ type: ListErrorResponseDto, description: 'Cannot delete list with tasks' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.listService.remove(parseInt(id, 10), req.user);
  }
}