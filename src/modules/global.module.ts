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
import { CacheModule } from '@nestjs/cache-manager'
import type { RedisClientOptions } from 'redis'
import * as redisStore from 'cache-manager-redis-store'

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
    ],
    imports: [
        CacheModule.register<RedisClientOptions>({
            isGlobal: true,
            store: redisStore,
            // redis[s]://[[username][:password]@][host][:port][/db-number]
            url: `redis://@localhost:6379`,
            ttl: 3600
        }),

    ]
})
export class GlobalModule implements NestModule{
    public configure(consumer: MiddlewareConsumer): any {
        consumer.apply(RequestContextMiddleware).forRoutes('*')
    }
}