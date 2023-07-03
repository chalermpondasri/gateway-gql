import {
    BaseResponse,
    ICmsRepository,
    TermResponse
} from '@/repositories/cms'
import {
    from,
    map,
    Observable
} from 'rxjs'
import {
    BaseRequest,
} from '@/repositories/cms/base.request'
import { EnvironmentConfig } from '@/models/common'
import axios, { AxiosInstance } from 'axios'
import * as querystring from 'querystring'

export class CmsRepository implements ICmsRepository {
    private readonly _axiosInstance: AxiosInstance

    constructor(config: EnvironmentConfig) {
        this._axiosInstance = axios.create({
            baseURL: `${config.CMS_ENDPOINT}/api`,
            headers: {
                Authorization: `Bearer ${config.CMS_API_KEY}`
            }
        })

    }
    public getTermsAndConditions(request:BaseRequest): Observable<BaseResponse<TermResponse>> {
        const queryString = querystring.encode(request.build())
        const promise = this._axiosInstance.get(`/terms-and-conditions?${queryString}`)
        return from(promise).pipe(
            map(result => {
                return result.data
            })
        )
    }

}