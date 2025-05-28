import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { Subtask } from 'src/entities/subtask.entity';
import { Comment } from 'src/entities/comment.entity';

@Module({
  imports: [
    ConfigModule, 
    TypeOrmModule.forFeature([Task]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forFeature([Subtask]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
