import { Cache } from 'cache-manager'
import {
    CacheName,
    ICacheService,
} from '@/services/cache/interface/service.interface'
import {
    catchError,
    from,
    map,
    Observable,
    of,
} from 'rxjs'
import {
    Logger,
    LoggerService,
} from '@nestjs/common'

export class CacheService implements ICacheService{
    private readonly _logger: LoggerService
    public constructor(
        private readonly _cacheMng: Cache
    ) {
        this._logger = new Logger(CacheService.name)
    }

    public setCache(name: CacheName | string, value: string, ttl: null|number = null): void {
        if(ttl) {
            this._cacheMng.set(name, value, {
                ttl
            })
        } else {
            this._cacheMng.set(name, value)
        }
    }

    public getCache(name: CacheName | string): Observable<string> {
        return from(this._cacheMng.store.get(name)).pipe(
            map(result => {
                return result as string
            }),
            catchError(err => {
                this._logger.error(`Get Cache : ${name} : ${err.toString()}`)
                return of(null)
            })
        )
    }
}