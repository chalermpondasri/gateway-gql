import { 
    BadRequestException, 
    Provider, 
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { EnvironmentConfig } from '@/models/common'
import { CmsRepository } from '@/repositories/cms'
import { AxiosInstance } from 'axios'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'


export const cmsRepositoryProvider: Provider = {
    provide: ProviderName.CMS_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
        ProviderName.HTTP_CLIENT,
        CACHE_MANAGER,
    ],
    useFactory: async (config: EnvironmentConfig, client: AxiosInstance, cache: Cache) => {

        client.defaults.baseURL = `${config.CMS_ENDPOINT}/api`
        client.defaults.headers.authorization = `Bearer ${config.CMS_API_KEY}`
        client.interceptors.response.use(null, error => {
            if(error?.response?.data?.error){
                throw new BadRequestException({
                    statusCode: Number(error.response.data.error?.status), 
                    message: error.response.data.error?.message,
                })
            }
        })
        return new CmsRepository(client, cache)
    },
}
