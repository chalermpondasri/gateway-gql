import {
    CacheModuleAsyncOptions,
    DynamicModule,
    Global,
    Module,
} from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { RedisClientOptions } from 'redis'
import * as redisStore from 'cache-manager-redis-store'
import { ProviderName } from '@/constants/provider-name.const'
import { EnvironmentConfig } from '@/models/common'
import { isEmpty } from 'lodash'
import { cacheProvider } from '@/providers/cache.provider'

@Global()
@Module({})
export class CacheRedisModule{

    public static register(): DynamicModule {
        return {
            module: CacheRedisModule,
            providers: [
                cacheProvider
            ],
            exports: [
                cacheProvider
            ],
            imports: [
                // CacheModule.register<RedisClientOptions>({
                //     isGlobal: true,
                //     store: redisStore,
                //     // redis[s]://[[username][:password]@][host][:port][/db-number]
                //     url: `redis://@localhost:6379`,
                //     ttl: 3600
                // }),
                CacheModule.registerAsync({
                    isGlobal: true,
                    inject: [ProviderName.ENV_CONFIG],
                    useFactory: (cfg: EnvironmentConfig) => {
                        let urlRedis = `redis://${cfg.REDIS_USER}:${cfg.REDIS_PASS}@${cfg.REDIS_HOST}:${cfg.REDIS_PORT}`
                        if (isEmpty(cfg.REDIS_USER)) {
                            urlRedis = `redis://@${cfg.REDIS_HOST}:${cfg.REDIS_PORT}`
                        }
                        return {
                            isGlobal: true,
                            store: redisStore,
                            url: urlRedis,
                            ttl: 36000
                        } as CacheModuleAsyncOptions<RedisClientOptions>
                    }
                }),
            ],
        }
    }

}