// src/task/list.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('lists')
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) { }

  @Post()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new list' })
  @ApiCreatedResponse({
    description: 'The list has been successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Personal Tasks' },
        icon: { type: 'string', example: 'personal' },
        color: { type: 'string', example: 'blue' },
        dueDate: { type: 'string', example: '2025-05-20T12:00:00Z' },
        user: {
          type: 'object',
          properties: {
            userId: { type: 'number', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', example: 'user' }
          }
        }
      }
    }
  })
  @ApiConflictResponse({ description: 'List with this name already exists' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: CreateListDto })
  async create(@Body(ValidationPipe) createListDto: CreateListDto, @Request() req) {
    const something = await this.listService.create(createListDto, req.user);
    return something;
  }

  @Get()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all lists for the current user' })
  @ApiOkResponse({
    description: 'Retrieved all lists for the current user',
    schema: {
      type: 'object',
      properties: {
        lists: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              icon: { type: 'string' },
              color: { type: 'string' },
              dueDate: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  email: { type: 'string' },
                  name: { type: 'string' },
                  role: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findAll(@Request() req) {
    return this.listService.findAll(req.user);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a list by ID' })
  @ApiParam({ name: 'id', description: 'List ID', type: 'number' })
  @ApiOkResponse({
    description: 'Retrieved the list successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Personal Tasks' },
        icon: { type: 'string', example: 'personal' },
        color: { type: 'string', example: 'blue' },
        dueDate: { type: 'string', example: '2025-05-20T12:00:00Z' },
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
  @ApiNotFoundResponse({ description: 'List not found' })
  @ApiForbiddenResponse({ description: 'Permission denied' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.listService.findOne(parseInt(id, 10), req.user);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a list' })
  @ApiParam({ name: 'id', description: 'List ID', type: 'number' })
  @ApiBody({ type: UpdateListDto })
  @ApiOkResponse({
    description: 'List updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Updated Personal Tasks' },
        icon: { type: 'string', example: 'work' },
        color: { type: 'string', example: 'green' },
        dueDate: { type: 'string', example: '2025-05-25T12:00:00Z' },
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
  @ApiNotFoundResponse({ description: 'List not found' })
  @ApiForbiddenResponse({ description: 'Permission denied' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateListDto: UpdateListDto,
    @Request() req
  ) {
    console.log('UpdateListDto:', UpdateListDto, req.user);
    return this.listService.update(parseInt(id, 10), updateListDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a list' })
  @ApiParam({ name: 'id', description: 'List ID', type: 'number' })
  @ApiOkResponse({
    description: 'List deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'List deleted successfully' }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'List not found' })
  @ApiForbiddenResponse({ description: 'Permission denied' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.listService.remove(parseInt(id, 10), req.user);
  }
}