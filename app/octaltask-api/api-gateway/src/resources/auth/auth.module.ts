import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getAuthGrpcClientOptions } from 'src/client-options/auth.grpc-client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        imports: [ConfigModule],
        useFactory: getAuthGrpcClientOptions,
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
