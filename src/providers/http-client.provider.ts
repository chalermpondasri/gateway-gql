import {
    BadRequestException,
    Logger,
    Provider,
    Scope,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import axios, { AxiosInstance } from 'axios'
import http from 'http'
import { RequestContext } from '@/providers/request-context.provider'

export const httpClientProvider: Provider = {
    provide: ProviderName.HTTP_CLIENT,
    scope: Scope.TRANSIENT,
    inject: [
        ProviderName.REQUEST_CONTEXT,
    ],
    useFactory: (requestContext:RequestContext): AxiosInstance => {
        const agent = new http.Agent({family: 4})
        const axiosInstance = axios.create({
            httpAgent: agent,
            headers: {
                ...requestContext.getHeaders(),
                'x-did': requestContext.deviceId,
                'x-profile-id': requestContext.profileId,
            },
        })

        axiosInstance.interceptors.request.use( (conf) => {
            Logger.log(conf.url, ProviderName.HTTP_CLIENT)
            return conf
        })

        axiosInstance.interceptors.response.use((value) => {
            return value
        }, (error) => {
            Logger.error(error, ProviderName.HTTP_CLIENT)
            throw new BadRequestException(error?.response?.data || error)
        })

        return axiosInstance
    }
}