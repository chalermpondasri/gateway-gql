import {
    ListResponse,
    ICmsRepository,
    LoginResponse,
    TermResponse,
    UserRoleResponse,
    BaseResponse,
} from '@/repositories/cms'
import {
    from,
    map,
    Observable,
} from 'rxjs'
import {
    BaseRequest,
} from '@/repositories/cms/base.request'
import { EnvironmentConfig } from '@/models/common'
import axios, { AxiosInstance } from 'axios'
import * as querystring from 'querystring'
import { PromotionalResponse } from '@/repositories/cms/promotional.response'
import http from 'http'

export class CmsRepository implements ICmsRepository {
    private readonly _axiosInstance: AxiosInstance

    constructor(config: EnvironmentConfig) {
        const agent = new http.Agent({family: 4})
        console.log(`${config.CMS_ENDPOINT}/api`)
        this._axiosInstance = axios.create({
            baseURL: `${config.CMS_ENDPOINT}/api`,
            httpAgent: agent,
            headers: {
                Authorization: `Bearer ${config.CMS_API_KEY}`,
            },
        })

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


}