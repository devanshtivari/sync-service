import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import appConfig from 'src/config/app-config.config';
import loggerConfig from './logger-factory';
import { QueueModule } from 'src/queue/queue.module';
import { CacheModule } from 'src/cache/cache.module';
import { Web3Module } from 'src/web3/web3.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockModule } from 'src/services/block.module';
import queueConfig from 'src/queue/config/queue-config.config';
import cacheConfigConfig from 'src/cache/config/cache-config.config';
import web3ConfigConfig from 'src/web3/config/web3-config.config';

export default function generateModuleSet () {
    const imports: ModuleMetadata['imports'] = [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, queueConfig,cacheConfigConfig,web3ConfigConfig],
            envFilePath: ['.env']
        }),
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: loggerConfig
        }),
        QueueModule,
        CacheModule,
        Web3Module,
        ScheduleModule.forRoot(),
        BlockModule
    ]

    return imports;
}