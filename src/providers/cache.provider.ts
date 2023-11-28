import { Provider } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { CacheService } from '@/services/cache/cache.service'

export const cacheProvider: Provider = {
    provide: ProviderName.CACHE_SERVICE,
    inject: [
        CACHE_MANAGER
    ],
    useFactory: (cache: Cache) => new CacheService(cache)
}