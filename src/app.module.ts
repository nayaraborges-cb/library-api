import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard, ThrottlerModuleOptions } from '@nestjs/throttler';
import Redis from 'ioredis';

import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (
        config: ConfigService<
          {
            THROTTLER_TTL: number;
            THROTTLER_LIMIT: number;
            REDIS_HOST: string;
            REDIS_PORT: number;
          },
          false
        >,
      ) => {
         const redisClient = new Redis({
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        });

        return {
          throttlers: [
            {
              ttl: config.get<number>('THROTTLER_TTL', 60000),
              limit: config.get<number>('THROTTLER_LIMIT', 10),
            },
          ],
          storage: new ThrottlerStorageRedisService(redisClient),
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    BooksModule,
    DatabaseModule,
    AuthModule,

    SequelizeModule.forRoot({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    
    synchronize: true, 
  }),

  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}