import { ConfigService } from '@nestjs/config';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const getTaskGrpcClientOptions = (configService: ConfigService): ClientProviderOptions => ({
  name: 'TASK_PACKAGE',
  transport: Transport.GRPC,
  options: {
    package: 'task',
    protoPath: join(__dirname, '../proto/task.proto'),
    url: configService.get<string>('CLIENT_GRPC_TASK_URL'),
  },
});
