import {
    BadRequestException,
    Provider,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { EnvironmentConfig } from '@/models/common'
import { AxiosInstance } from 'axios'
import { PlaybackRepository } from '@/repositories/playback/playback.repository'

export const playbackRepositoryProvider: Provider = {
    provide: ProviderName.PLAYBACK_REPOSITORY,
    inject: [
        ProviderName.ENV_CONFIG,
        ProviderName.HTTP_CLIENT,
    ],
    useFactory: (config: EnvironmentConfig, client: AxiosInstance) => {
        client.defaults.baseURL = config.PLAYBACK_ENDPOINT
        client.interceptors.response.use(null, error => {
            throw new BadRequestException(error?.response?.data)
        })
        return new PlaybackRepository(client)
    },
}