import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './resources/task/task.module';
import { Task } from './entities/task.entity';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Comment } from './entities/comment.entity';
import { Subtask } from './entities/subtask.entity';
import { CommentModule } from './resources/comment/comment.module';
import { SubtaskModule } from './resources/subtask/subtask.module';
import { List } from './entities/list.entity';
import { ListModule } from './resources/list/list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '..', '.env'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        type: config.get<'mysql' | 'postgres' | 'sqlite'>('DB_TYPE') as any,
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [Task, User,Comment,Subtask,List],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    TaskModule,
    CommentModule,
    SubtaskModule,
    ListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
