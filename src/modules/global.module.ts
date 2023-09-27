import {
    Global,
    MiddlewareConsumer,
    Module,
    NestModule,
    OnModuleInit,
} from '@nestjs/common'
import { envConfigProvider } from '@/providers/env.provider'
import {
    RequestContextMiddleware,
    requestContextProvider,
} from '@/providers/request-context.provider'

@Global()
@Module({
    providers: [
        envConfigProvider,
        requestContextProvider,
    ],
    exports: [
        envConfigProvider,
        requestContextProvider,
    ]
})
export class GlobalModule implements NestModule{
    public configure(consumer: MiddlewareConsumer): any {
        consumer.apply(RequestContextMiddleware).forRoutes('*')
    }
}