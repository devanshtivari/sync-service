import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel} from 'amqplib';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/types/AmqpConnectionManager';
import { PromiseResolve } from 'src/interface/promise-resolve';
import CustomError from 'src/utils/custom-error';
import { QUEUE_CONSTANT } from 'src/constant/queue.constant';
import { RESPONSES } from 'src/constant/res-code.constant';

@Injectable()
export class ProducerService {
    private readonly channelWrapper: ChannelWrapper;

    constructor(private readonly configService: ConfigService<any>) {
        const connection: IAmqpConnectionManager = amqp.connect(this.configService.get('queue.url'));
        this.channelWrapper = connection.createChannel({
            setup: async (channel: Channel) => {
                await channel.assertQueue(this.configService.get('queue.eventQueue'), { durable: true });
            }  
        })
    }

    /**
     * @param {string} queueName 
     * @param {any} data 
     * @returns {Promise<PromiseResolve>}
     * @memberof ProducerService
     * @description: Function to send data to the specified queue
     */

    async sendQueue(queueName: string, data: any): Promise<PromiseResolve> {
        try {
            const send: boolean = await this.channelWrapper.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify(data)),
            )

            if(!send) throw new CustomError(QUEUE_CONSTANT.SEND_ERROR, RESPONSES.BADREQUEST);

            return {
                status: RESPONSES.SUCCESS,
                error: false,
                message: QUEUE_CONSTANT.SEND_SUCCESS
            }
        } catch (error: any) {
            Logger.error(error, 'sendQueue error')
            
            return {
                status: RESPONSES.BADREQUEST,
                error: true,
                message: error.message || QUEUE_CONSTANT.SEND_ERROR
            }
        }
    }
}