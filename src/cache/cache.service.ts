import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IBlockInfo } from 'src/interface/block-info';

@Injectable()
export class CacheService {
    private readonly client: Redis;

    constructor(private readonly redisService: RedisService, private readonly config: ConfigService) {
        this.client = this.redisService.getOrThrow();
    }

    /**
     * @param {string} key
     * @param {IBlockInfo} data
     * @param {number} expires
     * @returns {Promise<number | void>}
     * @memberof CacheService
     * @description: Sets the data for respective key along with other specifications
     */
    async setData(key: string, data: object, expires: number = 0): Promise<number | void> {
        try {
            await this.client.set(key, JSON.stringify(data), 'EX', expires || this.config.get<number>('cache.expiryTime'));
        } catch (error: any) {
            Logger.error(error, 'Error in setOtp')
            return -1;
        }
    }


    /**
     * @param {string} key
     * @returns {Promise<IBlockInfo>}
     * @memberof CacheService
     * @description: Fetch the data for the respective key from the cache
     */
    async getData(key: string): Promise<IBlockInfo> {
        try {
            const temp: IBlockInfo = JSON.parse(await this.client.get(key))
            return {
                contractAddress: temp?.contractAddress,
                lastBlock: BigInt(temp?.lastBlock || 0)
            }
        } catch (error: any) {
            Logger.error(error, 'Error in getData')
            return null;
        }
    }
}