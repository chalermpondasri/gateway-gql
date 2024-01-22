import { ILocaleRepository } from '@/repositories/auth/repository.interface'
import {
    CreateLocaleRequest,
    UpdateLocaleRequest,
} from '@/repositories/auth/locale.request'
import {
    from,
    map,
    Observable,
} from 'rxjs'
import {
    IdResponse,
    PaginationQueryRequest,
} from '@/models/common/common.model'
import { plainToInstance } from 'class-transformer'
import {
    LocaleResponse,
    LocalizedKeyLabelResponse,
} from '@/repositories/auth/locale.response'
import { ListResponse } from '@/models/common'
import { AxiosInstance } from 'axios'
import { LocalizedKeyLabelType } from '@/types/objects'
import { EnvironmentConfig } from '@/models/common'

export class LocaleRepository implements ILocaleRepository {

    public constructor(
        private readonly _axiosInstance: AxiosInstance,
        private readonly _config: EnvironmentConfig,
        ) {
    }
    public createLabel(token: string,request: CreateLocaleRequest): Observable<IdResponse> {
        const opts = {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
        return from(this._axiosInstance.post(`/`, request, opts)).pipe(
            map( ({data}) => plainToInstance(IdResponse,data))
        )
    }

    public deleteLabel(token: string, id: string): Observable<LocaleResponse> {
        const opts = {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
        return from(this._axiosInstance.delete(`/${id}`, opts)).pipe(
            map(({data}) => plainToInstance(LocaleResponse, data))
        )
    }

    public getById(token: string,id: string): Observable<LocaleResponse> {
        const opts = {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
        return from(this._axiosInstance.get(`/${id}`, opts)).pipe(
            map(({data}) => plainToInstance(LocaleResponse, data))
        )
    }

    public updateLabel(token: string,id: string, request: UpdateLocaleRequest): Observable<LocaleResponse> {
        const opts = {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
        return from(this._axiosInstance.patch(`/${id}`,request, opts)).pipe(
            map(({data}) => plainToInstance(LocaleResponse, data))
        )
    }

    public listLabels(token: string,paginationQueryRequest: PaginationQueryRequest): Observable<ListResponse<LocaleResponse>> {
        const opts = {
            params: paginationQueryRequest,
            headers: {
                authorization: `Bearer ${token}`
            }
        }
        return from(this._axiosInstance.get(`/`,opts)).pipe(
            map(({data}) => {
                const response  =new ListResponse<LocaleResponse>()
                response.data = plainToInstance(LocaleResponse, data.data as unknown[])
                response.page = data.page
                response.limit = data.limit
                response.total = data.total
                return  response
            })
        )
    }

    public listLocalizedKeyLabel(localeKey: string): Observable<ListResponse<LocalizedKeyLabelResponse>> {
        const opts = {
            params: {
                limit: 0
            },
            baseURL: `${this._config.LOCALE_ENDPOINT}`
        }

        return from(this._axiosInstance.get(`/locales/${localeKey}`, opts)).pipe(
            map(({data}) => {
                const response = new ListResponse<LocalizedKeyLabelResponse>()
                response.data = plainToInstance(LocalizedKeyLabelType, data.data as unknown[])
                response.page = data.page
                response.limit = data.limit
                response.total = data.total
                return  response
            })
        )
    }
}