import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Request, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtGuard } from '../../guards/jwt.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { TaskResponseDto, TaskCommentResponseDto, TaskSubtaskResponseDto, TaskErrorResponseDto } from './dto/response.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task', description: 'Creates a new task for the authenticated user' })
  @ApiBody({ type: CreateTaskDto })
  @ApiCreatedResponse({ type: TaskResponseDto, description: 'Task created successfully' })
  @ApiBadRequestResponse({ type: TaskErrorResponseDto, description: 'Invalid request data' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiConflictResponse({ type: TaskErrorResponseDto, description: 'Task with this title already exists' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async create(@Body(ValidationPipe) createTaskDto: CreateTaskDto, @Request() req) {
    return this.taskService.create(createTaskDto, req.user);
  }

  @Get()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tasks', description: 'Retrieves all tasks for the authenticated user' })
  @ApiOkResponse({ type: [TaskResponseDto], description: 'Tasks retrieved successfully' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async findAll(@Request() req) {
    return this.taskService.findAll(req.user);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a task by ID', description: 'Retrieves a specific task by its ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiOkResponse({ type: TaskResponseDto, description: 'Task retrieved successfully' })
  @ApiNotFoundResponse({ type: TaskErrorResponseDto, description: 'Task not found' })
  @ApiForbiddenResponse({ type: TaskErrorResponseDto, description: 'Permission denied' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.taskService.findOne(parseInt(id, 10), req.user);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a task', description: 'Updates an existing task' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({ type: TaskResponseDto, description: 'Task updated successfully' })
  @ApiNotFoundResponse({ type: TaskErrorResponseDto, description: 'Task not found' })
  @ApiForbiddenResponse({ type: TaskErrorResponseDto, description: 'Permission denied' })
  @ApiBadRequestResponse({ type: TaskErrorResponseDto, description: 'Invalid request data' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
    @Request() req
  ) {
    return this.taskService.update(parseInt(id, 10), updateTaskDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task', description: 'Deletes an existing task' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiOkResponse({ description: 'Task deleted successfully' })
  @ApiNotFoundResponse({ type: TaskErrorResponseDto, description: 'Task not found' })
  @ApiForbiddenResponse({ type: TaskErrorResponseDto, description: 'Permission denied' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.taskService.remove(parseInt(id, 10), req.user);
  }

  // Admin routes
  @Get('admin/all')
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tasks (Admin)', description: 'Retrieves all tasks in the system (Admin only)' })
  @ApiOkResponse({ type: [TaskResponseDto], description: 'Tasks retrieved successfully' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiForbiddenResponse({ type: TaskErrorResponseDto, description: 'Forbidden - Admin access required' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async getAllTasksForAdmin() {
    return this.taskService.getAllTasksForAdmin();
  }

  @Get('admin/:id')
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get task by ID (Admin)', description: 'Retrieves a specific task by its ID (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiOkResponse({ type: TaskResponseDto, description: 'Task retrieved successfully' })
  @ApiNotFoundResponse({ type: TaskErrorResponseDto, description: 'Task not found' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiForbiddenResponse({ type: TaskErrorResponseDto, description: 'Forbidden - Admin access required' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async getTaskByIdForAdmin(@Param('id') id: string) {
    return this.taskService.getTaskByIdForAdmin(parseInt(id, 10));
  }

  @Patch('admin/:id')
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update task (Admin)', description: 'Updates an existing task (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({ type: TaskResponseDto, description: 'Task updated successfully' })
  @ApiNotFoundResponse({ type: TaskErrorResponseDto, description: 'Task not found' })
  @ApiBadRequestResponse({ type: TaskErrorResponseDto, description: 'Invalid request data' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiForbiddenResponse({ type: TaskErrorResponseDto, description: 'Forbidden - Admin access required' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async adminUpdateTask(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto
  ) {
    return this.taskService.adminUpdateTask(parseInt(id, 10), updateTaskDto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete task (Admin)', description: 'Deletes an existing task (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiOkResponse({ description: 'Task deleted successfully' })
  @ApiNotFoundResponse({ type: TaskErrorResponseDto, description: 'Task not found' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiForbiddenResponse({ type: TaskErrorResponseDto, description: 'Forbidden - Admin access required' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async adminDeleteTask(@Param('id') id: string) {
    return this.taskService.adminDeleteTask(parseInt(id, 10));
  }

  @Get('admin/user/:userId')
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tasks by user ID (Admin)', description: 'Retrieves all tasks for a specific user (Admin only)' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiOkResponse({ type: [TaskResponseDto], description: 'Tasks retrieved successfully' })
  @ApiNotFoundResponse({ type: TaskErrorResponseDto, description: 'User not found' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiForbiddenResponse({ type: TaskErrorResponseDto, description: 'Forbidden - Admin access required' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async getAllTasksByUserId(@Param('userId') userId: string) {
    return this.taskService.getAllTasksByUserId(parseInt(userId, 10));
  }

  @Post(':id/comments')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add comment to task', description: 'Adds a comment to a specific task' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({ type: TaskCommentResponseDto, description: 'Comment added successfully' })
  @ApiNotFoundResponse({ type: TaskErrorResponseDto, description: 'Task not found' })
  @ApiForbiddenResponse({ type: TaskErrorResponseDto, description: 'Permission denied' })
  @ApiBadRequestResponse({ type: TaskErrorResponseDto, description: 'Invalid request data' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async addCommentToTask(
    @Param('id') id: string,
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @Request() req
  ) {
    return this.taskService.addCommentToTask(parseInt(id, 10), createCommentDto, req.user);
  }

  @Get(':id/comments')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get task comments', description: 'Retrieves all comments for a specific task' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiOkResponse({ type: [TaskCommentResponseDto], description: 'Comments retrieved successfully' })
  @ApiNotFoundResponse({ type: TaskErrorResponseDto, description: 'Task not found' })
  @ApiForbiddenResponse({ type: TaskErrorResponseDto, description: 'Permission denied' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async getCommentsForTask(@Param('id') id: string, @Request() req) {
    return this.taskService.getCommentsForTask(parseInt(id, 10), req.user);
  }

  @Post(':id/subtasks')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add subtask to task', description: 'Adds a subtask to a specific task' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiBody({ type: CreateSubtaskDto })
  @ApiCreatedResponse({ type: TaskSubtaskResponseDto, description: 'Subtask added successfully' })
  @ApiNotFoundResponse({ type: TaskErrorResponseDto, description: 'Task not found' })
  @ApiForbiddenResponse({ type: TaskErrorResponseDto, description: 'Permission denied' })
  @ApiBadRequestResponse({ type: TaskErrorResponseDto, description: 'Invalid request data' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async addSubtaskToTask(
    @Param('id') id: string,
    @Body(ValidationPipe) createSubtaskDto: CreateSubtaskDto,
    @Request() req
  ) {
    return this.taskService.addSubtaskToTask(parseInt(id, 10), createSubtaskDto, req.user);
  }

  @Get(':id/subtasks')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get task subtasks', description: 'Retrieves all subtasks for a specific task' })
  @ApiParam({ name: 'id', type: Number, description: 'Task ID' })
  @ApiOkResponse({ type: [TaskSubtaskResponseDto], description: 'Subtasks retrieved successfully' })
  @ApiNotFoundResponse({ type: TaskErrorResponseDto, description: 'Task not found' })
  @ApiForbiddenResponse({ type: TaskErrorResponseDto, description: 'Permission denied' })
  @ApiUnauthorizedResponse({ type: TaskErrorResponseDto, description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ type: TaskErrorResponseDto, description: 'Internal server error' })
  async getSubtasksForTask(@Param('id') id: string, @Request() req) {
    return this.taskService.getSubtasksForTask(parseInt(id, 10), req.user);
  }
}