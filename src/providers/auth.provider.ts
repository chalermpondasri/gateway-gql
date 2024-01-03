import { BadRequestException, Provider } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { AuthRepository } from '@/repositories/auth/auth.repository'
import { LocaleRepository } from '@/repositories/auth/locale.repository'
import { EnvironmentConfig } from '@/models/common'
import { AxiosInstance } from 'axios'

export const authRepositoryProvider: Provider = {
    provide: ProviderName.AUTH_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
        ProviderName.HTTP_CLIENT,
    ],
    useFactory: (config: EnvironmentConfig, client: AxiosInstance) => {
        client.defaults.baseURL = config.AUTH_ENDPOINT
        client.interceptors.response.use(null, error => {
            throw new BadRequestException(error?.response?.data)
        })
        return new AuthRepository(client)
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