import {
    Global,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common'
import { envConfigProvider } from '@/providers/env.provider'
import {
    RequestContextMiddleware,
    requestContextProvider,
} from '@/providers/request-context.provider'
import { httpClientProvider } from '@/providers/http-client.provider'

@Global()
@Module({
    providers: [
        envConfigProvider,
        requestContextProvider,
        httpClientProvider,
    ],
    exports: [
        envConfigProvider,
        requestContextProvider,
        httpClientProvider,
    ]
})
export class GlobalModule implements NestModule{
    public configure(consumer: MiddlewareConsumer): any {
        consumer.apply(RequestContextMiddleware).forRoutes('*')
    }
}