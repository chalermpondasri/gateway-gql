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
} from '@/repositories/auth/common.model'
import { plainToInstance } from 'class-transformer'
import {
    LocaleResponse,
    LocalizedKeyLabelResponse,
} from '@/repositories/auth/locale.response'
import { ListResponse } from '@/repositories/auth/list.response'
import { EnvironmentConfig } from '@/models/common'
import http from 'http'
import axios, { AxiosInstance } from 'axios'
import {
    BadRequestException,
    Logger,
} from '@nestjs/common'
import { LocalizedKeyLabelType } from '@/types/objects'

export class LocaleRepository implements ILocaleRepository {
    private readonly _axiosInstance: AxiosInstance

    constructor(
        private readonly _config: EnvironmentConfig,
        ) {
        const agent = new http.Agent({family: 4})
        this._axiosInstance = axios.create({
            baseURL: `${_config.LOCALE_ENDPOINT}/i18n`,
            httpAgent: agent,
        })
        this._axiosInstance.interceptors.response.use(null, error => {
            Logger.error(error, LocaleRepository.name)
            throw new BadRequestException(error?.response?.data)
        })
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