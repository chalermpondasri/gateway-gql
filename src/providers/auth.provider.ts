import {
    BadRequestException,
    Logger,
    Provider,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { AuthRepository } from '@/repositories/auth/auth.repository'
import { LocaleRepository } from '@/repositories/auth/locale.repository'
import { EnvironmentConfig } from '@/models/common'
import { AxiosInstance } from 'axios'
import { ICacheService } from '@/services/cache/interface/service.interface'

export const authRepositoryProvider: Provider = {
    provide: ProviderName.AUTH_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
        ProviderName.HTTP_CLIENT,
        ProviderName.CACHE_SERVICE
    ],
    useFactory: (config: EnvironmentConfig, client: AxiosInstance, cache: ICacheService) => {
        client.defaults.baseURL = config.AUTH_ENDPOINT
        client.interceptors.response.use(null, error => {
            Logger.error(error, ProviderName.AUTH_REPOSITORY)
            throw new BadRequestException(error?.response?.data)
        })
        return new AuthRepository(client, cache)
    }

}

export const localeRepositoryProvider: Provider = {
    provide: ProviderName.LOCALE_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
        ProviderName.HTTP_CLIENT,
    ],
    useFactory: (config: EnvironmentConfig, client: AxiosInstance) => {
        client.defaults.baseURL = `${config.LOCALE_ENDPOINT}/i18n`
        return new LocaleRepository( client, config)
    }
}