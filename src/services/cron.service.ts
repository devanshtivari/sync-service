import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INSTANCE, WEB3_RESPONSE } from 'src/constant/web3.constant';
import { IGetBlock } from 'src/interface/block-info';
import { IWeb3Config } from 'src/web3/config/web3-config';
import { Web3Service } from 'src/web3/web3.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron'; 

@Injectable()
export class CronService implements OnModuleInit {
    constructor(
        private readonly config: ConfigService,
        private readonly web3: Web3Service,
        private readonly schedulerRegistry: SchedulerRegistry
    ) {}

    onModuleInit() {
        const cronExpression: string = `*/${this.config.get('app.cronTime')} * * * * *`;

        const job: CronJob = new CronJob(cronExpression, async () => {
            await this.handleCron()
        })

        job.start();
    }

    /**
     * @param {IWeb3ConfigConfig} network
     * @returns {Promise<void>}
     * @memberof CronService
     * @description: This function sets data into the queue 
     */
    async getEvents(network: IWeb3Config): Promise<void> {
        try {
            const getInstance: any = await this.web3.getInstance(network, INSTANCE.STATIC); 
            const getEvents: any = await this.web3.getPastEvents(network, getInstance);
            if(getEvents?.length > 0) {
                Logger.log(getEvents)
            }
        } catch (error: any) {
            Logger.error(error, 'error in getEvents')
        } 
    }

    /**
     * @returns {Promise<void>}
     * @memberof CronService
     * @description: This function traverse through array of web3 networks for events
     */
    async handleCron (): Promise<void> {
        const networks: IWeb3Config[] = await this.config.get('web3.networks');
        for(const network of networks) {
            await this.getEvents(network);
        }
    }
} 