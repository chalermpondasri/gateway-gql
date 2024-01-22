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
    PromotionalResponse,
    SectionResponse,
    TermResponse,
    UserRoleResponse,
} from '@/repositories/cms'
import {
    from,
    map,
    mergeMap,
    Observable,
    of,
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
import { ContentRating } from '@/types/enums'
import { NotFoundException } from '@nestjs/common'

export class CmsRepository implements ICmsRepository {
    public constructor(
        private readonly _axiosInstance: AxiosInstance,
        private readonly _cacheManager: Cache
    ) {
    }

    public getMainPageSections(): Observable<ListResponse<BaseResponse<SectionResponse>>> {
        const populate = [
            'items',
            'items.title',
            'items.subtitle',
            'items.trailers',
            'items.coverImage',
            'items.link',
            'title',
            'subtitle',
            'coverImage',
            'items.mediaEpisodes',
            'items.mediaEpisodes.name',
            'items.mediaTags',
            'items.mediaTags.name',
            'items.rating',
            'items.mediaEpisodes.coverImage',
            'items.mediaSeasons',
            'items.mediaSeasons.name',
            'items.mediaSeasons.mediaEpisodes'
        ]
        const queryString = querystring.encode({populate})
        const promise = this._axiosInstance.get(`/page-sections?${queryString}&sort=order:asc`)
        return from(promise).pipe(
            map(result => result.data)
        )
    }

    public getTermsAndConditions(request: BaseRequest): Observable<ListResponse<TermResponse>> {
        const queryString = querystring.encode(request.build())
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
        const queryString = querystring.encode({...request.build(),populate:"*"})
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
        const queryString = querystring.encode({populate: this._mediaContentPupulate})
        return from(this._axiosInstance.get(`/media-contents/${id}/?${queryString}`)).pipe(
            map(res=> plainToClass(CmsDataResponse<MediaContentDetailResponse>, res.data))
        )
    }

    private readonly _mediaContentPupulate = [
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
        'mediaEpisodes',
        'mediaEpisodes.name',
        'mediaEpisodes.coverImage',
        'rating',
        'mediaSeasons',
        'mediaSeasons.name',
        'mediaSeasons.mediaEpisodes',
        'mediaSeasons.mediaEpisodes.name',
        'mediaSeasons.mediaEpisodes.coverImage',
        'mediaSeasons.mediaEpisodes.audio',
        'mediaSeasons.mediaEpisodes.subtitle',
        'mediaSeasons.mediaEpisodes.subtitle',
    ]

    public getMediaContentBySlug(slug: string): Observable<CmsDataResponse<MediaContentDetailResponse>> {
        const queryString = querystring.encode({populate: this._mediaContentPupulate})
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

    public getMediaContentByTags(tags: string[]): Observable<CmsDataResponse<MediaContentDetailResponse>> {
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
        const queryString = querystring.encode({ populate: this._mediaContentPupulate });
        const promise = this._axiosInstance.get(`/media-contents?${filter}${queryString}`);
        return from(promise).pipe(map((result) => result.data));
    }
    
    public searchContentByKeyword(contentRatings: ContentRating[], keyword: string): Observable<CmsDataResponse<MediaContentDetailResponse>> {
        let filters = contentRatings.reduce((a, c, i)=>{
            return a += `filters[rating][value][$in][${i}]=${c}&`
        },'')
        if(keyword){
            filters += `filters[$or][0][title][en][$containsi]=${keyword}&filters[$or][1][title][th][$containsi]=${keyword}`
        }
        const queryString = querystring.encode({populate: this._mediaContentPupulate})
        const promise = this._axiosInstance.get(`/media-contents?${filters}${filters.endsWith('&')?'':'&'}${queryString}`)
        return from(promise).pipe(
            map(result => result.data)
        )
    }
}
