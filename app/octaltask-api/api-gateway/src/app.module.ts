import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './resources/auth/auth.controller';
import { AuthModule } from './resources/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { TaskModule } from './resources/task/task.module';
import { CommentModule } from './resources/comment/comment.module';
import { SubtaskModule } from './resources/subtask/subtask.module';
import { ListController } from './resources/list/list.controller';
import { ListModule } from './resources/list/list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '..', '.env'),
    }),
    AuthModule,
    TaskModule,
    CommentModule,
    SubtaskModule,
    ListModule
  ],
  controllers: [AppController, AuthController, ListController],
  providers: [AppService],
})
export class AppModule { }
