import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { JwtGuard } from '../../guards/jwt.guard';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Controller('subtasks')
export class SubtaskController {
  constructor(private readonly subtaskService: SubtaskService) {}

  @Get(':id')
  @UseGuards(JwtGuard)
  async getSubtask(@Param('id') id: string, @Request() req) {
    return this.subtaskService.getSubtask(parseInt(id, 10), req.user);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
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
  async deleteSubtask(@Param('id') id: string, @Request() req) {
    return this.subtaskService.deleteSubtask(parseInt(id, 10), req.user);
  }
}