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
import { LocaleResponse } from '@/repositories/auth/locale.response'
import { ListResponse } from '@/repositories/auth/list.response'
import { EnvironmentConfig } from '@/models/common'
import http from 'http'
import axios, { AxiosInstance } from 'axios'
import { BadRequestException } from '@nestjs/common'

export class LocaleRepository implements ILocaleRepository {
    private readonly _axiosInstance: AxiosInstance

    constructor(config: EnvironmentConfig) {
        const agent = new http.Agent({family: 4})
        this._axiosInstance = axios.create({
            baseURL: `${config.LOCALE_ENDPOINT}/i18n`,
            httpAgent: agent,
        })
        this._axiosInstance.interceptors.response.use(null, error => {
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
        return from(this._axiosInstance.delete(`/${id}`)).pipe(
            map(({data}) => plainToInstance(LocaleResponse, data))
        )
    }

    public getById(token: string,id: string): Observable<LocaleResponse> {
        return from(this._axiosInstance.get(`/${id}`)).pipe(
            map(({data}) => plainToInstance(LocaleResponse, data))
        )
    }

    public updateLabel(token: string,id: string, request: UpdateLocaleRequest): Observable<LocaleResponse> {
        return from(this._axiosInstance.patch(`/${id}`,request)).pipe(
            map(({data}) => plainToInstance(LocaleResponse, data))
        )
    }

    public listLabels(token: string,paginationQueryRequest: PaginationQueryRequest): Observable<ListResponse<LocaleResponse>> {
        return from(this._axiosInstance.get(`/`,{params: paginationQueryRequest})).pipe(
            map(({data}) => {
                const response  =new ListResponse<LocaleResponse>()
                response.data = plainToInstance(LocaleResponse, data.data as any[])
                response.page = data.page
                response.limit = data.limit
                response.total = data.total
                return  response
            })
        )
    }
}