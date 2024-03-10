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
import { contentRatingValidationProvider } from '@/providers/content-rating-validation.provider'
import { HealthCheckController } from '@/services/health-check/health-check.controller'

@Global()
@Module({
    controllers: [
        HealthCheckController
    ],
    providers: [
        envConfigProvider,
        requestContextProvider,
        httpClientProvider,
        byteArkRepositoryProvider,
        contentRatingValidationProvider,
    ],
    exports: [
        envConfigProvider,
        requestContextProvider,
        httpClientProvider,
        byteArkRepositoryProvider,
        contentRatingValidationProvider,
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