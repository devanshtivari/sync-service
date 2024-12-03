import { registerAs } from '@nestjs/config';
import { IQueueConfig } from './queue-config';

export default registerAs<IQueueConfig>('queue', () => {
    return {
        url: process.env.QUEUE_URL,
        eventQueue: process.env.EVENT_QUEUE || 'eventQueue'
    }
})