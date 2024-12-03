import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export default function loggerConfig(config: ConfigService): Params | Promise<Params> {
    return {
        pinoHttp: {
            name: config.get('app.projectName'),
            level: config.get('app.logLevel'), //Determines the logging level threshold. Only messages with this level or higher will be logged (e.g., if logLevel is warn, only warn and error messages are logged)
            customLevels: { user: 1 },
            autoLogging: false, //If set to true , logging happens automatically for all incoming requests
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    levelKey: 'level',
                    translateTime: 'yyyy-dd-mm, h:MM:ss TT',
                    customColors: 'err: red, info: green, warn: blue',
                }
            }
        }
    }
}

