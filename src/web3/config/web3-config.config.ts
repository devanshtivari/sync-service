import { registerAs } from '@nestjs/config';
import { INetworkConfig } from './web3-config';

export default registerAs<INetworkConfig>('web3', () => {
    return {
        networks: [
            {  
                name: process.env.BSC_NETWORK_NAME,
                rpcProvider: process.env.BSC_RPC_PROVIDER,
                rpcAlternateProvider: process.env.BSC_RPC_ALTERNATE_PROVIDER,
                contractAddress: process.env.BSC_CONTRACT_ADDRESS,
                blockNumber: BigInt(process.env.BSC_BLOCK_NUMBER),
                batchSize: Number(process.env.BSC_BATCH_SIZE)
            },
        ]
    }
})