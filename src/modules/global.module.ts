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
import { CacheRedisModule } from '@/modules/cache-redis.module'
import { ConfigModule } from '@nestjs/config'
import { byteArkRepositoryProvider } from '@/providers/byte-ark.provider'

@Global()
@Module({
    providers: [
        envConfigProvider,
        requestContextProvider,
        httpClientProvider,
        byteArkRepositoryProvider,
    ],
    exports: [
        envConfigProvider,
        requestContextProvider,
        httpClientProvider,
        byteArkRepositoryProvider,
    ],
    imports: [
        ConfigModule.forRoot(),
        CacheRedisModule.register()
    ]
})
export class GlobalModule implements NestModule{
    public configure(consumer: MiddlewareConsumer): any {
        consumer.apply(RequestContextMiddleware).forRoutes('*')
    }
}