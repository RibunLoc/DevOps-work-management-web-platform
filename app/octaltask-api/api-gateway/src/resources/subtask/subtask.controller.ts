import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { JwtGuard } from '../../guards/jwt.guard';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SubtaskSubtaskResponseDto, SubtaskErrorResponseDto, DeleteResponseDto } from './dto/response.dto';

@ApiTags('Subtasks')
@ApiBearerAuth()
@Controller('subtasks')
export class SubtaskController {
  constructor(private readonly subtaskService: SubtaskService) { }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get a subtask by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Subtask ID' })
  @ApiResponse({
    status: 200,
    description: 'Subtask retrieved successfully',
    type: SubtaskSubtaskResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid subtask ID format',
    type: SubtaskErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Subtask not found',
    type: SubtaskErrorResponseDto
  })
  @ApiForbiddenResponse({
    description: 'Permission denied to view this subtask',
    type: SubtaskErrorResponseDto
  })
  async getSubtask(@Param('id') id: string, @Request() req) {
    return this.subtaskService.getSubtask(parseInt(id, 10), req.user);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update a subtask' })
  @ApiParam({ name: 'id', type: Number, description: 'Subtask ID' })
  @ApiResponse({
    status: 200,
    description: 'Subtask updated successfully',
    type: SubtaskSubtaskResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: SubtaskErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Subtask not found',
    type: SubtaskErrorResponseDto
  })
  @ApiForbiddenResponse({
    description: 'Permission denied to update this subtask',
    type: SubtaskErrorResponseDto
  })
  async updateSubtask(
    @Param('id') id: string,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
    @Request() req
  ) {
    return this.subtaskService.updateSubtask(
      parseInt(id, 10),
      updateSubtaskDto,
      req.user
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete a subtask' })
  @ApiParam({ name: 'id', type: Number, description: 'Subtask ID' })
  @ApiResponse({
    status: 200,
    description: 'Subtask deleted successfully',
    type: DeleteResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid subtask ID format',
    type: SubtaskErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Subtask not found',
    type: SubtaskErrorResponseDto
  })
  @ApiForbiddenResponse({
    description: 'Permission denied to delete this subtask',
    type: SubtaskErrorResponseDto
  })
  async deleteSubtask(@Param('id') id: string, @Request() req) {
    return this.subtaskService.deleteSubtask(parseInt(id, 10), req.user);
  }
}