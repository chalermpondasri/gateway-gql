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
        Logger.log(requestContext.deviceId, requestContext.deviceId, ProviderName.HTTP_CLIENT)
        const agent = new http.Agent({family: 4})
        const axiosInstance = axios.create({
            httpAgent: agent,
            headers: {
                ...requestContext.getHeaders(),
                'x-did': requestContext.deviceId,
            }
        })

        axiosInstance.interceptors.response.use(null, error => {
            throw new BadRequestException(error?.response?.data)
        })

        return axiosInstance
    }
}