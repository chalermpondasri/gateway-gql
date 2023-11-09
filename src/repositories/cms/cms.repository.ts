import {
    AvatarResponse,
    BaseResponse,
    FaqResponse,
    ICmsRepository,
    ListResponse,
    LoginResponse,
    SectionResponse,
    TermResponse,
    UserRoleResponse,
} from '@/repositories/cms'
import {
    from,
    map,
    Observable,
} from 'rxjs'
import { BaseRequest } from '@/repositories/cms/base.request'
import { AxiosInstance } from 'axios'
import * as querystring from 'querystring'
import { PromotionalResponse } from '@/repositories/cms/promotional.response'
import { isNil } from 'lodash'

export class CmsRepository implements ICmsRepository {
    public constructor(
        private readonly _axiosInstance: AxiosInstance,
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
            'items.media_episodes',
            'items.media_episodes.name',
            'items.mediaTags',
            'items.mediaTags.name',
            'items.rating',
            'items.media_episodes.coverImage',
        ]
        const queryString = querystring.encode({populate})
        const promise = this._axiosInstance.get(`/page-sections?${queryString}`)
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
        const promise = this._axiosInstance.get(path)
        return from(promise).pipe(
            map(result => result.data),
        )
    }

    public getAvatars(id: number): Observable<ListResponse<BaseResponse<AvatarResponse>>> {
        let path = `/avatars?populate=*`
        if(!isNil(id)){
            path = `/avatars/${id}?populate=*`
        }      
        const promise = this._axiosInstance.get<ListResponse<BaseResponse<AvatarResponse>>>(path)
        return from(promise).pipe(
            map(result =>  {
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

}