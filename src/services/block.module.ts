import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { CacheModule } from 'src/cache/cache.module';
import { CacheService } from 'src/cache/cache.service';

@Module({
    imports: [CacheModule],
    providers: [BlockService, CacheService],
    exports: [BlockService]
})

export class BlockModule {}