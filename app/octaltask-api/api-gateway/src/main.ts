import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Octaltask API Documentation')
    .setDescription('Documentation for Octaltask application')
    .setVersion('1.0')
    .addTag('Authentication', 'Authentication endpoints for login, signup, password reset')
    .addTag('Task', 'Task management operations')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'accessToken',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') || 3000;
  await app.listen(port);
}
bootstrap();
