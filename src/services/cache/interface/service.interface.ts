import { Observable } from 'rxjs'

export enum CacheName {
    MAIN_PAGE = 'main-page'
}

export interface ICacheService {
    getCache(name: CacheName): Observable<string>

    setCache(name: CacheName, value: string, ttl: null | number): void
}
