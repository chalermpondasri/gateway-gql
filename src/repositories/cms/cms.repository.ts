import {
    AvatarResponse,
    BaseRequest,
    BaseResponse,
    CmsDataResponse,
    FaqResponse,
    ICmsRepository,
    ListResponse,
    LoginResponse,
    MediaContentDetailResponse,
    MediaSeasonResponse,
    PredefinedSearchResponse,
    PromotionalResponse,
    SectionResponse,
    TagResponse,
    TermResponse,
    UserRoleResponse,
} from '@/repositories/cms'
import {
    from,
    map,
    mergeMap,
    Observable,
    of,
    tap,
} from 'rxjs'
import { AxiosInstance } from 'axios'
import * as querystring from 'querystring'
import {
    plainToClass,
    plainToInstance,
} from 'class-transformer'
import {
    get,
    isNil,
} from 'lodash'
import { Cache } from 'cache-manager'
import { NotFoundException } from '@nestjs/common'
import { ContentRating } from '@/types/enums'
import { CoinPackageResponse } from './coin-package.response'
import { ICacheService } from '@/services/cache/interface/service.interface'

export class CmsRepository implements ICmsRepository {
    public constructor(
        private readonly _axiosInstance: AxiosInstance,
        private readonly _cacheManager: Cache,
        private readonly _cacheService: ICacheService
    ) {
    }

    public getCoinPackages(): Observable<ListResponse<BaseResponse<CoinPackageResponse>>> {

        const baseRequest = new BaseRequest()
        baseRequest.sortMeta = { 'price': 'asc'}
        baseRequest.populate = ['tag']

        const queryString = baseRequest.build()

        const promise = this._axiosInstance.get(`/coin-packages?${queryString}`)

        return from(promise).pipe(
            map(response => response.data),
        )
    }

    public getPredefinedSearches(): Observable<ListResponse<BaseResponse<PredefinedSearchResponse>>> {
        const populate = [
            'title',
            'coverImage',
            'link',
            'includeTags',
            'includeTags.name',
            'excludeTags',
            'excludeTags.name',
        ]
        const queryString = querystring.encode({populate})
        const promise = this._axiosInstance.get(`/predefined-searches?${queryString}&sort=order:asc`)

        return from(promise).pipe(
            map(result => result.data)
        )

    }

    public getMainPageSections(sectionId?: number): Observable<ListResponse<BaseResponse<SectionResponse>>> {
        const populate = [
            'title',
            'subtitle',
            'items',
            'coverImage',
            'items.title',
            'items.subtitle',
            'items.trailers',
            'items.coverImage',
            'items.link',
            'items.mediaTags',
            'items.mediaTags.name',
            'items.rating',
            'items.mediaSeasons',
            'items.mediaSeasons.name',
            'items.mediaSeasons.mediaEpisodes',    
            'items.mediaSeasons.mediaEpisodes.audio',
            'items.mediaSeasons.mediaEpisodes.subtitle',
            'items.mediaSeasons.mediaEpisodes.coverImage',
            'items.mediaSeasons.mediaEpisodes.name',
            'items.mediaSeasons.mediaEpisodes.duration',
            'items.mediaSeasons.mediaEpisodes.price',
            'items.casts',
            'items.casts.portrait',
            'items.directors',
            'items.directors.portrait',
        ]
        let queryString = querystring.encode({populate})
        if(!isNil(sectionId)) {
            queryString += `&filters[id][$eq]=${sectionId}`
        }
        const promise = this._axiosInstance.get(`/page-sections?${queryString}&sort=order:asc`)
        return from(promise).pipe(
            map(result => result.data)
        )
    }

    public getTermsAndConditions(request: BaseRequest): Observable<ListResponse<TermResponse>> {
        const queryString = request.build()
        const promise = this._axiosInstance.get(`/terms-and-conditions?${queryString}`)
        return from(promise).pipe(
            map(result => {
                return result.data
            }),
        )
    }

    public login(identifier: string, password: string): Observable<LoginResponse> {
        const promise = this._axiosInstance.post(`/auth/local`,
            {
                identifier,
                password,
            },
            {
                headers: {
                    Authorization: null,
                },
            },
        )
        return from(promise).pipe(
            map(result => result.data),
        )
    }

    public getUserData(userId: number): Observable<UserRoleResponse> {
        const path = `/users/${userId}?populate=*`
        const promise = this._axiosInstance.get(path)
        return from(promise).pipe(
            map(result => result.data),
        )
    }

    public getPromotionalContents(): Observable<ListResponse<BaseResponse<PromotionalResponse>>> {

        const path = `/promotions?populate=*`
        const promise = this._axiosInstance.get(path)
        return from(promise).pipe(
            map(result => result.data),
        )
    }

    public getFaqs(request: BaseRequest): Observable<ListResponse<BaseResponse<FaqResponse>>> {
        const queryString = request.build()
        const path = `/faqs?${queryString}`
        const findCache = this._cacheManager.get(path)
        return from(findCache).pipe(
            mergeMap((cacheData) => {
                if(!isNil(cacheData)) {
                    const dataParse = plainToInstance(ListResponse, JSON.parse(cacheData as string))
                    return of(dataParse)
                }
                const promise = this._axiosInstance.get(path)
                return from(promise).pipe(
                    map((result) => {
                        const respData = result.data
                        if(respData.meta.pagination.total > 0) {
                            this._cacheManager.set(path, JSON.stringify(respData), {
                                ttl: 3600
                            })
                        }
                        return respData
                    }),
                )
            })
        )
    }

    public getAvatars(id: number): Observable<ListResponse<BaseResponse<AvatarResponse>>> {
        let path = `/avatars?populate=*`
        if(!isNil(id)){
            path = `/avatars/${id}?populate=*`
        }      
        const promise = this._axiosInstance.get<ListResponse<BaseResponse<AvatarResponse>>>(path)
        return from(promise).pipe(
            map((result) =>  {
                const preMap = new ListResponse<BaseResponse<AvatarResponse>>()
                preMap.data = result.data?.data
                preMap.meta = result.data?.meta
                if(result.data && !Array.isArray(result.data?.data)){
                    preMap.data = [result.data?.data]
                }
                return preMap
            }),
        )
    }

    public getMediaContentById(id: string): Observable<CmsDataResponse<MediaContentDetailResponse>> {
        const cacheKey = `${this.getMediaContentById.name}_${id}`
        return this._cacheService.getCache(cacheKey).pipe(
            mergeMap(cacheResult => {
                if(!!cacheResult) {
                    return of(JSON.parse(cacheResult))
                }
                const queryString = querystring.encode({populate: this._mediaContentPopulate})
                return from(this._axiosInstance.get(`/media-contents/${id}/?${queryString}`)).pipe(
                    map(res => res.data),
                    tap(data => {
                        this._cacheService.setCache(cacheKey, JSON.stringify(data), 300)
                    })
                )
            }),
            map(data => plainToInstance(CmsDataResponse<MediaContentDetailResponse>, data))
        )

    }


    public getMediaContentsByIds(multipleId: number[]): Observable<CmsDataResponse<MediaContentDetailResponse>> {
        const filters = {
            id: {
                $in: multipleId,
            }
        }
        return from(this._axiosInstance.get(`/media-contents`, {params: {filters, populate: this._mediaContentPopulate}} )).pipe(
            map(res=> plainToInstance(CmsDataResponse<MediaContentDetailResponse>, res.data)),
        )
    }


    private readonly _mediaContentPopulate = [
        'title',
        'subtitle',
        'trailers',
        'coverImage',
        'link',
        'casts',
        'casts.portrait',
        'directors',
        'directors.portrait',
        'mediaTags',
        'mediaTags.name',
        'rating',
        'mediaSeasons',       
        'mediaSeasons.name',
        'mediaSeasons.mediaEpisodes',
        'mediaSeasons.mediaEpisodes.audio',
        'mediaSeasons.mediaEpisodes.subtitle',  
        'mediaSeasons.mediaEpisodes.coverImage',
        'mediaSeasons.mediaEpisodes.name',
        'mediaSeasons.mediaEpisodes.duration',
        'mediaSeasons.mediaEpisodes.price',
    ]

    public getMediaContentBySlug(slug: string): Observable<CmsDataResponse<MediaContentDetailResponse>> {
        const queryString = querystring.encode({populate: this._mediaContentPopulate})
        const promise = this._axiosInstance.get(`/media-contents?filters[slug][$eq]=${slug}&${queryString}`)
        return from(promise).pipe(
            map(res => {   
                if(res.data.data.length === 0){
                    throw new NotFoundException(`${slug} Not Found`)
                }
                return res
            }),
            map(result => ({ data:get(result,'data.data[0]', null) })),
        )
    }

    public getMediaContentByTags(tags: string[], contentRatings: Array<ContentRating> = []): Observable<ListResponse<BaseResponse<MediaContentDetailResponse>>>{
        const { filter } = tags.reduce(
            (a, c) => {
                a.filter += `filters[$or][${a.count}][mediaTags][slug][$eq]=${c}&filters[$or][${
                    a.count + 1
                }][mediaTags][slug][$containsi]=${c}&`;
                a.count += 2;
                return a;
            },
            { count: 0, filter: "" }
        );
        const filterRating = contentRatings.reduce((a,c,i)=>{
            a += `&filters[rating][value][$in][${i}]=${c}`
            return a
        },'')
        const queryString = querystring.encode({ populate: this._mediaContentPopulate });
        const promise = this._axiosInstance.get(`/media-contents?${filter}${queryString}&${filterRating}&sort=id:desc`);
        return from(promise).pipe(map((result) => result.data));
    }

    public getTags(): Observable<BaseResponse<TagResponse>[]> {
        return from(this._axiosInstance.get('tags?populate=name')).pipe(
            map(res => get(res, 'data.data', []))
        )
    }
    
    public getSeason(mediaContentId: string): Observable<ListResponse<BaseResponse<MediaSeasonResponse>>> {
        const populate = [
            "name",
            "mediaEpisodes",
            "mediaEpisodes.name",
            "mediaEpisodes.coverImage",
            "mediaEpisodes.audio",
            "mediaEpisodes.subtitle",
        ];
        const queryString = querystring.encode({ populate })
        return from(this._axiosInstance.get(`media-seasons?filters[mediaContent][id][$eq]=${mediaContentId}&${queryString}`)).pipe(
            map(res => res.data)
        )
    }

    public getLatestContent(contentRatings: ContentRating[]) :Observable<CmsDataResponse<MediaContentDetailResponse>>{
        const filters = contentRatings.reduce((a,c,i)=>{
            a += `&filters[rating][value][$in][${i}]=${c}`
            return a
        },'')
        const queryString = querystring.encode({
            populate: this._mediaContentPopulate, 
            sort:'publishedAt:desc',
            'pagination[pageSize]': 10,
            'pagination[page]': 1,
        })    
        return from(this._axiosInstance.get(`/media-contents/?${queryString}${filters}`)).pipe(
            map(res=> plainToClass(CmsDataResponse<MediaContentDetailResponse>, res.data)),
        )
    }
}
