import { Observable } from 'rxjs'

export enum CacheName {
    MAIN_PAGE = 'main-page',
    LOCALE_TH = 'LOCALE-TH',
    LOCALE_EN = 'LOCALE-EN',
    LOCALE_CN = 'LOCALE-CN',
    MEDIA_TAG = 'MEDIA-TAG',
}

export interface ICacheService {
    getCache(name: CacheName): Observable<string>

    setCache(name: CacheName, value: string, ttl: null | number): void
}
