import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule,
    RedisModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        config: {
          url: `redis://${config.get('cache.host')}:${config.get('cache.port')}`, // Ensures Redis is configured with correct URL
        },
      }),
      inject:[ConfigService]
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
