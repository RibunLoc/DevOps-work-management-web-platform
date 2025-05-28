import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { Subtask } from 'src/entities/subtask.entity';
import { ListController } from './list.controller';
import { List } from 'src/entities/list.entity';

@Module({
   imports: [
      ConfigModule, 
      TypeOrmModule.forFeature([Task]),
      TypeOrmModule.forFeature([User]),
      TypeOrmModule.forFeature([Subtask]),
      TypeOrmModule.forFeature([List])
    ],
    controllers: [ListController],
   
  providers: [ListService]
})
export class ListModule {}
