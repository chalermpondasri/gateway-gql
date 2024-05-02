import {
    Inject,
    Injectable,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { ISearchRepository } from '@/repositories/search'
import {
    concatMap,
    EMPTY,
    from,
    iif,
    map,
    mergeMap,
    Observable,
    of,
    tap,
    toArray,
} from 'rxjs'
import { RequestContext } from '@/providers/request-context.provider'
import { SearchInput } from '@/types/inputs/search.input'
import { get } from 'lodash'
import {
    ExternalContentType,
    MediaContentDetailType,
} from '@/types/objects'
import { plainToInstance } from 'class-transformer'
import dayjs from 'dayjs'
import {
    BaseResponse,
    ICmsRepository,
    MediaContentDetailResponse,
} from '@/repositories/cms'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { ICacheService } from '@/services/cache/interface/service.interface'

@Injectable()
export class SearchService {
    public constructor(
        @Inject(ProviderName.SEARCH_REPOSITORY)
        private readonly _searchRepository: ISearchRepository,
        @Inject(ProviderName.REQUEST_CONTEXT)
        private readonly _requestContext: RequestContext,
        @Inject(ProviderName.CMS_REPOSITORY)
        private readonly _cmsRepository: ICmsRepository,
        @Inject(ProviderName.CACHE_SERVICE)
        private readonly _cacheService: ICacheService,
    ) {
    }

    public searchContentByKeyword(query: SearchInput): Observable<MediaContentDetailType[]> {
        const lang = this._requestContext.languages[0].code
        return this._searchRepository.findMediaContentWithKeyword(query, this._requestContext.profileId).pipe(
            concatMap(data => from(data.data)),
            map(content => {
                const link = get(content, 'link', {})
                const media: MediaContentDetailType = {
                    id: content.id,
                    title: get(content, `title.${lang}`),
                    subtitle: get(content, `title.${lang}`),
                    contentRating: get(content, 'rating', ''),
                    trailers: get(content, 'trailers', []).map(e => plainToInstance(ExternalContentType, e)),
                    coverImage: content.coverImage as any,
                    slug: get(content, 'slug', ''),
                    tags: get(content, `mediaTags`, []).map(e => ({
                        id: get(e, 'slug', ''),
                        label: get(e, `name.${lang}`, ''),
                    })),
                    shortVideos: [],
                    link: plainToInstance(ExternalContentType, link),
                    casts: get(content, 'casts'),
                    director: get(content, 'directors'),
                    //! move to season
                    episodes: [],
                    //* resolve field
                    isSeries: false,
                    audios: null,
                    captions: null,
                    seasons: null,
                    totalEpisode: null,
                    totalSeason: null,
                    totalDuration: null,
                    latestPlayed: null,
                }
                return media
            }),
            toArray(),
        )
    }

    public getGeneralTopViews(): Observable<BaseResponse<MediaContentDetailResponse>[]> {
        const cacheKey = `${this.getGeneralTopViews.name}_${this._requestContext.languages[0].code}`
        return this._cacheService.getCache(cacheKey).pipe(
            mergeMap(data => {
                return iif(() => !!data,
                    of(JSON.parse(data)),
                    this._getGeneralTopViewsCacheWrapper()
                        .pipe(
                            tap(result => this._cacheService.setCache(cacheKey, JSON.stringify(result),3600)),
                        ),
                )
            }),
        )
    }

    private _getGeneralTopViewsCacheWrapper() {
        const yesterday = dayjs()
            .add(-1, 'd')
            .set('hour', 0)
            .set('minute', 0)
            .set('seconds', 0)
            .set('milliseconds', 0)
            .toISOString()
        const aWeekAgo = dayjs()
            .set('days', -8)
            .set('hour', 0)
            .set('minute', 0)
            .set('seconds', 0)
            .set('milliseconds', 0)
            .toISOString()

        const lang = this._requestContext.languages[0].code

        return this._searchRepository.getTopsViews(aWeekAgo, yesterday, []).pipe(
            concatMap(v => iif(() => v.length < 10, of([]), of(v))),
            concatMap(v => from(v)),
            concatMap(v => {
                return this._cmsRepository.getMediaContentById(String(v.contentId))
            }),
            map(res => (res.data) as BaseResponse<MediaContentDetailResponse>),
            toArray(),
        )
    }

}