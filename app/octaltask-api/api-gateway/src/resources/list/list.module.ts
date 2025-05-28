import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
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
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService]
})
export class ListModule {}
