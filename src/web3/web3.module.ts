import { Module, forwardRef } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { BlockModule } from 'src/services/block.module';

@Module({
    imports: [forwardRef(() => BlockModule)],
    providers: [Web3Service],
    exports: [Web3Service]
})

export class Web3Module {}