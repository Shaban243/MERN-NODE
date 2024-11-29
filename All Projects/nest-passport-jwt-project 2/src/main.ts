import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

   // Configure Swagger
   const config = new DocumentBuilder()
   .setTitle('User Authentication and Authorization with AWS Cognito Service')
   .setDescription('API documentation for managing users and products')
   .setVersion('1.0')
   .addBearerAuth() // Enable Authorization for endpoints
   .build();
 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api', app, document);
  await app.listen(4000);
}
bootstrap();
