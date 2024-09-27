import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SocketService } from './services/socket';
import { prisma } from './utils/prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const socketService = app.get(SocketService);
  socketService.io.attach(app.getHttpServer());
  socketService.initListeners();

  const config = new DocumentBuilder()
    .setTitle('Qilin')
    .setDescription('Qilin API description')
    .setVersion('1.0')
    .addTag('LFT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  console.log("Running 0");
  
  await app.listen(4000);
}
bootstrap();