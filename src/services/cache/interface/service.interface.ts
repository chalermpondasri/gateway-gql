import { Observable } from 'rxjs'

export enum CacheName {
    MAIN_PAGE = 'main-page',
    LOCALE_TH = 'LOCALE-TH',
    LOCALE_EN = 'LOCALE-EN',
    LOCALE_CN = 'LOCALE-CN',
    NEW_FIN = 'new-fin',
}

export interface ICacheService {
    getCache(name: CacheName | string): Observable<string>

    setCache(name: CacheName | string, value: string, ttl: null | number): Observable<any>
}
