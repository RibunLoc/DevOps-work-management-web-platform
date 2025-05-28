import { Module } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { SubtaskController } from './subtask.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { getTaskGrpcClientOptions } from 'src/client-options/task.grpc-client';

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
  controllers: [SubtaskController],
  providers: [SubtaskService],
})
export class SubtaskModule {}
