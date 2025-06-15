import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE, APP_FILTER } from '@nestjs/core';
import { JwtStrategy } from './auth/jwt.strategy';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TagsModule } from './tags/tags.module';
import { LikesModule } from './likes/likes.module';
import { PersonalLibraryModule } from './personal-library/personal-library.module';
import { ClubModule } from './club/club.module';
import { MembershipModule } from './membership/membership.module';

// Guards
import { JwtAuthGuard } from './auth/jwt-auth.guard';

// Entities
import { User } from './users/entities/user.entity';
import { Book } from './books/entities/book.entity';
import { Review } from './reviews/entities/review.entity';
import { Tag } from './tags/entities/tag.entity';
import { BookTag } from './books/entities/book-tag.entity';
import { ReviewLike } from './likes/entities/like.entity';
import { PersonalLibrary } from './personal-library/entities/personal-library.entity';
import { Club } from './club/entities/club.entity';
import { Membership } from './membership/entities/membership.entity';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    // Core modules
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('DATABASE_URL'),
        entities: [User, Book, Review, Tag, BookTag, ReviewLike, PersonalLibrary, Club, Membership],
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') !== 'production',
        ssl: configService.get('NODE_ENV') === 'production' ? {
          rejectUnauthorized: false,
        } : false,
      }),
      inject: [ConfigService],
    }),
    
    // JWT Module
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    
    // Passport
    PassportModule,
    
    // Feature modules
    AuthModule,
    UsersModule,
    BooksModule,
    ReviewsModule,
    TagsModule,
    LikesModule,
    PersonalLibraryModule,
    ClubModule,
    MembershipModule,
    SeedModule
  ],
  controllers: [],
  providers: [
    // Global validation pipe
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
          forbidNonWhitelisted: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
          validationError: {
            target: false,
            value: false,
          },
        }),
    },
    // Global JWT Auth Guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // JWT Strategy
    JwtStrategy,
    // Reflector for decorators
    {
      provide: 'REFLECTOR',
      useValue: new Reflector(),
    },
  ],
})
export class AppModule {}
