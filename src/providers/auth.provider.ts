import { Provider } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { AuthRepository } from '@/repositories/auth/auth.repository'
import { LocaleRepository } from '@/repositories/auth/locale.repository'

export const authRepositoryProvider: Provider = {
    provide: ProviderName.AUTH_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
    ],
    useFactory: (config) => new AuthRepository(config)

}

export const localeRepositoryProvider: Provider = {
    provide: ProviderName.LOCALE_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
    ],
    useFactory: (config) => new LocaleRepository(config)
}