import { Provider } from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { EnvironmentConfig } from '@/models/common'
import { CmsRepository } from '@/repositories/cms'
import { AxiosInstance } from 'axios'

export const cmsRepositoryProvider: Provider = {
    provide: ProviderName.CMS_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
        ProviderName.HTTP_CLIENT,
    ],
    useFactory: async (config: EnvironmentConfig, client: AxiosInstance) => {

        client.defaults.baseURL = `${config.CMS_ENDPOINT}/api`
        client.defaults.headers.authorization =`Bearer ${config.CMS_API_KEY}`
        return new CmsRepository(client)
    }
}
