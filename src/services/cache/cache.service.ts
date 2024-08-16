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

    public setCache(name: CacheName, value: string, ttl: null|number = null): Observable<string> {
        if(ttl) {
            return from(this._cacheMng.set(name, value, {
                ttl
            }))
        } else {
            return from(this._cacheMng.set(name, value))
        }

    }

    public getCache(name: CacheName): Observable<string> {
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