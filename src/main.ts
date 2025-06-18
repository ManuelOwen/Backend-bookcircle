import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpStatus, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS for frontend communication
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  // Global validation pipe with detailed error messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints ? Object.values(error.constraints)[0] : 'Validation error',
        }));
        return new Error(JSON.stringify(result));
      },
    }),
  );


  // Log unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  });
  
  // Log uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`, error.stack);
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Book Club API')
    .setDescription('API for managing book reviews in book clubs')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const host = '0.0.0.0'

  await app.listen(process.env.PORT ?? 3000, host);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
