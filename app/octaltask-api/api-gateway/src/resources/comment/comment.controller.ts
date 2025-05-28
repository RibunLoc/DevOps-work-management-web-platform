import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtGuard } from '../../guards/jwt.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':id')
  @UseGuards(JwtGuard)
  async getComment(@Param('id') id: string, @Request() req) {
    return this.commentService.getComment(parseInt(id, 10), req.user);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req
  ) {
    return this.commentService.updateComment(
      parseInt(id, 10),
      updateCommentDto,
      req.user
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteComment(@Param('id') id: string, @Request() req) {
    return this.commentService.deleteComment(parseInt(id, 10), req.user);
  }
}