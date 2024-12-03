import { registerAs } from '@nestjs/config';
import { ICacheConfig } from './cache-config';

export default registerAs<ICacheConfig>('cache', () => {
    
    return {
        host: process.env.CACHE_HOST,
        port: Number(process.env.CACHE_PORT),
        expiryTime: Number(process.env.CACHE_EXPIRY_TIME)
    }
})