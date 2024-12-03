import { Module } from '@nestjs/common';
import generateModuleSet from './utils/module-set';
import { CronService } from './services/cron.service';
import { Web3Service } from './web3/web3.service';

@Module({
  imports: generateModuleSet(),
  providers: [
    CronService, 
    Web3Service
  ]
})
export class AppModule {}
