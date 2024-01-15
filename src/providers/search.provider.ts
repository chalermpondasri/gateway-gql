import {
    BadRequestException,
    Provider,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { EnvironmentConfig } from '@/models/common'
import { AxiosInstance } from 'axios'
import { SearchRepository } from '@/repositories/search'

export const searchRepositoryProvider: Provider = {
    provide: ProviderName.SEARCH_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
        ProviderName.HTTP_CLIENT,
    ],
    useFactory: (config: EnvironmentConfig, client: AxiosInstance) => {
        client.defaults.baseURL = config.SEARCH_ENDPOINT
        client.interceptors.response.use(null, error => {
            throw new BadRequestException(error?.response?.data)
        })

        return new SearchRepository(client)
    }
}