import { Observable } from 'rxjs'

export enum CacheName {
    MAIN_PAGE = 'main-page',
}

export interface ICacheService {
    getCache(name: CacheName): Observable<string>

    setCache(name: CacheName | string, value: string, ttl: null | number): void
}
