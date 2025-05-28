import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule} from '@nestjs/config';
import { Comment } from '../../entities/comment.entity';
import { Subtask } from '../../entities/subtask.entity';
import { List } from 'src/entities/list.entity';

@Module({
  imports: [
    ConfigModule, 
    TypeOrmModule.forFeature([Task]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forFeature([Subtask]),
    TypeOrmModule.forFeature([List])
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
