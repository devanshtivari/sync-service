export interface INetworkConfig {
    networks: IWeb3Config[]
}

export interface IWeb3Config {
    name: string;
    rpcProvider: string;
    rpcAlternateProvider: string;
    contractAddress: string;
    blockNumber: bigint;
    batchSize: number;
}