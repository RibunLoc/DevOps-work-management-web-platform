import { ConfigService } from '@nestjs/config';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const getUserGrpcClientOptions = (configService: ConfigService): ClientProviderOptions => ({
  name: 'USER_PACKAGE',
  transport: Transport.GRPC,
  options: {
    package: 'user',
    protoPath: join(__dirname, '../proto/user.proto'),
    url: configService.get<string>('CLIENT_GRPC_USER_URL'),
  },
});
