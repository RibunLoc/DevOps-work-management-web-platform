import { ConfigService } from '@nestjs/config';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const getAuthGrpcClientOptions = (configService: ConfigService): ClientProviderOptions => ({
  name: 'AUTH_PACKAGE',
  transport: Transport.GRPC,
  options: {
    package: 'auth',
    protoPath: join(__dirname, '../proto/auth.proto'),
    url: configService.get<string>('CLIENT_GRPC_AUTH_URL'),
  },
});
