import { registerAs } from '@nestjs/config';
import { IAppConfig } from './app-config';

export default registerAs<IAppConfig>('app', () => {
    return {
        projectName: process.env.PROJECT_NAME,
        logLevel: process.env.LOG_LEVEL,
        port: Number(process.env.PORT) || 3000,
        cronTime: Number(process.env.CRON_TIME) || 5
    }
})