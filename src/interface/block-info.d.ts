export interface IBlockInfo {
    contractAddress: string;
    lastBlock: bigint;
}

export interface IGetBlock {
    startBlock: bigint;
    endBlock: bigint;
}