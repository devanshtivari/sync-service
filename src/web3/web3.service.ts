import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { IWeb3Config } from './config/web3-config';
import { RegisteredSubscription } from 'web3/lib/commonjs/eth.exports';
import { INSTANCE, WEB3_RESPONSE } from 'src/constant/web3.constant';
import { ABI } from 'src/utils/abi/contract.abi';
import { DYNAMIC_ABI } from 'src/utils/abi/dynamic-contract.abi';
import { Injectable, Logger } from '@nestjs/common';
import { IGetBlock } from 'src/interface/block-info';
import { BlockService } from 'src/services/block.service';
import { PromiseResolve } from 'src/interface/promise-resolve';

@Injectable()
export class Web3Service {
    constructor(
        private readonly config: ConfigService<any>,
        private readonly block: BlockService
    ) {}

    /**
     * @param {IWeb3Config} network
     * @param {string} contract
     * @param {string} dynamicAddress
     * @returns {Promise<any>}
     * @memberof Web3Service
     * @description: This function will return the dynamic instance of the contract
     */
    async getInstance(network: IWeb3Config, contract: string, dynamicAddress: string = ''): Promise<any> {
        try {
            let web3Instance: Web3<RegisteredSubscription> = new Web3(network.rpcProvider);
            let contractInstance: any;
            const currentBlock: bigint = await web3Instance.eth.getBlockNumber();

            //dynamic switcing between contract type
            switch (contract) {
                case INSTANCE.STATIC:
                    contractInstance = new web3Instance.eth.Contract(
                        ABI, network.contractAddress
                    );
                    break;
                
                case INSTANCE.DYNAMIC:
                    contractInstance = new web3Instance.eth.Contract(
                        DYNAMIC_ABI, network.contractAddress
                    )
                    break;
                
                default:
                    throw new Error(WEB3_RESPONSE.CONTRACT_ERROR)
            }

            return {
                instance: contractInstance,
                currentBlock: currentBlock
            }
            
        } catch (error: any) {
            Logger.error(error, 'Error in geInstance')
            throw error;
        }
    }

    /**
     * @param {IWeb3Config} network
     * @param {bigint} entryBlock
     * @param {number} batchSize
     * @returns {Promise<IGetBlock>} 
     * @memberof Web3Service
     * @description: This function returns the latest network info from the cache
     */
    async getBlocks(network: IWeb3Config, entryblock: bigint, batchSize: number): Promise<IGetBlock> {
        try {
           let blockInfo: PromiseResolve = await this.block.getBlockInfo(network.name);
           let startBlock: bigint = entryblock;
           let finalData: IGetBlock;
           //const currentBlock = await this.getCurrentBlock();

           if(!blockInfo || blockInfo.error) {
                //it means, there is no data in cache
                //hence creating data
                const create: PromiseResolve = await this.block.saveBlockInfo(network.name, network.contractAddress, startBlock)
                if(!create || create.error) throw new Error(create.message)

                finalData = {
                    startBlock: startBlock,
                    endBlock: BigInt(Number(startBlock) + batchSize + 1)
                }
           } else {
                //if data already exist, update the data and return
                const update: PromiseResolve = await this.block.saveBlockInfo(network.name, network.contractAddress, BigInt(Number(blockInfo.data.lastBlock) + batchSize))
                if(!update || update.error) throw new Error(update.message)
                
                finalData = {
                    startBlock: blockInfo.data.lastBlock,
                    endBlock: BigInt(Number(blockInfo.data.lastBlock) + batchSize + 1)
                }
           }  

            //returning the response
            return finalData;
        } catch (error: any) {
            Logger.error(error, 'Error in getBlocks')
            throw Error(error.message)
        }
    }

    /**
     * @param {IWeb3Config} network
     * @param {any} instance
     * @returns {Promise<any>}
     * @memberof Web3Service
     * @description: This function returns all past events for that network
     */
    async getPastEvents(network: IWeb3Config, data: any): Promise<any> {
        try {   
            const { instance, currentBlock } =data
            //getting the value of from block   
            const blockInfo: PromiseResolve = await this.block.getBlockInfo(network.name);
            let fromBlock: bigint = blockInfo.error ? network.blockNumber : blockInfo.data.lastBlock;
            
            //getting value of to block
            let toBlock: bigint = fromBlock + BigInt(network.batchSize)
            if(toBlock > currentBlock) toBlock = currentBlock;
            if(fromBlock > toBlock) fromBlock = toBlock;

            //reading the past events
            if(fromBlock <= toBlock) {
                Logger.log(`Reading blocks from: ${fromBlock} to: ${toBlock}`)
                const logs: any = await instance.getPastEvents('allEvents', {
                    fromBlock: fromBlock,
                    toBlock: toBlock
                })
                if(logs) {
                    const update: PromiseResolve = await this.block.saveBlockInfo(network.name, network.contractAddress, toBlock + 1n)
                    if(!update || update.error) throw new Error(update.message)

                    return logs;
                }
            }
        } catch (error: any) {
            Logger.error(error, 'Error in getPastEvents')
        }
    }

    async getCurrentBlock(instance: any): Promise<bigint> {
        try {
            return await instance.eth.getBlockNumber();
        } catch (error: any) {
            Logger.error(error, 'Error in getCurrentBlock')
        }
    }
}