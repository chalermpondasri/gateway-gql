import { Provider } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { EnvironmentConfig } from '@/models/common'
import { CmsRepository } from '@/repositories/cms'

export const cmsRepositoryProvider: Provider = {
    provide: ProviderName.CMS_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
    ],
    useFactory: async (config: EnvironmentConfig) => {
        return new CmsRepository(config)
    }
}
