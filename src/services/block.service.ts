import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { CACHE_RESPONSE } from 'src/constant/cache.constant';
import { RESPONSES } from 'src/constant/res-code.constant';
import { IBlockInfo } from 'src/interface/block-info';
import { PromiseResolve } from 'src/interface/promise-resolve';
import CustomError from 'src/utils/custom-error';

@Injectable()
export class BlockService {
    constructor (
        private readonly cache: CacheService
    ){}

    /**
     * @param {string} key
     * @param {string} contractAddress
     * @param {bigint} lastBlock
     * @returns {Promise<PromiseResolve>}
     * @memberof BlockService
     * @description: This function sets the information in cache respective to the specified key
     */
    async saveBlockInfo(key: string, contractAddress: string, lastBlock: bigint): Promise<PromiseResolve> {
        try {
            const saveInfo: number | void = await this.cache.setData(
                key,
                {
                    contractAddress: contractAddress,
                    lastBlock: Number(lastBlock)
                }
            )

            if(saveInfo === -1) throw new CustomError(CACHE_RESPONSE.ERROR, RESPONSES.BADREQUEST);

            return {
                error: false,
                message: CACHE_RESPONSE.SUCCESS
            }
        } catch (error: any) {
            Logger.error(error, 'Error in saveBlockInfo')

            return {
                error: true,
                message: error.message || CACHE_RESPONSE.ERROR
            }
        }
    }

    /**
     * @param {string} key
     * @returns {Promise<PromiseResolve>}
     * @memberof BlockService
     * @description: This function retrieves data of respective key
     */
    async getBlockInfo(key: string): Promise<PromiseResolve> {
        try {
            const data: IBlockInfo = await this.cache.getData(key);
            if(!data.contractAddress || !data.lastBlock) throw new CustomError(CACHE_RESPONSE.FETCH_ERROR, RESPONSES.BADREQUEST)

            return {
                error: false,
                message: CACHE_RESPONSE.FETCH_SUCCESS,
                data: data
            }
        } catch (error: any) {
            Logger.error(error, 'Error in getBlockInfo')

            return {
                error: true,
                message: error.message || CACHE_RESPONSE.FETCH_ERROR
            }
        }
    }

}