import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ClientsModule } from '@nestjs/microservices';
import { getTaskGrpcClientOptions} from '../../client-options/task.grpc-client';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('TOKEN_EXPIRE_TIME') },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'TASK_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: getTaskGrpcClientOptions,
      },
    ]),
  ],
  providers: [TaskService, JwtStrategy],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}

