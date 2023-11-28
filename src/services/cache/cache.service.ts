import { Cache } from 'cache-manager'
import {
    CacheName,
    ICacheService,
} from '@/services/cache/interface/service.interface'
import {
    from,
    map,
    Observable,
} from 'rxjs'

export class CacheService implements ICacheService{
    public constructor(
        private readonly _cacheMng: Cache
    ) {
    }

    public setCache(name: CacheName, value: string, ttl: null|number = null): void {
        if(ttl) {
            this._cacheMng.set(name, value, {
                ttl
            })
        } else {
            this._cacheMng.set(name, value)
        }
    }

    public getCache(name: CacheName): Observable<string> {
        return from(this._cacheMng.store.get(name)).pipe(
            map(result => {
                return result as string
            })
        )
    }
}