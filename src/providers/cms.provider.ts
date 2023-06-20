import { Provider } from '@nestjs/common'
import { ProviderNames } from '@/constants/provider-name.const'
import { EnvironmentConfig } from '@/models/common'
import { CmsRepository } from '@/repositories/cms'

export const cmsRepositoryProvider: Provider = {
    provide: ProviderNames.CMS_REPOSITORY,
    inject: [
        ProviderNames.ENV_CONFIG,
    ],
    useFactory: async (config: EnvironmentConfig) => {
        return new CmsRepository(config)
    }
}
