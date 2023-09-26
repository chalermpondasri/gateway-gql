import { Provider } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { AuthRepository } from '@/repositories/auth/auth.repository'
import { LocaleRepository } from '@/repositories/auth/locale.repository'
import { EnvironmentConfig } from '@/models/common'
import { RequestContext } from '@/providers/request-context.provider'

export const authRepositoryProvider: Provider = {
    provide: ProviderName.AUTH_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
        ProviderName.REQUEST_CONTEXT,
    ],
    useFactory: (config: EnvironmentConfig, context: RequestContext) => new AuthRepository(config, context)

}

export const localeRepositoryProvider: Provider = {
    provide: ProviderName.LOCALE_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
        ProviderName.REQUEST_CONTEXT,
    ],
    useFactory: (config: EnvironmentConfig, context: RequestContext) => new LocaleRepository(config, context)
}